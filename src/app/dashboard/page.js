"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import getApi from "@/lib/api";

export default function DashboardPage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalOpens: 0,
    totalClicks: 0,
    totalSent: 0,
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const key = localStorage.getItem("notifiq_token");
    if (!key) return router.push("/login");

    getApi()
      .get("/billing/usage")
      .then((res) => setUsage(res.data))
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));

    (async () => {
      const jobsRes = await getApi().get("/jobs");
      const sent = jobsRes.data.filter((j) => j.status === "sent");
      const totalOpens = sent.reduce((a, b) => a + (b.opens || 0), 0);
      const totalClicks = sent.reduce((a, b) => a + (b.clicks || 0), 0);
      setStats({
        totalOpens,
        totalClicks,
        totalSent: sent.length,
      });
    })();
  }, []);

  if (!mounted) return null;

  if (loading) return <div className="min-h-screen bg-gray-950" />;

  const handleUpgrade = async () => {
    try {
      const res = await getApi().post("/billing/checkout");
      console.log(res.data);
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        console.error("No checkoutUrl in response");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

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
            <button
              className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              onClick={handleUpgrade}
            >
              Upgrade
            </button>
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total sent</p>
          <p className="text-white text-2xl font-bold">{stats.totalSent}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total opens</p>
          <p className="text-white text-2xl font-bold">{stats.totalOpens}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total clicks</p>
          <p className="text-white text-2xl font-bold">{stats.totalClicks}</p>
        </div>
      </div>
    </div>
  );
}
