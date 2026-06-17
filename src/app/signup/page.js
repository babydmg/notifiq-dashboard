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
      localStorage.getItem("notifiq_show_welcome", "true");
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

        <div className="space-y-4">
          {[
            {
              icon: "⚡",
              title: "Up in 5 minutes",
              desc: "No complicated setup. Sign up and start scheduling immediately.",
            },
            {
              icon: "📊",
              title: "Track everything",
              desc: "See opens, clicks, and delivery status for every email.",
            },
            {
              icon: "🔄",
              title: "Set and forget",
              desc: "Recurring campaigns run on autopilot — weekly, daily, or custom.",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{f.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-xs">
          Free plan includes 100 emails/month. No credit card required.
        </p>
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
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Start scheduling emails for free. No card needed.
          </p>

          <div className="space-y-3 mb-2">
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Company or your name
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
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
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
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
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-4 py-3 text-sm transition shadow-sm mt-4"
          >
            {loading ? "Creating account..." : "Create free account"}
          </button>

          <p className="text-gray-400 text-xs text-center mt-4">
            By signing up you agree to our terms of service.
          </p>

          <p className="text-gray-400 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-600 font-medium transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
