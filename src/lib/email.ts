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

/**
 * Send return request confirmation email to customer
 */
export async function sendReturnRequestConfirmation({
  to,
  customerName,
  returnId,
  orderNumber,
}: {
  to: string;
  customerName: string;
  returnId: string;
  orderNumber: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Return Request Received - Order #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Return Request Received</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${customerName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                We've received your return request for order #${orderNumber}. Our team will review your request and get back to you within 24-48 hours.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">What Happens Next?</h2>
                <ul style="padding-left: 20px; color: #cbd5e1;">
                  <li style="margin: 10px 0;">We'll review your return request</li>
                  <li style="margin: 10px 0;">If approved, you'll receive a prepaid shipping label via email</li>
                  <li style="margin: 10px 0;">Once we receive your return, we'll process your refund</li>
                  <li style="margin: 10px 0;">Refunds typically appear within 5-10 business days</li>
                </ul>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Return Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Return ID:</strong> #${returnId.slice(-8)}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order:</strong> #${orderNumber}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/portal" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Return Status
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

    console.log(`✅ Return request confirmation email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send return request confirmation:", error);
    return { success: false, error };
  }
}

/**
 * Send return approved email with shipping label
 */
export async function sendReturnApprovedEmail({
  to,
  customerName,
  returnId,
  orderNumber,
  trackingNumber,
  labelUrl,
  carrier,
}: {
  to: string;
  customerName: string;
  returnId: string;
  orderNumber: string;
  trackingNumber: string;
  labelUrl: string;
  carrier: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Return Approved - Shipping Label Attached`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Return Approved!</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${customerName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Great news! Your return request for order #${orderNumber} has been approved. We've generated a prepaid shipping label for you.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Shipping Information</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Carrier:</strong> ${carrier}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Tracking Number:</strong> ${trackingNumber}</p>
                <div style="margin-top: 15px;">
                  <a href="${labelUrl}" 
                     style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                    Download Shipping Label
                  </a>
                </div>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Return Instructions</h2>
                <ol style="padding-left: 20px; color: #cbd5e1;">
                  <li style="margin: 10px 0;">Print the shipping label (click button above)</li>
                  <li style="margin: 10px 0;">Pack your item securely in its original packaging if possible</li>
                  <li style="margin: 10px 0;">Affix the shipping label to the outside of the package</li>
                  <li style="margin: 10px 0;">Drop off at any ${carrier} location or schedule a pickup</li>
                  <li style="margin: 10px 0;">Keep your tracking number for reference</li>
                </ol>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Refund Timeline</h2>
                <p style="color: #cbd5e1;">Once we receive your return, we'll inspect it and process your refund within 3-5 business days. The refund will appear on your original payment method within 5-10 business days after processing.</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/portal" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Track Return Status
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

    console.log(`✅ Return approved email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send return approved email:", error);
    return { success: false, error };
  }
}

/**
 * Send return rejected email
 */
export async function sendReturnRejectedEmail({
  to,
  customerName,
  returnId,
  orderNumber,
  reason,
}: {
  to: string;
  customerName: string;
  returnId: string;
  orderNumber: string;
  reason: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Return Request Update - Order #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Return Request Update</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${customerName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                We've reviewed your return request for order #${orderNumber}. Unfortunately, we're unable to approve this return at this time.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Reason</h2>
                <p style="color: #cbd5e1; white-space: pre-wrap;">${reason}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Have Questions?</h2>
                <p style="color: #cbd5e1;">If you have any questions about this decision or would like to discuss your return further, please don't hesitate to contact our support team. We're here to help!</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:dude@dude.box" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Contact Support
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

    console.log(`✅ Return rejected email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send return rejected email:", error);
    return { success: false, error };
  }
}

/**
 * Send refund confirmation email
 */
export async function sendRefundConfirmationEmail({
  to,
  customerName,
  returnId,
  orderNumber,
  refundAmount,
  stripeRefundId,
}: {
  to: string;
  customerName: string;
  returnId: string;
  orderNumber: string;
  refundAmount: string;
  stripeRefundId: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Refund Processed - $${refundAmount}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Refund Processed</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${customerName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Good news! We've processed your refund for order #${orderNumber}.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Refund Amount</h2>
                <div style="font-size: 48px; font-weight: 700; color: #10b981; margin: 20px 0;">
                  $${refundAmount}
                </div>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Refund Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order:</strong> #${orderNumber}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Return ID:</strong> #${returnId.slice(-8)}</p>
                <p style="margin: 8px 0; color: #cbd5e1; font-size: 12px;"><strong style="color: #e5e7eb;">Transaction ID:</strong> ${stripeRefundId}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">When Will I See the Refund?</h2>
                <p style="color: #cbd5e1;">Your refund has been issued to your original payment method. It typically takes 5-10 business days for the credit to appear on your statement, depending on your bank or card issuer.</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/portal" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Order History
                </a>
              </div>
              
              <p style="font-size: 14px; color: #94a3b8; margin-top: 30px; text-align: center;">
                Thank you for giving us the opportunity to serve you. We hope to see you again soon!
              </p>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid #334155; padding-top: 20px;">
                Questions? Contact us at dude@dude.box
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Refund confirmation email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send refund confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send vendor new order notification
 */
export async function sendVendorOrderNotification({
  to,
  storeName,
  storeSubdomain,
  orderId,
  customerName,
  orderTotal,
  vendorAmount,
  items,
}: {
  to: string;
  storeName: string;
  storeSubdomain: string;
  orderId: string;
  customerName: string;
  orderTotal: string;
  vendorAmount: string;
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
      from: `${storeName} <${storeSubdomain}@dude.box>`,
      to,
      subject: `New Order - ${storeName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">New Order Received!</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Great news! You have a new order from ${customerName}.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Order Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order ID:</strong> ${orderId}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Customer:</strong> ${customerName}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Order Total:</strong> $${orderTotal}</p>
                <p style="margin: 8px 0; color: #10b981; font-weight: 600;"><strong style="color: #e5e7eb;">Your Amount:</strong> $${vendorAmount} (after platform fee)</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Items Ordered</h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  ${itemsList}
                </ul>
              </div>
              
              <p style="font-size: 14px; color: #94a3b8; margin-top: 30px;">
                Please fulfill this order as soon as possible. Once shipped, mark it as shipped in your vendor dashboard.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/vendor/orders" 
                   style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Order Details
                </a>
              </div>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid #334155; padding-top: 20px;">
                Questions? Contact support at dude@dude.box
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log(`✅ Vendor order notification sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send vendor order notification:", error);
    return { success: false, error };
  }
}

/**
 * Send store approval email
 */
export async function sendStoreApproved({
  to,
  vendorName,
  storeName,
  subdomain,
}: {
  to: string;
  vendorName: string;
  storeName: string;
  subdomain: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${storeName} Approved - Welcome to Dude.Box!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Store Approved! 🎉</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${vendorName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Great news! Your store "${storeName}" has been approved and is now live on Dude.Box!
              </p>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #818cf8; font-weight: 600;">Your Store Details</h2>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Store Name:</strong> ${storeName}</p>
                <p style="margin: 8px 0; color: #cbd5e1;"><strong style="color: #e5e7eb;">Store URL:</strong> <a href="https://${subdomain}.dude.box" style="color: #6366f1;">https://${subdomain}.dude.box</a></p>
              </div>
              
              <div style="background: #10b981; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px; color: white; font-weight: 600;">Next Steps:</h3>
                <ol style="margin: 0; padding-left: 20px; color: white;">
                  <li style="margin-bottom: 10px;">Connect your Stripe account to receive payments</li>
                  <li style="margin-bottom: 10px;">Add your first products</li>
                  <li style="margin-bottom: 10px;">Share your store with customers!</li>
                </ol>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/vendor" 
                   style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 10px;">
                  Go to Vendor Dashboard
                </a>
                <a href="https://${subdomain}.dude.box" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  View Your Store
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

    console.log(`✅ Store approval email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send store approval email:", error);
    return { success: false, error };
  }
}

/**
 * Send store rejection email
 */
export async function sendStoreRejected({
  to,
  vendorName,
  storeName,
  reason,
}: {
  to: string;
  vendorName: string;
  storeName: string;
  reason: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Store Application Update - ${storeName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #e5e7eb; max-width: 600px; margin: 0 auto; padding: 0; background: #0f172a;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">Store Application Update</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Hey ${vendorName},
              </p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                Thank you for your interest in becoming a vendor on Dude.Box. After reviewing your store "${storeName}", we're unable to approve it at this time.
              </p>
              
              <div style="background: #0f172a; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0; font-size: 20px; color: #ef4444; font-weight: 600;">Reason</h2>
                <p style="color: #cbd5e1;">${reason}</p>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #e5e7eb;">
                If you believe this was a mistake or would like to discuss further, please don't hesitate to reach out to us.
              </p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:dude@dude.box" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  Contact Support
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

    console.log(`✅ Store rejection email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to send store rejection email:", error);
    return { success: false, error };
  }
}

/**
 * Send moderation alert to admin
 */
export async function sendModerationAlertEmail({
  type,
  severity,
  vendorEmail,
  storeName,
  contentName,
  reason,
  categories,
}: {
  type: "product" | "store";
  severity: "severe" | "moderate";
  vendorEmail: string;
  storeName: string;
  contentName: string;
  reason: string;
  categories: string[];
}) {
  const adminEmail = process.env.SUPPORT_EMAIL || "dude@dude.box";
  const severityColor = severity === "severe" ? "#ef4444" : "#f59e0b";
  const actionTaken = severity === "severe" ? "AUTOMATICALLY HIDDEN" : "FLAGGED FOR REVIEW";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `🚨 ${severity.toUpperCase()} Policy Violation Detected`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e5e7eb;">
            <div style="background: ${severityColor}; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Policy Violation Detected</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <div style="background: #0f172a; border: 2px solid ${severityColor}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: ${severityColor}; margin-top: 0;">Action Taken: ${actionTaken}</h2>
                <p style="color: #cbd5e1;"><strong>Type:</strong> ${type}</p>
                <p style="color: #cbd5e1;"><strong>Severity:</strong> ${severity}</p>
                <p style="color: #cbd5e1;"><strong>Store:</strong> ${storeName}</p>
                <p style="color: #cbd5e1;"><strong>Vendor:</strong> ${vendorEmail}</p>
                <p style="color: #cbd5e1;"><strong>Content:</strong> ${contentName}</p>
              </div>
              
              <div style="background: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px;">
                <h3 style="color: #818cf8;">Violation Details</h3>
                <p style="color: #cbd5e1;"><strong>Reason:</strong> ${reason}</p>
                <p style="color: #cbd5e1;"><strong>Categories:</strong> ${categories.join(", ")}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/admin/products" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                  Review in Admin Panel
                </a>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`✅ Moderation alert sent to admin`);
  } catch (error) {
    console.error("Failed to send moderation alert:", error);
  }
}

/**
 * Send content hidden notification to vendor
 */
export async function sendVendorContentHiddenEmail({
  to,
  vendorName,
  contentType,
  contentName,
  reason,
}: {
  to: string;
  vendorName: string;
  contentType: "product" | "store";
  contentName: string;
  reason: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Important: ${contentType === "product" ? "Product" : "Store Content"} Removed`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e5e7eb;">
            <div style="background: #ef4444; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Policy Violation Notice</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p>Hello ${vendorName},</p>
              
              <p>Your ${contentType} "${contentName}" has been automatically hidden due to a policy violation.</p>
              
              <div style="background: #0f172a; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ef4444; margin-top: 0;">Reason for Removal</h3>
                <p style="color: #cbd5e1;">${reason}</p>
              </div>
              
              <p>This content violates our <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/legal/vendor-terms" style="color: #6366f1;">Vendor Terms of Service</a>, specifically Section 6: Prohibited Products and Conduct.</p>
              
              <p style="color: #94a3b8; font-size: 14px;"><strong>What happens now?</strong></p>
              <ul style="color: #cbd5e1;">
                <li>This ${contentType} is hidden from public view</li>
                <li>You cannot reactivate it</li>
                <li>Repeated violations may result in store suspension</li>
              </ul>
              
              <p>If you believe this was a mistake, please contact our support team.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:dude@dude.box" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                  Contact Support
                </a>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`✅ Content hidden email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send content hidden email:", error);
  }
}

/**
 * Send content flagged notification to vendor (moderate violations)
 */
export async function sendVendorContentFlaggedEmail({
  to,
  vendorName,
  contentType,
  contentName,
  reason,
}: {
  to: string;
  vendorName: string;
  contentType: "product" | "store";
  contentName: string;
  reason: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Action Required: ${contentType === "product" ? "Product" : "Content"} Flagged for Review`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e5e7eb;">
            <div style="background: #f59e0b; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Content Flagged for Review</h1>
            </div>
            
            <div style="background: #1e293b; padding: 30px;">
              <p>Hello ${vendorName},</p>
              
              <p>Your ${contentType} "${contentName}" has been flagged for potential policy concerns.</p>
              
              <div style="background: #0f172a; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #f59e0b; margin-top: 0;">Reason for Flag</h3>
                <p style="color: #cbd5e1;">${reason}</p>
              </div>
              
              <p><strong>What this means:</strong></p>
              <ul style="color: #cbd5e1;">
                <li>Your ${contentType} is still visible for now</li>
                <li>Our team will review it within 24-48 hours</li>
                <li>You may be asked to make changes</li>
                <li>If unresolved, it may be hidden</li>
              </ul>
              
              <p>We recommend reviewing our <a href="${process.env.NEXT_PUBLIC_APP_DOMAIN || "https://www.dude.box"}/legal/vendor-terms" style="color: #6366f1;">Vendor Terms</a> to ensure compliance.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:dude@dude.box" 
                   style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px;">
                  Contact Support
                </a>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`✅ Content flagged email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send content flagged email:", error);
  }
}
