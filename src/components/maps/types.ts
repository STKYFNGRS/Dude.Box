export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  type: string;
}
