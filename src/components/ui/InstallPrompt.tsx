"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "dudebox-install-dismissed";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    setVisible(false);
    setDeferredPrompt(null);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-slide-up">
      <div className="mx-auto max-w-lg rounded-xl border border-panel-border bg-panel/95 backdrop-blur-md p-4 shadow-glow-lg flex items-center justify-between gap-4">
        <p className="text-sm text-gray-200">
          Install{" "}
          <span className="font-bold text-tactical-500">Dude.Box</span> for
          the best experience
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-panel-light transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={handleInstall}
            className="rounded-lg bg-tactical-600 hover:bg-tactical-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
