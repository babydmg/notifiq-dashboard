"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import getApi from "@/lib/api";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  const handleReset = async () => {
    if (!password || !confirm) return setError("All fields are required");
    if (password !== confirm) return setError("Passwords don't match");
    if (password.length < 8)
      return setError("Password must be at least 8 characters long");
    setLoading(true);
    setError("");

    try {
      await getApi().post("/auth/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
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

        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-white mb-2">
              Password reset!
            </h2>
            <p className="text-gray-400 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">
              Set new password
            </h1>
            <p className="text-gray-400 mb-6">
              Choose a strong password for your account.
            </p>

            <div className="space-y-4 mb-4">
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReset()}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-3 transition"
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
