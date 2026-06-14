"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

export default function BillingPage() {
  const [usage, setUsage] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");

    Promise.all([
      getApi().get("/billing/usage"),
      getApi().get("/billing/invoices"),
      getApi().get("/auth/me"),
    ])
      .then(([usageRes, invoicesRes, meRes]) => {
        setUsage(usageRes.data);
        setInvoices(invoicesRes.data);
        setTenant(meRes.data.tenant);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await getApi().post("/billing/checkout");
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await getApi().post("/billing/portal");
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Billing</h1>
          <p className="text-gray-500">
            Manage your subscription and view invoices.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Current plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Current plan</p>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">
                      {usage?.plan === "pro" ? "Pro" : "Free"}
                    </h2>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        usage?.plan === "pro"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {usage?.plan === "pro" ? "Active" : "Free tier"}
                    </span>
                  </div>
                  {usage?.plan === "pro" && (
                    <p className="text-gray-400 text-sm mt-1">
                      $29 / month · Renews automatically
                    </p>
                  )}
                </div>

                {usage?.plan === "pro" ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 font-medium rounded-xl px-5 py-2.5 text-sm transition disabled:opacity-50"
                  >
                    {portalLoading ? "Loading..." : "Manage subscription →"}
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={upgradeLoading}
                    className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition shadow-sm"
                  >
                    {upgradeLoading ? "Loading..." : "Upgrade to Pro →"}
                  </button>
                )}
              </div>

              {/* Usage bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">
                    Emails this month
                  </p>
                  <p className="text-gray-500 text-sm">
                    {usage?.usage} /{" "}
                    {usage?.plan === "pro" ? "∞" : usage?.limit}
                  </p>
                </div>
                {usage?.plan !== "pro" && (
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        usage?.usage / usage?.limit > 0.8
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min((usage?.usage / usage?.limit) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
                {usage?.plan === "pro" && (
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500 w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Plan comparison */}
            {usage?.plan !== "pro" && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-lg mb-1">
                      Upgrade to Pro
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      Everything you need to grow.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Unlimited emails per month",
                        "Priority email delivery",
                        "Advanced analytics",
                        "Priority support",
                      ].map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-gray-300 text-sm"
                        >
                          <span className="text-blue-400">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right flex-shrink-0 ml-8">
                    <p className="text-white text-4xl font-extrabold">$29</p>
                    <p className="text-gray-400 text-sm mb-4">/month</p>
                    <button
                      onClick={handleUpgrade}
                      disabled={upgradeLoading}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
                    >
                      {upgradeLoading ? "Loading..." : "Upgrade now →"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h3 className="text-gray-900 font-semibold text-sm">
                  Invoice History
                </h3>
              </div>
              {invoices.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-400 text-sm">No invoices yet.</p>
                </div>
              ) : (
                invoices.map((inv, i) => (
                  <div
                    key={inv.id}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i !== invoices.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                  >
                    <div>
                      <p className="text-gray-900 text-sm font-medium">
                        {inv.date}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {inv.currency} {inv.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                      {inv.pdf && (
                        <a
                          href={inv.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition"
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
