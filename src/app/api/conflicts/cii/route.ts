import { NextResponse } from "next/server";
import { computeAllCII } from "@/lib/conflict-data";

export async function GET() {
  try {
    const scores = await computeAllCII();
    return NextResponse.json(scores);
  } catch (error) {
    console.error("Failed to compute CII scores:", error);
    return NextResponse.json(
      { error: "Failed to compute CII scores" },
      { status: 500 }
    );
  }
}
