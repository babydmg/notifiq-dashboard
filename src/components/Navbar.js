"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("notifiq_token");
    localStorage.removeItem("notifiq_tenant");
    router.push("/login");
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-white font-bold text-lg">Notifiq</span>
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Overview
        </Link>
        <Link
          href="/dashboard/jobs"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Jobs
        </Link>
        <Link
          href="/dashboard/blast"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Blast
        </Link>
        <Link
          href="/dashboard/recurring"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Recurring
        </Link>
        <Link
          href="/dashboard/templates"
          className="text-gray-400 hover:text-white text-sm transition"
        >
          Templates
        </Link>
      </div>
      <button
        onClick={logout}
        className="text-gray-400 hover:text-white text-sm transition"
      >
        Logout
      </button>
    </nav>
  );
}
