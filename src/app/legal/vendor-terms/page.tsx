import { Container } from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Terms of Service | Dude.Box",
  description: "Terms and conditions for becoming a vendor on the Dude.Box marketplace platform.",
};

export default function VendorTermsPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Vendor Terms of Service</h1>
        <p className="text-sm text-muted mb-8">Last Updated: January 29, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              Welcome to Dude.Box. These Vendor Terms of Service ("Terms") govern your use of the Dude.Box platform 
              as a vendor. By applying to become a vendor and using our platform, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Platform Role */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Platform Services</h2>
            <p className="text-muted leading-relaxed mb-4">
              Dude.Box provides:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>A custom subdomain storefront (yourstore.dude.box)</li>
              <li>E-commerce platform technology and hosting</li>
              <li>Payment processing infrastructure via Stripe</li>
              <li>Shopping cart and checkout functionality</li>
              <li>SSL certificates and security</li>
              <li>Platform maintenance and updates</li>
            </ul>
            <p className="text-muted leading-relaxed mt-4">
              <strong>Important:</strong> Dude.Box is a technology platform only. We do not handle product fulfillment, 
              shipping, customer service for your products, or inventory management.
            </p>
          </section>

          {/* Vendor Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Vendor Responsibilities</h2>
            <p className="text-muted leading-relaxed mb-4">
              As a vendor, you are solely responsible for:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li><strong>Product Fulfillment:</strong> Packaging, shipping, and delivering all products to customers</li>
              <li><strong>Customer Service:</strong> Responding to customer inquiries about your products</li>
              <li><strong>Product Accuracy:</strong> Ensuring product descriptions, pricing, and images are accurate</li>
              <li><strong>Inventory Management:</strong> Maintaining adequate stock levels and updating availability</li>
              <li><strong>Shipping Policies:</strong> Setting and honoring your shipping timeframes and costs</li>
              <li><strong>Return Policies:</strong> Handling returns and refunds according to your stated policies</li>
              <li><strong>Legal Compliance:</strong> Complying with all applicable federal, state, and local laws</li>
              <li><strong>Tax Obligations:</strong> Collecting, remitting, and reporting all applicable taxes</li>
              <li><strong>Product Safety:</strong> Ensuring all products meet safety standards and regulations</li>
            </ul>
          </section>

          {/* Application Process */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Application Process</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>4.1 Application Fee:</strong> A non-refundable $5.00 application fee is required to submit 
                your vendor application.
              </p>
              <p>
                <strong>4.2 Approval Rights:</strong> Dude.Box reserves the absolute right to approve or reject any 
                vendor application for any reason or no reason. We are not obligated to provide reasons for rejection.
              </p>
              <p>
                <strong>4.3 No Guarantee:</strong> Payment of the application fee does not guarantee approval. 
                The application fee is non-refundable regardless of approval status.
              </p>
              <p>
                <strong>4.4 Timeline:</strong> We aim to review applications within 5-7 business days, though this 
                is not guaranteed.
              </p>
            </div>
          </section>

          {/* Fees and Payment */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Fees and Payment Terms</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>5.1 Platform Fee:</strong> Dude.Box charges a 1% platform fee on each sale. This fee is 
                automatically deducted from the transaction total before funds are transferred to your connected 
                Stripe account.
              </p>
              <p>
                <strong>5.2 Monthly Subscription:</strong> A $5.00 monthly subscription fee is required to maintain 
                an active vendor store. This fee is charged automatically on the same day each month.
              </p>
              <p>
                <strong>5.3 Non-Refundable:</strong> All fees (application, monthly subscription, and platform fees) 
                are non-refundable under any circumstances.
              </p>
              <p>
                <strong>5.4 Payment Distribution:</strong> You will receive 99% of each sale directly to your 
                connected Stripe account. Payouts are processed according to Stripe's standard payout schedule 
                (typically 2 business days).
              </p>
              <p>
                <strong>5.5 Stripe Connect Required:</strong> You must connect a valid Stripe account to receive 
                payments. Dude.Box never holds your funds.
              </p>
              <p>
                <strong>5.6 Fee Changes:</strong> We reserve the right to change fees with 30 days notice to 
                existing vendors.
              </p>
            </div>
          </section>

          {/* Prohibited Items */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Prohibited Products and Conduct</h2>
            <p className="text-muted leading-relaxed mb-4">
              You may not sell or offer for sale:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li>Illegal items, drugs, or drug paraphernalia</li>
              <li>Counterfeit or fake goods</li>
              <li>Stolen items or property</li>
              <li>Weapons, firearms, or explosive materials (unless properly licensed)</li>
              <li>Hazardous or dangerous materials</li>
              <li>Adult content or sexually explicit materials</li>
              <li>Items that infringe on intellectual property rights</li>
              <li>Live animals</li>
              <li>Human remains or body parts</li>
              <li>Items that violate any applicable laws</li>
            </ul>
          </section>

          {/* Store Requirements */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Store Requirements</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>7.1 Active Store:</strong> You must maintain at least one active product listing and 
                fulfill orders in a timely manner.
              </p>
              <p>
                <strong>7.2 Response Time:</strong> You must respond to customer inquiries within 48 hours.
              </p>
              <p>
                <strong>7.3 Shipping Timeframes:</strong> You must ship orders within your stated shipping timeframe.
              </p>
              <p>
                <strong>7.4 Accurate Information:</strong> All product information must be accurate and not misleading.
              </p>
              <p>
                <strong>7.5 Quality Standards:</strong> Products must match descriptions and meet reasonable quality 
                expectations.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>8.1 By Vendor:</strong> You may close your store at any time with 30 days written notice. 
                You remain responsible for fulfilling all pending orders.
              </p>
              <p>
                <strong>8.2 By Platform:</strong> We reserve the right to suspend or terminate your store immediately 
                for violation of these Terms, illegal activity, poor customer service, repeated customer complaints, 
                or any other reason we deem appropriate.
              </p>
              <p>
                <strong>8.3 No Refunds:</strong> Upon termination, no refunds of application fees or monthly subscription 
                fees will be issued.
              </p>
              <p>
                <strong>8.4 Outstanding Payments:</strong> You remain entitled to receive payment for completed sales 
                prior to termination, minus any applicable fees or chargebacks.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>9.1 Your Content:</strong> You retain all rights to your product images, descriptions, and 
                brand materials.
              </p>
              <p>
                <strong>9.2 License to Display:</strong> By using the platform, you grant Dude.Box a non-exclusive 
                license to display your content on the platform and in marketing materials.
              </p>
              <p>
                <strong>9.3 Platform IP:</strong> All Dude.Box trademarks, technology, and platform features remain 
                the property of Dude.Box.
              </p>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>10.1 Platform Availability:</strong> We strive for 99.9% uptime but do not guarantee 
                uninterrupted service.
              </p>
              <p>
                <strong>10.2 Indemnification:</strong> You agree to indemnify and hold Dude.Box harmless from any 
                claims arising from your products, actions, or breach of these Terms.
              </p>
              <p>
                <strong>10.3 Disclaimer:</strong> THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. 
                DUDE.BOX IS NOT LIABLE FOR ANY DAMAGES ARISING FROM YOUR USE OF THE PLATFORM OR LOSS OF SALES.
              </p>
              <p>
                <strong>10.4 Maximum Liability:</strong> Our total liability to you for any claim shall not exceed 
                the fees you paid to Dude.Box in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. Dispute Resolution</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>11.1 Governing Law:</strong> These Terms are governed by the laws of the United States and 
                the state in which Dude.Box is incorporated.
              </p>
              <p>
                <strong>11.2 Arbitration:</strong> Any disputes shall be resolved through binding arbitration rather 
                than in court.
              </p>
              <p>
                <strong>11.3 No Class Actions:</strong> You waive any right to participate in class action lawsuits 
                against Dude.Box.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
            <p className="text-muted leading-relaxed">
              We may update these Terms at any time. Material changes will be communicated via email with 30 days 
              notice. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
            <p className="text-muted leading-relaxed">
              For questions about these Terms, please contact us at:{" "}
              <a href="mailto:vendors@dude.box" className="text-accent hover:underline">
                vendors@dude.box
              </a>
            </p>
          </section>

          {/* Agreement */}
          <section className="border-t border-border pt-8 mt-8">
            <p className="text-muted leading-relaxed font-semibold">
              BY CHECKING THE BOX AND SUBMITTING YOUR VENDOR APPLICATION, YOU ACKNOWLEDGE THAT YOU HAVE READ, 
              UNDERSTOOD, AND AGREE TO BE BOUND BY THESE VENDOR TERMS OF SERVICE.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
