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
              href="/signup"
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg px-6 py-32 text-center">
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
          <div className="flex items-center justify-center gap-4 flex-wrap">
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
          <p className="text-gray-400 text-sm mt-8">
            Free plan includes 100 emails/month · No credit card required
          </p>
        </div>
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
