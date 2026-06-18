"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

const PRESETS = [
  { label: "Every day at 9am", value: "0 9 * * *" },
  { label: "Every Monday at 9am", value: "0 9 * * 1" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every 30 minutes", value: "*/30 * * * *" },
  { label: "Custom", value: "custom" },
];

export default function RecurringPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].value);
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    cron: "0 9 * * *",
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
      const res = await getApi().get("/recurring");
      setJobs(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (value) => {
    setSelectedPreset(value);
    if (value !== "custom") setForm({ ...form, cron: value });
  };

  const handleCreate = async () => {
    if (!form.to || !form.subject || !form.body || !form.cron)
      return setError("All fields are required");
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await getApi().post("/recurring", form);
      setSuccess("Recurring job created!");
      setForm({ to: "", subject: "", body: "", cron: "0 9 * * *" });
      setSelectedPreset(PRESETS[0].value);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await getApi().delete(`/recurring/${id}`);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to cancel");
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Recurring Jobs
          </h1>
          <p className="text-gray-500">
            Set up emails that send automatically on a schedule.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
            <textarea
              placeholder="Email body..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition resize-none"
            />
          </div>
          <div className="mb-5">
            <label className="text-gray-600 text-sm font-medium mb-2 block">
              Schedule
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                    selectedPreset === p.value
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {selectedPreset === "custom" && (
              <input
                type="text"
                placeholder="e.g. 0 9 * * 1"
                value={form.cron}
                onChange={(e) => setForm({ ...form, cron: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition font-mono"
              />
            )}
            {selectedPreset !== "custom" && (
              <p className="text-gray-400 text-xs">
                Cron:{" "}
                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                  {form.cron}
                </span>
              </p>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
          >
            {submitting ? "Creating..." : "Create Recurring Job"}
          </button>
        </div>

        {/* Active jobs */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Active Jobs
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.filter((j) => j.active).length === 0 && (
              <p className="text-gray-400 text-sm">No recurring jobs yet.</p>
            )}
            {jobs
              .filter((j) => j.active)
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {job.payload.subject}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      To: {job.payload.to}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 font-mono">
                      {job.cron}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(job.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
