import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-panel mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-foreground mb-2 text-sm">Dude.Box</h3>
            <p className="text-xs text-muted leading-snug">
              A marketplace connecting skilled makers with customers who value quality craftsmanship.
            </p>
          </div>

          {/* Combined: Resources (Vendors + Support) */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm">Resources</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/members/become-vendor" className="text-muted hover:text-accent transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-muted hover:text-accent transition-colors">
                  Browse Stores
                </Link>
              </li>
              <li>
                <a href="mailto:support@dude.box" className="text-muted hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/investors" className="text-muted hover:text-accent transition-colors">
                  Investors
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-2 text-sm">Legal</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/legal/terms" className="text-muted hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-muted hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/vendor-terms" className="text-muted hover:text-accent transition-colors">
                  Vendor Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-4 pt-3 text-center">
          <p className="text-xs text-muted">
            © {currentYear} Dude Dot Box LLC. All rights reserved. · Made for makers
          </p>
        </div>
      </div>
    </footer>
  );
}
