import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { auth } from "@/lib/auth";
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
      { error: "Challenge expired or not found" },
      { status: 400 }
    );
  }

  const rpID = getRpID();
  const origin = getOrigin();

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: entry.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 400 }
    );
  }

  const { credential, credentialDeviceType, credentialBackedUp } =
    verification.registrationInfo;

  const session = await auth();
  let userId: string;

  if (session?.user?.id) {
    userId = session.user.id;
  } else if (entry.email && entry.name) {
    const user = await prisma.user.create({
      data: {
        email: entry.email,
        name: entry.name,
        emailVerified: new Date(),
      },
    });
    userId = user.id;
  } else {
    return NextResponse.json(
      { error: "Invalid registration state" },
      { status: 400 }
    );
  }

  const publicKeyBase64 = Buffer.from(credential.publicKey).toString(
    "base64url"
  );

  await prisma.authenticator.create({
    data: {
      credentialID: credential.id,
      userId,
      providerAccountId: credential.id,
      credentialPublicKey: publicKeyBase64,
      counter: credential.counter,
      credentialDeviceType: credentialDeviceType,
      credentialBackedUp: credentialBackedUp,
      transports: response.response?.transports?.join(",") ?? null,
    },
  });

  if (!session?.user?.id) {
    const token = createPasskeyAuthToken(userId);
    return NextResponse.json({ verified: true, passkeyToken: token });
  }

  return NextResponse.json({ verified: true });
}
