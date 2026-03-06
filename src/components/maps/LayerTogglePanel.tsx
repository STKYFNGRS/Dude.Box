"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crosshair,
  Flame,
  MegaphoneOff,
  Swords,
  Satellite,
  Globe2,
  Plane,
  Ship,
  Sun,
  Thermometer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface LayerConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  defaultEnabled: boolean;
  group: "markers" | "overlays";
}

const LAYERS: LayerConfig[] = [
  { id: "active-conflicts", label: "Conflicts", icon: Crosshair, defaultEnabled: true, group: "markers" },
  { id: "protests-unrest", label: "Protests / Unrest", icon: MegaphoneOff, defaultEnabled: true, group: "markers" },
  { id: "military", label: "Military", icon: Swords, defaultEnabled: true, group: "markers" },
  { id: "natural-disasters", label: "Disasters", icon: Flame, defaultEnabled: true, group: "markers" },
  { id: "viirs-night", label: "Night Lights", icon: Globe2, defaultEnabled: false, group: "overlays" },
  { id: "viirs-fires", label: "Satellite Fires", icon: Satellite, defaultEnabled: false, group: "overlays" },
  { id: "sea-surface-temp", label: "Sea Temperature", icon: Thermometer, defaultEnabled: false, group: "overlays" },
  { id: "day-night", label: "Day / Night", icon: Sun, defaultEnabled: false, group: "overlays" },
  { id: "flights", label: "Live Flights", icon: Plane, defaultEnabled: false, group: "overlays" },
  { id: "shipping-lanes", label: "Shipping Lanes", icon: Ship, defaultEnabled: false, group: "overlays" },
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

export default function LayerTogglePanel({
  onChange,
  className = "",
}: LayerTogglePanelProps) {
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
    } catch { /* noop */ }
    onChange?.(
      Object.entries(enabled)
        .filter(([, v]) => v)
        .map(([k]) => k)
    );
  }, [enabled, onChange]);

  const toggle = useCallback((id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const markerLayers = LAYERS.filter((l) => l.group === "markers");
  const overlayLayers = LAYERS.filter((l) => l.group === "overlays");

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">
          Data
        </p>
        <div className="space-y-0.5">
          {markerLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => toggle(layer.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  enabled[layer.id]
                    ? "text-gray-200 bg-white/5"
                    : "text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 text-left">{layer.label}</span>
                <div
                  className={`w-7 h-3.5 rounded-full relative transition-colors ${
                    enabled[layer.id] ? "bg-tactical-600" : "bg-gray-800"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                      enabled[layer.id] ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 pt-2">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">
          Overlays
        </p>
        <div className="space-y-0.5">
          {overlayLayers.map((layer) => {
            const Icon = layer.icon;
            return (
              <button
                key={layer.id}
                onClick={() => toggle(layer.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  enabled[layer.id]
                    ? "text-gray-200 bg-white/5"
                    : "text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 text-left">{layer.label}</span>
                <div
                  className={`w-7 h-3.5 rounded-full relative transition-colors ${
                    enabled[layer.id] ? "bg-tactical-600" : "bg-gray-800"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                      enabled[layer.id] ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { LAYERS };
