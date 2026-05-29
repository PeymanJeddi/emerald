"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Array<{ id: string; title: string; body: string; is_read: boolean }>>([]);

  useEffect(() => {
    apiFetch<Array<{ id: string; title: string; body: string; is_read: boolean }>>("/api/me/messages").then(setMessages);
  }, []);

  async function markRead(id: string) {
    await apiFetch(`/api/me/messages/${id}/read`, { method: "PATCH" });
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, is_read: true } : x)));
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-emerald">Messages</h1>
      <div className="mt-8 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`archival-card rounded-sm p-4 ${!m.is_read ? "border-emerald" : ""}`}>
            <p className="font-medium">{m.title}</p>
            <p className="mt-1 text-sm text-graphite/70">{m.body}</p>
            {!m.is_read && (
              <button onClick={() => markRead(m.id)} className="mt-2 text-xs text-emerald underline">
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
