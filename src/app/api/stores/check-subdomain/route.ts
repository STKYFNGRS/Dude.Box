import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidSubdomain, isReservedSubdomain } from "@/lib/marketplace";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain required" }, { status: 400 });
    }

    // Check if valid format
    if (!isValidSubdomain(subdomain)) {
      return NextResponse.json({ available: false, reason: "invalid_format" });
    }

    // Check if reserved
    if (isReservedSubdomain(subdomain)) {
      return NextResponse.json({ available: false, reason: "reserved" });
    }

    // Check if already taken
    const existing = await prisma.store.findUnique({
      where: { subdomain },
    });

    if (existing) {
      return NextResponse.json({ available: false, reason: "taken" });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Error checking subdomain:", error);
    return NextResponse.json({ available: null, error: "Failed to check" }, { status: 500 });
  }
}
