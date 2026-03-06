import { NextResponse } from "next/server";

interface FlightState {
  icao24: string;
  callsign: string;
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  heading: number;
  onGround: boolean;
}

let cache: { data: FlightState[]; ts: number } | null = null;
const CACHE_TTL_MS = 30_000;

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
      return NextResponse.json(cache.data);
    }

    const res = await fetch(
      "https://opensky-network.org/api/states/all",
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      if (cache) return NextResponse.json(cache.data);
      return NextResponse.json([], { status: 200 });
    }

    const json = await res.json();
    const states: unknown[][] = json.states ?? [];

    const flights: FlightState[] = [];
    const step = Math.max(1, Math.floor(states.length / 2000));
    for (let i = 0; i < states.length; i += step) {
      const s = states[i];
      const lat = s[6] as number | null;
      const lng = s[5] as number | null;
      if (lat == null || lng == null) continue;
      flights.push({
        icao24: (s[0] as string).trim(),
        callsign: ((s[1] as string) ?? "").trim(),
        lat,
        lng,
        altitude: (s[13] as number) ?? (s[7] as number) ?? 0,
        velocity: (s[9] as number) ?? 0,
        heading: (s[10] as number) ?? 0,
        onGround: (s[8] as boolean) ?? false,
      });
    }

    cache = { data: flights, ts: Date.now() };
    return NextResponse.json(flights);
  } catch (error) {
    console.error("Flights API error:", error);
    if (cache) return NextResponse.json(cache.data);
    return NextResponse.json([]);
  }
}
