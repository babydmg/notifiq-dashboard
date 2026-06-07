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
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Left panel */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12"
        style={{ background: "#0f1117" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}
          >
            N
          </div>
          <span className="text-white font-semibold text-sm">Notifiq</span>
        </div>

        <div>
          <p className="text-2xl font-bold text-white leading-snug mb-4">
            "Notifiq cut our email setup time from days to minutes."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div>
              <p className="text-white text-sm font-medium">Sarah K.</p>
              <p className="text-gray-500 text-xs">Founder, ShopEasy</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {[
            ["10k+", "Emails sent"],
            ["99.9%", "Uptime"],
            ["500+", "Businesses"],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-white font-bold text-xl">{val}</p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              }}
            >
              N
            </div>
            <span className="font-semibold text-gray-900 text-sm">Notifiq</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to your account to continue.
          </p>

          <div className="space-y-3 mb-2">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-600 text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-blue-500 text-xs hover:text-blue-600 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
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
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-4 py-3 text-sm transition shadow-sm mt-4"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-gray-400 text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-600 font-medium transition"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
