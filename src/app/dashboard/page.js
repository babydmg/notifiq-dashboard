"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

export default function DashboardPage() {
  const [usage, setUsage] = useState(null);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalOpens: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tenant, setTenant] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    const t = localStorage.getItem("notifiq_tenant");
    if (!token) return router.push("/login");
    if (t) setTenant(JSON.parse(t));

    Promise.all([getApi().get("/billing/usage"), getApi().get("/jobs")])
      .then(([usageRes, jobsRes]) => {
        setUsage(usageRes.data);
        const sent = jobsRes.data.filter((j) => j.status === "sent");
        setStats({
          totalSent: sent.length,
          totalOpens: sent.reduce((a, b) => a + (b.opens || 0), 0),
          totalClicks: sent.reduce((a, b) => a + (b.clicks || 0), 0),
        });
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    try {
      const res = await getApi().post("/billing/checkout");
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Good to see you
            {tenant?.name ? `, ${tenant.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your emails.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Emails this month",
              value: loading ? "—" : (usage?.usage ?? 0),
              sub: `of ${usage?.limit ?? 100} limit`,
              color: "text-gray-900",
            },
            {
              label: "Total sent",
              value: loading ? "—" : stats.totalSent,
              sub: "all time",
              color: "text-gray-900",
            },
            {
              label: "Total opens",
              value: loading ? "—" : stats.totalOpens,
              sub: "all time",
              color: "text-blue-600",
            },
            {
              label: "Total clicks",
              value: loading ? "—" : stats.totalClicks,
              sub: "all time",
              color: "text-indigo-600",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <p className="text-gray-500 text-sm mb-3">{card.label}</p>
              <p className={`text-3xl font-bold mb-1 ${card.color}`}>
                {card.value}
              </p>
              <p className="text-gray-400 text-xs">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Upgrade banner */}
        {usage?.plan === "free" && (
          <div
            className="rounded-2xl p-6 mb-8 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #1e40af, #4f46e5)" }}
          >
            <div>
              <p className="text-white font-semibold text-lg mb-1">
                Upgrade to Pro
              </p>
              <p className="text-blue-200 text-sm">
                You're on the free plan. Upgrade for unlimited emails.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg text-sm"
            >
              Upgrade — $29/mo
            </button>
          </div>
        )}

        {/* Quick actions */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick actions
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              href: "/dashboard/blast",
              label: "Send a campaign",
              desc: "Blast an email to all contacts",
              icon: "⚡",
              color: "bg-blue-50 text-blue-600",
            },
            {
              href: "/dashboard/contacts",
              label: "Manage contacts",
              desc: "Add or import your audience",
              icon: "👥",
              color: "bg-purple-50 text-purple-600",
            },
            {
              href: "/dashboard/templates",
              label: "Create template",
              desc: "Save emails for reuse",
              icon: "📋",
              color: "bg-green-50 text-green-600",
            },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${action.color}`}
              >
                {action.icon}
              </div>
              <p className="text-gray-900 font-semibold text-sm mb-1 group-hover:text-blue-600 transition">
                {action.label}
              </p>
              <p className="text-gray-400 text-xs">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
