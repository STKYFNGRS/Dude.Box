"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  MessageSquare,
  Send,
  Users,
  Flame,
  Newspaper,
  AlertTriangle,
  Gamepad2,
  Wrench,
  MessageCircle,
  LogIn,
  ChevronRight,
  Lock,
  Plus,
  Search,
  ArrowLeft,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  memberCount: number;
  messageCount: number;
  joined: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface DMConversation {
  id: string;
  otherUser: { id: string; name: string | null; image: string | null };
  lastMessage: { preview: string; createdAt: string } | null;
  unreadCount: number;
}

interface DMMessage {
  id: string;
  senderId: string;
  ciphertext: string;
  iv: string;
  createdAt: string;
  sender: { id: string; name: string | null; image: string | null };
}

interface UserSearchResult {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hash: Hash,
  newspaper: Newspaper,
  "alert-triangle": AlertTriangle,
  "gamepad-2": Gamepad2,
  wrench: Wrench,
  flame: Flame,
  "message-circle": MessageCircle,
};

function getChannelIcon(icon: string | null) {
  return CHANNEL_ICONS[icon ?? "hash"] ?? Hash;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return (
    d.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

type SidebarTab = "channels" | "messages";
type MainView = "channel" | "dm" | "new-dm";

/* ─── Component ─────────────────────────────────────────────────────── */

export default function ConversationPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConversationPage />
    </Suspense>
  );
}

function ConversationPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  // Sidebar tab
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("channels");

  // Channel state
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("general");
  const [channelMessages, setChannelMessages] = useState<ChatMessage[]>([]);
  const [channelInfo, setChannelInfo] = useState<{ name: string; description: string | null } | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<{ id: string; name: string | null; image: string | null }[]>([]);

  // DM state
  const [dmConversations, setDmConversations] = useState<DMConversation[]>([]);
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [dmMessages, setDmMessages] = useState<DMMessage[]>([]);
  const [dmMeta, setDmMeta] = useState<{ id: string; otherUser: { id: string; name: string | null; image: string | null } } | null>(null);

  // New DM state
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Shared
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [mainView, setMainView] = useState<MainView>("channel");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle URL params (e.g. ?dm=conversationId)
  useEffect(() => {
    const dmParam = searchParams.get("dm");
    if (dmParam) {
      setSidebarTab("messages");
      setMainView("dm");
      setActiveDmId(dmParam);
    }
  }, [searchParams]);

  /* ─── Channel data fetching ──────────────────────────────────────── */

  useEffect(() => {
    fetch("/api/channels")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setChannels(data); })
      .catch(() => {});
  }, []);

  const fetchChannelMessages = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/channels/${slug}`);
      if (!res.ok) return;
      const data = await res.json();
      setChannelMessages(data.messages ?? []);
      setChannelInfo(data.channel ?? null);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (mainView !== "channel") return;
    fetchChannelMessages(activeSlug);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchChannelMessages(activeSlug), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeSlug, fetchChannelMessages, mainView]);

  /* ─── DM data fetching ───────────────────────────────────────────── */

  const fetchDmConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setDmConversations(data);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (sidebarTab === "messages" && session?.user) {
      fetchDmConversations();
    }
  }, [sidebarTab, session, fetchDmConversations]);

  const fetchDmMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/messages/${convId}`);
      if (!res.ok) return;
      const data = await res.json();
      setDmMessages(data.messages ?? []);
      setDmMeta(data.meta ?? null);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (mainView !== "dm" || !activeDmId) return;
    fetchDmMessages(activeDmId);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchDmMessages(activeDmId), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeDmId, fetchDmMessages, mainView]);

  useEffect(() => { scrollToBottom(); }, [channelMessages, dmMessages, scrollToBottom]);

  /* ─── Send handlers ──────────────────────────────────────────────── */

  const handleSendChannel = async () => {
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
        await fetchChannelMessages(activeSlug);
        inputRef.current?.focus();
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  const handleSendDM = async () => {
    if (!draft.trim() || sending || !activeDmId) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${activeDmId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ciphertext: draft.trim(), iv: "plaintext-placeholder" }),
      });
      if (res.ok) {
        const msg = await res.json();
        setDmMessages((prev) => [...prev, msg]);
        setDraft("");
        inputRef.current?.focus();
      }
    } catch { /* ignore */ }
    setSending(false);
  };

  const handleSend = mainView === "channel" ? handleSendChannel : handleSendDM;

  const handleJoinChannel = async () => {
    if (!session?.user) return;
    await fetch(`/api/channels/${activeSlug}?action=join`, { method: "POST" });
    setChannels((prev) => prev.map((ch) =>
      ch.slug === activeSlug ? { ...ch, joined: true, memberCount: ch.memberCount + 1 } : ch
    ));
  };

  /* ─── User search for new DM ────────────────────────────────────── */

  const handleUserSearch = async (query: string) => {
    setUserSearch(query);
    if (query.length < 2) { setUserResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/messages/conversations?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setUserResults(data.users ?? []);
      }
    } catch { /* ignore */ }
    setSearching(false);
  };

  const startDmWith = async (userId: string) => {
    try {
      const res = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveDmId(data.id);
        setMainView("dm");
        setUserSearch("");
        setUserResults([]);
        await fetchDmConversations();
      }
    } catch { /* ignore */ }
  };

  /* ─── Members panel ──────────────────────────────────────────────── */

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch(`/api/channels/${activeSlug}?action=members`);
      if (res.ok) setMembers(await res.json());
    } catch { /* ignore */ }
  }, [activeSlug]);

  useEffect(() => {
    if (showMembers && mainView === "channel") fetchMembers();
  }, [showMembers, fetchMembers, mainView]);

  /* ─── Derived ────────────────────────────────────────────────────── */

  const activeChannel = channels.find((ch) => ch.slug === activeSlug);
  const ActiveIcon = getChannelIcon(activeChannel?.icon ?? null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ─── Render ─────────────────────────────────────────────────────── */

  return (
    <div className="flex h-[calc(100vh-4rem)] max-h-screen">
      {/* Sidebar */}
      <aside className="w-64 min-w-[220px] border-r border-white/5 glass-panel hidden md:flex flex-col">
        {/* Tab toggle */}
        <div className="flex border-b border-white/5">
          <button
            onClick={() => { setSidebarTab("channels"); setMainView("channel"); }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors duration-200 ${
              sidebarTab === "channels"
                ? "text-tactical-400 border-b-2 border-tactical-500 bg-tactical-500/5"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => { setSidebarTab("messages"); setMainView(activeDmId ? "dm" : "new-dm"); }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors duration-200 relative ${
              sidebarTab === "messages"
                ? "text-tactical-400 border-b-2 border-tactical-500 bg-tactical-500/5"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            Messages
            {dmConversations.some((c) => c.unreadCount > 0) && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-tactical-500" />
            )}
          </button>
        </div>

        {/* Sidebar content */}
        <AnimatePresence mode="wait">
          {sidebarTab === "channels" ? (
            <motion.nav
              key="channels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto py-2"
            >
              {channels.map((ch) => {
                const Icon = getChannelIcon(ch.icon);
                const isActive = ch.slug === activeSlug && mainView === "channel";
                return (
                  <button
                    key={ch.slug}
                    onClick={() => { setActiveSlug(ch.slug); setMainView("channel"); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-200 ${
                      isActive
                        ? "bg-tactical-500/10 text-tactical-400 border-r-2 border-tactical-500"
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium truncate block">{ch.name}</span>
                    </div>
                    {ch.messageCount > 0 && (
                      <span className="text-[10px] text-gray-700 font-mono">{ch.messageCount}</span>
                    )}
                  </button>
                );
              })}
            </motion.nav>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto flex flex-col"
            >
              {/* New message button */}
              <button
                onClick={() => { setMainView("new-dm"); setActiveDmId(null); }}
                className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-tactical-400 hover:bg-tactical-500/5 transition-colors border-b border-white/5"
              >
                <Plus className="w-3.5 h-3.5" /> New Message
              </button>

              {!session?.user ? (
                <div className="flex-1 flex items-center justify-center">
                  <Link href="/login" className="text-xs text-tactical-400 flex items-center gap-1.5 hover:text-tactical-300 transition-colors">
                    <LogIn className="w-3.5 h-3.5" /> Sign in
                  </Link>
                </div>
              ) : dmConversations.length === 0 ? (
                <div className="flex-1 flex items-center justify-center px-4">
                  <p className="text-xs text-gray-600 text-center">No conversations yet. Start one!</p>
                </div>
              ) : (
                <div className="py-1">
                  {dmConversations.map((conv) => {
                    const isActive = conv.id === activeDmId && mainView === "dm";
                    return (
                      <button
                        key={conv.id}
                        onClick={() => { setActiveDmId(conv.id); setMainView("dm"); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors duration-200 ${
                          isActive
                            ? "bg-tactical-500/10 text-tactical-400 border-r-2 border-tactical-500"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-white/5 shrink-0">
                          {conv.otherUser.image ? (
                            <Image src={conv.otherUser.image} alt="" width={28} height={28} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-tactical-400 bg-tactical-600/20">
                              {conv.otherUser.name?.charAt(0).toUpperCase() ?? "?"}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate">{conv.otherUser.name ?? "Unknown"}</span>
                            {conv.lastMessage && (
                              <span className="text-[9px] text-gray-700 font-mono shrink-0 ml-1">{timeAgo(conv.lastMessage.createdAt)}</span>
                            )}
                          </div>
                          {conv.lastMessage && (
                            <p className="text-[10px] text-gray-600 truncate">{conv.lastMessage.preview}</p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-tactical-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ─── CHANNEL VIEW ─────────────────────────────────────────── */}
        {mainView === "channel" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 glass-panel">
              <div className="flex items-center gap-3 min-w-0">
                <ActiveIcon className="w-5 h-5 text-tactical-400 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {channelInfo?.name ?? activeSlug}
                  </h3>
                  {channelInfo?.description && (
                    <p className="text-[11px] text-gray-600 truncate">{channelInfo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={activeSlug}
                  onChange={(e) => setActiveSlug(e.target.value)}
                  className="md:hidden bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 px-2 py-1.5"
                >
                  {channels.map((ch) => (
                    <option key={ch.slug} value={ch.slug}>#{ch.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                    showMembers ? "text-tactical-400 bg-tactical-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{activeChannel?.memberCount ?? 0}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-1 min-h-0">
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                  {channelMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-700" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">No messages yet</h4>
                      <p className="text-xs text-gray-600 max-w-xs">
                        Be the first to start the conversation in #{channelInfo?.name ?? activeSlug}.
                      </p>
                    </div>
                  ) : (
                    channelMessages.map((msg, i) => {
                      const prevMsg = channelMessages[i - 1];
                      const isSameUser = prevMsg?.user.id === msg.user.id;
                      const timeDiff = prevMsg
                        ? new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime()
                        : Infinity;
                      const grouped = isSameUser && timeDiff < 300000;

                      return (
                        <div key={msg.id} className={`flex items-start gap-3 ${grouped ? "mt-0.5" : "mt-4"} group`}>
                          {!grouped ? (
                            <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden bg-white/5 mt-0.5">
                              {msg.user.image ? (
                                <Image src={msg.user.image} alt={msg.user.name ?? ""} width={32} height={32} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-tactical-400 bg-tactical-600/20">
                                  {msg.user.name?.charAt(0).toUpperCase() ?? "?"}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-8 shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            {!grouped && (
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <span className="text-sm font-semibold text-gray-200">{msg.user.name ?? "Anonymous"}</span>
                                <span className="text-[10px] text-gray-700 font-mono">{timeAgo(msg.createdAt)}</span>
                              </div>
                            )}
                            <p className="text-sm text-gray-400 leading-relaxed break-words">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="px-5 pb-4 pt-2">
                  {!session?.user ? (
                    <div className="glass-card p-4 text-center">
                      <p className="text-sm text-gray-500 mb-3">Sign in to join the conversation</p>
                      <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tactical-600 hover:bg-tactical-500 text-white text-sm font-medium transition-colors">
                        <LogIn className="w-4 h-4" /> Sign In
                      </Link>
                    </div>
                  ) : !activeChannel?.joined ? (
                    <div className="glass-card p-4 text-center">
                      <p className="text-sm text-gray-500 mb-3">Join this channel to start chatting</p>
                      <button onClick={handleJoinChannel} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tactical-600 hover:bg-tactical-500 text-white text-sm font-medium transition-colors">
                        <ChevronRight className="w-4 h-4" /> Join #{activeChannel?.name}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={`Message #${channelInfo?.name ?? activeSlug}...`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-tactical-600/50 focus:border-tactical-600/50 transition-colors"
                        disabled={sending}
                        autoComplete="off"
                      />
                      <button type="submit" disabled={!draft.trim() || sending} className="flex items-center justify-center w-11 h-11 rounded-xl bg-tactical-600 hover:bg-tactical-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Members panel */}
              <AnimatePresence>
                {showMembers && (
                  <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-l border-white/5 overflow-hidden hidden sm:block"
                  >
                    <div className="w-[220px] h-full overflow-y-auto">
                      <div className="px-4 py-3 border-b border-white/5">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Members — {members.length}</h4>
                      </div>
                      <div className="py-2">
                        {members.map((member) => (
                          <div key={member.id} className="flex items-center gap-2.5 px-4 py-1.5">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-white/5 shrink-0">
                              {member.image ? (
                                <Image src={member.image} alt={member.name ?? ""} width={24} height={24} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-tactical-400 bg-tactical-600/20">
                                  {member.name?.charAt(0).toUpperCase() ?? "?"}
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 truncate">{member.name ?? "Anonymous"}</span>
                          </div>
                        ))}
                        {members.length === 0 && <p className="px-4 py-2 text-xs text-gray-700">No members yet</p>}
                      </div>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* ─── DM VIEW ──────────────────────────────────────────────── */}
        {mainView === "dm" && activeDmId && (
          <>
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 glass-panel">
              <button
                onClick={() => { setMainView("new-dm"); setActiveDmId(null); }}
                className="md:hidden text-gray-500 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 shrink-0">
                {dmMeta?.otherUser.image ? (
                  <Image src={dmMeta.otherUser.image} alt="" width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-tactical-400 bg-tactical-600/20">
                    {dmMeta?.otherUser.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white text-sm truncate">{dmMeta?.otherUser.name ?? "Loading..."}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-tactical-500 font-mono">
                <Lock className="w-3 h-3" /> E2E
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {dmMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-gray-700" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Start the conversation</h4>
                    <p className="text-xs text-gray-600 max-w-xs">Messages are end-to-end encrypted.</p>
                  </div>
                ) : (
                  dmMessages.map((msg) => {
                    const isMine = msg.senderId === session?.user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          isMine ? "bg-tactical-600 text-white rounded-br-md" : "bg-[var(--panel-light)] text-gray-200 rounded-bl-md"
                        }`}>
                          <p className="text-sm leading-relaxed break-words">{msg.ciphertext}</p>
                          <p className={`text-[10px] mt-1 ${isMine ? "text-tactical-200/60" : "text-gray-500"}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-5 pb-4 pt-2">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Message ${dmMeta?.otherUser.name ?? ""}...`}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-tactical-600/50 focus:border-tactical-600/50 transition-colors"
                    disabled={sending}
                    autoComplete="off"
                  />
                  <button type="submit" disabled={!draft.trim() || sending} className="flex items-center justify-center w-11 h-11 rounded-xl bg-tactical-600 hover:bg-tactical-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* ─── NEW DM VIEW ──────────────────────────────────────────── */}
        {mainView === "new-dm" && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 glass-panel">
              <MessageSquare className="w-5 h-5 text-tactical-400" />
              <h3 className="font-semibold text-white text-sm">New Message</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {!session?.user ? (
                <div className="text-center">
                  <Lock className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-4">Sign in to send direct messages</p>
                  <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tactical-600 hover:bg-tactical-500 text-white text-sm font-medium transition-colors">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                </div>
              ) : (
                <div className="w-full max-w-md space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-gray-700" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-300">End-to-End Encrypted</h4>
                    <p className="text-xs text-gray-600 mt-1">Search for a user to start a private conversation.</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-tactical-600/50 transition-colors"
                      autoFocus
                    />
                  </div>

                  {searching && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 justify-center py-2">
                      <div className="w-3 h-3 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  )}

                  {!searching && userResults.length > 0 && (
                    <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/5">
                      {userResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => startDmWith(user.id)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.03] transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/5 shrink-0">
                            {user.image ? (
                              <Image src={user.image} alt="" width={32} height={32} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-tactical-400 bg-tactical-600/20">
                                {user.name?.charAt(0).toUpperCase() ?? "?"}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-medium truncate">{user.name ?? "Unknown"}</p>
                            <p className="text-[10px] text-gray-600 truncate">{user.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!searching && userSearch.length >= 2 && userResults.length === 0 && (
                    <p className="text-xs text-gray-600 text-center py-2">No users found.</p>
                  )}

                  {dmConversations.length > 0 && !userSearch && (
                    <div className="mt-6">
                      <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Recent Conversations</h4>
                      <div className="space-y-1">
                        {dmConversations.slice(0, 5).map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => { setActiveDmId(conv.id); setMainView("dm"); }}
                            className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors text-left"
                          >
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-white/5 shrink-0">
                              {conv.otherUser.image ? (
                                <Image src={conv.otherUser.image} alt="" width={28} height={28} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-tactical-400 bg-tactical-600/20">
                                  {conv.otherUser.name?.charAt(0).toUpperCase() ?? "?"}
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-400 truncate">{conv.otherUser.name ?? "Unknown"}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
