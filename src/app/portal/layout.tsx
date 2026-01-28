import { Container } from "@/components/Container";

// Force dynamic rendering to ensure fresh auth state checks
export const dynamic = 'force-dynamic';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <Container className="py-12">{children}</Container>;
}
