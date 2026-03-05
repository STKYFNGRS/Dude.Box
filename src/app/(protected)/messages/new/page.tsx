"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserResult {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function NewConversationPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [selected, setSelected] = useState<UserResult | null>(null);
  const [message, setMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(query: string) {
    setSearch(query);
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `/api/messages/conversations?search=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.users ?? []);
      }
    } finally {
      setSearching(false);
    }
  }

  async function handleSend() {
    if (!selected || !message.trim()) return;
    setSending(true);
    setError(null);

    try {
      const convRes = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected.id }),
      });

      if (!convRes.ok) {
        const err = await convRes.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to create conversation");
      }

      const conv = await convRes.json();

      await fetch(`/api/messages/${conv.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ciphertext: message.trim(),
          iv: "plaintext-placeholder",
        }),
      });

      router.push(`/messages/${conv.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">New Conversation</h1>
        </div>

        {/* User search */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Search by name or email
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Type to search users…"
              className="input-field w-full"
              autoFocus
            />
          </div>

          {/* Search results */}
          {searching && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
              Searching…
            </div>
          )}

          {!searching && results.length > 0 && !selected && (
            <div className="rounded-xl border border-panel-border overflow-hidden divide-y divide-panel-border">
              {results.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelected(user);
                    setResults([]);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-panel-light/60 transition-colors text-left"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="w-9 h-9 rounded-full ring-2 ring-panel-border"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-tactical-600 flex items-center justify-center text-sm font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white font-medium">
                      {user.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searching && search.length >= 2 && results.length === 0 && !selected && (
            <p className="text-sm text-gray-500">No users found.</p>
          )}

          {/* Selected user */}
          {selected && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-panel-light border border-panel-border">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt=""
                    className="w-9 h-9 rounded-full ring-2 ring-tactical-500"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-tactical-600 flex items-center justify-center text-sm font-bold text-white">
                    {selected.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    {selected.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">{selected.email}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                >
                  &times;
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  First message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message…"
                  rows={4}
                  className="input-field w-full resize-none"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                )}
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
