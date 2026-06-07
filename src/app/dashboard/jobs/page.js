"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import TemplatePicker from "@/components/TemplatePicker";
import getApi from "@/lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    scheduledAt: "",
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getApi().get("/jobs");
      setJobs(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!form.to || !form.subject || !form.body || !form.scheduledAt)
      return setError("All fields are required");
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await getApi().post("/jobs/schedule", {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      setSuccess("Email scheduled successfully!");
      setForm({ to: "", subject: "", body: "", scheduledAt: "" });
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const statusStyle = {
    sent: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Schedule Email
          </h1>
          <p className="text-gray-500">
            Send a one-off email to a specific recipient.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
          <TemplatePicker
            onSelect={(t) =>
              setForm({ ...form, subject: t.subject, body: t.body })
            }
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                To
              </label>
              <input
                type="email"
                placeholder="recipient@email.com"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Subject
              </label>
              <input
                type="text"
                placeholder="Email subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-gray-600 text-sm font-medium mb-1.5 block">
              Body
            </label>
            <RichTextEditor
              value={form.body}
              onChange={(html) => setForm({ ...form, body: html })}
            />
          </div>
          <div className="mb-5">
            <label className="text-gray-600 text-sm font-medium mb-1.5 block">
              Schedule At
            </label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <button
            onClick={handleSchedule}
            disabled={submitting}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
          >
            {submitting ? "Scheduling..." : "Schedule Email"}
          </button>
        </div>

        {/* Job history */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Job History
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.length === 0 && (
              <p className="text-gray-400 text-sm">
                No jobs yet. Schedule your first email above.
              </p>
            )}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {job.payload.subject}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      To: {job.payload.to}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyle[job.status] || statusStyle.pending}`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-6 mt-2 pt-2 border-t border-gray-50">
                  <p className="text-gray-400 text-xs">
                    {new Date(job.scheduled_at).toLocaleString()}
                  </p>
                  {job.status === "sent" && (
                    <>
                      <span className="text-gray-400 text-xs">
                        👁️ {job.opens || 0} opens
                      </span>
                      <span className="text-gray-400 text-xs">
                        🖱️ {job.clicks || 0} clicks
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
