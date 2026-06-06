"use client";
import { useEffect, useState } from "react";
import getApi from "@/lib/api";

export default function TemplatePicker({ onSelect }) {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getApi()
      .get("/templates")
      .then((res) => setTemplates(res.data));
  }, []);

  if (templates.length === 0) return null;

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
      >
        📋 Load from template {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="absolute top-11 left-0 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-10 w-80 overflow-hidden">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                console.log(t);
                onSelect(t);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
            >
              <p className="text-white text-sm font-medium">{t.name}</p>
              <p className="text-gray-400 text-xs">{t.subject}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
