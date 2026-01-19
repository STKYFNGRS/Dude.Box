import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-8 flex flex-col gap-3 text-sm muted">
        <span>dude.box — San Diego, California</span>
        <span>Investor inquiries: investors@dude.box (placeholder)</span>
        <span className="text-xs">
          © {new Date().getFullYear()} dude.box. All rights reserved.
        </span>
      </Container>
    </footer>
  );
}
