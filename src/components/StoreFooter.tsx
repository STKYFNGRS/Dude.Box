import Link from "next/link";

interface StoreFooterProps {
  store: {
    name: string;
    description: string | null;
    contact_email: string;
    shipping_policy: string | null;
    return_policy: string | null;
  };
  basePath: string; // "" for subdomain, "/stores/subdomain" for path-based
}

export function StoreFooter({ store, basePath }: StoreFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/95 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Store */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">{store.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {store.description || "Handcrafted products made with care and attention to detail."}
            </p>
          </div>

          {/* Store Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Store</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`${basePath}/`} className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/products`} className="text-muted-foreground hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/about`} className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Policies */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact & Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href={`mailto:${store.contact_email}`} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
              {store.shipping_policy && (
                <li>
                  <Link 
                    href={`${basePath}/about#shipping`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Shipping Policy
                  </Link>
                </li>
              )}
              {store.return_policy && (
                <li>
                  <Link 
                    href={`${basePath}/about#returns`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Return Policy
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  href="https://www.dude.box/legal/terms" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="https://www.dude.box/legal/privacy" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {store.name}. All rights reserved.
          </p>
          
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <Link href="https://www.dude.box" className="text-primary hover:text-primary/80 transition-colors">
              Dude.Box
            </Link>
            {" "}• A marketplace for makers
          </p>
        </div>
      </div>
    </footer>
  );
}
