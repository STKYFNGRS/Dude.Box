import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    let payload: Record<string, string> = {};

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    }

    const { name, email, organization, phone, inquiryType, message } = payload;

    // Send email notification to admin
    await resend.emails.send({
      from: "Dude.Box Investors <investors@dude.box>",
      to: process.env.ADMIN_EMAIL || "support@dude.box",
      replyTo: email,
      subject: `[Investor Inquiry] ${inquiryType || "New"} - ${name}`,
      html: `
        <h2>New Investor Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${organization ? `<p><strong>Company/Fund:</strong> ${organization}</p>` : ""}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        ${message ? `<p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>` : ""}
        <hr/>
        <p><small>Submitted from dude.box/investors</small></p>
      `,
    });

    // Send confirmation to inquirer
    await resend.emails.send({
      from: "Dude.Box <support@dude.box>",
      to: email,
      subject: "Thank you for your inquiry - Dude.Box",
      html: `
        <h2>Thank you for your interest in Dude.Box</h2>
        <p>Hi ${name},</p>
        <p>We've received your ${inquiryType || "investor"} inquiry and will review it carefully. We respond to all serious inquiries within 48 hours.</p>
        <p>In the meantime, feel free to explore our platform at <a href="https://www.dude.box">dude.box</a> or browse our maker stores at <a href="https://www.dude.box/stores">dude.box/stores</a>.</p>
        <br/>
        <p>Best regards,<br/>The Dude.Box Team</p>
        <hr/>
        <p><small>This is an automated confirmation. Please do not reply to this email.</small></p>
      `,
    });

    return NextResponse.json({ ok: true, message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("Error processing investor inquiry:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
