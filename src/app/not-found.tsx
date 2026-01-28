import Link from "next/link";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <Container className="py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Section
          eyebrow="404 Error"
          title="Page Not Found"
          description="The page you're looking for doesn't exist or has been moved."
        >
          <div className="flex flex-col items-center gap-6 pt-6">
            <div className="text-9xl font-bold text-accent/20">404</div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="solid-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em]"
              >
                Back to Home
              </Link>
              <Link
                href="/portal"
                className="outline-button rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em]"
              >
                Go to Portal
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </Container>
  );
}
