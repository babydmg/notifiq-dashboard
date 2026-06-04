"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RichTextEditor from "@/components/RichTextEditor";
import getApi from "@/lib/api";

export default function BlastPage() {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    subject: "",
    body: "",
    scheduledAt: "",
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");

    getApi()
      .get("/contacts")
      .then((res) => {
        setContactCount(res.data.filter((c) => c.subscribed).length);
      });
  }, []);

  const handleBlast = async () => {
    if (!form.subject || !form.body || !form.scheduledAt) {
      return setError("All fields are required");
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await getApi().post("/jobs/blast", {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      setSuccess(`Blast scheduled to ${res.data.count} contacts!`);
      setForm({ subject: "", body: "", scheduledAt: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Send Newsletter Blast
          </h2>
          <span className="bg-blue-900 text-blue-300 text-sm px-4 py-2 rounded-full font-medium">
            {contactCount} subscribed contacts
          </span>
        </div>

        {contactCount === 0 && (
          <div className="bg-yellow-950 border border-yellow-800 rounded-xl p-4 mb-6">
            <p className="text-yellow-300 text-sm">
              You have no subscribed contacts yet.{" "}
              <a href="/dashboard/contacts" className="underline">
                Add contacts first →
              </a>
            </p>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Subject</label>
            <input
              type="text"
              placeholder="Your newsletter subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Body</label>
            <RichTextEditor
              value={form.body}
              onChange={(html) => setForm({ ...form, body: html })}
            />
          </div>

          <div className="mb-6">
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
            onClick={handleBlast}
            disabled={submitting || contactCount === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg px-8 py-3 transition"
          >
            {submitting
              ? "Scheduling..."
              : `🚀 Schedule blast to ${contactCount} contacts`}
          </button>
        </div>
      </div>
    </div>
  );
}
