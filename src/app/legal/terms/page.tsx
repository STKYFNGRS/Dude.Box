import { Container } from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Dude.Box",
  description: "General terms and conditions for using the Dude.Box marketplace platform.",
};

export default function TermsPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-muted mb-8">Last Updated: January 29, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted leading-relaxed">
              Welcome to Dude.Box ("Platform", "we", "us", or "our"). By accessing or using our website and services, 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please 
              do not use our Platform.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>2.1 Registration:</strong> To make purchases or become a vendor, you must create an account. 
                You must provide accurate, current, and complete information during registration.
              </p>
              <p>
                <strong>2.2 Account Security:</strong> You are responsible for maintaining the confidentiality of 
                your account credentials and for all activities under your account.
              </p>
              <p>
                <strong>2.3 Age Requirement:</strong> You must be at least 18 years old to create an account and 
                use our Platform.
              </p>
              <p>
                <strong>2.4 Account Termination:</strong> We reserve the right to suspend or terminate accounts that 
                violate these Terms or for any other reason at our discretion.
              </p>
            </div>
          </section>

          {/* Platform Use */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Platform Usage</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>3.1 Marketplace Platform:</strong> Dude.Box operates as a marketplace connecting independent 
                vendors with customers. We do not manufacture, sell, or ship products directly.
              </p>
              <p>
                <strong>3.2 Vendor Responsibility:</strong> Each vendor store is independently operated. Vendors are 
                responsible for their products, fulfillment, shipping, and customer service.
              </p>
              <p>
                <strong>3.3 Permitted Use:</strong> You may use our Platform only for lawful purposes and in accordance 
                with these Terms.
              </p>
              <p>
                <strong>3.4 Prohibited Activities:</strong> You may not:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or viruses</li>
                <li>Interfere with platform security or functionality</li>
                <li>Scrape or harvest user data</li>
                <li>Impersonate others or misrepresent affiliations</li>
                <li>Engage in fraudulent activities</li>
              </ul>
            </div>
          </section>

          {/* Purchases */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Purchases and Payments</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>4.1 Product Listings:</strong> Product descriptions, prices, and availability are provided by 
                individual vendors and may change without notice.
              </p>
              <p>
                <strong>4.2 Pricing:</strong> All prices are in U.S. Dollars (USD) unless otherwise stated. Prices 
                include any applicable platform fees but may not include taxes or shipping.
              </p>
              <p>
                <strong>4.3 Payment Processing:</strong> Payments are processed securely through Stripe. By making a 
                purchase, you agree to Stripe's terms of service.
              </p>
              <p>
                <strong>4.4 Order Acceptance:</strong> Vendors have the right to refuse or cancel orders for any reason 
                prior to shipment.
              </p>
              <p>
                <strong>4.5 Shipping:</strong> Shipping is handled by individual vendors. Delivery times, costs, and 
                methods are set by each vendor.
              </p>
            </div>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Returns and Refunds</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>5.1 Vendor Policies:</strong> Each vendor sets their own return and refund policies. Please 
                review the vendor's policy before making a purchase.
              </p>
              <p>
                <strong>5.2 Platform Role:</strong> Dude.Box is not responsible for processing returns or issuing 
                refunds. All returns must be coordinated directly with the vendor.
              </p>
              <p>
                <strong>5.3 Disputes:</strong> If you have a dispute with a vendor, please attempt to resolve it 
                directly first. If unresolved, you may contact our support team for assistance.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property Rights</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>6.1 Platform Content:</strong> All content on Dude.Box, including text, graphics, logos, 
                and software, is owned by Dude.Box or its licensors and protected by copyright and trademark laws.
              </p>
              <p>
                <strong>6.2 User Content:</strong> You retain ownership of content you submit, but grant us a 
                non-exclusive license to use, display, and distribute it on the Platform.
              </p>
              <p>
                <strong>6.3 Copyright Infringement:</strong> If you believe content infringes your copyright, please 
                contact us with details of the alleged infringement.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Privacy and Data</h2>
            <p className="text-muted leading-relaxed">
              Your use of the Platform is also governed by our{" "}
              <a href="/legal/privacy" className="text-accent hover:underline">Privacy Policy</a>, 
              which describes how we collect, use, and protect your personal information.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Disclaimers and Limitations</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>8.1 "AS IS" Basis:</strong> THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT 
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
              <p>
                <strong>8.2 No Guarantees:</strong> We do not guarantee that the Platform will be uninterrupted, 
                secure, or error-free.
              </p>
              <p>
                <strong>8.3 Product Quality:</strong> We do not warrant the quality, safety, or legality of products 
                sold by vendors.
              </p>
              <p>
                <strong>8.4 Third-Party Links:</strong> Our Platform may contain links to third-party websites. We are 
                not responsible for their content or practices.
              </p>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DUDE.BOX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
              <p>
                OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE PLATFORM SHALL NOT EXCEED THE AMOUNT YOU PAID TO US 
                IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
            <p className="text-muted leading-relaxed">
              You agree to indemnify, defend, and hold harmless Dude.Box and its officers, directors, employees, and 
              agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Platform 
              or violation of these Terms.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Dispute Resolution</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>11.1 Governing Law:</strong> These Terms are governed by the laws of the United States, without 
                regard to conflict of law principles.
              </p>
              <p>
                <strong>11.2 Arbitration:</strong> Any disputes shall be resolved through binding arbitration in 
                accordance with the American Arbitration Association rules.
              </p>
              <p>
                <strong>11.3 Class Action Waiver:</strong> You agree to resolve disputes on an individual basis and 
                waive the right to participate in class actions.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Modifications to Terms</h2>
            <p className="text-muted leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of material changes via 
              email or prominent notice on the Platform. Continued use after changes constitutes acceptance of the 
              modified Terms.
            </p>
          </section>

          {/* General Provisions */}
          <section>
            <h2 className="text-2xl font-bold mb-4">13. General Provisions</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>13.1 Entire Agreement:</strong> These Terms constitute the entire agreement between you and 
                Dude.Box regarding the Platform.
              </p>
              <p>
                <strong>13.2 Severability:</strong> If any provision is found invalid, the remaining provisions remain 
                in full force.
              </p>
              <p>
                <strong>13.3 No Waiver:</strong> Our failure to enforce any right or provision shall not constitute a 
                waiver.
              </p>
              <p>
                <strong>13.4 Assignment:</strong> You may not assign these Terms without our consent. We may assign 
                these Terms without restriction.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
            <p className="text-muted leading-relaxed">
              For questions about these Terms, please contact us at:{" "}
              <a href="mailto:legal@dude.box" className="text-accent hover:underline">
                legal@dude.box
              </a>
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
