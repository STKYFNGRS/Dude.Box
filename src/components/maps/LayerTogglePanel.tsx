"use client";

import { useState, useEffect, useCallback } from "react";

export interface LayerConfig {
  id: string;
  label: string;
  icon: string;
  defaultEnabled: boolean;
}

const LAYERS: LayerConfig[] = [
  { id: "active-conflicts",   label: "Active Conflicts",    icon: "💥", defaultEnabled: true },
  { id: "military-bases",     label: "Military Bases",       icon: "🎖️", defaultEnabled: true },
  { id: "nuclear-facilities", label: "Nuclear Facilities",   icon: "☢️",  defaultEnabled: false },
  { id: "undersea-cables",    label: "Undersea Cables",      icon: "🌊", defaultEnabled: false },
  { id: "infrastructure",     label: "Infrastructure",       icon: "🏗️", defaultEnabled: false },
  { id: "satellite-fires",    label: "Satellite Fires",      icon: "🔥", defaultEnabled: false },
  { id: "protests-unrest",    label: "Protests / Unrest",    icon: "✊", defaultEnabled: true },
  { id: "natural-disasters",  label: "Natural Disasters",    icon: "🌪️", defaultEnabled: false },
  { id: "day-night",          label: "Day / Night",          icon: "🌗", defaultEnabled: false },
  { id: "cii-heatmap",        label: "CII Heatmap",          icon: "📊", defaultEnabled: false },
];

const STORAGE_KEY = "dudebox-map-layers";

function loadSaved(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface LayerTogglePanelProps {
  onChange?: (enabledLayerIds: string[]) => void;
  className?: string;
}

export default function LayerTogglePanel({ onChange, className = "" }: LayerTogglePanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const saved = loadSaved();
    const initial: Record<string, boolean> = {};
    LAYERS.forEach((l) => {
      initial[l.id] = saved[l.id] ?? l.defaultEnabled;
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    } catch {}
    onChange?.(Object.entries(enabled).filter(([, v]) => v).map(([k]) => k));
  }, [enabled, onChange]);

  const toggle = useCallback((id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <div
      className={`bg-panel/95 backdrop-blur border border-panel-border rounded-xl overflow-hidden transition-all duration-300 ${collapsed ? "w-12" : "w-64"} ${className}`}
    >
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center gap-2 px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-200 transition-colors border-b border-panel-border"
      >
        <svg
          className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        {!collapsed && <span>Layers</span>}
      </button>

      {!collapsed && (
        <div className="p-2 space-y-0.5 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => toggle(layer.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                enabled[layer.id]
                  ? "bg-tactical-900/40 text-gray-200"
                  : "text-gray-500 hover:text-gray-400 hover:bg-panel-light/50"
              }`}
            >
              <span className="text-base w-5 text-center">{layer.icon}</span>
              <span className="flex-1 text-left">{layer.label}</span>
              <div
                className={`w-8 h-4 rounded-full relative transition-colors ${
                  enabled[layer.id] ? "bg-tactical-600" : "bg-panel-light"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                    enabled[layer.id] ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
