"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");

  const fileRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getApi().get("/contacts");
      setContacts(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!email) return setError("Email is required");
    setError("");
    setSuccess("");
    try {
      await getApi().post("/contacts", {
        email,
        name,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
      setSuccess("Contact added!");
      setEmail("");
      setName("");
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await getApi().post("/contacts/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(
        `✅ Imported ${res.data.imported} contacts. Skipped ${res.data.skipped}.`,
      );
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.error || "Import failed");
    } finally {
      setImporting(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    try {
      await getApi().delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.name && c.name.toLowerCase().includes(search.toLowerCase())),
  );

  const statusBadge = (contact) => {
    if (contact.status === "bounced") return "bg-red-100 text-red-600";
    if (contact.status === "complained") return "bg-orange-100 text-orange-600";
    if (!contact.subscribed) return "bg-gray-100 text-gray-500";
    return "bg-green-100 text-green-700";
  };

  const statusLabel = (contact) => {
    if (contact.status === "bounced") return "Bounced";
    if (contact.status === "complained") return "Spam complaint";
    if (!contact.subscribed) return "Unsubscribed";
    return "Subscribed";
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Contacts</h1>
            <p className="text-gray-500">
              {contacts.filter((c) => c.subscribed).length} subscribed ·{" "}
              {contacts.length} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current.click()}
              disabled={importing}
              className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 text-sm font-medium px-4 py-2.5 rounded-xl transition"
            >
              {importing ? "Importing..." : "📂 Import CSV"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>

        {/* Add contact form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">
            Add Contact
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>
          <div className="mb-4">
            <label className="text-gray-600 text-sm font-medium mb-1.5 block">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="vip, newsletter, customer"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <p className="text-gray-400 text-xs mb-3">
            CSV must have an{" "}
            <span className="font-mono bg-gray-100 px-1 rounded">email</span>{" "}
            column.{" "}
            <span className="font-mono bg-gray-100 px-1 rounded">name</span> is
            optional.
          </p>
          <button
            onClick={handleAdd}
            className="bg-gray-900 hover:bg-gray-700 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition shadow-sm"
          >
            Add Contact
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white"
          />
        </div>

        {/* Contact list */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-16 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400 text-sm">No contacts found.</p>
              </div>
            ) : (
              filtered.map((contact, i) => (
                <div
                  key={contact.id}
                  className={`flex items-center justify-between px-6 py-4 ${i !== filtered.length - 1 ? "border-b border-gray-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                      {(contact.name || contact.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">
                        {contact.name || contact.email}
                      </p>
                      {contact.name && (
                        <p className="text-gray-400 text-xs">{contact.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(contact)}`}
                    >
                      {statusLabel(contact)}
                    </span>
                    {contact.bounce_count > 0 && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({contact.bounce_count} bounce
                        {contact.bounce_count > 1 ? "s" : ""})
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-gray-300 hover:text-red-400 text-sm transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
