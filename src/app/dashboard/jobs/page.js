"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TemplatePicker from "@/components/TemplatePicker";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
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
    if (!form.to || !form.subject || !form.body || !form.scheduledAt) {
      return setError("All fields are required");
    }

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

  if (!mounted) return null;
  if (loading) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-white mb-6">Schedule Email</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
          <TemplatePicker
            onSelect={(t) =>
              setForm({ ...form, subject: t.subject, body: t.body })
            }
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">To</label>
              <input
                type="email"
                placeholder="recipient@email.com"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Subject
              </label>
              <input
                type="text"
                placeholder="Email subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Body</label>
            <RichTextEditor
              value={form.body}
              onChange={(html) => setForm({ ...form, body: html })}
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">
              Schedule At
            </label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

          <button
            onClick={handleSchedule}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-3 transition"
          >
            {submitting ? "Scheduling..." : "Schedule Email"}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Job History</h2>
        <div className="space-y-3">
          {jobs.length === 0 && (
            <p className="text-gray-500">
              No jobs yet. Schedule your first email above.
            </p>
          )}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{job.payload.subject}</p>
                <p className="text-gray-400 text-sm">To: {job.payload.to}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Scheduled: {new Date(job.scheduled_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  job.status === "sent"
                    ? "bg-green-900 text-green-400"
                    : job.status === "failed"
                      ? "bg-red-900 text-red-400"
                      : "bg-yellow-900 text-yellow-400"
                }`}
              >
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
