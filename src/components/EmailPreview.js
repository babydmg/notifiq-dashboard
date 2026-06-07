"use client";
import { useEffect, useRef } from "react";

export default function EmailPreview({ subject, body, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => e.key === "Espace" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.addEventListener("keydown", handleKey);
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-gray-900 font-semibold text-sm">Email Preview</p>
            <p className="text-gray-400 text-xs mt-0.5">
              This is how your email will look
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Email client mock */}
        <div className="flex-1 overflow-auto">
          {/* Email header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                }}
              >
                N
              </div>
              <div>
                <p className="text-gray-900 text-sm font-medium">Notifiq</p>
                <p className="text-gray-400 text-xs">via notifiq.app</p>
              </div>
            </div>
            <p className="text-gray-900 font-semibold text-base">
              {subject || "No subject"}
            </p>
          </div>

          {/* Email body */}
          <div className="px-6 py-6">
            {body ? (
              <div
                className="prose max-w-none text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <p className="text-gray-400 text-sm">No content yet.</p>
            )}

            {/* Unsubscribe footer preview */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-400 text-xs text-center">
                You're receiving this email because you subscribed to our list.{" "}
                <span className="text-blue-400 underline cursor-pointer">
                  Unsubscribe
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-gray-400 text-xs">
            Preview only — links and tracking are not active here.
          </p>
          <button
            onClick={onClose}
            className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
}
