"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import TemplatePicker from "@/components/TemplatePicker";
import EmailPreview from "@/components/EmailPreview";
import getApi from "@/lib/api";

function BlastForm() {
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const [segmentId, setSegmentId] = useState(null);
  const [segmentName, setSegmentName] = useState(null);
  const [segments, setSegments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", scheduledAt: "" });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");

    const sid = searchParams.get("segmentId");
    const sname = searchParams.get("segmentName");
    if (sid) {
      setSegmentId(sid);
      setSegmentName(sname);
    }

    Promise.all([getApi().get("/contacts"), getApi().get("/segments")]).then(
      ([contactsRes, segmentsRes]) => {
        setContactCount(contactsRes.data.filter((c) => c.subscribed).length);
        setSegments(segmentsRes.data);
      },
    );
  }, []);

  const handleBlast = async () => {
    if (!form.subject || !form.body || !form.scheduledAt)
      return setError("All fields are required");
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      let res;
      if (segmentId) {
        res = await getApi().post(`/jobs/blast/segment/${segmentId}`, {
          ...form,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
        });
      } else {
        res = await getApi().post("/jobs/blast", {
          ...form,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
        });
      }
      setSuccess(`🚀 Blast scheduled to ${res.data.count} contacts!`);
      setForm({ subject: "", body: "", scheduledAt: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  const targetCount = segmentId
    ? segments.find((s) => s.id === segmentId)?.contact_count || 0
    : contactCount;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Send Campaign
            </h1>
            <p className="text-gray-500">
              Blast a newsletter to your contacts.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-center">
            <p className="text-blue-700 font-bold text-xl">{targetCount}</p>
            <p className="text-blue-500 text-xs">recipients</p>
          </div>
        </div>

        {/* Audience selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <p className="text-gray-600 text-sm font-medium mb-3">Send to</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSegmentId(null);
                setSegmentName(null);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                !segmentId
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              👥 All contacts ({contactCount})
            </button>
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => {
                  setSegmentId(seg.id);
                  setSegmentName(seg.name);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition border ${
                  segmentId === seg.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                🎯 {seg.name} ({seg.contact_count})
              </button>
            ))}
            <a
              href="/dashboard/segments"
              className="px-4 py-2 rounded-xl text-sm font-medium border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition"
            >
              + New segment
            </a>
          </div>
        </div>

        {targetCount === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-amber-700 text-sm">
              No subscribed contacts in this audience.{" "}
              <a href="/dashboard/contacts" className="font-semibold underline">
                Add contacts →
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleBlast}
              disabled={submitting || targetCount === 0}
              className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
            >
              {submitting
                ? "Scheduling..."
                : `⚡ Blast to ${targetCount} contacts`}
            </button>
            <button
              onClick={() => setPreview(true)}
              disabled={!form.subject && !form.body}
              className="border border-gray-200 text-gray-600 hover:border-gray-400 disabled:opacity-40 font-medium rounded-xl px-6 py-3 text-sm transition"
            >
              👁️ Preview
            </button>
          </div>
        </div>
      </div>
      {preview && (
        <EmailPreview
          subject={form.subject}
          body={form.body}
          onClose={() => setPreview(false)}
        />
      )}
    </DashboardLayout>
  );
}

export default function BlastPage() {
  return (
    <Suspense>
      <BlastForm />
    </Suspense>
  );
}
