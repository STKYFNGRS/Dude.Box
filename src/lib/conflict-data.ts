import { prisma } from "./prisma";

// ---------------------------------------------------------------------------
// Country keyword aliases – used for headline matching & news velocity
// ---------------------------------------------------------------------------
export const COUNTRY_ALIASES: Record<string, string[]> = {
  AF: ["afghanistan", "kabul", "afghan", "taliban"],
  AL: ["albania", "tirana", "albanian"],
  DZ: ["algeria", "algiers", "algerian"],
  AO: ["angola", "luanda", "angolan"],
  AR: ["argentina", "buenos aires", "argentine"],
  AM: ["armenia", "yerevan", "armenian"],
  AU: ["australia", "canberra", "sydney", "australian"],
  AZ: ["azerbaijan", "baku", "azerbaijani", "nagorno-karabakh"],
  BH: ["bahrain", "manama", "bahraini"],
  BD: ["bangladesh", "dhaka", "bangladeshi"],
  BY: ["belarus", "minsk", "belarusian"],
  BE: ["belgium", "brussels", "belgian"],
  BJ: ["benin", "porto-novo"],
  BO: ["bolivia", "la paz", "bolivian"],
  BA: ["bosnia", "sarajevo", "bosnian"],
  BR: ["brazil", "brasilia", "brazilian", "rio de janeiro", "são paulo"],
  BF: ["burkina faso", "ouagadougou", "burkinabe"],
  MM: ["myanmar", "burma", "burmese", "naypyidaw", "yangon"],
  BI: ["burundi", "bujumbura", "burundian"],
  KH: ["cambodia", "phnom penh", "cambodian"],
  CM: ["cameroon", "yaoundé", "cameroonian"],
  CA: ["canada", "ottawa", "canadian", "toronto"],
  CF: ["central african republic", "bangui"],
  TD: ["chad", "n'djamena", "chadian"],
  CL: ["chile", "santiago", "chilean"],
  CN: ["china", "beijing", "chinese", "prc", "shanghai", "xi jinping"],
  CO: ["colombia", "bogotá", "colombian", "farc"],
  CD: ["congo", "kinshasa", "congolese", "drc", "dr congo", "m23"],
  CG: ["congo republic", "brazzaville"],
  CR: ["costa rica", "san josé"],
  CI: ["ivory coast", "côte d'ivoire", "abidjan"],
  HR: ["croatia", "zagreb", "croatian"],
  CU: ["cuba", "havana", "cuban"],
  CY: ["cyprus", "nicosia", "cypriot"],
  CZ: ["czech republic", "czechia", "prague"],
  DK: ["denmark", "copenhagen", "danish"],
  DJ: ["djibouti"],
  DO: ["dominican republic", "santo domingo"],
  EC: ["ecuador", "quito", "ecuadorian"],
  EG: ["egypt", "cairo", "egyptian", "sinai"],
  SV: ["el salvador", "san salvador", "salvadoran"],
  GQ: ["equatorial guinea", "malabo"],
  ER: ["eritrea", "asmara", "eritrean"],
  EE: ["estonia", "tallinn", "estonian"],
  SZ: ["eswatini", "swaziland"],
  ET: ["ethiopia", "addis ababa", "ethiopian", "tigray"],
  FI: ["finland", "helsinki", "finnish"],
  FR: ["france", "paris", "french", "macron"],
  GA: ["gabon", "libreville", "gabonese"],
  GM: ["gambia", "banjul"],
  GE: ["georgia", "tbilisi", "georgian"],
  DE: ["germany", "berlin", "german", "bundeswehr"],
  GH: ["ghana", "accra", "ghanaian"],
  GR: ["greece", "athens", "greek"],
  GT: ["guatemala", "guatemala city"],
  GN: ["guinea", "conakry", "guinean"],
  GW: ["guinea-bissau", "bissau"],
  GY: ["guyana", "georgetown"],
  HT: ["haiti", "port-au-prince", "haitian"],
  HN: ["honduras", "tegucigalpa"],
  HU: ["hungary", "budapest", "hungarian"],
  IS: ["iceland", "reykjavik"],
  IN: ["india", "delhi", "indian", "modi", "mumbai", "kashmir"],
  ID: ["indonesia", "jakarta", "indonesian"],
  IR: ["iran", "tehran", "iranian", "irgc", "persian"],
  IQ: ["iraq", "baghdad", "iraqi", "kurdistan"],
  IE: ["ireland", "dublin", "irish"],
  IL: ["israel", "jerusalem", "tel aviv", "israeli", "idf", "netanyahu", "gaza", "west bank"],
  IT: ["italy", "rome", "italian"],
  JM: ["jamaica", "kingston"],
  JP: ["japan", "tokyo", "japanese"],
  JO: ["jordan", "amman", "jordanian"],
  KZ: ["kazakhstan", "astana", "kazakh"],
  KE: ["kenya", "nairobi", "kenyan"],
  KP: ["north korea", "pyongyang", "dprk", "kim jong"],
  KR: ["south korea", "seoul", "korean"],
  KW: ["kuwait", "kuwaiti"],
  KG: ["kyrgyzstan", "bishkek"],
  LA: ["laos", "vientiane"],
  LV: ["latvia", "riga", "latvian"],
  LB: ["lebanon", "beirut", "lebanese", "hezbollah"],
  LR: ["liberia", "monrovia"],
  LY: ["libya", "tripoli", "libyan", "benghazi"],
  LT: ["lithuania", "vilnius", "lithuanian"],
  MG: ["madagascar", "antananarivo"],
  MW: ["malawi", "lilongwe"],
  MY: ["malaysia", "kuala lumpur", "malaysian"],
  ML: ["mali", "bamako", "malian", "sahel"],
  MR: ["mauritania", "nouakchott"],
  MX: ["mexico", "mexico city", "mexican", "cartel"],
  MD: ["moldova", "chisinau", "moldovan", "transnistria"],
  MN: ["mongolia", "ulaanbaatar"],
  ME: ["montenegro", "podgorica"],
  MA: ["morocco", "rabat", "moroccan"],
  MZ: ["mozambique", "maputo", "mozambican"],
  NA: ["namibia", "windhoek"],
  NP: ["nepal", "kathmandu", "nepali"],
  NL: ["netherlands", "amsterdam", "dutch", "the hague"],
  NZ: ["new zealand", "wellington"],
  NI: ["nicaragua", "managua", "nicaraguan"],
  NE: ["niger", "niamey", "nigerien"],
  NG: ["nigeria", "abuja", "nigerian", "lagos", "boko haram"],
  NO: ["norway", "oslo", "norwegian"],
  OM: ["oman", "muscat", "omani"],
  PK: ["pakistan", "islamabad", "pakistani", "karachi", "balochistan"],
  PS: ["palestine", "palestinian", "west bank", "gaza strip", "hamas"],
  PA: ["panama", "panama city"],
  PG: ["papua new guinea", "port moresby"],
  PY: ["paraguay", "asunción"],
  PE: ["peru", "lima", "peruvian"],
  PH: ["philippines", "manila", "filipino", "philippine"],
  PL: ["poland", "warsaw", "polish"],
  PT: ["portugal", "lisbon", "portuguese"],
  QA: ["qatar", "doha", "qatari"],
  RO: ["romania", "bucharest", "romanian"],
  RU: ["russia", "moscow", "kremlin", "russian", "putin", "siberia"],
  RW: ["rwanda", "kigali", "rwandan"],
  SA: ["saudi arabia", "riyadh", "saudi", "mecca", "mbs"],
  SN: ["senegal", "dakar", "senegalese"],
  RS: ["serbia", "belgrade", "serbian", "kosovo"],
  SL: ["sierra leone", "freetown"],
  SG: ["singapore", "singaporean"],
  SK: ["slovakia", "bratislava", "slovak"],
  SI: ["slovenia", "ljubljana"],
  SO: ["somalia", "mogadishu", "somali", "al-shabaab"],
  ZA: ["south africa", "pretoria", "johannesburg", "south african"],
  SS: ["south sudan", "juba"],
  ES: ["spain", "madrid", "spanish"],
  LK: ["sri lanka", "colombo", "sri lankan"],
  SD: ["sudan", "khartoum", "sudanese", "darfur", "rsf"],
  SE: ["sweden", "stockholm", "swedish"],
  CH: ["switzerland", "bern", "swiss", "geneva"],
  SY: ["syria", "damascus", "syrian", "aleppo"],
  TW: ["taiwan", "taipei", "taiwanese"],
  TJ: ["tajikistan", "dushanbe"],
  TZ: ["tanzania", "dodoma", "dar es salaam"],
  TH: ["thailand", "bangkok", "thai"],
  TL: ["timor-leste", "east timor", "dili"],
  TG: ["togo", "lomé"],
  TN: ["tunisia", "tunis", "tunisian"],
  TR: ["turkey", "ankara", "turkish", "türkiye", "istanbul", "erdogan"],
  TM: ["turkmenistan", "ashgabat"],
  UG: ["uganda", "kampala", "ugandan"],
  UA: ["ukraine", "kyiv", "ukrainian", "zelensky", "donbas", "crimea"],
  AE: ["united arab emirates", "uae", "abu dhabi", "dubai", "emirati"],
  GB: ["united kingdom", "britain", "london", "british", "uk"],
  US: ["united states", "america", "usa", "washington", "pentagon", "white house"],
  UY: ["uruguay", "montevideo"],
  UZ: ["uzbekistan", "tashkent"],
  VE: ["venezuela", "caracas", "venezuelan", "maduro"],
  VN: ["vietnam", "hanoi", "vietnamese"],
  YE: ["yemen", "sanaa", "yemeni", "houthi", "aden"],
  ZM: ["zambia", "lusaka"],
  ZW: ["zimbabwe", "harare", "zimbabwean"],
};

export const COUNTRY_NAMES: Record<string, { name: string; flag: string }> = {
  AF: { name: "Afghanistan", flag: "🇦🇫" },
  AL: { name: "Albania", flag: "🇦🇱" },
  DZ: { name: "Algeria", flag: "🇩🇿" },
  AO: { name: "Angola", flag: "🇦🇴" },
  AR: { name: "Argentina", flag: "🇦🇷" },
  AM: { name: "Armenia", flag: "🇦🇲" },
  AU: { name: "Australia", flag: "🇦🇺" },
  AZ: { name: "Azerbaijan", flag: "🇦🇿" },
  BH: { name: "Bahrain", flag: "🇧🇭" },
  BD: { name: "Bangladesh", flag: "🇧🇩" },
  BY: { name: "Belarus", flag: "🇧🇾" },
  BE: { name: "Belgium", flag: "🇧🇪" },
  BJ: { name: "Benin", flag: "🇧🇯" },
  BO: { name: "Bolivia", flag: "🇧🇴" },
  BA: { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  BR: { name: "Brazil", flag: "🇧🇷" },
  BF: { name: "Burkina Faso", flag: "🇧🇫" },
  MM: { name: "Myanmar", flag: "🇲🇲" },
  BI: { name: "Burundi", flag: "🇧🇮" },
  KH: { name: "Cambodia", flag: "🇰🇭" },
  CM: { name: "Cameroon", flag: "🇨🇲" },
  CA: { name: "Canada", flag: "🇨🇦" },
  CF: { name: "Central African Republic", flag: "🇨🇫" },
  TD: { name: "Chad", flag: "🇹🇩" },
  CL: { name: "Chile", flag: "🇨🇱" },
  CN: { name: "China", flag: "🇨🇳" },
  CO: { name: "Colombia", flag: "🇨🇴" },
  CD: { name: "DR Congo", flag: "🇨🇩" },
  CG: { name: "Republic of the Congo", flag: "🇨🇬" },
  CR: { name: "Costa Rica", flag: "🇨🇷" },
  CI: { name: "Ivory Coast", flag: "🇨🇮" },
  HR: { name: "Croatia", flag: "🇭🇷" },
  CU: { name: "Cuba", flag: "🇨🇺" },
  CY: { name: "Cyprus", flag: "🇨🇾" },
  CZ: { name: "Czech Republic", flag: "🇨🇿" },
  DK: { name: "Denmark", flag: "🇩🇰" },
  DJ: { name: "Djibouti", flag: "🇩🇯" },
  DO: { name: "Dominican Republic", flag: "🇩🇴" },
  EC: { name: "Ecuador", flag: "🇪🇨" },
  EG: { name: "Egypt", flag: "🇪🇬" },
  SV: { name: "El Salvador", flag: "🇸🇻" },
  GQ: { name: "Equatorial Guinea", flag: "🇬🇶" },
  ER: { name: "Eritrea", flag: "🇪🇷" },
  EE: { name: "Estonia", flag: "🇪🇪" },
  SZ: { name: "Eswatini", flag: "🇸🇿" },
  ET: { name: "Ethiopia", flag: "🇪🇹" },
  FI: { name: "Finland", flag: "🇫🇮" },
  FR: { name: "France", flag: "🇫🇷" },
  GA: { name: "Gabon", flag: "🇬🇦" },
  GM: { name: "Gambia", flag: "🇬🇲" },
  GE: { name: "Georgia", flag: "🇬🇪" },
  DE: { name: "Germany", flag: "🇩🇪" },
  GH: { name: "Ghana", flag: "🇬🇭" },
  GR: { name: "Greece", flag: "🇬🇷" },
  GT: { name: "Guatemala", flag: "🇬🇹" },
  GN: { name: "Guinea", flag: "🇬🇳" },
  GW: { name: "Guinea-Bissau", flag: "🇬🇼" },
  GY: { name: "Guyana", flag: "🇬🇾" },
  HT: { name: "Haiti", flag: "🇭🇹" },
  HN: { name: "Honduras", flag: "🇭🇳" },
  HU: { name: "Hungary", flag: "🇭🇺" },
  IS: { name: "Iceland", flag: "🇮🇸" },
  IN: { name: "India", flag: "🇮🇳" },
  ID: { name: "Indonesia", flag: "🇮🇩" },
  IR: { name: "Iran", flag: "🇮🇷" },
  IQ: { name: "Iraq", flag: "🇮🇶" },
  IE: { name: "Ireland", flag: "🇮🇪" },
  IL: { name: "Israel", flag: "🇮🇱" },
  IT: { name: "Italy", flag: "🇮🇹" },
  JM: { name: "Jamaica", flag: "🇯🇲" },
  JP: { name: "Japan", flag: "🇯🇵" },
  JO: { name: "Jordan", flag: "🇯🇴" },
  KZ: { name: "Kazakhstan", flag: "🇰🇿" },
  KE: { name: "Kenya", flag: "🇰🇪" },
  KP: { name: "North Korea", flag: "🇰🇵" },
  KR: { name: "South Korea", flag: "🇰🇷" },
  KW: { name: "Kuwait", flag: "🇰🇼" },
  KG: { name: "Kyrgyzstan", flag: "🇰🇬" },
  LA: { name: "Laos", flag: "🇱🇦" },
  LV: { name: "Latvia", flag: "🇱🇻" },
  LB: { name: "Lebanon", flag: "🇱🇧" },
  LR: { name: "Liberia", flag: "🇱🇷" },
  LY: { name: "Libya", flag: "🇱🇾" },
  LT: { name: "Lithuania", flag: "🇱🇹" },
  MG: { name: "Madagascar", flag: "🇲🇬" },
  MW: { name: "Malawi", flag: "🇲🇼" },
  MY: { name: "Malaysia", flag: "🇲🇾" },
  ML: { name: "Mali", flag: "🇲🇱" },
  MR: { name: "Mauritania", flag: "🇲🇷" },
  MX: { name: "Mexico", flag: "🇲🇽" },
  MD: { name: "Moldova", flag: "🇲🇩" },
  MN: { name: "Mongolia", flag: "🇲🇳" },
  ME: { name: "Montenegro", flag: "🇲🇪" },
  MA: { name: "Morocco", flag: "🇲🇦" },
  MZ: { name: "Mozambique", flag: "🇲🇿" },
  NA: { name: "Namibia", flag: "🇳🇦" },
  NP: { name: "Nepal", flag: "🇳🇵" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  NZ: { name: "New Zealand", flag: "🇳🇿" },
  NI: { name: "Nicaragua", flag: "🇳🇮" },
  NE: { name: "Niger", flag: "🇳🇪" },
  NG: { name: "Nigeria", flag: "🇳🇬" },
  NO: { name: "Norway", flag: "🇳🇴" },
  OM: { name: "Oman", flag: "🇴🇲" },
  PK: { name: "Pakistan", flag: "🇵🇰" },
  PS: { name: "Palestine", flag: "🇵🇸" },
  PA: { name: "Panama", flag: "🇵🇦" },
  PG: { name: "Papua New Guinea", flag: "🇵🇬" },
  PY: { name: "Paraguay", flag: "🇵🇾" },
  PE: { name: "Peru", flag: "🇵🇪" },
  PH: { name: "Philippines", flag: "🇵🇭" },
  PL: { name: "Poland", flag: "🇵🇱" },
  PT: { name: "Portugal", flag: "🇵🇹" },
  QA: { name: "Qatar", flag: "🇶🇦" },
  RO: { name: "Romania", flag: "🇷🇴" },
  RU: { name: "Russia", flag: "🇷🇺" },
  RW: { name: "Rwanda", flag: "🇷🇼" },
  SA: { name: "Saudi Arabia", flag: "🇸🇦" },
  SN: { name: "Senegal", flag: "🇸🇳" },
  RS: { name: "Serbia", flag: "🇷🇸" },
  SL: { name: "Sierra Leone", flag: "🇸🇱" },
  SG: { name: "Singapore", flag: "🇸🇬" },
  SK: { name: "Slovakia", flag: "🇸🇰" },
  SI: { name: "Slovenia", flag: "🇸🇮" },
  SO: { name: "Somalia", flag: "🇸🇴" },
  ZA: { name: "South Africa", flag: "🇿🇦" },
  SS: { name: "South Sudan", flag: "🇸🇸" },
  ES: { name: "Spain", flag: "🇪🇸" },
  LK: { name: "Sri Lanka", flag: "🇱🇰" },
  SD: { name: "Sudan", flag: "🇸🇩" },
  SE: { name: "Sweden", flag: "🇸🇪" },
  CH: { name: "Switzerland", flag: "🇨🇭" },
  SY: { name: "Syria", flag: "🇸🇾" },
  TW: { name: "Taiwan", flag: "🇹🇼" },
  TJ: { name: "Tajikistan", flag: "🇹🇯" },
  TZ: { name: "Tanzania", flag: "🇹🇿" },
  TH: { name: "Thailand", flag: "🇹🇭" },
  TL: { name: "Timor-Leste", flag: "🇹🇱" },
  TG: { name: "Togo", flag: "🇹🇬" },
  TN: { name: "Tunisia", flag: "🇹🇳" },
  TR: { name: "Turkey", flag: "🇹🇷" },
  TM: { name: "Turkmenistan", flag: "🇹🇲" },
  UG: { name: "Uganda", flag: "🇺🇬" },
  UA: { name: "Ukraine", flag: "🇺🇦" },
  AE: { name: "United Arab Emirates", flag: "🇦🇪" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  US: { name: "United States", flag: "🇺🇸" },
  UY: { name: "Uruguay", flag: "🇺🇾" },
  UZ: { name: "Uzbekistan", flag: "🇺🇿" },
  VE: { name: "Venezuela", flag: "🇻🇪" },
  VN: { name: "Vietnam", flag: "🇻🇳" },
  YE: { name: "Yemen", flag: "🇾🇪" },
  ZM: { name: "Zambia", flag: "🇿🇲" },
  ZW: { name: "Zimbabwe", flag: "🇿🇼" },
};

// ---------------------------------------------------------------------------
// Headline → country code matching
// ---------------------------------------------------------------------------
export function getCountryFromHeadline(headline: string): string | null {
  const lower = headline.toLowerCase();
  for (const [code, aliases] of Object.entries(COUNTRY_ALIASES)) {
    for (const alias of aliases) {
      if (lower.includes(alias)) return code;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Severity weights for scoring
// ---------------------------------------------------------------------------
const SEVERITY_WEIGHT: Record<string, number> = {
  CRITICAL: 8,
  HIGH: 5,
  MEDIUM: 2,
  LOW: 1,
};

// ---------------------------------------------------------------------------
// CII Computation — fully live, data-driven
// ---------------------------------------------------------------------------
export interface CIIBreakdown {
  conflictIntensity: number;
  eventDensity: number;
  unrestScore: number;
  newsVelocity: number;
}

export async function computeCII(countryCode: string): Promise<{
  score: number;
  breakdown: CIIBreakdown;
}> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // ---- 1. Fetch events directly by countryCode on the event itself ----
  const directEvents = await prisma.conflictEvent.findMany({
    where: {
      countryCode,
      date: { gte: sevenDaysAgo },
    },
    select: { severity: true, eventType: true, date: true },
  });

  // ---- 2. Fetch events via zone linkage (for seeded zones) ----
  const zoneEvents = await prisma.conflictEvent.findMany({
    where: {
      zone: { countryCode },
      countryCode: null,
      date: { gte: sevenDaysAgo },
    },
    select: { severity: true, eventType: true, date: true },
  });

  const allEvents = [...directEvents, ...zoneEvents];

  // ---- 3. Categorise & weight events ----
  let conflictWeighted = 0;
  let protestWeighted = 0;
  let militaryWeighted = 0;
  let disasterWeighted = 0;
  let totalWeighted = 0;

  // Match actual Prisma EventType enum values
  const CONFLICT_TYPES = new Set(["CONFLICT"]);
  const PROTEST_TYPES = new Set(["PROTEST"]);
  const MILITARY_TYPES = new Set(["MILITARY"]);
  const DISASTER_TYPES = new Set(["DISASTER"]);

  for (const ev of allEvents) {
    const w = SEVERITY_WEIGHT[ev.severity] ?? 1;

    // Apply recency boost: events in the last 7 days count 1.5×
    const recencyMul = ev.date >= sevenDaysAgo ? 1.5 : 1.0;
    const weighted = w * recencyMul;

    totalWeighted += weighted;

    if (CONFLICT_TYPES.has(ev.eventType)) conflictWeighted += weighted;
    else if (PROTEST_TYPES.has(ev.eventType)) protestWeighted += weighted;
    else if (MILITARY_TYPES.has(ev.eventType)) militaryWeighted += weighted;
    else if (DISASTER_TYPES.has(ev.eventType)) disasterWeighted += weighted;
    else conflictWeighted += weighted; // default bucket
  }

  // ---- 4. Compute component scores (0-100) ----

  // Conflict Intensity: weighted conflict + military events, scaled
  const conflictIntensity = Math.min(100, Math.round(
    ((conflictWeighted + militaryWeighted) / 15) * 100
  ));

  // Event Density: total weighted events per day, scaled so >0.5/day = 100
  const daysInWindow = 7;
  const eventsPerDay = totalWeighted / daysInWindow;
  const eventDensity = Math.min(100, Math.round((eventsPerDay / 0.5) * 100));

  // Unrest Score: weighted protest events, scaled
  const unrestScore = Math.min(100, Math.round(
    (protestWeighted / 8) * 100
  ));

  // ---- 5. News Velocity ----
  const aliases = COUNTRY_ALIASES[countryCode] || [countryCode.toLowerCase()];
  const newsItems = await prisma.newsFeedItem.count({
    where: {
      publishedAt: { gte: sevenDaysAgo },
      OR: aliases.map((alias) => ({
        title: { contains: alias, mode: "insensitive" as const },
      })),
    },
  });
  const newsVelocity = Math.min(100, Math.round(newsItems * 2.0));

  // ---- 6. Composite CII score ----
  // Weighted blend:
  //   Conflict Intensity  35% — direct violence/security
  //   Event Density       25% — raw volume of incidents
  //   Unrest Score        15% — civil unrest / protests
  //   News Velocity       25% — media attention as instability proxy
  const score = Math.round(
    conflictIntensity * 0.35 +
    eventDensity * 0.25 +
    unrestScore * 0.15 +
    newsVelocity * 0.25
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      conflictIntensity,
      eventDensity,
      unrestScore,
      newsVelocity,
    },
  };
}

// ---------------------------------------------------------------------------
// Compute CII for all tracked countries
// ---------------------------------------------------------------------------
export async function computeAllCII(): Promise<
  Record<string, { score: number; breakdown: CIIBreakdown }>
> {
  // Collect every country that has data: zone countries + event countries
  const zoneCountries = await prisma.conflictZone.findMany({
    where: { countryCode: { not: null } },
    select: { countryCode: true },
    distinct: ["countryCode"],
  });

  const eventCountries = await prisma.conflictEvent.findMany({
    where: { countryCode: { not: null } },
    select: { countryCode: true },
    distinct: ["countryCode"],
  });

  const codes = new Set<string>();
  for (const z of zoneCountries) if (z.countryCode) codes.add(z.countryCode);
  for (const e of eventCountries) if (e.countryCode) codes.add(e.countryCode);
  // Also include all alias keys so countries with only news coverage get scored
  for (const code of Object.keys(COUNTRY_ALIASES)) codes.add(code);

  const results: Record<string, { score: number; breakdown: CIIBreakdown }> = {};

  // Process in batches of 20 to avoid overwhelming the DB
  const codeArr = Array.from(codes);
  const BATCH = 20;
  for (let i = 0; i < codeArr.length; i += BATCH) {
    const batch = codeArr.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (code) => {
        results[code] = await computeCII(code);
      })
    );
  }

  return results;
}
