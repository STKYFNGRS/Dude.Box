"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastMessage: {
    preview: string;
    createdAt: string;
  } | null;
  unreadCount: number;
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

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages/conversations")
      .then((r) => (r.ok ? r.json() : []))
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">
              End-to-end encrypted conversations
            </p>
          </div>
          <Link href="/messages/new" className="btn-primary text-sm flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New
          </Link>
        </div>

        {/* Encrypted banner */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-tactical-900/30 border border-tactical-500/20">
          <svg className="w-4 h-4 text-tactical-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span className="text-xs text-tactical-400">
            Messages are end-to-end encrypted
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Conversation list */}
        {!loading && conversations.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-panel-light flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-2">No conversations yet</p>
            <Link href="/messages/new" className="text-sm text-tactical-400 hover:text-tactical-300">
              Start a new conversation
            </Link>
          </div>
        )}

        {!loading && conversations.length > 0 && (
          <div className="divide-y divide-panel-border rounded-xl border border-panel-border overflow-hidden">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-3 p-4 hover:bg-panel-light/60 transition-colors group"
              >
                {/* Avatar */}
                {conv.otherUser.image ? (
                  <img
                    src={conv.otherUser.image}
                    alt=""
                    className="w-10 h-10 rounded-full ring-2 ring-panel-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-tactical-600 flex items-center justify-center text-sm font-bold text-white">
                    {conv.otherUser.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white group-hover:text-tactical-400 transition-colors">
                      {conv.otherUser.name ?? "Unknown"}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500 shrink-0">
                        {timeAgo(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {conv.lastMessage?.preview ?? "No messages yet"}
                  </p>
                </div>

                {/* Unread badge */}
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 w-5 h-5 rounded-full bg-tactical-500 text-white text-xs font-bold flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
