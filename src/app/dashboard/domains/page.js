"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

export default function DomainsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    domain: "",
    fromEmail: "",
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await getApi().get("/domains");
      setDomains(res.data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.domain || !form.fromEmail)
      return setError("All fields are required");
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await getApi().post("/domains", form);
      setSuccess("Domain added! Add the DNS records below to verify.");
      setForm({ domain: "", fromEmail: "" });
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifying(id);
    setError("");
    setSuccess("");
    try {
      const res = await getApi().post(`/domains/${id}/verify`);
      setSuccess(res.data.message);
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setVerifying(null);
    }
  };

  const handleActivate = async (id) => {
    setError("");
    setSuccess("");

    try {
      const res = await getApi().post(`/domains/${id}/activate`);
      setSuccess(
        `${res.data.message} - emails will now send from ${res.data.fromEmail}`,
      );
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || "Activation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await getApi().delete(`/domains/${id}`);
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };
  if (!mounted) return null;
  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Custom Domain
          </h1>
          <p className="text-gray-500">
            Send emails from your own domain for better deliverability.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
          <p className="text-blue-800 font-semibold text-sm mb-1">
            How it works
          </p>
          <p className="text-blue-600 text-sm">
            Add your domain, copy the DNS records to your domain provider
            (Cloudflare, GoDaddy, etc.), then click Verify. Once verified,
            activate it and all emails will send from your domain.
          </p>
        </div>

        {/* Add domain form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">
            Add Domain
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Domain
              </label>
              <input
                type="text"
                placeholder="yourcompany.com"
                value={form.domain}
                onChange={(e) =>
                  setForm({
                    ...form,
                    domain: e.target.value.toLowerCase().trim(),
                  })
                }
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                From Email
              </label>
              <input
                type="email"
                placeholder="hello@yourcompany.com"
                value={form.fromEmail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fromEmail: e.target.value.toLowerCase().trim(),
                  })
                }
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
          >
            {submitting ? "Adding..." : "Add Domain"}
          </button>
        </div>

        {/* Domains list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Your Domains
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {domains.length === 0 && (
              <p className="text-gray-400 text-sm">
                No domains yet. Add one above.
              </p>
            )}
            {domains.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-gray-900 font-semibold text-sm">
                        {d.domain}
                      </p>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          d.status === "verified"
                            ? "bg-green-100 text-green-700"
                            : d.status === "failed"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      From: {d.from_email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.status !== "verified" && (
                      <button
                        onClick={() => handleVerify(d.id)}
                        disabled={verifying === d.id}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition disabled:opacity-50"
                      >
                        {verifying === d.id ? "Checking..." : "Verify DNS"}
                      </button>
                    )}
                    {d.status === "verified" && (
                      <button
                        onClick={() => handleActivate(d.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
                      >
                        Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* DNS Records */}
                {d.dns_records && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                    <p className="text-gray-600 text-xs font-semibold mb-3">
                      DNS Records — add these to your domain provider
                    </p>
                    <div className="space-y-2 overflow-x-auto">
                      {JSON.parse(
                        typeof d.dns_records === "string"
                          ? d.dns_records
                          : JSON.stringify(d.dns_records),
                      ).map((record, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-4 gap-3 text-xs font-mono bg-white border border-gray-100 rounded-lg px-4 py-3"
                        >
                          <span className="text-gray-500 font-sans font-medium">
                            {record.type}
                          </span>
                          <span className="text-gray-700 truncate">
                            {record.name}
                          </span>
                          <span className="text-gray-700 truncate col-span-2">
                            {record.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
