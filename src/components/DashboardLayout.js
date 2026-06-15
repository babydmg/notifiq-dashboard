"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import getApi from "@/lib/api";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/blast", label: "Campaigns", icon: "⚡" },
  { href: "/dashboard/segments", label: "Segments", icon: "🎯" },
  { href: "/dashboard/jobs", label: "Schedule", icon: "🕐" },
  { href: "/dashboard/recurring", label: "Recurring", icon: "🔄" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "👥" },
  { href: "/dashboard/templates", label: "Templates", icon: "📋" },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: "🔔" },
  { href: "/dashboard/domains", label: "Domains", icon: "🌐" },
  { href: "/dashboard/team", label: "Team", icon: "👤" },
  { href: "/dashboard/billing", label: "Billing", icon: "💳" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }) {
  const [tenant, setTenant] = useState(null);
  const [role, setRole] = useState("owner");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");

    getApi()
      .get("/auth/me")
      .then((res) => {
        setTenant(res.data.tenant);
        setRole(res.data.role);
        localStorage.setItem("notifiq_tenant", JSON.stringify(res.data.tenant));
      })
      .catch(() => {
        localStorage.removeItem("notifiq_token");
        localStorage.removeItem("notifiq_tenant");
        router.push("/login");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("notifiq_token");
    localStorage.removeItem("notifiq_tenant");
    router.push("/login");
  };

  if (!mounted) return null;

  const visibleNav = navItems.filter((item) => {
    if (role === "member") {
      return !["/dashboard/domains", "/dashboard/team"].includes(item.href);
    }
    return true;
  });

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }
        .nav-item { transition: all 0.15s ease; }
        .nav-item:hover { background: rgba(255,255,255,0.06); }
        .nav-item.active { background: rgba(255,255,255,0.1); }
        .main-content { background: #f8f9fb; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>

      {/* Sidebar */}
      <aside
        className="w-60 min-h-screen flex flex-col"
        style={{
          background: "#0f1117",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              }}
            >
              N
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">
              Notifiq
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {visibleNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  active ? "active text-white" : "text-gray-400"
                }`}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {tenant && (
            <div
              className="px-3 py-2.5 mb-2 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-white text-xs font-medium truncate">
                {tenant.name}
              </p>
              <p className="text-gray-500 text-xs truncate">{tenant.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                    tenant.plan === "pro"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {tenant.plan === "pro" ? "⚡ Pro" : "Free"}
                </span>
                {role !== "owner" && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-purple-900 text-purple-300 capitalize">
                    {role}
                  </span>
                )}
              </div>
            </div>
          )}
          <a
            href="mailto:your@email.com?subject=Notifiq Feedback"
            className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300 mb-1"
          >
            <span className="text-base w-5 text-center">💬</span>
            Send feedback
          </a>
          <button
            onClick={logout}
            className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-300"
          >
            <span className="text-base w-5 text-center">→</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 main-content overflow-auto">{children}</main>
    </div>
  );
}
