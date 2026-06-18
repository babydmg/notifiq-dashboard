"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RichTextEditor from "@/components/RichTextEditor";
import getApi from "@/lib/api";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", subject: "", body: "" });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await getApi().get("/templates");
      setTemplates(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.subject || !form.body)
      return setError("All fields are required");
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editing) {
        await getApi().put(`/templates/${editing}`, form);
        setSuccess("Template updated!");
      } else {
        await getApi().post("/templates", form);
        setSuccess("Template saved!");
      }
      setForm({ name: "", subject: "", body: "" });
      setEditing(null);
      fetchTemplates();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t) => {
    setEditing(t.id);
    setForm({ name: t.name, subject: t.subject, body: t.body });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await getApi().delete(`/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {editing ? "Edit Template" : "Templates"}
          </h1>
          <p className="text-gray-500">
            Save and reuse email content across campaigns.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Template Name
              </label>
              <input
                type="text"
                placeholder="e.g. Welcome Email"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Subject
              </label>
              <input
                type="text"
                placeholder="Email subject line"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="text-gray-600 text-sm font-medium mb-1.5 block">
              Body
            </label>
            <RichTextEditor
              key={editing || "new"}
              value={form.body}
              onChange={(html) => setForm({ ...form, body: html })}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={submitting}
              className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
            >
              {submitting
                ? "Saving..."
                : editing
                  ? "Update Template"
                  : "Save Template"}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", subject: "", body: "" });
                }}
                className="border border-gray-200 text-gray-600 hover:border-gray-400 font-medium rounded-xl px-6 py-3 text-sm transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Templates list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Saved Templates
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
            {templates.length === 0 && (
              <p className="text-gray-400 text-sm">
                No templates yet. Create one above.
              </p>
            )}
            {templates.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-gray-900 font-medium text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{t.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
