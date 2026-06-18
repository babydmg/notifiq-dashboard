"use client";
import Link from "next/link";

const features = [
  {
    icon: "📨",
    title: "Schedule Newsletters",
    description:
      "Write your newsletter once and schedule it to land in your customers' inboxes at exactly the right time.",
  },
  {
    icon: "🔔",
    title: "Automated Reminders",
    description:
      "Send order confirmations, appointment reminders, and follow-ups automatically — set it and forget it.",
  },
  {
    icon: "📅",
    title: "Recurring Campaigns",
    description:
      "Weekly digests, monthly updates, daily deals — set up recurring emails that run on autopilot forever.",
  },
  {
    icon: "📊",
    title: "Track Every Job",
    description:
      "See exactly which emails were sent, pending, or failed — all from one clean dashboard.",
  },
  {
    icon: "⚡",
    title: "Instant Setup",
    description:
      "No complicated integrations. Sign up, get your API key, and start scheduling emails in under 5 minutes.",
  },
  {
    icon: "🔒",
    title: "Reliable & Secure",
    description:
      "Built on enterprise-grade infrastructure. Your emails go out on time, every time.",
  },
];

const usecases = [
  {
    emoji: "🛍️",
    label: "E-commerce",
    example:
      "Abandoned cart reminders, order updates, flash sale announcements",
  },
  {
    emoji: "🚀",
    label: "SaaS",
    example: "Trial expiry warnings, onboarding sequences, usage reports",
  },
  {
    emoji: "🏢",
    label: "Small Business",
    example: "Appointment reminders, newsletters, promotional campaigns",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        h1, h2, h3, nav .logo { font-family: 'Bricolage Grotesque', sans-serif; }
        body, p, a, li, span, button { font-family: 'DM Sans', sans-serif; }
        .hero-bg { background: radial-gradient(ellipse 80% 60% at 50% -10%, #dbeafe 0%, #ffffff 70%); }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .gradient-text { background: linear-gradient(135deg, #1d4ed8, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .mock-bar { animation: growBar 1.2s ease-out forwards; }
        @keyframes growBar { from { height: 0; } }
        .mock-float { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .mock-pulse { animation: pulseGlow 2.5s ease-in-out infinite; }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>

      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="logo text-xl font-bold text-gray-900">Notifiq</span>
          <div className="flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-500 hover:text-gray-900 text-sm transition"
            >
              Features
            </a>
            <a
              href="#usecases"
              className="text-gray-500 hover:text-gray-900 text-sm transition"
            >
              Use Cases
            </a>
            <a
              href="#pricing"
              className="text-gray-500 hover:text-gray-900 text-sm transition"
            >
              Pricing
            </a>
            <Link
              href="/login"
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg px-6 pt-28 pb-0 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase border border-blue-100">
            Email Scheduling Platform
          </span>
          <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Send the right email
            <br />
            <span className="gradient-text">at the right time.</span>
          </h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
            Notifiq lets businesses schedule newsletters, automate reminders,
            and run recurring email campaigns — all from one simple dashboard.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Link
              href="/signup"
              className="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-10 py-4 rounded-xl transition text-lg shadow-lg"
            >
              Start for free →
            </Link>
            <a
              href="#usecases"
              className="text-gray-600 hover:text-gray-900 font-medium px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-400 transition text-lg"
            >
              See use cases
            </a>
          </div>
          <p className="text-gray-400 text-sm mb-16">
            Free plan includes 100 emails/month · No credit card required
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative">
            {/* glow behind mockup */}
            <div
              className="absolute inset-0 mock-pulse"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(59,130,246,0.15), transparent 70%)",
                filter: "blur(20px)",
              }}
            />

            <div
              className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.2)" }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-400 border border-gray-100">
                    app.notifiq.com/dashboard
                  </div>
                </div>
              </div>

              {/* Mock dashboard body */}
              <div className="flex text-left">
                {/* Mini sidebar */}
                <div
                  className="hidden sm:flex w-44 flex-shrink-0 flex-col py-5 px-3 gap-1"
                  style={{ background: "#0f1117" }}
                >
                  <div className="flex items-center gap-2 px-2 mb-5">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                      }}
                    >
                      N
                    </div>
                    <span className="text-white text-xs font-semibold">
                      Notifiq
                    </span>
                  </div>
                  {[
                    { label: "Overview", active: true },
                    { label: "Analytics", active: false },
                    { label: "Campaigns", active: false },
                    { label: "Contacts", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-2.5 py-2 rounded-lg text-xs ${item.active ? "text-white" : "text-gray-500"}`}
                      style={{
                        background: item.active
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main panel */}
                <div
                  className="flex-1 p-5 sm:p-6"
                  style={{ background: "#f8f9fb" }}
                >
                  <p className="text-gray-900 font-semibold text-sm mb-4">
                    Good to see you, Sarah 👋
                  </p>

                  {/* Stat row */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      {
                        label: "Sent this month",
                        value: "12,480",
                        color: "text-gray-900",
                      },
                      {
                        label: "Open rate",
                        value: "42.8%",
                        color: "text-blue-600",
                      },
                      {
                        label: "Click rate",
                        value: "9.1%",
                        color: "text-indigo-600",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="bg-white rounded-xl border border-gray-100 p-3"
                      >
                        <p className="text-gray-400 text-[10px] mb-1">
                          {s.label}
                        </p>
                        <p className={`text-lg font-bold ${s.color}`}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart */}
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-gray-700 text-xs font-medium mb-3">
                      Last 14 days
                    </p>
                    <div className="flex items-end gap-1.5 h-20">
                      {[
                        40, 55, 35, 70, 50, 80, 60, 90, 65, 75, 95, 70, 85, 100,
                      ].map((h, i) => (
                        <div
                          key={i}
                          className="mock-bar flex-1 rounded-t-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 13 ? "#3b82f6" : "#dbeafe",
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating "scheduled" card */}
            <div className="hidden md:block absolute -right-6 top-12 mock-float">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-48">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">📨</span>
                  <p className="text-gray-900 text-xs font-semibold">
                    Weekly Digest
                  </p>
                </div>
                <p className="text-gray-400 text-[10px] mb-2">
                  Scheduled for Monday, 9:00 AM
                </p>
                <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                  pending
                </span>
              </div>
            </div>

            {/* Floating "sent" card */}
            <div
              className="hidden md:block absolute -left-6 bottom-16 mock-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 w-44">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-gray-900 text-xs font-semibold">
                    Order confirmed
                  </p>
                  <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    sent
                  </span>
                </div>
                <p className="text-gray-400 text-[10px]">
                  👁️ 1,204 opens · 🖱️ 312 clicks
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </section>

      {/* Use cases */}
      <section id="usecases" className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Built for every business
            </h2>
            <p className="text-gray-500 text-lg">
              Whether you run a store, a startup, or a service business —
              Notifiq works for you.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {usecases.map((u) => (
              <div
                key={u.label}
                className="card-hover bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center"
              >
                <span className="text-5xl mb-4 block">{u.emoji}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {u.label}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {u.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything you need to stay in touch
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Powerful features that make email scheduling simple, reliable, and
              effective.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-hover bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
              >
                <span className="text-4xl mb-5 block">{f.icon}</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 tracking-tight">
            Up and running in minutes
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create an account",
                desc: "Sign up and get your API key instantly. No setup, no configuration.",
              },
              {
                step: "2",
                title: "Schedule your first email",
                desc: "Use the dashboard to write your email and pick when to send it.",
              },
              {
                step: "3",
                title: "Sit back and relax",
                desc: "Notifiq handles delivery automatically. Track status in real time.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-gray-900 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Simple, honest pricing
            </h2>
            <p className="text-gray-500 text-lg">
              Start free. Upgrade when your business grows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Free</h3>
              <p className="text-gray-400 text-sm mb-8">
                Perfect for getting started
              </p>
              <div className="mb-10">
                <span className="text-6xl font-extrabold text-gray-900">
                  $0
                </span>
                <span className="text-gray-400 ml-2 text-lg">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "100 emails per month",
                  "Scheduled emails",
                  "Recurring campaigns",
                  "Dashboard access",
                  "Email support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <span className="text-green-500 font-bold text-lg">✓</span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center border-2 border-gray-200 hover:border-gray-400 text-gray-700 font-semibold px-6 py-4 rounded-xl transition"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gray-900 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Pro</h3>
              <p className="text-gray-400 text-sm mb-8">
                For growing businesses
              </p>
              <div className="mb-10">
                <span className="text-6xl font-extrabold text-white">$29</span>
                <span className="text-gray-400 ml-2 text-lg">/month</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited emails",
                  "Scheduled emails",
                  "Recurring campaigns",
                  "Dashboard access",
                  "Priority support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="text-blue-400 font-bold text-lg">✓</span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl transition"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-28 bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Start sending smarter.
          </h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">
            Join businesses already using Notifiq to stay connected with their
            customers on autopilot.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white hover:bg-gray-100 text-gray-900 font-bold px-12 py-5 rounded-xl transition text-xl shadow-xl"
          >
            Get started free →
          </Link>
          <p className="text-gray-500 text-sm mt-6">
            No credit card required · Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-gray-900 font-bold text-lg">Notifiq</span>
          <p className="text-gray-400 text-sm">
            © 2026 Notifiq. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
