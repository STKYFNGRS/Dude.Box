interface CountryBox {
  iso2: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  cLat: number;
  cLng: number;
}

// Bounding boxes + centroids for ~200 countries/territories.
// When a point falls in overlapping boxes the closest centroid wins.
const COUNTRIES: CountryBox[] = [
  { iso2: "AF", latMin: 29.38, latMax: 38.49, lngMin: 60.47, lngMax: 74.89, cLat: 33.94, cLng: 67.71 },
  { iso2: "AL", latMin: 39.64, latMax: 42.66, lngMin: 19.26, lngMax: 21.06, cLat: 41.15, cLng: 20.17 },
  { iso2: "DZ", latMin: 18.96, latMax: 37.09, lngMin: -8.67, lngMax: 11.98, cLat: 28.03, cLng: 1.66 },
  { iso2: "AO", latMin: -18.04, latMax: -4.37, lngMin: 11.64, lngMax: 24.08, cLat: -11.20, cLng: 17.87 },
  { iso2: "AR", latMin: -55.06, latMax: -21.78, lngMin: -73.58, lngMax: -53.59, cLat: -38.42, cLng: -63.62 },
  { iso2: "AM", latMin: 38.84, latMax: 41.30, lngMin: 43.45, lngMax: 46.63, cLat: 40.07, cLng: 45.04 },
  { iso2: "AU", latMin: -43.64, latMax: -10.06, lngMin: 113.34, lngMax: 153.57, cLat: -25.27, cLng: 133.78 },
  { iso2: "AT", latMin: 46.37, latMax: 49.02, lngMin: 9.48, lngMax: 17.16, cLat: 47.52, cLng: 14.55 },
  { iso2: "AZ", latMin: 38.39, latMax: 41.91, lngMin: 44.77, lngMax: 50.37, cLat: 40.14, cLng: 47.58 },
  { iso2: "BH", latMin: 25.80, latMax: 26.28, lngMin: 50.38, lngMax: 50.65, cLat: 26.02, cLng: 50.55 },
  { iso2: "BD", latMin: 20.74, latMax: 26.63, lngMin: 88.01, lngMax: 92.67, cLat: 23.68, cLng: 90.36 },
  { iso2: "BY", latMin: 51.26, latMax: 56.17, lngMin: 23.18, lngMax: 32.78, cLat: 53.71, cLng: 27.95 },
  { iso2: "BE", latMin: 49.50, latMax: 51.50, lngMin: 2.55, lngMax: 6.40, cLat: 50.50, cLng: 4.47 },
  { iso2: "BZ", latMin: 15.89, latMax: 18.50, lngMin: -89.22, lngMax: -87.49, cLat: 17.19, cLng: -88.50 },
  { iso2: "BJ", latMin: 6.14, latMax: 12.42, lngMin: 0.77, lngMax: 3.84, cLat: 9.31, cLng: 2.32 },
  { iso2: "BT", latMin: 26.70, latMax: 28.33, lngMin: 88.75, lngMax: 92.13, cLat: 27.51, cLng: 90.43 },
  { iso2: "BO", latMin: -22.90, latMax: -9.68, lngMin: -69.64, lngMax: -57.45, cLat: -16.29, cLng: -63.59 },
  { iso2: "BA", latMin: 42.56, latMax: 45.28, lngMin: 15.72, lngMax: 19.62, cLat: 43.92, cLng: 17.68 },
  { iso2: "BW", latMin: -26.91, latMax: -17.78, lngMin: 19.99, lngMax: 29.37, cLat: -22.33, cLng: 24.68 },
  { iso2: "BR", latMin: -33.75, latMax: 5.27, lngMin: -73.99, lngMax: -34.73, cLat: -14.24, cLng: -51.93 },
  { iso2: "BN", latMin: 4.00, latMax: 5.05, lngMin: 114.07, lngMax: 115.36, cLat: 4.54, cLng: 114.73 },
  { iso2: "BG", latMin: 41.24, latMax: 44.21, lngMin: 22.36, lngMax: 28.61, cLat: 42.73, cLng: 25.49 },
  { iso2: "BF", latMin: 9.40, latMax: 15.08, lngMin: -5.52, lngMax: 2.41, cLat: 12.24, cLng: -1.56 },
  { iso2: "BI", latMin: -4.47, latMax: -2.31, lngMin: 29.00, lngMax: 30.85, cLat: -3.37, cLng: 29.92 },
  { iso2: "KH", latMin: 10.41, latMax: 14.69, lngMin: 102.34, lngMax: 107.64, cLat: 12.57, cLng: 104.99 },
  { iso2: "CM", latMin: 1.65, latMax: 13.08, lngMin: 8.49, lngMax: 16.19, cLat: 7.37, cLng: 12.35 },
  { iso2: "CA", latMin: 41.68, latMax: 83.11, lngMin: -141.00, lngMax: -52.62, cLat: 56.13, cLng: -106.35 },
  { iso2: "CF", latMin: 2.22, latMax: 11.01, lngMin: 14.42, lngMax: 27.46, cLat: 6.61, cLng: 20.94 },
  { iso2: "TD", latMin: 7.44, latMax: 23.45, lngMin: 13.47, lngMax: 24.00, cLat: 15.45, cLng: 18.73 },
  { iso2: "CL", latMin: -55.98, latMax: -17.51, lngMin: -75.64, lngMax: -66.96, cLat: -35.68, cLng: -71.54 },
  { iso2: "CN", latMin: 18.15, latMax: 53.56, lngMin: 73.50, lngMax: 134.77, cLat: 35.86, cLng: 104.20 },
  { iso2: "CO", latMin: -4.23, latMax: 13.39, lngMin: -79.00, lngMax: -66.87, cLat: 4.57, cLng: -74.30 },
  { iso2: "CD", latMin: -13.46, latMax: 5.39, lngMin: 12.18, lngMax: 31.31, cLat: -4.04, cLng: 21.76 },
  { iso2: "CG", latMin: -5.03, latMax: 3.70, lngMin: 11.21, lngMax: 18.65, cLat: -0.23, cLng: 15.83 },
  { iso2: "CR", latMin: 8.03, latMax: 11.22, lngMin: -85.95, lngMax: -82.55, cLat: 9.75, cLng: -83.75 },
  { iso2: "CI", latMin: 4.36, latMax: 10.74, lngMin: -8.60, lngMax: -2.49, cLat: 7.54, cLng: -5.55 },
  { iso2: "HR", latMin: 42.39, latMax: 46.55, lngMin: 13.49, lngMax: 19.43, cLat: 45.10, cLng: 15.20 },
  { iso2: "CU", latMin: 19.83, latMax: 23.19, lngMin: -84.95, lngMax: -74.13, cLat: 21.52, cLng: -79.53 },
  { iso2: "CY", latMin: 34.57, latMax: 35.70, lngMin: 32.27, lngMax: 34.60, cLat: 35.13, cLng: 33.43 },
  { iso2: "CZ", latMin: 48.55, latMax: 51.06, lngMin: 12.09, lngMax: 18.86, cLat: 49.82, cLng: 15.47 },
  { iso2: "DK", latMin: 54.56, latMax: 57.75, lngMin: 8.09, lngMax: 15.16, cLat: 56.26, cLng: 9.50 },
  { iso2: "DJ", latMin: 10.93, latMax: 12.71, lngMin: 41.77, lngMax: 43.42, cLat: 11.83, cLng: 42.59 },
  { iso2: "DO", latMin: 17.47, latMax: 19.93, lngMin: -72.00, lngMax: -68.32, cLat: 18.74, cLng: -70.16 },
  { iso2: "EC", latMin: -5.01, latMax: 1.44, lngMin: -81.08, lngMax: -75.19, cLat: -1.83, cLng: -78.18 },
  { iso2: "EG", latMin: 22.00, latMax: 31.67, lngMin: 24.70, lngMax: 36.87, cLat: 26.82, cLng: 30.80 },
  { iso2: "SV", latMin: 13.15, latMax: 14.45, lngMin: -90.13, lngMax: -87.69, cLat: 13.79, cLng: -88.90 },
  { iso2: "GQ", latMin: 1.01, latMax: 2.35, lngMin: 9.31, lngMax: 11.34, cLat: 1.65, cLng: 10.27 },
  { iso2: "ER", latMin: 12.36, latMax: 18.00, lngMin: 36.44, lngMax: 43.12, cLat: 15.18, cLng: 39.78 },
  { iso2: "EE", latMin: 57.52, latMax: 59.68, lngMin: 21.83, lngMax: 28.21, cLat: 58.60, cLng: 25.01 },
  { iso2: "SZ", latMin: -27.32, latMax: -25.72, lngMin: 30.79, lngMax: 32.14, cLat: -26.52, cLng: 31.47 },
  { iso2: "ET", latMin: 3.40, latMax: 14.89, lngMin: 32.99, lngMax: 47.99, cLat: 9.15, cLng: 40.49 },
  { iso2: "FI", latMin: 59.81, latMax: 70.09, lngMin: 20.55, lngMax: 31.59, cLat: 61.92, cLng: 25.75 },
  { iso2: "FR", latMin: 42.33, latMax: 51.09, lngMin: -4.79, lngMax: 8.23, cLat: 46.23, cLng: 2.21 },
  { iso2: "GA", latMin: -3.98, latMax: 2.32, lngMin: 8.70, lngMax: 14.50, cLat: -0.80, cLng: 11.61 },
  { iso2: "GM", latMin: 13.06, latMax: 13.83, lngMin: -16.82, lngMax: -13.80, cLat: 13.44, cLng: -15.31 },
  { iso2: "GE", latMin: 41.05, latMax: 43.59, lngMin: 40.01, lngMax: 46.74, cLat: 42.32, cLng: 43.36 },
  { iso2: "DE", latMin: 47.27, latMax: 55.06, lngMin: 5.87, lngMax: 15.04, cLat: 51.17, cLng: 10.45 },
  { iso2: "GH", latMin: 4.74, latMax: 11.17, lngMin: -3.26, lngMax: 1.19, cLat: 7.95, cLng: -1.02 },
  { iso2: "GR", latMin: 34.80, latMax: 41.75, lngMin: 19.37, lngMax: 29.65, cLat: 39.07, cLng: 21.82 },
  { iso2: "GT", latMin: 13.74, latMax: 17.82, lngMin: -92.23, lngMax: -88.22, cLat: 15.78, cLng: -90.23 },
  { iso2: "GN", latMin: 7.19, latMax: 12.68, lngMin: -15.08, lngMax: -7.64, cLat: 9.95, cLng: -11.36 },
  { iso2: "GW", latMin: 10.93, latMax: 12.68, lngMin: -16.71, lngMax: -13.64, cLat: 11.80, cLng: -15.18 },
  { iso2: "GY", latMin: 1.17, latMax: 8.56, lngMin: -61.40, lngMax: -56.48, cLat: 4.86, cLng: -58.93 },
  { iso2: "HT", latMin: 18.02, latMax: 20.09, lngMin: -74.48, lngMax: -71.62, cLat: 19.08, cLng: -72.29 },
  { iso2: "HN", latMin: 12.98, latMax: 16.52, lngMin: -89.35, lngMax: -83.11, cLat: 15.20, cLng: -86.24 },
  { iso2: "HU", latMin: 45.74, latMax: 48.58, lngMin: 16.11, lngMax: 22.90, cLat: 47.16, cLng: 19.50 },
  { iso2: "IS", latMin: 63.30, latMax: 66.54, lngMin: -24.53, lngMax: -13.50, cLat: 64.96, cLng: -19.02 },
  { iso2: "IN", latMin: 6.75, latMax: 35.50, lngMin: 68.16, lngMax: 97.40, cLat: 20.59, cLng: 78.96 },
  { iso2: "ID", latMin: -11.00, latMax: 6.08, lngMin: 95.01, lngMax: 141.02, cLat: -0.79, cLng: 113.92 },
  { iso2: "IR", latMin: 25.06, latMax: 39.78, lngMin: 44.03, lngMax: 63.32, cLat: 32.43, cLng: 53.69 },
  { iso2: "IQ", latMin: 29.06, latMax: 37.38, lngMin: 38.79, lngMax: 48.57, cLat: 33.22, cLng: 43.68 },
  { iso2: "IE", latMin: 51.42, latMax: 55.39, lngMin: -10.48, lngMax: -5.99, cLat: 53.41, cLng: -8.24 },
  { iso2: "IL", latMin: 29.48, latMax: 33.33, lngMin: 34.27, lngMax: 35.90, cLat: 31.05, cLng: 34.85 },
  { iso2: "IT", latMin: 36.65, latMax: 47.09, lngMin: 6.63, lngMax: 18.52, cLat: 41.87, cLng: 12.57 },
  { iso2: "JM", latMin: 17.70, latMax: 18.52, lngMin: -78.37, lngMax: -76.18, cLat: 18.11, cLng: -77.30 },
  { iso2: "JP", latMin: 24.25, latMax: 45.52, lngMin: 122.93, lngMax: 153.99, cLat: 36.20, cLng: 138.25 },
  { iso2: "JO", latMin: 29.19, latMax: 33.38, lngMin: 34.96, lngMax: 39.30, cLat: 30.59, cLng: 36.24 },
  { iso2: "KZ", latMin: 40.57, latMax: 55.44, lngMin: 46.49, lngMax: 87.31, cLat: 48.02, cLng: 66.92 },
  { iso2: "KE", latMin: -4.68, latMax: 5.03, lngMin: 33.91, lngMax: 41.91, cLat: -0.02, cLng: 37.91 },
  { iso2: "KP", latMin: 37.67, latMax: 43.01, lngMin: 124.27, lngMax: 130.67, cLat: 40.34, cLng: 127.51 },
  { iso2: "KR", latMin: 33.11, latMax: 38.61, lngMin: 125.89, lngMax: 129.58, cLat: 35.91, cLng: 127.77 },
  { iso2: "KW", latMin: 28.52, latMax: 30.10, lngMin: 46.55, lngMax: 48.43, cLat: 29.31, cLng: 47.48 },
  { iso2: "KG", latMin: 39.17, latMax: 43.24, lngMin: 69.28, lngMax: 80.23, cLat: 41.20, cLng: 74.77 },
  { iso2: "LA", latMin: 13.91, latMax: 22.50, lngMin: 100.09, lngMax: 107.64, cLat: 19.86, cLng: 102.50 },
  { iso2: "LV", latMin: 55.67, latMax: 58.08, lngMin: 20.97, lngMax: 28.24, cLat: 56.88, cLng: 24.60 },
  { iso2: "LB", latMin: 33.05, latMax: 34.69, lngMin: 35.10, lngMax: 36.63, cLat: 33.85, cLng: 35.86 },
  { iso2: "LS", latMin: -30.67, latMax: -28.57, lngMin: 27.01, lngMax: 29.46, cLat: -29.61, cLng: 28.23 },
  { iso2: "LR", latMin: 4.35, latMax: 8.55, lngMin: -11.49, lngMax: -7.37, cLat: 6.43, cLng: -9.43 },
  { iso2: "LY", latMin: 19.50, latMax: 33.17, lngMin: 9.39, lngMax: 25.15, cLat: 26.34, cLng: 17.23 },
  { iso2: "LT", latMin: 53.90, latMax: 56.45, lngMin: 20.94, lngMax: 26.84, cLat: 55.17, cLng: 23.88 },
  { iso2: "LU", latMin: 49.44, latMax: 50.18, lngMin: 5.73, lngMax: 6.53, cLat: 49.82, cLng: 6.13 },
  { iso2: "MG", latMin: -25.60, latMax: -11.95, lngMin: 43.19, lngMax: 50.48, cLat: -18.77, cLng: 46.87 },
  { iso2: "MW", latMin: -17.13, latMax: -9.37, lngMin: 32.67, lngMax: 35.92, cLat: -13.25, cLng: 34.30 },
  { iso2: "MY", latMin: 0.85, latMax: 7.36, lngMin: 99.64, lngMax: 119.27, cLat: 4.21, cLng: 101.98 },
  { iso2: "ML", latMin: 10.16, latMax: 25.00, lngMin: -12.24, lngMax: 4.27, cLat: 17.57, cLng: -4.00 },
  { iso2: "MR", latMin: 14.72, latMax: 27.31, lngMin: -17.07, lngMax: -4.83, cLat: 21.01, cLng: -10.94 },
  { iso2: "MX", latMin: 14.53, latMax: 32.72, lngMin: -118.40, lngMax: -86.71, cLat: 23.63, cLng: -102.55 },
  { iso2: "MD", latMin: 46.35, latMax: 48.49, lngMin: 26.62, lngMax: 30.13, cLat: 47.41, cLng: 28.37 },
  { iso2: "MN", latMin: 41.58, latMax: 52.15, lngMin: 87.75, lngMax: 119.77, cLat: 46.86, cLng: 103.85 },
  { iso2: "ME", latMin: 41.85, latMax: 43.56, lngMin: 18.43, lngMax: 20.36, cLat: 42.71, cLng: 19.37 },
  { iso2: "MA", latMin: 27.67, latMax: 35.92, lngMin: -13.17, lngMax: -1.01, cLat: 31.79, cLng: -7.09 },
  { iso2: "MZ", latMin: -26.87, latMax: -10.47, lngMin: 30.22, lngMax: 40.84, cLat: -18.67, cLng: 35.53 },
  { iso2: "MM", latMin: 9.78, latMax: 28.54, lngMin: 92.19, lngMax: 101.17, cLat: 21.91, cLng: 95.96 },
  { iso2: "NA", latMin: -28.97, latMax: -16.96, lngMin: 11.73, lngMax: 25.26, cLat: -22.96, cLng: 18.49 },
  { iso2: "NP", latMin: 26.36, latMax: 30.45, lngMin: 80.06, lngMax: 88.20, cLat: 28.39, cLng: 84.12 },
  { iso2: "NL", latMin: 50.75, latMax: 53.47, lngMin: 3.36, lngMax: 7.21, cLat: 52.13, cLng: 5.29 },
  { iso2: "NZ", latMin: -47.29, latMax: -34.39, lngMin: 166.51, lngMax: 178.52, cLat: -40.90, cLng: 174.89 },
  { iso2: "NI", latMin: 10.71, latMax: 15.03, lngMin: -87.69, lngMax: -82.73, cLat: 12.87, cLng: -85.21 },
  { iso2: "NE", latMin: 11.69, latMax: 23.53, lngMin: 0.17, lngMax: 15.99, cLat: 17.61, cLng: 8.08 },
  { iso2: "NG", latMin: 4.27, latMax: 13.89, lngMin: 2.69, lngMax: 14.68, cLat: 9.08, cLng: 8.68 },
  { iso2: "MK", latMin: 40.85, latMax: 42.36, lngMin: 20.46, lngMax: 23.04, cLat: 41.61, cLng: 21.75 },
  { iso2: "NO", latMin: 58.00, latMax: 71.19, lngMin: 4.65, lngMax: 31.08, cLat: 60.47, cLng: 8.47 },
  { iso2: "OM", latMin: 16.65, latMax: 26.39, lngMin: 51.88, lngMax: 59.84, cLat: 21.47, cLng: 55.98 },
  { iso2: "PK", latMin: 23.69, latMax: 37.08, lngMin: 60.87, lngMax: 77.83, cLat: 30.38, cLng: 69.35 },
  { iso2: "PS", latMin: 31.22, latMax: 32.55, lngMin: 34.22, lngMax: 35.57, cLat: 31.95, cLng: 35.23 },
  { iso2: "PA", latMin: 7.20, latMax: 9.65, lngMin: -83.05, lngMax: -77.17, cLat: 8.54, cLng: -80.78 },
  { iso2: "PG", latMin: -10.65, latMax: -1.35, lngMin: 140.84, lngMax: 155.96, cLat: -6.31, cLng: 143.96 },
  { iso2: "PY", latMin: -27.59, latMax: -19.29, lngMin: -62.65, lngMax: -54.26, cLat: -23.44, cLng: -58.44 },
  { iso2: "PE", latMin: -18.35, latMax: -0.04, lngMin: -81.33, lngMax: -68.65, cLat: -9.19, cLng: -75.02 },
  { iso2: "PH", latMin: 4.59, latMax: 21.12, lngMin: 116.93, lngMax: 126.60, cLat: 12.88, cLng: 121.77 },
  { iso2: "PL", latMin: 49.00, latMax: 54.84, lngMin: 14.12, lngMax: 24.15, cLat: 51.92, cLng: 19.15 },
  { iso2: "PT", latMin: 36.96, latMax: 42.15, lngMin: -9.50, lngMax: -6.19, cLat: 39.40, cLng: -8.22 },
  { iso2: "QA", latMin: 24.47, latMax: 26.15, lngMin: 50.76, lngMax: 51.64, cLat: 25.35, cLng: 51.18 },
  { iso2: "RO", latMin: 43.62, latMax: 48.27, lngMin: 20.26, lngMax: 29.69, cLat: 45.94, cLng: 24.97 },
  { iso2: "RU", latMin: 41.19, latMax: 81.86, lngMin: 19.64, lngMax: -169.05, cLat: 61.52, cLng: 105.32 },
  { iso2: "RW", latMin: -2.84, latMax: -1.05, lngMin: 28.86, lngMax: 30.90, cLat: -1.94, cLng: 29.87 },
  { iso2: "SA", latMin: 16.35, latMax: 32.16, lngMin: 34.49, lngMax: 55.67, cLat: 23.89, cLng: 45.08 },
  { iso2: "SN", latMin: 12.31, latMax: 16.69, lngMin: -17.54, lngMax: -11.36, cLat: 14.50, cLng: -14.45 },
  { iso2: "RS", latMin: 42.23, latMax: 46.19, lngMin: 18.84, lngMax: 23.01, cLat: 44.02, cLng: 21.01 },
  { iso2: "SL", latMin: 6.93, latMax: 10.00, lngMin: -13.30, lngMax: -10.27, cLat: 8.46, cLng: -11.78 },
  { iso2: "SG", latMin: 1.26, latMax: 1.47, lngMin: 103.64, lngMax: 104.01, cLat: 1.35, cLng: 103.82 },
  { iso2: "SK", latMin: 47.73, latMax: 49.60, lngMin: 16.83, lngMax: 22.56, cLat: 48.67, cLng: 19.70 },
  { iso2: "SI", latMin: 45.42, latMax: 46.88, lngMin: 13.38, lngMax: 16.61, cLat: 46.15, cLng: 14.99 },
  { iso2: "SO", latMin: -1.68, latMax: 11.99, lngMin: 40.99, lngMax: 51.41, cLat: 5.15, cLng: 46.20 },
  { iso2: "ZA", latMin: -34.84, latMax: -22.13, lngMin: 16.34, lngMax: 32.89, cLat: -30.56, cLng: 22.94 },
  { iso2: "SS", latMin: 3.49, latMax: 12.24, lngMin: 24.15, lngMax: 35.94, cLat: 7.86, cLng: 29.69 },
  { iso2: "ES", latMin: 36.00, latMax: 43.79, lngMin: -9.30, lngMax: 4.33, cLat: 40.46, cLng: -3.75 },
  { iso2: "LK", latMin: 5.92, latMax: 9.84, lngMin: 79.65, lngMax: 81.88, cLat: 7.87, cLng: 80.77 },
  { iso2: "SD", latMin: 8.68, latMax: 22.23, lngMin: 21.81, lngMax: 38.61, cLat: 12.86, cLng: 30.22 },
  { iso2: "SR", latMin: 1.83, latMax: 6.01, lngMin: -58.07, lngMax: -53.98, cLat: 3.92, cLng: -56.03 },
  { iso2: "SE", latMin: 55.34, latMax: 69.06, lngMin: 11.11, lngMax: 24.17, cLat: 60.13, cLng: 18.64 },
  { iso2: "CH", latMin: 45.83, latMax: 47.81, lngMin: 5.96, lngMax: 10.49, cLat: 46.82, cLng: 8.23 },
  { iso2: "SY", latMin: 32.31, latMax: 37.32, lngMin: 35.73, lngMax: 42.38, cLat: 34.80, cLng: 38.99 },
  { iso2: "TW", latMin: 21.90, latMax: 25.30, lngMin: 120.11, lngMax: 121.95, cLat: 23.70, cLng: 120.96 },
  { iso2: "TJ", latMin: 36.67, latMax: 41.04, lngMin: 67.39, lngMax: 75.14, cLat: 38.86, cLng: 71.28 },
  { iso2: "TZ", latMin: -11.75, latMax: -0.99, lngMin: 29.33, lngMax: 40.44, cLat: -6.37, cLng: 34.89 },
  { iso2: "TH", latMin: 5.61, latMax: 20.46, lngMin: 97.35, lngMax: 105.64, cLat: 15.87, cLng: 100.99 },
  { iso2: "TL", latMin: -9.46, latMax: -8.13, lngMin: 124.04, lngMax: 127.34, cLat: -8.87, cLng: 125.73 },
  { iso2: "TG", latMin: 6.10, latMax: 11.14, lngMin: -0.15, lngMax: 1.81, cLat: 8.62, cLng: 0.82 },
  { iso2: "TT", latMin: 10.04, latMax: 10.84, lngMin: -61.93, lngMax: -60.52, cLat: 10.44, cLng: -61.31 },
  { iso2: "TN", latMin: 30.23, latMax: 37.54, lngMin: 7.52, lngMax: 11.60, cLat: 33.89, cLng: 9.54 },
  { iso2: "TR", latMin: 35.82, latMax: 42.11, lngMin: 25.66, lngMax: 44.83, cLat: 38.96, cLng: 35.24 },
  { iso2: "TM", latMin: 35.14, latMax: 42.80, lngMin: 52.44, lngMax: 66.68, cLat: 38.97, cLng: 59.56 },
  { iso2: "UG", latMin: -1.48, latMax: 4.23, lngMin: 29.57, lngMax: 35.04, cLat: 1.37, cLng: 32.29 },
  { iso2: "UA", latMin: 44.39, latMax: 52.38, lngMin: 22.14, lngMax: 40.22, cLat: 48.38, cLng: 31.17 },
  { iso2: "AE", latMin: 22.63, latMax: 26.08, lngMin: 51.50, lngMax: 56.38, cLat: 23.42, cLng: 53.85 },
  { iso2: "GB", latMin: 49.96, latMax: 58.64, lngMin: -8.16, lngMax: 1.75, cLat: 55.38, cLng: -3.44 },
  { iso2: "US", latMin: 24.40, latMax: 49.38, lngMin: -124.85, lngMax: -66.88, cLat: 37.09, cLng: -95.71 },
  { iso2: "UY", latMin: -35.03, latMax: -30.09, lngMin: -58.44, lngMax: -53.07, cLat: -32.52, cLng: -55.77 },
  { iso2: "UZ", latMin: 37.18, latMax: 45.59, lngMin: 55.99, lngMax: 73.13, cLat: 41.38, cLng: 64.59 },
  { iso2: "VE", latMin: 0.65, latMax: 12.20, lngMin: -73.38, lngMax: -59.80, cLat: 6.42, cLng: -66.59 },
  { iso2: "VN", latMin: 8.56, latMax: 23.39, lngMin: 102.14, lngMax: 109.47, cLat: 14.06, cLng: 108.28 },
  { iso2: "YE", latMin: 12.11, latMax: 18.99, lngMin: 42.55, lngMax: 54.53, cLat: 15.55, cLng: 48.52 },
  { iso2: "ZM", latMin: -18.08, latMax: -8.22, lngMin: 21.99, lngMax: 33.71, cLat: -13.13, cLng: 27.85 },
  { iso2: "ZW", latMin: -22.42, latMax: -15.61, lngMin: 25.24, lngMax: 33.06, cLat: -19.02, cLng: 29.15 },
  { iso2: "XK", latMin: 41.86, latMax: 43.27, lngMin: 20.01, lngMax: 21.79, cLat: 42.60, cLng: 20.90 },
];

function distSq(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return (lat1 - lat2) ** 2 + (lng1 - lng2) ** 2;
}

/**
 * Fast point-in-bounding-box reverse geocode.
 * Returns the ISO-2 country code whose bounding box contains the point.
 * When multiple boxes overlap the closest centroid wins.
 * Returns null for ocean / unmapped territories.
 */
export function getCountryCode(lat: number, lng: number): string | null {
  let best: string | null = null;
  let bestDist = Infinity;

  for (const c of COUNTRIES) {
    if (c.iso2 === "RU") {
      // Russia wraps across the date line; special handling
      const inLat = lat >= c.latMin && lat <= c.latMax;
      const inLng = lng >= c.lngMin || lng <= c.lngMax;
      if (inLat && inLng) {
        const d = distSq(lat, lng, c.cLat, c.cLng);
        if (d < bestDist) { bestDist = d; best = c.iso2; }
      }
    } else {
      if (lat >= c.latMin && lat <= c.latMax && lng >= c.lngMin && lng <= c.lngMax) {
        const d = distSq(lat, lng, c.cLat, c.cLng);
        if (d < bestDist) { bestDist = d; best = c.iso2; }
      }
    }
  }

  return best;
}
