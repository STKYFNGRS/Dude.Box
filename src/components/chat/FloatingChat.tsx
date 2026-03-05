"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Hash,
  LogIn,
  Maximize2,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  memberCount: number;
  joined: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function FloatingChat() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeSlug, setActiveSlug] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/channels")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setChannels(data); })
      .catch(() => {});
  }, [open]);

  const fetchMessages = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/channels/${slug}?limit=30`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!open) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    fetchMessages(activeSlug);
    pollRef.current = setInterval(() => fetchMessages(activeSlug), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open, activeSlug, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || sending || !session?.user) return;
    setSending(true);
    try {
      const res = await fetch(`/api/channels/${activeSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft.trim() }),
      });
      if (res.ok) {
        setDraft("");
        await fetchMessages(activeSlug);
        inputRef.current?.focus();
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  const activeChannel = channels.find((ch) => ch.slug === activeSlug);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors duration-200 ${
          open
            ? "bg-gray-800 text-gray-400 hover:text-white"
            : "bg-tactical-600 text-white hover:bg-tactical-500"
        }`}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[60] w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl"
            style={{ background: "var(--panel, #0d1321)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2 min-w-0">
                <Hash className="w-4 h-4 text-tactical-400 shrink-0" />
                <span className="text-sm font-semibold text-white truncate">
                  {activeChannel?.name ?? activeSlug}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/conversation"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                  title="Open full conversation"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Channel tabs */}
            <div className="flex gap-1 px-3 py-2 border-b border-white/5 overflow-x-auto">
              {channels.slice(0, 5).map((ch) => (
                <button
                  key={ch.slug}
                  onClick={() => setActiveSlug(ch.slug)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors duration-200 ${
                    ch.slug === activeSlug
                      ? "bg-tactical-500/10 text-tactical-400"
                      : "text-gray-600 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {ch.name}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-8 h-8 text-gray-800 mb-2" />
                  <p className="text-xs text-gray-600">No messages yet</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const prevMsg = messages[i - 1];
                  const grouped = prevMsg?.user.id === msg.user.id &&
                    new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 300000;

                  return (
                    <div key={msg.id} className={`flex items-start gap-2 ${grouped ? "mt-0" : "mt-3"}`}>
                      {!grouped ? (
                        <div className="shrink-0 w-6 h-6 rounded-full overflow-hidden bg-white/5 mt-0.5">
                          {msg.user.image ? (
                            <Image src={msg.user.image} alt="" width={24} height={24} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-tactical-400 bg-tactical-600/20">
                              {msg.user.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-6 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        {!grouped && (
                          <div className="flex items-baseline gap-1.5 mb-0.5">
                            <span className="text-xs font-semibold text-gray-300">
                              {msg.user.name ?? "Anonymous"}
                            </span>
                            <span className="text-[9px] text-gray-700 font-mono">
                              {timeAgo(msg.createdAt)}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 leading-relaxed break-words">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-1 border-t border-white/5">
              {!session?.user ? (
                <div className="text-center py-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-tactical-400 hover:text-tactical-300 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign in to chat
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Message #${activeChannel?.name ?? activeSlug}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-tactical-600/50 transition-colors"
                    disabled={sending}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-tactical-600 hover:bg-tactical-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
