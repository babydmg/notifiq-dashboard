"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import getApi from "@/lib/api";

const CRON_PRESENTS = [
  { label: "Everday at 9am", value: "0 9 * * *" },
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
  const [selectedPreset, setSelectedPreset] = useState(CRON_PRESENTS[0].value);
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    cron: "0 9 * * *",
  });
  const router = useRouter();

  if (!mounted) return null;

  const fetchJobs = async () => {
    try {
      const res = await getApi().get("/recurring");
      setJobs(res.data);
    } catch {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const key = localStorage.getItem("notifiq_api_key");
    if (!key) return router.push("/");
    fetchJobs();
  }, []);

  const handlePreset = (value) => {
    setSelectedPreset(value);
    if (value !== "custom") setForm({ ...form, cron: value });
  };

  const handleCreate = async () => {
    if (!form.to || !form.subject || !form.body || !form.cron) {
      return setError("All fields are required");
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await getApi().post("/recurring", form);
      setSuccess("Recurring job created!");
      setForm({ to: "", subject: "", body: "", cron: "0 9 * * *" });
      setSelectedPreset(CRON_PRESENTS[0].value);
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
      setError(err.response?.data?.errro || "Something went wrong");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create Recurring Job
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
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
            <textarea
              placeholder="Email body..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block">Schedule</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {CRON_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePreset(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedPreset === p.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
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
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            )}
            {selectedPreset !== "custom" && (
              <p className="text-gray-500 text-xs">
                Cron:{" "}
                <span className="text-gray-400 font-mono">{form.cron}</span>
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

          <button
            onClick={handleCreate}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-3 transition"
          >
            {submitting ? "Creating..." : "Create Recurring Job"}
          </button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Active Jobs</h2>
        <div className="space-y-3">
          {jobs.filter((j) => j.active).length === 0 && (
            <p className="text-gray-500">No recurring jobs yet.</p>
          )}
          {jobs
            .filter((j) => j.active)
            .map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">
                    {job.payload.subject}
                  </p>
                  <p className="text-gray-400 text-sm">To: {job.payload.to}</p>
                  <p className="text-gray-500 text-xs mt-1 font-mono">
                    Cron: {job.cron}
                  </p>
                </div>
                <button
                  onClick={() => handleCancel(job.id)}
                  className="bg-red-900 hover:bg-red-800 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
