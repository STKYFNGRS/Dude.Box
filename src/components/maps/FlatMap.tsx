"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { MapMarker } from "./types";

interface FlatMapProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
}

const SEVERITY_COLORS: Record<MapMarker["severity"], string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function FlatMap({ markers = [], onMarkerClick }: FlatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;
    let disposed = false;

    Promise.all([import("leaflet"), import("supercluster")]).then(
      ([L, SuperclusterMod]) => {
        if (disposed || !containerRef.current) return;

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);

        const map = L.default.map(containerRef.current, {
          center: [20, 0],
          zoom: 3,
          minZoom: 2,
          maxBounds: [[-85, -180], [85, 180]],
          maxBoundsViscosity: 1.0,
          zoomControl: false,
          attributionControl: false,
        });

        L.default.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(map);
        L.default.control.zoom({ position: "topright" }).addTo(map);
        L.default.control.attribution({ position: "bottomright" }).addTo(map);

        mapInstanceRef.current = map;
        markerLayerRef.current = L.default.layerGroup().addTo(map);
        setLoaded(true);
      }
    );

    return () => {
      disposed = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !mapInstanceRef.current) return;
    const ro = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [loaded]);

  const clusterIndex = useMemo(() => {
    if (!loaded) return null;
    const Supercluster =
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("supercluster") as typeof import("supercluster");
    const SC = (Supercluster as any).default ?? Supercluster;
    const index = new SC({ radius: 60, maxZoom: 16 });
    index.load(
      markers.map((m) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [m.lng, m.lat] },
        properties: m,
      }))
    );
    return index;
  }, [markers, loaded]);

  const updateMarkers = useCallback(async () => {
    const map = mapInstanceRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer || !clusterIndex) return;
    const L = (await import("leaflet")).default;

    layer.clearLayers();

    const bounds = map.getBounds();
    const zoom = map.getZoom();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const clusters = clusterIndex.getClusters(bbox, zoom);

    clusters.forEach((feature: any) => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;

      if (props.cluster) {
        const count = props.point_count;
        const size = count < 10 ? 28 : count < 50 ? 36 : 44;
        const icon = L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(34,197,94,0.3);border:2px solid #22c55e;color:#e5e7eb;font-size:12px;font-weight:700;">${count}</div>`,
          className: "",
          iconSize: [size, size],
        });
        L.marker([lat, lng], { icon }).addTo(layer).on("click", () => {
          map.flyTo([lat, lng], zoom + 2, { duration: 0.5 });
        });
      } else {
        const m = props as MapMarker;
        const color = SEVERITY_COLORS[m.severity];
        const sz = m.severity === "CRITICAL" ? 14 : 10;
        const icon = L.divIcon({
          html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};"></div>`,
          className: "",
          iconSize: [sz, sz],
          iconAnchor: [sz / 2, sz / 2],
        });
        const marker = L.marker([lat, lng], { icon }).addTo(layer);
        marker.bindPopup(
          `<div style="background:#111827;color:#e5e7eb;padding:8px 12px;border-radius:8px;min-width:160px;">
            <div style="font-weight:600;margin-bottom:4px;">${m.label}</div>
            <div style="font-size:12px;color:#9ca3af;">Type: ${m.type}</div>
            <div style="font-size:12px;margin-top:2px;">
              <span style="color:${color};font-weight:600;">${m.severity}</span>
            </div>
          </div>`,
          {
            className: "dark-popup",
            closeButton: false,
          }
        );
        marker.on("click", () => onMarkerClick?.(m));
      }
    });
  }, [clusterIndex, onMarkerClick]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;

    updateMarkers();
    map.on("moveend", updateMarkers);
    return () => {
      map.off("moveend", updateMarkers);
    };
  }, [loaded, updateMarkers]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0f1a] z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-tactical-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500 font-mono">Loading Map…</span>
          </div>
        </div>
      )}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: #111827 !important;
        }
      `}</style>
    </div>
  );
}
