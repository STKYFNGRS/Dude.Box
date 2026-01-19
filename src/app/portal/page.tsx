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
          description="Members must sign in to access bookings and announcements."
        />
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
        description="Account status and internal access."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Membership status">
          Active member. Billing status and renewals will appear here once payments are
          integrated.
        </Card>
        <Card title="Profile">
          Name: {session.user?.name ?? "Member"}
          <br />
          Email: {session.user?.email ?? "On file"}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card title="Barber booking">
          Placeholder UI. TODO: integrate scheduling and member preferences.
        </Card>
        <Card title="Therapist session request">
          Placeholder UI. TODO: add request workflow and approvals.
        </Card>
        <Card title="Event calendar">
          Placeholder UI. TODO: integrate events, RSVP, and notifications.
        </Card>
      </div>

      <Card title="Internal announcements">
        Placeholder UI. TODO: connect announcements table in Neon DB.
      </Card>
    </div>
  );
}
