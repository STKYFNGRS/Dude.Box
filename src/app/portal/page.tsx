import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col gap-6">
        <Section
          eyebrow="Member Portal"
          title="Secure access required"
          description="Members must sign in to access drop previews and order details."
        />
        <p className="text-xs muted">
          TODO: Keep portal hidden from public navigation until member operations go live.
        </p>
        <Link
          href="/portal/login"
          className="outline-button rounded px-5 py-3 text-sm uppercase tracking-[0.2em] w-fit"
        >
          Member Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title="Welcome back"
        description="Account status, upcoming drops, and delivery details."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Subscription status">
          Active subscriber. Billing status and renewals will appear here once payments are
          integrated.
        </Card>
        <Card title="Profile">
          Name: {session.user?.name ?? "Member"}
          <br />
          Email: {session.user?.email ?? "On file"}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Drop preview">
          Placeholder UI. TODO: show upcoming box contents and release dates.
        </Card>
        <Card title="Shipping updates">
          Placeholder UI. TODO: integrate tracking and delivery notifications.
        </Card>
        <Card title="Gift notes">
          Placeholder UI. TODO: display saved gift note preferences.
        </Card>
      </div>

      <Card title="Internal announcements">
        Placeholder UI. TODO: connect announcements table in Neon DB.
      </Card>
    </div>
  );
}
