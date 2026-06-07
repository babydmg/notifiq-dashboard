"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const StatCard = ({ label, value, sub, color = "text-gray-900" }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <p className="text-gray-500 text-sm mb-3">{label}</p>
    <p className={`text-3xl font-bold mb-1 ${color}`}>{value}</p>
    {sub && <p className="text-gray-400 text-xs">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="text-gray-500 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeChart, setActiveChart] = useState("sent");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");

    getApi()
      .get("/jobs/analytics")
      .then((res) => setData(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const chartData =
    data?.daily.map((d) => ({
      date: formatDate(d.data),
      Sent: parseInt(d.sent) || 0,
      Opens: parseInt(d.opens) || 0,
      Clicks: parseInt(d.clicks) || 0,
    })) || [];

  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics</h1>
          <p className="text-gray-500">
            Track your email performance over time.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total sent"
                value={data?.overall.total_sent || 0}
                sub="all time"
              />
              <StatCard
                label="Total opens"
                value={data?.overall.total_opens || 0}
                sub="all time"
                color="text-blue-600"
              />
              <StatCard
                label="Open rate"
                value={`${data?.overall.open_rate || 0}%`}
                sub="avg per email"
                color="text-indigo-600"
              />
              <StatCard
                label="Click rate"
                value={`${data?.overall.click_rate || 0}%`}
                sub="avg per email"
                color="text-purple-600"
              />
            </div>

            {/* Chart toggle */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900 font-semibold">Last 30 days</h2>
                <div className="flex items-center gap-2">
                  {["sent", "opens", "clicks"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize border ${
                        activeChart === type
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    No data yet. Send some emails first.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={
                        activeChart.charAt(0).toUpperCase() +
                        activeChart.slice(1)
                      }
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#colorGrad)"
                      dot={false}
                      activeDot={{ r: 4, fill: "#3b82f6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Sent vs Opens vs Clicks bar chart */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-gray-900 font-semibold mb-6">
                  Sent vs Opens vs Clicks
                </h2>
                {chartData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">No data yet.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar
                        dataKey="Sent"
                        fill="#e2e8f0"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="Opens"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="Clicks"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top performing emails */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-gray-900 font-semibold mb-4">
                  Top Performing Emails
                </h2>
                {data?.topEmails.length === 0 ? (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">No sent emails yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data?.topEmails.map((email, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-gray-900 text-sm font-medium truncate">
                            {email.subject}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {email.sent_at
                              ? new Date(email.sent_at).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            👁️ {email.opens || 0}
                          </span>
                          <span className="text-xs text-gray-500">
                            🖱️ {email.clicks || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-gray-900 font-semibold mb-4">
                Job Status Breakdown
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Sent",
                    value: data?.overall.total_sent || 0,
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    label: "Pending",
                    value: data?.overall.total_pending || 0,
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    label: "Failed",
                    value: data?.overall.total_failed || 0,
                    color: "bg-red-100 text-red-700",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-xl px-4 py-3 flex items-center justify-between ${s.color}`}
                  >
                    <span className="font-medium text-sm">{s.label}</span>
                    <span className="font-bold text-xl">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
