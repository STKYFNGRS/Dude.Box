import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@dude.box";

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Verify your Dude.Box account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #e5e7eb; padding: 32px; border-radius: 8px;">
        <h1 style="color: #22c55e; margin-bottom: 16px;">Welcome to Dude.Box</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #22c55e; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">Verify Email</a>
        <p style="color: #9ca3af; font-size: 14px;">If you didn't create this account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendNewMessageNotification(
  email: string,
  senderName: string
) {
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `New message from ${senderName} on Dude.Box`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #e5e7eb; padding: 32px; border-radius: 8px;">
        <h2 style="color: #22c55e;">New Message</h2>
        <p>You have a new encrypted message from <strong>${senderName}</strong>.</p>
        <a href="${process.env.NEXTAUTH_URL}/messages" style="display: inline-block; background: #22c55e; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">Open Messages</a>
        <p style="color: #9ca3af; font-size: 14px;">Message content is end-to-end encrypted and cannot be previewed in email.</p>
      </div>
    `,
  });
}
