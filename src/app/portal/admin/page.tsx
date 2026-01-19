import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Section } from "@/components/Section";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Section
        eyebrow="Admin"
        title="Access restricted"
        description="Admin access requires authentication."
      />
    );
  }

  return (
    <Section
      eyebrow="Admin"
      title="Admin dashboard placeholder"
      description="TODO: add role-based access, member cap enforcement, and admin tooling."
    />
  );
}
