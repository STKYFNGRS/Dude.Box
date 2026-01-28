import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@dude.box";
const COMPANY_NAME = "Dude.Box";

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation({
  to,
  customerName,
  orderId,
  orderTotal,
  orderDate,
  items,
}: {
  to: string;
  customerName: string;
  orderId: string;
  orderTotal: string;
  orderDate: string;
  items: Array<{ name: string; quantity: number; price: string }>;
}) {
  try {
    const itemsList = items
      .map(
        (item) =>
          `<li style="padding: 12px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
            <strong style="color: #e5e7eb;">${item.name}</strong> × ${item.quantity} - $${item.price}
          </li>`
      )
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmation - ${COMPANY_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Order Confirmed!</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${customerName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Thanks for your order! We've received your payment and we're getting your gear ready to ship.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Order Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order ID:</strong> ${orderId}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Date:</strong> ${orderDate}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Total:</strong> $${orderTotal}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Items Ordered</h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  ${itemsList}
                </ul>
              </div>
              
              <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
                You'll receive a shipping confirmation email with tracking information once your order ships.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/portal" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Order in Portal
                </a>
              </div>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid #334155; padding-top: 20px;">
                Questions? Contact us at dude@dude.box
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Order confirmation email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmation({
  to,
  customerName,
  subscriptionId,
  nextBillingDate,
  amount,
}: {
  to: string;
  customerName: string;
  subscriptionId: string;
  nextBillingDate: string;
  amount: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to ${COMPANY_NAME} - Subscription Active!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Welcome to the Crew! 🎉</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${customerName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Your subscription is now active! Get ready for your first drop of premium, veteran-owned gear.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Subscription Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Plan:</strong> Monthly Subscription Box</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Amount:</strong> $${amount}/month</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Next Billing:</strong> ${nextBillingDate}</p>
                <p style="margin: 8px 0; color: #cbd5e1; font-size: 12px;"><strong style="color: #e5e7eb;">Subscription ID:</strong> ${subscriptionId.substring(0, 20)}...</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">What's Next?</h2>
                <ul style="padding-left: 20px; color: #cbd5e1;">
                  <li style="margin: 10px 0;">Your first box will ship within 3-5 business days</li>
                  <li style="margin: 10px 0;">You'll receive a tracking number once it ships</li>
                  <li style="margin: 10px 0;">Cancel, pause, or skip anytime from your portal</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/portal" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Manage Subscription
                </a>
              </div>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid #334155; padding-top: 20px;">
                Questions? Contact us at dude@dude.box
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Subscription confirmation email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send subscription confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail({
  to,
  resetToken,
  customerId,
}: {
  to: string;
  resetToken: string;
  customerId: string;
}) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/portal/reset-password?token=${resetToken}&id=${customerId}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Reset Your ${COMPANY_NAME} Password`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Password Reset</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                We received a request to reset your password for your ${COMPANY_NAME} account.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
              
              <p style="font-size: 14px; color: #94a3b8; margin-top: 20px;">
                This link will expire in 1 hour for security reasons.
              </p>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #818cf8; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Password reset email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
}
