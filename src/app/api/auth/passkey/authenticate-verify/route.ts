import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import {
  getRpID,
  getOrigin,
  getAndDeleteChallenge,
  createPasskeyAuthToken,
} from "@/lib/webauthn";

export async function POST(req: Request) {
  const body = await req.json();
  const { response, challengeKey } = body;

  const entry = getAndDeleteChallenge(challengeKey);
  if (!entry) {
    return NextResponse.json(
      { error: "Challenge expired" },
      { status: 400 }
    );
  }

  const credentialID = response.id;
  const authenticator = await prisma.authenticator.findUnique({
    where: { credentialID },
    include: { user: true },
  });

  if (!authenticator) {
    return NextResponse.json(
      { error: "Passkey not recognized" },
      { status: 400 }
    );
  }

  const rpID = getRpID();
  const origin = getOrigin();

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: entry.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: authenticator.credentialID,
        publicKey: new Uint8Array(
          Buffer.from(authenticator.credentialPublicKey, "base64url")
        ),
        counter: authenticator.counter,
        transports: authenticator.transports
          ? (authenticator.transports.split(",") as any[])
          : undefined,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (!verification.verified) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 400 }
    );
  }

  await prisma.authenticator.update({
    where: { credentialID },
    data: { counter: verification.authenticationInfo.newCounter },
  });

  const token = createPasskeyAuthToken(authenticator.userId);
  return NextResponse.json({ verified: true, passkeyToken: token });
}
