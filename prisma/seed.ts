import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = [
    {
      name: "News",
      slug: "news",
      description: "AI-curated global news, conflict tracking, and live coverage from around the world",
      icon: "newspaper",
      sortOrder: 1,
    },
    {
      name: "The Workshop",
      slug: "the-workshop",
      description: "Gaming, gear reviews, DIY builds, and hands-on projects",
      icon: "wrench",
      sortOrder: 2,
    },
    {
      name: "The Forge",
      slug: "the-forge",
      description: "Tactical thinking, military history, philosophy, religion, and strategy",
      icon: "flame",
      sortOrder: 3,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log("✅ Categories seeded");

  // Seed admin user
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@dude.box" },
    update: {},
    create: {
      email: "admin@dude.box",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Admin user seeded (admin@dude.box / Admin123!)");

  // Seed default news sources
  const defenseCategory = await prisma.category.findUnique({
    where: { slug: "news" },
  });

  const newsSources = [
    // Defense & Military
    { name: "Defense One", url: "https://www.defenseone.com", feedUrl: "https://www.defenseone.com/rss/" },
    { name: "Breaking Defense", url: "https://breakingdefense.com", feedUrl: "https://breakingdefense.com/feed/" },
    { name: "The War Zone", url: "https://www.twz.com", feedUrl: "https://www.twz.com/feed" },
    { name: "Military Times", url: "https://www.militarytimes.com", feedUrl: "https://www.militarytimes.com/arc/outboundfeeds/rss/" },
    // Global News
    { name: "Reuters World", url: "https://www.reuters.com", feedUrl: "https://www.reutersagency.com/feed/" },
    { name: "AP News", url: "https://apnews.com", feedUrl: "https://rsshub.app/apnews/topics/world-news" },
    { name: "BBC World News", url: "https://www.bbc.com/news/world", feedUrl: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "Al Jazeera", url: "https://www.aljazeera.com", feedUrl: "https://www.aljazeera.com/xml/rss/all.xml" },
    // Latin America
    { name: "Reuters Latin America", url: "https://www.reuters.com", feedUrl: "https://rsshub.app/reuters/world/americas" },
    // Asia
    { name: "South China Morning Post", url: "https://www.scmp.com", feedUrl: "https://www.scmp.com/rss/91/feed" },
    { name: "Nikkei Asia", url: "https://asia.nikkei.com", feedUrl: "https://asia.nikkei.com/rss" },
    // Europe
    { name: "Euronews", url: "https://www.euronews.com", feedUrl: "https://www.euronews.com/rss" },
    // Africa
    { name: "Africa News", url: "https://www.africanews.com", feedUrl: "https://www.africanews.com/feed/" },
    // Economics & Politics
    { name: "Foreign Policy", url: "https://foreignpolicy.com", feedUrl: "https://foreignpolicy.com/feed/" },
    { name: "The Economist World", url: "https://www.economist.com", feedUrl: "https://www.economist.com/international/rss.xml" },
    // US Politics & General
    { name: "The Hill", url: "https://thehill.com", feedUrl: "https://thehill.com/feed/" },
    { name: "Washington Post", url: "https://www.washingtonpost.com", feedUrl: "https://feeds.washingtonpost.com/rss/world" },
    { name: "New York Times", url: "https://www.nytimes.com", feedUrl: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml" },
    { name: "CNN", url: "https://www.cnn.com", feedUrl: "http://rss.cnn.com/rss/edition_world.rss" },
    { name: "Fox News", url: "https://www.foxnews.com", feedUrl: "https://moxie.foxnews.com/google-publisher/world.xml" },
    { name: "NPR News", url: "https://www.npr.org", feedUrl: "https://feeds.npr.org/1004/rss.xml" },
    { name: "USA Today", url: "https://www.usatoday.com", feedUrl: "http://rssfeeds.usatoday.com/UsatodaycomWorld-TopStories" },
    { name: "Politico", url: "https://www.politico.com", feedUrl: "https://rss.politico.com/politics-news.xml" },
    // International
    { name: "The Guardian World", url: "https://www.theguardian.com/world", feedUrl: "https://www.theguardian.com/world/rss" },
  ];

  for (const source of newsSources) {
    await prisma.newsSource.upsert({
      where: { feedUrl: source.feedUrl },
      update: { name: source.name, url: source.url },
      create: {
        ...source,
        categoryId: defenseCategory?.id,
      },
    });
  }

  console.log("✅ News sources seeded");

  // Seed sample conflict zones
  const conflictZones = [
    // CRITICAL conflicts
    { name: "Ukraine-Russia Front", lat: 48.3794, lng: 31.1656, region: "Europe", countryCode: "UA", severity: "CRITICAL" as const, conflictType: "WAR" as const, baselineRisk: 92 },
    { name: "Gaza Strip", lat: 31.3547, lng: 34.3088, region: "MENA", countryCode: "PS", severity: "CRITICAL" as const, conflictType: "WAR" as const, baselineRisk: 95 },
    { name: "Israel-Lebanon Border", lat: 33.1, lng: 35.5, region: "MENA", countryCode: "LB", severity: "CRITICAL" as const, conflictType: "WAR" as const, baselineRisk: 88 },
    { name: "Sudan Civil War", lat: 15.5007, lng: 32.5599, region: "Africa", countryCode: "SD", severity: "CRITICAL" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 90 },
    { name: "Iran-US Tensions", lat: 32.4279, lng: 53.688, region: "MENA", countryCode: "IR", severity: "CRITICAL" as const, conflictType: "WAR" as const, baselineRisk: 85 },
    // HIGH conflicts
    { name: "Yemen Civil War", lat: 15.3694, lng: 44.191, region: "MENA", countryCode: "YE", severity: "HIGH" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 80 },
    { name: "Myanmar Civil War", lat: 19.7633, lng: 96.0785, region: "Asia-Pacific", countryCode: "MM", severity: "HIGH" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 78 },
    { name: "Syria Instability", lat: 34.8021, lng: 38.9968, region: "MENA", countryCode: "SY", severity: "HIGH" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 75 },
    { name: "Iraq Insurgency", lat: 33.3152, lng: 44.3661, region: "MENA", countryCode: "IQ", severity: "HIGH" as const, conflictType: "INSURGENCY" as const, baselineRisk: 65 },
    { name: "Somalia - Al-Shabaab", lat: 2.0469, lng: 45.3182, region: "Africa", countryCode: "SO", severity: "HIGH" as const, conflictType: "INSURGENCY" as const, baselineRisk: 72 },
    { name: "DR Congo - M23", lat: -1.6596, lng: 29.2194, region: "Africa", countryCode: "CD", severity: "HIGH" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 70 },
    { name: "Sahel Insurgency", lat: 14.4974, lng: -2.1278, region: "Africa", countryCode: "ML", severity: "HIGH" as const, conflictType: "INSURGENCY" as const, baselineRisk: 68 },
    { name: "Taiwan Strait", lat: 24.0, lng: 120.5, region: "Asia-Pacific", countryCode: "TW", severity: "HIGH" as const, conflictType: "TERRITORIAL" as const, baselineRisk: 62 },
    { name: "Korean DMZ", lat: 38.0, lng: 127.0, region: "Asia-Pacific", countryCode: "KP", severity: "HIGH" as const, conflictType: "TERRITORIAL" as const, baselineRisk: 58 },
    { name: "Haiti Gang Crisis", lat: 18.5944, lng: -72.3074, region: "Americas", countryCode: "HT", severity: "HIGH" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 65 },
    { name: "Burkina Faso Insurgency", lat: 12.3714, lng: -1.5197, region: "Africa", countryCode: "BF", severity: "HIGH" as const, conflictType: "INSURGENCY" as const, baselineRisk: 67 },
    // MEDIUM conflicts
    { name: "South China Sea", lat: 12.0, lng: 114.0, region: "Asia-Pacific", countryCode: "CN", severity: "MEDIUM" as const, conflictType: "TERRITORIAL" as const, baselineRisk: 45 },
    { name: "Ethiopia Tensions", lat: 9.145, lng: 40.4897, region: "Africa", countryCode: "ET", severity: "MEDIUM" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 48 },
    { name: "Pakistan - Balochistan", lat: 28.4907, lng: 65.0958, region: "South Asia", countryCode: "PK", severity: "MEDIUM" as const, conflictType: "INSURGENCY" as const, baselineRisk: 50 },
    { name: "Libya Instability", lat: 26.3351, lng: 17.2283, region: "Africa", countryCode: "LY", severity: "MEDIUM" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 52 },
    { name: "Colombia Remnant Groups", lat: 4.5709, lng: -74.2973, region: "Americas", countryCode: "CO", severity: "MEDIUM" as const, conflictType: "INSURGENCY" as const, baselineRisk: 40 },
    { name: "Nagorno-Karabakh", lat: 39.8, lng: 46.75, region: "Europe", countryCode: "AZ", severity: "MEDIUM" as const, conflictType: "TERRITORIAL" as const, baselineRisk: 42 },
    { name: "Niger Instability", lat: 17.6078, lng: 8.0817, region: "Africa", countryCode: "NE", severity: "MEDIUM" as const, conflictType: "CIVIL_UNREST" as const, baselineRisk: 50 },
    { name: "Saudi Arabia - Houthi Attacks", lat: 24.7136, lng: 46.6753, region: "MENA", countryCode: "SA", severity: "MEDIUM" as const, conflictType: "WAR" as const, baselineRisk: 45 },
    { name: "Red Sea Shipping Crisis", lat: 13.0, lng: 42.5, region: "MENA", countryCode: "YE", severity: "HIGH" as const, conflictType: "WAR" as const, baselineRisk: 70 },
  ];

  for (const zone of conflictZones) {
    await prisma.conflictZone.upsert({
      where: { id: zone.name },
      update: {},
      create: {
        id: zone.name,
        ...zone,
        description: `Active ${zone.conflictType.toLowerCase().replace("_", " ")} zone`,
        status: "ACTIVE",
      },
    });
  }

  console.log("✅ Conflict zones seeded");

  // Seed conflict events
  const eventTypeMap: Record<string, "CONFLICT" | "PROTEST" | "DISASTER" | "MILITARY"> = {
    AIRSTRIKE: "MILITARY",
    CONFLICT: "CONFLICT",
    MILITARY_ACTION: "MILITARY",
    TERRORISM: "CONFLICT",
  };
  const conflictEvents = [
    { title: "Russian missile strikes on Kyiv infrastructure", lat: 50.4501, lng: 30.5234, severity: "CRITICAL" as const, eventType: "AIRSTRIKE", description: "Multiple cruise missile and drone strikes targeting energy infrastructure in the Ukrainian capital." },
    { title: "IDF ground operations in southern Gaza", lat: 31.25, lng: 34.28, severity: "CRITICAL" as const, eventType: "CONFLICT", description: "Continued Israeli military ground operations in Rafah and Khan Younis." },
    { title: "Hezbollah rocket barrage into northern Israel", lat: 32.95, lng: 35.5, severity: "CRITICAL" as const, eventType: "AIRSTRIKE", description: "Hezbollah launches largest barrage into northern Galilee region." },
    { title: "Israeli airstrikes on Beirut southern suburbs", lat: 33.85, lng: 35.5, severity: "CRITICAL" as const, eventType: "AIRSTRIKE", description: "IDF conducts targeted strikes on Hezbollah positions in Dahieh." },
    { title: "US-Iran naval confrontation in Strait of Hormuz", lat: 26.56, lng: 56.25, severity: "CRITICAL" as const, eventType: "MILITARY_ACTION", description: "US Navy and Iranian IRGC vessels in tense standoff near the strait." },
    { title: "Iranian ballistic missile launch", lat: 35.6892, lng: 51.389, severity: "CRITICAL" as const, eventType: "AIRSTRIKE", description: "Iran conducts retaliatory ballistic missile strikes." },
    { title: "RSF advance on El-Fasher, Sudan", lat: 13.6289, lng: 25.3493, severity: "CRITICAL" as const, eventType: "CONFLICT", description: "Rapid Support Forces push toward last government-held city in Darfur." },
    { title: "Houthi anti-ship missile hits cargo vessel in Red Sea", lat: 13.5, lng: 42.8, severity: "HIGH" as const, eventType: "AIRSTRIKE", description: "Commercial vessel struck by Houthi launched anti-ship ballistic missile." },
    { title: "ISIS attack on Iraqi military convoy", lat: 34.55, lng: 43.26, severity: "HIGH" as const, eventType: "CONFLICT", description: "Islamic State remnants ambush Iraqi army patrol near Mosul." },
    { title: "M23 rebels capture town in eastern DRC", lat: -1.5, lng: 29.0, severity: "HIGH" as const, eventType: "CONFLICT", description: "M23 forces seize control of strategic town in North Kivu province." },
    { title: "Myanmar resistance forces retake border town", lat: 20.45, lng: 97.03, severity: "HIGH" as const, eventType: "CONFLICT", description: "PDF and ethnic alliance forces recapture Laukkai from junta." },
    { title: "Al-Shabaab car bombing in Mogadishu", lat: 2.0469, lng: 45.3182, severity: "HIGH" as const, eventType: "TERRORISM", description: "Vehicle-borne IED detonated near government building in Mogadishu." },
    { title: "JNIM attack on Burkina Faso military base", lat: 13.0, lng: -1.0, severity: "HIGH" as const, eventType: "TERRORISM", description: "Jihadist group overruns military outpost in northern Burkina Faso." },
    { title: "China conducts military exercises near Taiwan", lat: 23.5, lng: 119.5, severity: "HIGH" as const, eventType: "MILITARY_ACTION", description: "PLA conducts large-scale naval and air exercises in Taiwan Strait." },
    { title: "North Korea launches ballistic missiles", lat: 39.0, lng: 125.75, severity: "HIGH" as const, eventType: "MILITARY_ACTION", description: "DPRK fires multiple short-range ballistic missiles into the Sea of Japan." },
    { title: "Port-au-Prince gang battle", lat: 18.54, lng: -72.34, severity: "HIGH" as const, eventType: "CONFLICT", description: "Armed gangs battle for control of strategic neighborhoods in the capital." },
    { title: "Pakistan counter-terror operation in Balochistan", lat: 29.0, lng: 66.0, severity: "MEDIUM" as const, eventType: "MILITARY_ACTION", description: "Pakistani military launches operation against separatist militants." },
    { title: "Syrian airstrikes on rebel positions in Idlib", lat: 35.93, lng: 36.63, severity: "MEDIUM" as const, eventType: "AIRSTRIKE", description: "Syrian and Russian forces strike opposition-held areas." },
    { title: "Saudi air defenses intercept Houthi drone", lat: 24.47, lng: 39.61, severity: "MEDIUM" as const, eventType: "AIRSTRIKE", description: "Patriot batteries intercept Houthi UAV targeting Riyadh area." },
    { title: "Ethiopian military operations in Amhara region", lat: 11.6, lng: 37.4, severity: "MEDIUM" as const, eventType: "CONFLICT", description: "Government forces clash with Fano militia in contested regions." },
    { title: "Libya rival government clashes in Tripoli", lat: 32.9, lng: 13.18, severity: "MEDIUM" as const, eventType: "CONFLICT", description: "Armed factions exchange fire in southern Tripoli neighborhoods." },
    { title: "Colombian military strikes FARC dissidents", lat: 2.5, lng: -72.5, severity: "MEDIUM" as const, eventType: "MILITARY_ACTION", description: "Armed forces conduct operations against FARC-EP remnants." },
  ];

  for (const event of conflictEvents) {
    const existing = await prisma.conflictEvent.findFirst({
      where: { title: event.title },
    });
    if (!existing) {
      await prisma.conflictEvent.create({
        data: {
          title: event.title,
          description: event.description,
          lat: event.lat,
          lng: event.lng,
          severity: event.severity,
          eventType: eventTypeMap[event.eventType] ?? "CONFLICT",
          date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        },
      });
    }
  }

  console.log("✅ Conflict events seeded");

  // Seed data layer sources
  const dataSources = [
    { name: "ACLED", apiUrl: "https://api.acleddata.com/acled/read", type: "ACLED" as const, fetchIntervalMinutes: 60 },
    { name: "USGS Earthquakes", apiUrl: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", type: "USGS" as const, fetchIntervalMinutes: 30 },
    { name: "NASA FIRMS", apiUrl: "https://firms.modaps.eosdis.nasa.gov/api/area/csv/", type: "FIRMS" as const, fetchIntervalMinutes: 60 },
    { name: "GDELT", apiUrl: "http://api.gdeltproject.org/api/v2/geo/geo", type: "GDELT" as const, fetchIntervalMinutes: 30 },
  ];

  for (const ds of dataSources) {
    await prisma.dataLayerSource.upsert({
      where: { id: ds.name },
      update: {},
      create: ds,
    });
  }

  console.log("✅ Data layer sources seeded");

  // Seed channels for The Conversation
  const channels = [
    { name: "General", slug: "general", description: "Open discussion for the community", icon: "hash", sortOrder: 1 },
    { name: "News Discussion", slug: "news-discussion", description: "Discuss breaking news and current events", icon: "newspaper", sortOrder: 2 },
    { name: "Conflicts", slug: "conflicts", description: "Analysis and discussion of global conflicts", icon: "alert-triangle", sortOrder: 3 },
    { name: "Gaming", slug: "gaming", description: "Tactical shooters, mil-sim, strategy, and gaming talk", icon: "gamepad-2", sortOrder: 4 },
    { name: "Gear & DIY", slug: "gear-and-diy", description: "Equipment reviews, builds, and project sharing", icon: "wrench", sortOrder: 5 },
    { name: "The Forge", slug: "the-forge", description: "History, philosophy, tactics, and deeper discussions", icon: "flame", sortOrder: 6 },
    { name: "Off Topic", slug: "off-topic", description: "Anything goes — just keep it civil", icon: "message-circle", sortOrder: 7 },
  ];

  for (const ch of channels) {
    await prisma.channel.upsert({
      where: { slug: ch.slug },
      update: { description: ch.description, icon: ch.icon, sortOrder: ch.sortOrder },
      create: ch,
    });
  }

  console.log("✅ Channels seeded");
  console.log("\n🎯 Seed complete! You can now log in as admin@dude.box / Admin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
