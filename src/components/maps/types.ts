export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  type: string;
  countryCode?: string;
}

export interface FlightMarker {
  icao24: string;
  callsign: string;
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  heading: number;
  onGround: boolean;
}
