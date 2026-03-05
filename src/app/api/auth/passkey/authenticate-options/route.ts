import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { getRpID, storeChallenge } from "@/lib/webauthn";

export async function POST() {
  const rpID = getRpID();

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "preferred",
  });

  const challengeKey = `auth-${crypto.randomUUID()}`;
  storeChallenge(challengeKey, {
    challenge: options.challenge,
    expires: Date.now() + 5 * 60 * 1000,
  });

  return NextResponse.json({ options, challengeKey });
}
