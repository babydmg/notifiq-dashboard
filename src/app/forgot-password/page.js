"use client";
import { useState } from "react";
import Link from "next/link";
import getApi from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return setError("Email is required");
    setLoading(true);
    setError("");

    try {
      await getApi().post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <Link href="/login" className="text-blue-400 text-sm mb-6 block">
          ← Back to login
        </Link>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-400 text-sm">
              If that email is registered, we sent a reset link. Check your
              inbox.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">
              Forgot password?
            </h1>
            <p className="text-gray-400 mb-6">
              Enter your email and we'll send you a reset link.
            </p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500"
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-3 transition"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
