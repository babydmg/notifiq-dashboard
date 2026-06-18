"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import getApi from "@/lib/api";

const EVENT_OPTIONS = ["email.sent", "email.failed"];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deliveries, setDeliveries] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({
    url: "",
    events: ["email.sent", "email.failed"],
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("notifiq_token");
    if (!token) return router.push("/login");
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const res = await getApi().get("/webhooks");
      setWebhooks(res.data);
    } catch (err) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.url) return setError("URL is required");
    if (!form.url.startsWith("http")) {
      return setError("URL must start with http:// or https://");
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await getApi().post("/webhooks", form);
      setSuccess("Webhook created!");
      setForm({ url: "", events: ["email.sent", "email.failed"] });
      fetchWebhooks();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await getApi().delete(`/webhooks/${id}`);
      fetchWebhooks();
    } catch (err) {
      setError(err.response?.data?.error || "Delete failed");
    }
  };

  const toggleDeliveries = async (id) => {
    if (expandedId === id) return setExpandedId(null);

    setExpandedId(id);
    if (!deliveries[id]) {
      const res = await getApi().get(`/webhooks/${id}/deliveries`);
      setDeliveries({ ...deliveries, [id]: res.data });
    }
  };

  const toggleEvent = (event) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(event)
        ? f.events.filter((e) => e !== event)
        : [...f.events, event],
    }));
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Webhooks</h1>
          <p className="text-gray-500">
            Get notified when emails are sent or fail — in real time.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
          <p className="text-blue-800 font-semibold text-sm mb-1">
            How webhooks work
          </p>
          <p className="text-blue-600 text-sm">
            When an email is sent or fails, Notifiq sends a POST request to your
            URL with a signed payload. Verify the signature using the{" "}
            <span className="font-mono bg-blue-100 px-1 rounded">
              X-Notifiq-Signature
            </span>{" "}
            header and your webhook secret.
          </p>
        </div>

        {/* Create form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-gray-900 font-semibold text-sm mb-4">
            Add Webhook
          </h3>
          <div className="mb-4">
            <label className="text-gray-600 text-sm font-medium mb-1.5 block">
              Endpoint URL
            </label>
            <input
              type="url"
              placeholder="https://your-app.com/webhooks/notifiq"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>
          <div className="mb-5">
            <label className="text-gray-600 text-sm font-medium mb-2 block">
              Events to listen to
            </label>
            <div className="flex gap-3">
              {EVENT_OPTIONS.map((event) => (
                <button
                  key={event}
                  onClick={() => toggleEvent(event)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border font-mono ${
                    form.events.includes(event)
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white font-medium rounded-xl px-6 py-3 text-sm transition shadow-sm"
          >
            {submitting ? "Creating..." : "Add Webhook"}
          </button>
        </div>

        {/* Webhooks list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Active Webhooks
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {webhooks.length === 0 && (
              <p className="text-gray-400 text-sm">
                No webhooks yet. Add one above.
              </p>
            )}
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-gray-900 font-medium text-sm font-mono truncate">
                      {wh.url}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {wh.events.map((e) => (
                        <span
                          key={e}
                          className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleDeliveries(wh.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition"
                    >
                      {expandedId === wh.id ? "Hide logs" : "View logs"}
                    </button>
                    <button
                      onClick={() => handleDelete(wh.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delivery logs */}
                {expandedId === wh.id && (
                  <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                    <p className="text-gray-600 text-xs font-semibold mb-3">
                      Recent Deliveries
                    </p>
                    {!deliveries[wh.id] || deliveries[wh.id].length === 0 ? (
                      <p className="text-gray-400 text-xs">
                        No deliveries yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {deliveries[wh.id].map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2 py-0.5 rounded-full font-medium ${
                                  d.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {d.status}
                              </span>
                              <span className="font-mono text-gray-500">
                                {d.event}
                              </span>
                              {d.response_code && (
                                <span className="text-gray-400">
                                  HTTP {d.response_code}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400">
                              {d.delivered_at
                                ? new Date(d.delivered_at).toLocaleString()
                                : "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
