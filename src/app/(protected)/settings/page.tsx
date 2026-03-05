"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, type FormEvent } from "react";

interface PasskeyInfo {
  credentialID: string;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports: string | null;
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [passkeysLoading, setPasskeysLoading] = useState(true);
  const [passkeyAction, setPasskeyAction] = useState(false);
  const [passkeyMessage, setPasskeyMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchPasskeys = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/passkey");
      if (res.ok) {
        setPasskeys(await res.json());
      }
    } catch {
      /* ignore */
    } finally {
      setPasskeysLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setEmail(session.user.email ?? "");
      setImage(session.user.image ?? "");
    }
  }, [session]);

  useEffect(() => {
    fetchPasskeys();
  }, [fetchPasskeys]);

  async function handleRegisterPasskey() {
    setPasskeyAction(true);
    setPasskeyMessage(null);
    try {
      const optRes = await fetch("/api/auth/passkey/register-options", {
        method: "POST",
      });
      const { options, challengeKey } = await optRes.json();

      const { startRegistration } = await import("@simplewebauthn/browser");
      const regResponse = await startRegistration({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/passkey/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: regResponse, challengeKey }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setPasskeyMessage({
          type: "error",
          text: verifyData.error || "Registration failed",
        });
        return;
      }

      setPasskeyMessage({
        type: "success",
        text: "Passkey registered successfully!",
      });
      fetchPasskeys();
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setPasskeyMessage({ type: "error", text: "Passkey ceremony was cancelled" });
      } else {
        setPasskeyMessage({
          type: "error",
          text: err.message || "Failed to register passkey",
        });
      }
    } finally {
      setPasskeyAction(false);
    }
  }

  async function handleDeletePasskey(credentialID: string) {
    if (!confirm("Remove this passkey? You won't be able to sign in with it anymore.")) return;
    setPasskeyAction(true);
    setPasskeyMessage(null);
    try {
      const res = await fetch(
        `/api/auth/passkey/${encodeURIComponent(credentialID)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json();
        setPasskeyMessage({ type: "error", text: data.error || "Failed to remove passkey" });
        return;
      }
      setPasskeyMessage({ type: "success", text: "Passkey removed." });
      fetchPasskeys();
    } catch {
      setPasskeyMessage({ type: "error", text: "Failed to remove passkey" });
    } finally {
      setPasskeyAction(false);
    }
  }

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update profile");
      }

      await updateSession();
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-extrabold text-white">Settings</h1>

        {/* Profile */}
        <section className="mb-8 rounded-xl bg-panel border border-panel-border p-6">
          <h2 className="mb-5 text-lg font-bold text-white">Profile</h2>

          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-2.5 text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-900/30 text-green-400 border border-green-800"
                  : "bg-red-900/30 text-red-400 border border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-panel-border bg-panel-light px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg border border-panel-border bg-[#0a0f1a] px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-600">
                Email cannot be changed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full rounded-lg border border-panel-border bg-panel-light px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-tactical-500 focus:ring-1 focus:ring-tactical-500 outline-none transition-colors"
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-tactical-600 hover:bg-tactical-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Notifications */}
        <section className="mb-8 rounded-xl bg-panel border border-panel-border p-6">
          <h2 className="mb-5 text-lg font-bold text-white">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-200">
                  Push Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Receive alerts for breaking news and updates.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pushEnabled}
                onClick={() => setPushEnabled(!pushEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  pushEnabled ? "bg-tactical-600" : "bg-panel-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform ${
                    pushEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-200">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Weekly digest and important alerts via email.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailNotifs}
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  emailNotifs ? "bg-tactical-600" : "bg-panel-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform ${
                    emailNotifs ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>
        </section>

        {/* Passkey Management */}
        <section className="rounded-xl bg-panel border border-panel-border p-6">
          <h2 className="mb-5 text-lg font-bold text-white">Passkeys</h2>
          <p className="mb-4 text-sm text-gray-400">
            Passkeys let you sign in securely without a password using
            biometrics or your device&apos;s lock screen.
          </p>

          {passkeyMessage && (
            <div
              className={`mb-4 rounded-lg px-4 py-2.5 text-sm font-medium ${
                passkeyMessage.type === "success"
                  ? "bg-green-900/30 text-green-400 border border-green-800"
                  : "bg-red-900/30 text-red-400 border border-red-800"
              }`}
            >
              {passkeyMessage.text}
            </div>
          )}

          {passkeysLoading ? (
            <div className="mb-4 rounded-lg border border-dashed border-panel-border bg-[#0a0f1a] p-6 text-center">
              <p className="text-sm text-gray-500">Loading passkeys...</p>
            </div>
          ) : passkeys.length === 0 ? (
            <div className="mb-4 rounded-lg border border-dashed border-panel-border bg-[#0a0f1a] p-6 text-center">
              <p className="text-sm text-gray-500">
                No passkeys registered yet.
              </p>
            </div>
          ) : (
            <div className="mb-4 space-y-2">
              {passkeys.map((pk) => (
                <div
                  key={pk.credentialID}
                  className="flex items-center justify-between rounded-lg border border-panel-border bg-[#0a0f1a] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-5 w-5 text-tactical-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {pk.credentialDeviceType === "singleDevice"
                          ? "Device-bound Passkey"
                          : "Synced Passkey"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pk.credentialBackedUp ? "Backed up" : "Not backed up"}
                        {pk.transports && ` \u00b7 ${pk.transports}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePasskey(pk.credentialID)}
                    disabled={passkeyAction}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleRegisterPasskey}
            disabled={passkeyAction}
            className="inline-flex items-center justify-center rounded-lg border border-tactical-600 bg-transparent hover:bg-tactical-600/10 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-tactical-500 transition-colors"
          >
            {passkeyAction ? "Processing..." : "Register New Passkey"}
          </button>
        </section>
      </div>
    </div>
  );
}
