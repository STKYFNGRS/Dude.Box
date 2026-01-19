import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  let payload: Record<string, string> = {};

  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const formData = await request.formData();
    payload = Object.fromEntries(formData.entries()) as Record<string, string>;
  }

  // TODO: Send payload to a secure email handler or CRM.
  return NextResponse.json({ ok: true, received: payload });
}
