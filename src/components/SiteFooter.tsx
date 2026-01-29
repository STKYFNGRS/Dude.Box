import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-panel mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Dude.Box</h3>
            <p className="text-sm text-muted leading-relaxed">
              A marketplace connecting skilled makers with customers who value quality craftsmanship.
            </p>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Vendors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/members/become-vendor" className="text-muted hover:text-accent transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/legal/vendor-terms" className="text-muted hover:text-accent transition-colors">
                  Vendor Terms
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-muted hover:text-accent transition-colors">
                  Browse Stores
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@dude.box" className="text-muted hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="mailto:vendors@dude.box" className="text-muted hover:text-accent transition-colors">
                  Vendor Support
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
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
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
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            © {currentYear} Dude Dot Box LLC. All rights reserved.
          </p>
          
          <div className="flex gap-4 text-sm text-muted">
            <span>Made for makers</span>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
