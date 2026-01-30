import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Container } from "@/components/Container";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login");
  }

  return (
    <Container className="py-12">
      <div className="max-w-2xl mx-auto">
        <div className="card rounded-lg p-12 text-center animate-fade-in">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 border-2 border-success/40 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-foreground">
            Application Submitted Successfully!
          </h1>

          <p className="text-lg text-muted mb-8 leading-relaxed">
            Thank you for your payment. Your vendor application has been submitted 
            and is now pending review by our team.
          </p>

          {/* What's Next */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <span>📋</span>
              <span>What Happens Next</span>
            </h2>
            <ol className="space-y-3 text-sm text-muted list-decimal list-inside">
              <li>
                <strong className="text-foreground">Review Process:</strong> Our team will review 
                your application within 5-7 business days
              </li>
              <li>
                <strong className="text-foreground">Email Notification:</strong> You'll receive 
                an email once your application is approved or if we need more information
              </li>
              <li>
                <strong className="text-foreground">Stripe Connect:</strong> After approval, you'll 
                connect your Stripe account to receive payments
              </li>
              <li>
                <strong className="text-foreground">Start Selling:</strong> Once connected, you can 
                add products and start accepting orders
              </li>
            </ol>
          </div>

          {/* Payment Confirmed */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-8 text-sm">
            <p className="text-foreground">
              <strong>✓ Payment Confirmed</strong>
              <br />
              <span className="text-muted">Your application fee and first month's subscription have been processed.</span>
            </p>
          </div>

          {/* Important Info */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
              <span>⚠️</span>
              <span>Important Information</span>
            </h3>
            <ul className="space-y-2 text-sm text-muted list-disc list-inside">
              <li>Your $5 application fee and $5 monthly subscription are non-refundable</li>
              <li>Approval is not guaranteed - we review all applications carefully</li>
              <li>Check your email regularly for updates on your application status</li>
              <li>Your monthly subscription will renew automatically</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/members"
              className="solid-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] font-semibold"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="outline-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] font-semibold"
            >
              Back to Home
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted">
              Questions about your application?{" "}
              <a
                href="mailto:vendors@dude.box"
                className="text-accent hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
