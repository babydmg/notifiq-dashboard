"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getApi from "@/lib/api";

export default function LoginPage() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const key = localStorage.getItem("notifiq_api_key");
    if (key) router.push("/dashboard");
  }, []);

  if (!mounted) return null;

  const handleLogin = async () => {
    if (!apiKey.trim()) return setError("Enter Your API KEY");
    setLoading(true);
    setError("");

    try {
      localStorage.setItem("notifiq_api_key", apiKey);
      const api = getApi();
      await api.get("/jobs");
      router.push("/dashboard");
    } catch (err) {
      localStorage.removeItem("notifiq_api_key");
      setError("Invalid API KEY. Try Again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-1">Notifiq</h1>
        <p className="text-gray-400 mb-6">
          Enter your API key to access the dashboard
        </p>

        <input
          type="text"
          placeholder="nfq_xxxxxxxxxxxx"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-blue-500"
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-3 transition"
        >
          {loading ? "Verifying..." : "Enter Dashboard"}
        </button>
      </div>
    </div>
  );
}
