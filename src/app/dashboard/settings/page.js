"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

const Section = ({ title, desc, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
    <div className="px-6 py-5 border-b border-gray-50">
      <h3 className="text-gray-900 font-semibold text-sm">{title}</h3>
      {desc && <p className="text-gray-400 text-xs mt-0.5">{desc}</p>}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="text-gray-600 text-sm font-medium mb-1.5 block">
      {label}
    </label>
    <input
      {...props}
      className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
    />
  </div>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const [profile, setProfile] = useState({ name: "", fromName: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  const [emailForm, setEmailForm] = useState({ email: "", password: "" });
  const [emailMsg, setEmailMsg] = useState({ type: "", text: "" });
  const [emailSaving, setEmailSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");

    getApi()
      .get("/settings")
      .then((res) => {
        setSettings(res.data);
        setProfile({
          name: res.data.name,
          fromName: res.data.from_name || res.data.name,
        });
        setEmailForm((f) => ({ ...f, email: res.data.email }));
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const res = await getApi().put("/settings/profile", profile);
      setSettings((s) => ({ ...s, name: res.data.name }));
      localStorage.setItem(
        "notifiq_tenant",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("notifiq_tenant") || "{}"),
          name: res.data.name,
        }),
      );
      setProfileMsg({
        type: "success",
        text: "Profile updated!",
      });
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.error || "Something went wrong",
      });
    }
  };

  const handleEmailSave = async () => {
    setEmailSaving(true);
    setEmailMsg({ type: "", text: "" });
    try {
      await getApi().put("/settings/email", emailForm);
      setSettings((s) => ({ ...s, email: emailForm.email }));
      setEmailForm((f) => ({ ...f, password: "" }));
      setEmailMsg({ type: "success", text: "Email updated!" });
    } catch (err) {
      setEmailMsg({
        type: "error",
        text: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirm) {
      return setPasswordMsg({ type: "error", text: "Passwords don't match" });
    }

    setPasswordSaving(true);
    setPasswordMsg({ type: "", text: "" });

    try {
      await getApi().put("/settings/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirm: "" });
      setPasswordMsg({ type: "success", text: "Password updated!" });
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (
      !confirm(
        "Are you sure? Your existing API key will stop working immediately.",
      )
    ) {
      return;
    }
    try {
      const res = await getApi().post("/settings/regenerate-key");
      setSettings((s) => ({ ...s, api_key: res.data.api_key }));
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(settings.api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Feedback = ({ msg }) => {
    if (!msg.text) return null;
    return (
      <p
        className={`text-sm mb-3 ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}
      >
        {msg.text}
      </p>
    );
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-8 py-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Profile */}
            <Section
              title="Profile"
              desc="Update your company name and sender name."
            >
              <Input
                label="Company / Your name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
              <Input
                label="From name (shown in emails)"
                placeholder="e.g. Acme Newsletter"
                value={profile.fromName}
                onChange={(e) =>
                  setProfile({ ...profile, fromName: e.target.value })
                }
              />
              <Feedback msg={profileMsg} />
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition shadow-sm"
              >
                {profileSaving ? "Saving..." : "Save changes"}
              </button>
            </Section>

            {/* Email */}
            <Section
              title="Email address"
              desc="Change the email you use to sign in."
            >
              <Input
                label="New email address"
                type="email"
                value={emailForm.email}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, email: e.target.value })
                }
              />
              <Input
                label="Current password"
                type="password"
                placeholder="Confirm your password"
                value={emailForm.password}
                onChange={(e) =>
                  setEmailForm({ ...emailForm, password: e.target.value })
                }
              />
              <Feedback msg={emailMsg} />
              <button
                onClick={handleEmailSave}
                disabled={emailSaving}
                className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition shadow-sm"
              >
                {emailSaving ? "Saving..." : "Update email"}
              </button>
            </Section>

            {/* Password */}
            <Section title="Password" desc="Change your account password.">
              <Input
                label="Current password"
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
              />
              <Input
                label="New password"
                type="password"
                placeholder="Min. 8 characters"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="Repeat new password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
              />
              <Feedback msg={passwordMsg} />
              <button
                onClick={handlePasswordSave}
                disabled={passwordSaving}
                className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-5 py-2.5 text-sm transition shadow-sm"
              >
                {passwordSaving ? "Saving..." : "Update password"}
              </button>
            </Section>

            {/* API Key */}
            <Section
              title="API Key"
              desc="Use this key to authenticate API requests."
            >
              <div className="flex items-center gap-3 mb-4">
                <code className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 text-xs font-mono truncate">
                  {settings?.api_key}
                </code>
                <button
                  onClick={copyApiKey}
                  className="border border-gray-200 text-gray-600 hover:border-gray-400 font-medium rounded-xl px-4 py-3 text-sm transition flex-shrink-0"
                >
                  {copied ? "✅ Copied" : "Copy"}
                </button>
              </div>
              <button
                onClick={handleRegenerateKey}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
              >
                Regenerate API key
              </button>
              <p className="text-gray-400 text-xs mt-2">
                ⚠️ Regenerating will invalidate your existing key immediately.
              </p>
            </Section>

            {/* Account info */}
            <Section title="Account" desc="Your account details.">
              <div className="space-y-3">
                {[
                  {
                    label: "Plan",
                    value: settings?.plan === "pro" ? "⚡ Pro" : "Free",
                  },
                  {
                    label: "Member since",
                    value: new Date(settings?.created_at).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" },
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
