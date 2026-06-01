"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getApi from "@/lib/api";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (token) router.push("/dashboard");
  }, []);

  if (!mounted) return null;

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password)
      return setError("All fields are required");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");

    try {
      const res = await getApi().post("/auth/signup", form);
      localStorage.setItem("notifiq_token", res.data.token);
      localStorage.setItem("notifiq_tenant", JSON.stringify(res.data.tenant));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <Link href="/" className="text-blue-400 text-sm mb-6 block">
          ← Back to home
        </Link>
        <h1 className="text-2xl font-bold text-white mb-1">
          Create your account
        </h1>
        <p className="text-gray-400 mb-6">Start scheduling emails for free</p>

        <div className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Company or your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-3 transition mb-4"
        >
          {loading ? "Creating account..." : "Create free account"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
