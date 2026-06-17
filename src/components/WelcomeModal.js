"use client";
import { useState } from "react";

export default function WelcomeModal({ name, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Notifiq{name ? `, ${name.split(" ")[0]}` : ""}!
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          You're all set up. Add your first contacts, create a template, and
          send your first campaign — we'll guide you through it.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl transition text-sm"
        >
          Let's get started →
        </button>
      </div>
    </div>
  );
}
