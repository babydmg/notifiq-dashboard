"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Navbar from "@/components/Navbar";
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
  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
  });
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
    if (!form.name || !form.subject || !form.body) {
      return setError("All fields are required");
    }

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

  const handleEdit = (template) => {
    setEditing(template.id);
    setForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await getApi().delete(`/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      setError(err.message?.data?.error || "Delete failed");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: "", subject: "", body: "" });
    setError("");
    setSuccess("");
  };

  if (!mounted) return null;
  if (loading) return <div className="min-h-screen bg-gray-950" />;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Form */}
        <h2 className="text-2xl font-bold text-white mb-6">
          {editing ? "Edit Template" : "Create Template"}
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Template Name
              </label>
              <input
                type="text"
                placeholder="e.g. Welcome Email"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Subject
              </label>
              <input
                type="text"
                placeholder="Email subject line"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Body</label>
            <RichTextEditor
              key={editing || "new"}
              value={form.body}
              onChange={(html) => setForm({ ...form, body: html })}
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-3 transition"
            >
              {submitting
                ? "Saving..."
                : editing
                  ? "Update Template"
                  : "Save Template"}
            </button>
            {editing && (
              <button
                onClick={handleCancel}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg px-6 py-3 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Templates list */}
        <h2 className="text-2xl font-bold text-white mb-4">Saved Templates</h2>
        <div className="space-y-3">
          {templates.length === 0 && (
            <p className="text-gray-500">No templates yet. Create one above.</p>
          )}
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">{t.name}</p>
                <p className="text-gray-400 text-sm">{t.subject}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-900 hover:bg-red-800 text-red-400 text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
