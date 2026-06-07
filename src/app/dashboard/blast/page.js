"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import TemplatePicker from "@/components/TemplatePicker";
import getApi from "@/lib/api";

export default function BlastPage() {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ subject: "", body: "", scheduledAt: "" });
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
    if (!form.subject || !form.body || !form.scheduledAt)
      return setError("All fields are required");
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await getApi().post("/jobs/blast", {
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
      });
      setSuccess(`🚀 Blast scheduled to ${res.data.count} contacts!`);
      setForm({ subject: "", body: "", scheduledAt: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Send Campaign
            </h1>
            <p className="text-gray-500">
              Blast a newsletter to your entire contact list.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-center">
            <p className="text-blue-700 font-bold text-xl">{contactCount}</p>
            <p className="text-blue-500 text-xs">subscribers</p>
          </div>
        </div>

        {contactCount === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-amber-700 text-sm">
              No subscribed contacts yet.{" "}
              <a href="/dashboard/contacts" className="font-semibold underline">
                Add contacts first →
              </a>
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <TemplatePicker
            onSelect={(t) =>
              setForm({ ...form, subject: t.subject, body: t.body })
            }
          />
          <div className="mb-4">
            <label className="text-gray-600 text-sm font-medium mb-1.5 block">
              Subject
            </label>
            <input
              type="text"
              placeholder="Your campaign subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
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
          <div className="mb-6">
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
            onClick={handleBlast}
            disabled={submitting || contactCount === 0}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
          >
            {submitting
              ? "Scheduling..."
              : `⚡ Schedule blast to ${contactCount} contacts`}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
