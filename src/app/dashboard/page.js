"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import getApi from "@/lib/api";

export default function DashboardPage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const key = localStorage.getItem("notifiq_api_key");
    if (!key) return router.push("/");

    getApi()
      .get("/billing/usage")
      .then((res) => setUsage(res.data))
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  if (loading) return <div className="min-h-screen bg-gray-950" />;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Plan</p>
            <p className="text-white text-2xl font-bold capitalize">
              {usage?.plan}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Emails this month</p>
            <p className="text-white text-2xl font-bold">{usage?.usage}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Remaining</p>
            <p className="text-white text-2xl font-bold">{usage?.remaining}</p>
          </div>
        </div>

        {usage?.plan === "free" && (
          <div className="bg-blue-950 border border-blue-800 rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Upgrade to Pro</p>
              <p className="text-blue-300 text-sm">
                Get unlimited emails for $29/month
              </p>
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/billing/checkout`}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Upgrade
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
