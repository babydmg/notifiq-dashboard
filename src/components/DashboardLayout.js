"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/blast", label: "Campaigns", icon: "⚡" },
  { href: "/dashboard/jobs", label: "Schedule", icon: "🕐" },
  { href: "/dashboard/recurring", label: "Recurring", icon: "🔄" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "👥" },
  { href: "/dashboard/templates", label: "Templates", icon: "📋" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: "🔔" },
  { href: "/dashboard/domains", label: "Domains", icon: "🌐" },
  { href: "/dashboard/team", label: "Team", icon: "🤝" },
];

export default function DashboardLayout({ children }) {
  const [tenant, setTenant] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    const t = localStorage.getItem("notifiq_tenant");
    if (!token) return router.push("/login");
    if (t) setTenant(JSON.parse(t));
  }, []);

  const logout = () => {
    localStorage.removeItem("notifiq_token");
    localStorage.removeItem("notifiq_tenant");
    router.push("/login");
  };

  if (!mounted) return null;

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
          {navItems.map((item) => {
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

        {/* Bottom — tenant info + logout */}
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
              <span
                className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                  tenant.plan === "pro"
                    ? "bg-blue-900 text-blue-300"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {tenant.plan === "pro" ? "⚡ Pro" : "Free"}
              </span>
            </div>
          )}
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
