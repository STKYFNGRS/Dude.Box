"use client";

import { useEffect, useState } from "react";

export default function TestSyncPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const syncNow = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sync-subscription", {
        method: "POST",
      });
      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Sync Subscription from Stripe</h1>
        
        <button
          onClick={syncNow}
          disabled={loading}
          className="px-4 py-2 bg-accent text-white rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Syncing..." : "Sync Now"}
        </button>

        {result && (
          <div className="bg-muted p-4 rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
