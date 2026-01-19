import Link from "next/link";
import { Container } from "@/components/Container";
import { navigationLinks } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <Container className="py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <Link href="/" className="text-xl font-semibold section-title">
            dude.box
          </Link>
          <span className="text-sm muted">Veteran-Owned Men’s Recovery & Social Club</span>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.2em]">
          {navigationLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
