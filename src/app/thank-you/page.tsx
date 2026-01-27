import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Thank You | Dude.Box",
  description: "Your order has been received.",
};

interface ThankYouPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const sessionId = searchParams.session_id;

  let orderDetails = null;
  let subscriptionDetails = null;

  if (sessionId) {
    try {
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.metadata?.userId) {
        // Get the most recent order for this user
        const order = await prisma.order.findFirst({
          where: {
            user_id: session.metadata.userId,
            stripe_payment_intent_id: session.payment_intent as string,
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
        });

        if (order) {
          orderDetails = order;

          // Get subscription details if this was a subscription purchase
          if (session.subscription) {
            const subscription = await prisma.subscription.findUnique({
              where: {
                stripe_subscription_id: session.subscription as string,
              },
            });
            subscriptionDetails = subscription;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  }
  return (
    <Container className="py-12">
      <Section
        eyebrow="Order Confirmed"
        title="Thank you for your order"
        description="We've received your order and will send you a confirmation email shortly."
      >
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="card rounded-2xl p-8 bg-background/40">
            <div className="flex flex-col gap-4 text-center">
              <svg
                className="mx-auto h-16 w-16 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="section-title text-2xl">Your order is confirmed!</h2>
              <p className="text-sm muted">
                You'll receive a confirmation email with your order details and tracking information.
              </p>
              {orderDetails && (
                <div className="text-left mt-6 pt-6 border-t border-border">
                  <div className="text-xs uppercase tracking-[0.3em] muted pb-4">
                    Order Details
                  </div>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="muted">Order Number:</span>
                      <span className="font-medium">{orderDetails.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="muted">Total:</span>
                      <span className="font-medium">${orderDetails.total.toString()}</span>
                    </div>
                    {subscriptionDetails && (
                      <div className="flex justify-between">
                        <span className="muted">Next Billing:</span>
                        <span className="font-medium">
                          {new Date(subscriptionDetails.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/portal"
              className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] text-center"
            >
              {subscriptionDetails ? "Manage Subscription" : "View Orders"}
            </Link>
            <Link
              href="/"
              className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] text-center"
            >
              Back to Home
            </Link>
          </div>

          <div className="card rounded-2xl p-6 bg-background/20">
            <h3 className="text-xs uppercase tracking-[0.3em] muted pb-4">
              What happens next?
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex gap-3">
                <span className="text-accent">1.</span>
                <span>You'll receive an order confirmation email</span>
              </div>
              <div className="flex gap-3">
                <span className="text-accent">2.</span>
                <span>Your order will be prepared and packaged</span>
              </div>
              <div className="flex gap-3">
                <span className="text-accent">3.</span>
                <span>You'll receive shipping confirmation with tracking</span>
              </div>
              <div className="flex gap-3">
                <span className="text-accent">4.</span>
                <span>
                  {subscriptionDetails
                    ? "Your monthly subscription will renew automatically"
                    : "Your order will arrive within 3-5 business days"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm muted">
            Questions about your order?{" "}
            <a href="mailto:support@dude.box" className="text-accent hover:underline">
              Contact us
            </a>
          </div>
        </div>
      </Section>
    </Container>
  );
}
