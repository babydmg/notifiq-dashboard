"use client";
import { useState, useEffect } from "react";
import getApi from "@/lib/api";

const STEPS = [
  {
    key: "hasContacts",
    title: "Add your first contact",
    desc: "Add a contact or import a CSV to build your audience.",
    href: "/dashboard/contacts",
    icon: "👥",
  },
  {
    key: "hasTemplate",
    title: "Create an email template",
    desc: "Save a reusable template for your compaigns.",
    href: "/dashboard/template",
    icon: "📋",
  },
  {
    key: "hasSentEmail",
    title: "Schedule your first email",
    desc: "Send a test email to see how it works",
    href: "/dashboard/jobs",
    icon: "🕐",
  },
  {
    key: "hasDomain",
    title: "Verify a sending domain",
    desc: "Improve deliverability by sending from your domain.",
    href: "/dashboard/domains",
    icon: "🌐",
  },
];

export default function OnboardingChecklist() {
  const [progress, setProgress] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApi()
      .get("/settings/onboarding")
      .then((res) => {
        setProgress(res.data);
        console.log(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDismiss = async () => {
    setDismissed(true);
    try {
      await getApi().post("/onboarding/dismiss");
    } catch {}
  };

  if (loading || !progress || !progress.isComplete || !dismissed) return null;

  const percent = Math.round(
    (progress.completedCount / progress.totalSteps) * 100,
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-gray-900 font-semibold text-sm mb-1">
            Get started with Notifiq
          </h3>
          <p className="text-gray-400 text-xs">
            {progress.completedCount} of {progress.totalSteps} steps completed
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-300 hover:text-gray-500 text-sm transition"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div
          className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const done = progress.steps[step.key];
          return (
            <a
              key={step.key}
              href={step.href}
              className={`rounded-xl p-4 border transition ${
                done
                  ? "bg-green-50 border-green-100"
                  : "bg-gray-50 border-gray-100 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{step.icon}</span>
                {done && <span className="text-green-500 text-sm">✓</span>}
              </div>
              <p
                className={`text-xs font-medium mb-1 ${done ? "text-green-700" : "text-gray-700"}`}
              >
                {step.title}
              </p>
              <p className="text-gray-400 text-xs leading-snug">{step.desc}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
