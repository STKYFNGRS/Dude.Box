import { Container } from "@/components/Container";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <Container className="py-12">{children}</Container>;
}
