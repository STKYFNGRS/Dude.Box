import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRpID, rpName, storeChallenge } from "@/lib/webauthn";

export async function POST(req: Request) {
  const session = await auth();
  const rpID = getRpID();

  let userIdBytes: Uint8Array;
  let userName: string;
  let userDisplayName: string;
  let challengeKey: string;
  let email: string | undefined;
  let name: string | undefined;

  if (session?.user?.id) {
    userIdBytes = new TextEncoder().encode(session.user.id);
    userName = session.user.email || session.user.id;
    userDisplayName = session.user.name || "User";
    challengeKey = `session-${session.user.id}`;
  } else {
    const body = await req.json();
    email = body.email;
    name = body.name;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    userIdBytes = new TextEncoder().encode(email);
    userName = email;
    userDisplayName = name;
    challengeKey = `new-${email}`;
  }

  const existingAuthenticators = session?.user?.id
    ? await prisma.authenticator.findMany({
        where: { userId: session.user.id },
      })
    : [];

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userIdBytes as Uint8Array<ArrayBuffer>,
    userName,
    userDisplayName,
    attestationType: "none",
    excludeCredentials: existingAuthenticators.map((a) => ({
      id: a.credentialID,
      transports: a.transports
        ? (a.transports.split(",") as any[])
        : undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  storeChallenge(challengeKey, {
    challenge: options.challenge,
    expires: Date.now() + 5 * 60 * 1000,
    email,
    name,
  });

  return NextResponse.json({ options, challengeKey });
}
