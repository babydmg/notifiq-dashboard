"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

const roleColors = {
  admin: "bg-purple-100 text-purple-700",
  member: "bg-gray-100 text-gray-600",
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    email: "",
    role: "member",
  });

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await getApi().get("/team");
      setMembers(res.data);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!form.email) return setError("Email is required");
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await getApi().post("/team/invite", form);
      setSuccess(res.data.message);
      setForm({ email: "", role: "member" });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await getApi().delete(`/team/${id}`);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || "Remove failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await getApi().put(`/team/${id}`, { role });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Team Members
          </h1>
          <p className="text-gray-500">
            Invite colleagues to manage campaigns together.
          </p>
        </div>

        {/* Invite form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">
            Invite Team Member
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="col-span-2">
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
            <div>
              <label className="text-gray-600 text-sm font-medium mb-1.5 block">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition bg-white"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Role explanation */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {
                role: "Member",
                desc: "Can view and send campaigns but can't manage billing or team.",
              },
              {
                role: "Admin",
                desc: "Full access including billing, team management, and settings.",
              },
            ].map((r) => (
              <div key={r.role} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-gray-700 text-xs font-semibold mb-0.5">
                  {r.role}
                </p>
                <p className="text-gray-400 text-xs">{r.desc}</p>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <button
            onClick={handleInvite}
            disabled={submitting}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
          >
            {submitting ? "Sending invite..." : "Send Invitation"}
          </button>
        </div>

        {/* Members list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Team — {members.length} {members.length === 1 ? "member" : "members"}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-16 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {members.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400 text-sm">
                  No team members yet. Invite someone above.
                </p>
              </div>
            ) : (
              members.map((member, i) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i !== members.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-semibold">
                      {(member.name || member.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-medium">
                        {member.name || member.email}
                      </p>
                      {member.name && (
                        <p className="text-gray-400 text-xs">{member.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[member.status]}`}
                    >
                      {member.status}
                    </span>

                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value)
                      }
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 focus:outline-none cursor-pointer ${roleColors[member.role]}`}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-gray-300 hover:text-red-400 text-sm transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
