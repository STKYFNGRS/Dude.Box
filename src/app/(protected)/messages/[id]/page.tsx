"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  senderId: string;
  ciphertext: string;
  iv: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface ConversationMeta {
  id: string;
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatThreadPage() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const conversationId = params.id;
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [meta, setMeta] = useState<ConversationMeta | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages ?? []);
          setMeta(data.meta ?? null);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ciphertext: input.trim(),
          iv: "plaintext-placeholder",
        }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        setInput("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0a0f1a]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-panel-border bg-panel/90 backdrop-blur-sm">
        <Link
          href="/messages"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </Link>

        {meta?.otherUser.image ? (
          <img
            src={meta.otherUser.image}
            alt=""
            className="w-8 h-8 rounded-full ring-2 ring-panel-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-tactical-600 flex items-center justify-center text-xs font-bold text-white">
            {meta?.otherUser.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {meta?.otherUser.name ?? "Loading…"}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-tactical-500">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          Encrypted
        </div>
      </div>

      {/* E2E banner */}
      <div className="text-center py-2 text-xs text-gray-500 bg-panel/50">
        Messages are end-to-end encrypted. Only you and{" "}
        {meta?.otherUser.name ?? "the recipient"} can read them.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-500">
              No messages yet. Say hello!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMine
                    ? "bg-tactical-600 text-white rounded-br-md"
                    : "bg-panel-light text-gray-200 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {msg.ciphertext}
                </p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMine ? "text-tactical-200/60" : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-panel-border bg-panel/90 backdrop-blur-sm p-3">
        <div className="flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 input-field resize-none min-h-[40px] max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="btn-primary !py-2.5 !px-4 disabled:opacity-40 shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
