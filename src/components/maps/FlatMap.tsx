"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import type { MapMarker } from "./types";

interface FlatMapProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onClusterNavigate?: (countryCode: string) => void;
  enabledLayers?: string[];
}

const SEVERITY_COLORS: Record<MapMarker["severity"], string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};

const TILE_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>';

function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d.toISOString().split("T")[0];
}

const NASA_LAYERS: Record<string, { url: string; attr: string; opacity: number }> = {
  "viirs-night": {
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_Black_Marble/default/2024-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`,
    attr: "NASA GIBS",
    opacity: 0.6,
  },
  "modis-truecolor": {
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${todayStr()}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    attr: "NASA GIBS MODIS",
    opacity: 0.5,
  },
  "viirs-fires": {
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_Thermal_Anomalies_375m_All/default/${todayStr()}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`,
    attr: "NASA GIBS VIIRS",
    opacity: 0.8,
  },
  "sea-surface-temp": {
    url: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/${yesterdayStr()}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png`,
    attr: "NASA GIBS SST",
    opacity: 0.6,
  },
};

export default function FlatMap({
  markers = [],
  onMarkerClick,
  onClusterNavigate,
  enabledLayers = [],
}: FlatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const overlayLayersRef = useRef<Record<string, any>>({});
  const flightLayerRef = useRef<any>(null);
  const terminatorRef = useRef<any>(null);
  const shippingLayerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;
    let disposed = false;

    Promise.all([import("leaflet"), import("supercluster")]).then(
      ([L]) => {
        if (disposed || !containerRef.current) return;

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);

        const map = L.default.map(containerRef.current, {
          center: [20, 0],
          zoom: 3,
          minZoom: 2,
          maxBounds: [
            [-85, -180],
            [85, 180],
          ],
          maxBoundsViscosity: 1.0,
          zoomControl: false,
          attributionControl: false,
        });

        L.default.tileLayer(TILE_URL, { attribution: TILE_ATTR }).addTo(map);
        L.default.control.zoom({ position: "topright" }).addTo(map);
        L.default
          .control.attribution({ position: "bottomright" })
          .addTo(map);

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

  // Manage NASA overlay layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;

    import("leaflet").then(({ default: L }) => {
      for (const [key, config] of Object.entries(NASA_LAYERS)) {
        const isEnabled = enabledLayers.includes(key);
        const existing = overlayLayersRef.current[key];

        if (isEnabled && !existing) {
          const layer = L.tileLayer(config.url, {
            attribution: config.attr,
            opacity: config.opacity,
            maxZoom: 8,
          });
          layer.addTo(map);
          overlayLayersRef.current[key] = layer;
        } else if (!isEnabled && existing) {
          map.removeLayer(existing);
          delete overlayLayersRef.current[key];
        }
      }
    });
  }, [enabledLayers, loaded]);

  // Day/night terminator
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;
    const isEnabled = enabledLayers.includes("day-night");

    if (isEnabled && !terminatorRef.current) {
      import("leaflet").then(({ default: L }) => {
        const terminator = createTerminator(L);
        if (terminator) {
          terminator.addTo(map);
          terminatorRef.current = terminator;
        }
      });
    } else if (!isEnabled && terminatorRef.current) {
      map.removeLayer(terminatorRef.current);
      terminatorRef.current = null;
    }
  }, [enabledLayers, loaded]);

  // Flight layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;
    const isEnabled = enabledLayers.includes("flights");

    if (isEnabled && !flightLayerRef.current) {
      import("leaflet").then(({ default: L }) => {
        const layer = L.layerGroup().addTo(map);
        flightLayerRef.current = layer;
        fetchFlights(L, layer);
        const interval = setInterval(() => fetchFlights(L, layer), 30000);
        (layer as any)._flightInterval = interval;
      });
    } else if (!isEnabled && flightLayerRef.current) {
      clearInterval((flightLayerRef.current as any)._flightInterval);
      map.removeLayer(flightLayerRef.current);
      flightLayerRef.current = null;
    }
  }, [enabledLayers, loaded]);

  // Shipping lanes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;
    const isEnabled = enabledLayers.includes("shipping-lanes");

    if (isEnabled && !shippingLayerRef.current) {
      import("leaflet").then(({ default: L }) => {
        const layer = L.layerGroup();
        SHIPPING_LANES.forEach((lane) => {
          L.polyline(lane.coords, {
            color: "#0ea5e9",
            weight: 1.5,
            opacity: 0.3,
            dashArray: "8 4",
          })
            .bindPopup(
              `<div style="background:#111827;color:#e5e7eb;padding:6px 10px;border-radius:6px;font-size:12px;">${lane.name}</div>`,
              { className: "dark-popup", closeButton: false }
            )
            .addTo(layer);
        });
        layer.addTo(map);
        shippingLayerRef.current = layer;
      });
    } else if (!isEnabled && shippingLayerRef.current) {
      map.removeLayer(shippingLayerRef.current);
      shippingLayerRef.current = null;
    }
  }, [enabledLayers, loaded]);

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
        L.marker([lat, lng], { icon })
          .addTo(layer)
          .on("click", () => {
            const leaves = clusterIndex.getLeaves(props.cluster_id, Infinity);
            const codes = new Set(
              leaves
                .map((l: any) => (l.properties as MapMarker).countryCode)
                .filter(Boolean)
            );
            if (codes.size === 1 && onClusterNavigate) {
              onClusterNavigate(codes.values().next().value as string);
            } else {
              map.flyTo([lat, lng], zoom + 2, { duration: 0.5 });
            }
          });
      } else {
        const m = props as MapMarker;
        const color = SEVERITY_COLORS[m.severity];
        const sz = m.severity === "CRITICAL" ? 14 : 10;
        const icon = L.divIcon({
          html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};cursor:pointer;"></div>`,
          className: "",
          iconSize: [sz, sz],
          iconAnchor: [sz / 2, sz / 2],
        });
        const marker = L.marker([lat, lng], { icon }).addTo(layer);
        const briefLink = m.countryCode
          ? `<a href="/conflicts/brief/${m.countryCode}" style="display:inline-block;margin-top:6px;font-size:11px;color:#22c55e;text-decoration:none;font-weight:600;">View Briefing →</a>`
          : "";
        marker.bindPopup(
          `<div style="background:#111827;color:#e5e7eb;padding:8px 12px;border-radius:8px;min-width:160px;">
            <div style="font-weight:600;margin-bottom:4px;">${m.label}</div>
            <div style="font-size:12px;color:#9ca3af;">Type: ${m.type}</div>
            <div style="font-size:12px;margin-top:2px;">
              <span style="color:${color};font-weight:600;">${m.severity}</span>
              ${m.countryCode ? `<span style="margin-left:8px;color:#6b7280;">${m.countryCode}</span>` : ""}
            </div>
            ${briefLink}
          </div>`,
          { className: "dark-popup", closeButton: false }
        );
        marker.on("click", () => onMarkerClick?.(m));
      }
    });
  }, [clusterIndex, onMarkerClick, onClusterNavigate]);

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
            <span className="text-sm text-gray-500 font-mono">
              Loading Map…
            </span>
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

function createTerminator(L: any) {
  try {
    const now = new Date();
    const jd = now.getTime() / 86400000 + 2440587.5;
    const n = jd - 2451545.0;
    const L0 = (280.46 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
    const ecLong =
      (L0 + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) *
      (Math.PI / 180);
    const obliq = 23.439 * (Math.PI / 180);
    const dec = Math.asin(Math.sin(obliq) * Math.sin(ecLong));
    const eqTime =
      (L0 -
        (Math.atan2(
          Math.cos(obliq) * Math.sin(ecLong),
          Math.cos(ecLong)
        ) *
          180) /
          Math.PI) *
      4;
    const ha =
      ((now.getUTCHours() * 60 + now.getUTCMinutes()) / 4 - 180 - eqTime) *
      (Math.PI / 180);

    const points: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += 2) {
      const lngRad = lng * (Math.PI / 180);
      const cosLHA = -Math.tan(dec) * Math.tan(Math.asin(0));
      const latRad = Math.atan(
        -(Math.cos(lngRad + ha) / Math.tan(dec))
      );
      const lat = (latRad * 180) / Math.PI;
      points.push([lat, lng]);
    }

    const nightCoords: [number, number][] = [...points];
    if (dec > 0) {
      nightCoords.push([-90, 180], [-90, -180]);
    } else {
      nightCoords.push([90, 180], [90, -180]);
    }

    return L.polygon(nightCoords, {
      color: "transparent",
      fillColor: "#000",
      fillOpacity: 0.25,
      interactive: false,
    });
  } catch {
    return null;
  }
}

async function fetchFlights(L: any, layer: any) {
  try {
    const res = await fetch("/api/map-layers/flights");
    if (!res.ok) return;
    const flights = await res.json();
    layer.clearLayers();

    for (const f of flights) {
      if (f.onGround) continue;
      const icon = L.divIcon({
        html: `<div style="transform:rotate(${f.heading}deg);font-size:8px;color:#60a5fa;opacity:0.6;">✈</div>`,
        className: "",
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      const marker = L.marker([f.lat, f.lng], { icon, interactive: true });
      marker.bindPopup(
        `<div style="background:#111827;color:#e5e7eb;padding:6px 10px;border-radius:6px;font-size:11px;">
          <div style="font-weight:600;">${f.callsign || f.icao24}</div>
          <div style="color:#9ca3af;">Alt: ${Math.round(f.altitude)}m · ${Math.round(f.velocity * 3.6)}km/h</div>
        </div>`,
        { className: "dark-popup", closeButton: false }
      );
      marker.addTo(layer);
    }
  } catch {
    /* silently fail */
  }
}

const SHIPPING_LANES: { name: string; coords: [number, number][] }[] = [
  // --- Chokepoints & Straits ---
  { name: "Strait of Hormuz", coords: [[26.56, 56.25], [25.5, 57.0], [24.5, 58.5], [23.0, 60.0]] },
  { name: "Strait of Malacca", coords: [[6.0, 100.0], [4.0, 101.5], [2.0, 103.5], [1.2, 104.0]] },
  { name: "Bab el-Mandeb", coords: [[12.5, 43.3], [12.0, 44.0], [11.5, 45.0]] },
  { name: "English Channel", coords: [[50.0, -5.0], [50.5, -2.0], [51.0, 1.0], [51.5, 2.0]] },
  { name: "Strait of Gibraltar", coords: [[36.0, -5.5], [35.9, -5.3], [36.1, -5.0]] },
  { name: "Taiwan Strait", coords: [[22.5, 118.5], [24.0, 119.0], [25.5, 120.0]] },
  { name: "Strait of Dover", coords: [[50.8, 0.5], [51.0, 1.5], [51.3, 2.0]] },
  { name: "Lombok Strait", coords: [[-8.8, 115.5], [-9.0, 116.0], [-8.5, 116.5]] },
  { name: "Strait of Bosporus", coords: [[41.0, 28.9], [41.1, 29.0], [41.2, 29.1]] },
  { name: "Danish Straits (Øresund)", coords: [[55.6, 12.7], [56.0, 12.5], [56.5, 12.0], [57.0, 11.0]] },

  // --- Canal Approaches ---
  { name: "Suez Canal Approach", coords: [[31.3, 32.3], [30.0, 32.6], [28.0, 33.5], [25.0, 35.0], [20.0, 38.0], [13.0, 43.0]] },
  { name: "Panama Canal (Atlantic)", coords: [[12.0, -80.0], [10.0, -79.5], [9.3, -79.9]] },
  { name: "Panama Canal (Pacific)", coords: [[9.0, -79.5], [7.0, -80.5], [5.0, -82.0]] },

  // --- Trans-Oceanic Routes ---
  { name: "Trans-Pacific (Asia–Americas)", coords: [[35.0, 140.0], [40.0, 170.0], [42.0, -170.0], [38.0, -140.0], [35.0, -122.0]] },
  { name: "North Atlantic Shipping Lane", coords: [[40.7, -74.0], [42.0, -60.0], [48.0, -40.0], [50.5, -10.0], [51.5, 2.0]] },
  { name: "South Atlantic Route", coords: [[-23.0, -43.0], [-20.0, -30.0], [-15.0, -10.0], [-10.0, 5.0], [-5.0, 10.0]] },
  { name: "Trans-Pacific (South)", coords: [[-33.0, -71.0], [-35.0, -100.0], [-33.0, -130.0], [-30.0, -160.0], [-33.0, 172.0], [-37.0, 150.0]] },
  { name: "Australia–Asia Route", coords: [[-33.8, 151.2], [-25.0, 140.0], [-15.0, 130.0], [-10.0, 120.0], [-8.0, 115.0], [1.2, 104.0]] },

  // --- Regional Seas ---
  { name: "Mediterranean Route", coords: [[36.0, -5.5], [37.0, 5.0], [35.5, 15.0], [33.5, 25.0], [31.3, 32.3]] },
  { name: "Red Sea", coords: [[13.0, 43.0], [16.0, 41.5], [20.0, 38.0], [25.0, 35.0], [28.0, 33.5]] },
  { name: "South China Sea Route", coords: [[1.2, 104.0], [5.0, 110.0], [10.0, 115.0], [15.0, 117.0], [20.0, 118.0], [22.0, 114.0]] },
  { name: "East China Sea Route", coords: [[22.0, 114.0], [25.0, 122.0], [30.0, 125.0], [35.0, 130.0], [35.5, 140.0]] },
  { name: "Sea of Japan Route", coords: [[35.0, 130.0], [37.0, 132.0], [40.0, 135.0], [43.0, 140.0]] },
  { name: "Black Sea Route", coords: [[41.2, 29.1], [42.5, 32.0], [43.5, 35.0], [44.0, 38.0]] },
  { name: "Baltic Sea Route", coords: [[57.0, 11.0], [58.0, 14.0], [57.5, 18.0], [59.5, 24.0], [60.0, 28.0]] },
  { name: "North Sea Route", coords: [[51.5, 2.0], [53.0, 4.0], [55.0, 7.0], [57.5, 10.0]] },
  { name: "Persian Gulf", coords: [[23.0, 60.0], [25.0, 55.0], [26.5, 51.0], [27.5, 49.5], [29.0, 49.0]] },
  { name: "Gulf of Aden", coords: [[11.5, 45.0], [12.0, 48.0], [13.0, 50.0], [14.5, 52.0]] },
  { name: "Bay of Bengal Route", coords: [[6.0, 80.0], [10.0, 82.0], [14.0, 85.0], [18.0, 88.0], [21.0, 90.0]] },
  { name: "Arabian Sea Route", coords: [[23.0, 60.0], [18.0, 62.0], [12.0, 65.0], [8.0, 72.0], [6.0, 80.0]] },

  // --- Americas ---
  { name: "US East Coast Corridor", coords: [[25.8, -80.1], [30.0, -80.0], [32.8, -79.0], [36.8, -76.0], [39.0, -74.5], [40.7, -74.0]] },
  { name: "US West Coast Corridor", coords: [[33.7, -118.3], [35.0, -121.0], [37.8, -122.5], [46.0, -124.0], [48.5, -124.7]] },
  { name: "Gulf of Mexico Route", coords: [[25.8, -80.1], [25.0, -83.0], [27.0, -88.0], [29.0, -90.0], [28.0, -94.0], [26.0, -97.0]] },
  { name: "Caribbean Route", coords: [[10.0, -61.0], [12.0, -66.0], [15.0, -70.0], [18.0, -76.0], [20.0, -80.0], [25.8, -80.1]] },
  { name: "South America East Coast", coords: [[-34.6, -58.4], [-28.0, -48.0], [-23.0, -43.0], [-12.0, -38.0], [-5.0, -35.0], [5.0, -52.0]] },
  { name: "South America West Coast", coords: [[-33.0, -71.0], [-23.0, -70.0], [-12.0, -77.0], [-2.0, -80.0], [5.0, -77.0], [9.0, -79.5]] },

  // --- Africa ---
  { name: "West Africa Coast", coords: [[-5.0, 10.0], [0.0, 5.0], [4.5, -1.0], [6.5, -3.5], [10.0, -13.0], [14.7, -17.4]] },
  { name: "Cape of Good Hope", coords: [[-34.5, 18.5], [-35.0, 20.0], [-33.0, 28.0], [-30.0, 32.0]] },
  { name: "East Africa Coast", coords: [[-30.0, 32.0], [-25.0, 35.0], [-15.0, 41.0], [-6.0, 39.5], [-1.0, 41.0], [2.0, 45.0]] },
  { name: "Mozambique Channel", coords: [[-30.0, 32.0], [-25.0, 36.0], [-20.0, 40.0], [-15.0, 41.0]] },

  // --- Indian Ocean & Oceania ---
  { name: "Indian Ocean Route", coords: [[-33.0, 28.0], [-20.0, 45.0], [-5.0, 60.0], [5.0, 75.0], [6.0, 80.0], [5.0, 95.0], [2.0, 103.5]] },
  { name: "Australia–NZ Route", coords: [[-33.8, 151.2], [-37.0, 160.0], [-40.0, 170.0], [-41.3, 174.8]] },
  { name: "Pacific Islands Route", coords: [[-33.8, 151.2], [-25.0, 165.0], [-18.0, 178.0], [-13.0, -172.0]] },

  // --- Arctic & Northern ---
  { name: "Northern Sea Route (Arctic)", coords: [[69.0, 33.0], [72.0, 55.0], [74.0, 80.0], [73.0, 110.0], [71.0, 140.0], [66.0, 170.0]] },
  { name: "Northwest Passage", coords: [[66.0, -62.0], [70.0, -75.0], [73.0, -95.0], [71.0, -115.0], [70.0, -135.0], [68.0, -155.0]] },
];
