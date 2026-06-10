"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import getApi from "@/lib/api";

function InviteForm() {
  const [invite, setInvite] = useState(null);
  const [form, setForm] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return router.push("/login");
    getApi()
      .get(`/team/invite/${token}`)
      .then((res) => setInvite(res.data))
      .catch(() => setError("This invite link is invalid or has expired"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    if (!form.name || !form.password)
      return setError("All fields are required");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters long");
    setSubmitting(true);
    setError("");
    try {
      const res = await getApi().post(`/team/invite/${token}/accept`, form);
      localStorage.setItem("notifiq_token", res.data.token);
      localStorage.setItem("notifiq_tenant", JSON.stringify(res.data.tenant));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
          >
            N
          </div>
          <span className="font-semibold text-gray-900 text-sm">Notifiq</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-6 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
          </div>
        ) : error && !invite ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              ❌
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Invalid invite
            </h2>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <a href="/login" className="text-blue-500 text-sm font-medium">
              Go to login →
            </a>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-sm font-semibold mb-0.5">
                You're invited! 🎉
              </p>
              <p className="text-blue-600 text-sm">
                Join <strong>{invite?.tenant_name}</strong> as a{" "}
                <strong>{invite?.role}</strong>.
              </p>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Set up your account
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              You'll use these to sign in to Notifiq.
            </p>

            <div className="space-y-3 mb-3">
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAccept()}
                  className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleAccept}
              disabled={submitting}
              className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-4 py-3 text-sm transition shadow-sm mt-2"
            >
              {submitting ? "Joining..." : "Accept & Join Team"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense>
      <InviteForm />
    </Suspense>
  );
}
