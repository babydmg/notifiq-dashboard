"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getApi from "@/lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
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

  const handleLogin = async () => {
    if (!form.email || !form.password)
      return setError("All fields are required");
    setLoading(true);
    setError("");

    try {
      const res = await getApi().post("/auth/login", form);
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
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-gray-400 mb-6">Sign in to your Notifiq account</p>

        <div className="space-y-4 mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end mb-4">
          <Link
            href="/forgot-password"
            className="text-blue-400 text-sm hover:text-blue-300"
          >
            Forgot Password?
          </Link>
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-3 transition mb-4"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
