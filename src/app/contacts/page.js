"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
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
      await getApi().post("/contacts", { email, name });
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
        `Imported ${res.data.imported} contacts. Skipped ${res.data.skipped}.`,
      );
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
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
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  if (!mounted) return null;
  if (loading) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Contacts</h2>
          <span className="text-gray-400 text-sm">
            {contacts.length} total ·{" "}
            {contacts.filter((c) => c.subscribed).length} subscribed
          </span>
        </div>

        {/* Add + Import */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Add Contact</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-3">{success}</p>}

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg px-6 py-3 transition"
            >
              Add Contact
            </button>

            <div className="relative">
              <button
                onClick={() => fileRef.current.click()}
                disabled={importing}
                className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium rounded-lg px-6 py-3 transition"
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

            <p className="text-gray-500 text-xs">
              CSV must have an{" "}
              <span className="text-gray-400 font-mono">email</span> column.{" "}
              <span className="text-gray-400 font-mono">name</span> is optional.
            </p>
          </div>
        </div>

        {/* Contact list */}
        <div className="space-y-2">
          {contacts.length === 0 && (
            <p className="text-gray-500">
              No contacts yet. Add one above or import a CSV.
            </p>
          )}
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="text-white font-medium">
                  {contact.name || contact.email}
                </p>
                {contact.name && (
                  <p className="text-gray-400 text-sm">{contact.email}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    contact.subscribed
                      ? "bg-green-900 text-green-400"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {contact.subscribed ? "Subscribed" : "Unsubscribed"}
                </span>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="text-gray-600 hover:text-red-400 text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
