import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { headerNavigationLinks } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <Container className="py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <Link href="/" aria-label="dude.box home">
            <Image
              src="/Logo.png"
              alt="dude.box logo"
              width={140}
              height={36}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <nav aria-label="Primary" className="flex flex-wrap gap-4 text-sm uppercase tracking-[0.2em]">
            {headerNavigationLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/portal/login"
            className="outline-button rounded px-3 py-2 text-xs uppercase tracking-[0.25em]"
          >
            Member Login
          </Link>
        </div>
      </Container>
    </header>
  );
}
