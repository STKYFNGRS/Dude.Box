"use client";

import { useState, useEffect, useCallback } from "react";

/* ---------- types ---------- */
interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  countryCode: string | null;
  status: string;
  severity: string;
  baselineRisk: number;
  conflictType: string;
  lastUpdated: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  lat: number;
  lng: number;
  severity: string;
  eventType: string;
  sourceUrl: string | null;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
  active: boolean;
  lastFetched: string | null;
  lastError: string | null;
}

interface CIIOverride {
  countryCode: string;
  baselineRisk: number;
}

type Tab = "zones" | "events" | "sources" | "cii";

const TABS: { key: Tab; label: string }[] = [
  { key: "zones", label: "Zones" },
  { key: "events", label: "Events" },
  { key: "sources", label: "Data Sources" },
  { key: "cii", label: "CII Overrides" },
];

const SEVERITY_OPTIONS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUS_OPTIONS = ["ACTIVE", "MONITORING", "RESOLVED"];
const CONFLICT_TYPES = ["WAR", "INSURGENCY", "CIVIL_UNREST", "TERRITORIAL", "CYBER"];
const EVENT_TYPES = ["CONFLICT", "PROTEST", "DISASTER", "MILITARY"];

const severityBadge: Record<string, string> = {
  CRITICAL: "badge-critical",
  HIGH: "badge-high",
  MEDIUM: "badge-medium",
  LOW: "badge-low",
};

/* ---------- zone form ---------- */
function ZoneForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Zone>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    lat: initial?.lat?.toString() ?? "",
    lng: initial?.lng?.toString() ?? "",
    region: initial?.region ?? "",
    countryCode: initial?.countryCode ?? "",
    status: initial?.status ?? "ACTIVE",
    severity: initial?.severity ?? "MEDIUM",
    baselineRisk: initial?.baselineRisk?.toString() ?? "50",
    conflictType: initial?.conflictType ?? "WAR",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="bg-panel-light border border-panel-border rounded-xl p-5 space-y-4 animate-fade-in">
      <h4 className="text-sm font-bold text-white">
        {initial?.id ? "Edit Zone" : "Add Zone"}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input className="input-field" placeholder="Zone name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <input className="input-field" placeholder="Latitude" type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} />
        <input className="input-field" placeholder="Longitude" type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} />
        <input className="input-field" placeholder="Region" value={form.region} onChange={(e) => set("region", e.target.value)} />
        <input className="input-field" placeholder="Country code" maxLength={2} value={form.countryCode} onChange={(e) => set("countryCode", e.target.value.toUpperCase())} />
        <select className="input-field" value={form.status} onChange={(e) => set("status", e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input-field" value={form.severity} onChange={(e) => set("severity", e.target.value)}>
          {SEVERITY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="input-field" placeholder="Baseline risk (0-100)" type="number" min={0} max={100} value={form.baselineRisk} onChange={(e) => set("baselineRisk", e.target.value)} />
        <select className="input-field" value={form.conflictType} onChange={(e) => set("conflictType", e.target.value)}>
          {CONFLICT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          className="btn-primary text-sm"
          onClick={() =>
            onSubmit({
              ...form,
              lat: parseFloat(form.lat),
              lng: parseFloat(form.lng),
              baselineRisk: parseInt(form.baselineRisk, 10),
            })
          }
        >
          {initial?.id ? "Update" : "Create"}
        </button>
        <button className="btn-secondary text-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------- event form ---------- */
function EventForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    lat: "",
    lng: "",
    severity: "MEDIUM",
    eventType: "CONFLICT",
    sourceUrl: "",
  });

  const set = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="bg-panel-light border border-panel-border rounded-xl p-5 space-y-4 animate-fade-in">
      <h4 className="text-sm font-bold text-white">Add Event</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input className="input-field sm:col-span-2 lg:col-span-3" placeholder="Event title" value={form.title} onChange={(e) => set("title", e.target.value)} />
        <textarea className="input-field sm:col-span-2 lg:col-span-3" placeholder="Description" rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} />
        <input className="input-field" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        <input className="input-field" placeholder="Latitude" type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} />
        <input className="input-field" placeholder="Longitude" type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} />
        <select className="input-field" value={form.severity} onChange={(e) => set("severity", e.target.value)}>
          {SEVERITY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input-field" value={form.eventType} onChange={(e) => set("eventType", e.target.value)}>
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input className="input-field" placeholder="Source URL (optional)" value={form.sourceUrl} onChange={(e) => set("sourceUrl", e.target.value)} />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <button
          className="btn-primary text-sm"
          onClick={() =>
            onSubmit({
              ...form,
              lat: parseFloat(form.lat),
              lng: parseFloat(form.lng),
              date: new Date(form.date).toISOString(),
            })
          }
        >
          Create
        </button>
        <button className="btn-secondary text-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ---------- main page ---------- */
export default function AdminConflictsPage() {
  const [tab, setTab] = useState<Tab>("zones");
  const [zones, setZones] = useState<Zone[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [ciiOverrides, setCiiOverrides] = useState<CIIOverride[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conflicts/zones");
      if (res.ok) setZones(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conflicts/events");
      if (res.ok) setEvents(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conflicts/sources");
      if (res.ok) setSources(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCII = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/conflicts/cii-overrides");
      if (res.ok) setCiiOverrides(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "zones") fetchZones();
    if (tab === "events") fetchEvents();
    if (tab === "sources") fetchSources();
    if (tab === "cii") fetchCII();
  }, [tab, fetchZones, fetchEvents, fetchSources, fetchCII]);

  async function handleCreateZone(data: any) {
    await fetch("/api/conflicts/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchZones();
  }

  async function handleUpdateZone(data: any) {
    if (!editingZone) return;
    await fetch(`/api/conflicts/zones/${editingZone.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditingZone(null);
    fetchZones();
  }

  async function handleDeleteZone(id: string) {
    if (!confirm("Delete this zone?")) return;
    await fetch(`/api/conflicts/zones/${id}`, { method: "DELETE" });
    fetchZones();
  }

  async function handleCreateEvent(data: any) {
    await fetch("/api/conflicts/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchEvents();
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/conflicts/events/${id}`, { method: "DELETE" });
    fetchEvents();
  }

  async function handleRefreshSource(type: string) {
    setRefreshing(type);
    try {
      await fetch(`/api/conflicts/refresh/${type}`, { method: "POST" });
      fetchSources();
    } finally {
      setRefreshing(null);
    }
  }

  async function handleCIIUpdate(countryCode: string, baselineRisk: number) {
    await fetch("/api/admin/conflicts/cii-overrides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode, baselineRisk }),
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Conflict Management</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage conflict zones, events, data sources, and CII parameters.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-panel-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setShowForm(false);
              setEditingZone(null);
            }}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-tactical-500 text-tactical-400"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
          Loading…
        </div>
      )}

      {/* ─── Zones Tab ─── */}
      {tab === "zones" && (
        <div className="space-y-4">
          {!showForm && !editingZone && (
            <button className="btn-primary text-sm" onClick={() => setShowForm(true)}>
              + Add Zone
            </button>
          )}

          {showForm && (
            <ZoneForm
              onSubmit={handleCreateZone}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editingZone && (
            <ZoneForm
              initial={editingZone}
              onSubmit={handleUpdateZone}
              onCancel={() => setEditingZone(null)}
            />
          )}

          <div className="overflow-x-auto rounded-xl border border-panel-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panel-light text-left">
                  <th className="px-4 py-3 text-gray-400 font-medium">Name</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Region</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Country</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Severity</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Type</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Risk</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-panel-light/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{z.name}</td>
                    <td className="px-4 py-3 text-gray-300">{z.region}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{z.countryCode || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-panel-light text-gray-300 border border-panel-border">
                        {z.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={severityBadge[z.severity] || "badge"}>
                        {z.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{z.conflictType}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono">{z.baselineRisk}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingZone(z); setShowForm(false); }}
                          className="text-xs text-tactical-400 hover:text-tactical-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteZone(z.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {zones.length === 0 && !loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No zones configured yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Events Tab ─── */}
      {tab === "events" && (
        <div className="space-y-4">
          {!showForm && (
            <button className="btn-primary text-sm" onClick={() => setShowForm(true)}>
              + Add Event
            </button>
          )}

          {showForm && (
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="overflow-x-auto rounded-xl border border-panel-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panel-light text-left">
                  <th className="px-4 py-3 text-gray-400 font-medium">Title</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Date</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Severity</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Type</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Coords</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-panel-light/40 transition-colors">
                    <td className="px-4 py-3 text-white font-medium max-w-xs truncate">
                      {ev.title}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={severityBadge[ev.severity] || "badge"}>
                        {ev.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{ev.eventType}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                      {ev.lat.toFixed(2)}, {ev.lng.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Data Sources Tab ─── */}
      {tab === "sources" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["ACLED", "USGS", "FIRMS", "GDELT"] as const).map((type) => {
            const src = sources.find((s) => s.type === type);
            return (
              <div key={type} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${src?.active ? "bg-green-500" : "bg-gray-500"}`} />
                    <h3 className="text-white font-bold">{type}</h3>
                  </div>
                  <button
                    onClick={() => handleRefreshSource(type)}
                    disabled={refreshing === type}
                    className="btn-secondary !py-1 !px-3 text-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {refreshing === type ? (
                      <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                      </svg>
                    )}
                    Refresh
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-gray-400">
                    <span className="text-gray-500">Last fetched:</span>{" "}
                    {src?.lastFetched
                      ? new Date(src.lastFetched).toLocaleString()
                      : "Never"}
                  </p>
                  {src?.lastError && (
                    <p className="text-red-400 truncate" title={src.lastError}>
                      Error: {src.lastError}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── CII Overrides Tab ─── */}
      {tab === "cii" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Adjust baseline risk values for each country. These feed into the
            Conflict Instability Index calculation.
          </p>
          <div className="overflow-x-auto rounded-xl border border-panel-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-panel-light text-left">
                  <th className="px-4 py-3 text-gray-400 font-medium">Country</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Baseline Risk</th>
                  <th className="px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panel-border">
                {ciiOverrides.map((entry) => (
                  <tr key={entry.countryCode} className="hover:bg-panel-light/40 transition-colors">
                    <td className="px-4 py-3 text-white font-mono font-bold">
                      {entry.countryCode}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        defaultValue={entry.baselineRisk}
                        className="input-field w-24 text-center"
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val !== entry.baselineRisk) {
                            handleCIIUpdate(entry.countryCode, val);
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      Saves on blur
                    </td>
                  </tr>
                ))}
                {ciiOverrides.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No CII data available. Add zones with country codes first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
