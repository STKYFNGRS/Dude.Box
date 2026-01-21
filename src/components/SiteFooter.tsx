import Link from "next/link";
import { Container } from "@/components/Container";
import { footerNavigationLinks } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-8 flex flex-col gap-6 text-sm muted">
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em]">
          {footerNavigationLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          <span>
            Contact:{" "}
            <a href="mailto:dude@dude.box" className="underline underline-offset-4">
              dude@dude.box
            </a>
          </span>
        </div>
        <span className="text-xs">
          © {new Date().getFullYear()} dude.box LLC. All rights reserved.
        </span>
      </Container>
    </footer>
  );
}
