import { Container } from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Dude.Box",
  description: "Privacy policy for the Dude.Box marketplace platform - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted mb-8">Last Updated: January 29, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              Dude.Box ("we", "us", or "our") respects your privacy and is committed to protecting your personal 
              information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our marketplace platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">2.1 Information You Provide</h3>
                <p className="text-muted leading-relaxed mb-2">We collect information you provide directly:</p>
                <ul className="list-disc list-inside text-muted space-y-1 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, password</li>
                  <li><strong>Profile Information:</strong> Phone number, addresses</li>
                  <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store card details)</li>
                  <li><strong>Vendor Information:</strong> Business details, store information, banking details (via Stripe Connect)</li>
                  <li><strong>Communications:</strong> Messages, support inquiries, feedback</li>
                  <li><strong>Product Information:</strong> For vendors - product descriptions, images, pricing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">2.2 Information Automatically Collected</h3>
                <p className="text-muted leading-relaxed mb-2">When you use our Platform, we automatically collect:</p>
                <ul className="list-disc list-inside text-muted space-y-1 ml-4">
                  <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                  <li><strong>Usage Information:</strong> Pages viewed, time spent, links clicked</li>
                  <li><strong>Cookies:</strong> Session identifiers, preferences, authentication tokens</li>
                  <li><strong>Location Data:</strong> General location based on IP address</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">2.3 Information from Third Parties</h3>
                <p className="text-muted leading-relaxed mb-2">We may receive information from:</p>
                <ul className="list-disc list-inside text-muted space-y-1 ml-4">
                  <li><strong>Stripe:</strong> Payment processing and verification data</li>
                  <li><strong>Analytics Services:</strong> Aggregated usage data</li>
                  <li><strong>Authentication Services:</strong> If you use social login (future feature)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-muted space-y-2 ml-4">
              <li><strong>Provide Services:</strong> Process orders, manage accounts, facilitate marketplace transactions</li>
              <li><strong>Communication:</strong> Send order updates, respond to inquiries, provide customer support</li>
              <li><strong>Platform Improvement:</strong> Analyze usage patterns, improve features, fix bugs</li>
              <li><strong>Security:</strong> Detect fraud, prevent abuse, enforce Terms of Service</li>
              <li><strong>Legal Compliance:</strong> Comply with laws, regulations, and legal processes</li>
              <li><strong>Marketing:</strong> Send promotional emails (you can opt out anytime)</li>
              <li><strong>Vendor Management:</strong> Review vendor applications, monitor store performance</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold mb-4">4. How We Share Your Information</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>4.1 With Vendors:</strong> When you make a purchase, we share your name, shipping address, 
                and order details with the relevant vendor for fulfillment.
              </p>
              <p>
                <strong>4.2 With Stripe:</strong> Payment information is processed through Stripe. We share necessary 
                transaction details with Stripe to process payments.
              </p>
              <p>
                <strong>4.3 Service Providers:</strong> We may share data with trusted third-party service providers 
                (hosting, analytics, email services) who assist in operating our Platform.
              </p>
              <p>
                <strong>4.4 Legal Requirements:</strong> We may disclose information if required by law, court order, 
                or government request.
              </p>
              <p>
                <strong>4.5 Business Transfers:</strong> If Dude.Box is acquired or merged, your information may be 
                transferred to the new entity.
              </p>
              <p>
                <strong>4.6 With Your Consent:</strong> We may share information for other purposes with your explicit 
                consent.
              </p>
              <p>
                <strong>We do not sell your personal information to third parties.</strong>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                <strong>5.1 What Are Cookies:</strong> Cookies are small text files stored on your device that help us 
                provide and improve our services.
              </p>
              <p>
                <strong>5.2 Types of Cookies We Use:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for authentication and shopping cart functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Platform</li>
                <li><strong>Marketing Cookies:</strong> May be used for targeted advertising (with your consent)</li>
              </ul>
              <p>
                <strong>5.3 Managing Cookies:</strong> You can control cookies through your browser settings. Note that 
                disabling essential cookies may limit platform functionality.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Data Security</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                We implement reasonable security measures to protect your information, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and monitoring</li>
                <li>Password hashing and encryption</li>
                <li>PCI-compliant payment processing through Stripe</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute 
                security of your information.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Your Privacy Rights</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                <li><strong>Restriction:</strong> Request limitation on processing of your data</li>
                <li><strong>Object:</strong> Object to processing of your data for certain purposes</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@dude.box" className="text-accent hover:underline">
                  privacy@dude.box
                </a>
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations (e.g., tax records, transaction history)</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain security and prevent fraud</li>
              </ul>
              <p className="mt-4">
                When data is no longer needed, we securely delete or anonymize it.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            <p className="text-muted leading-relaxed">
              Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
            <p className="text-muted leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. These countries 
              may have different data protection laws. By using our Platform, you consent to such transfers.
            </p>
          </section>

          {/* California Privacy Rights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">11. California Privacy Rights (CCPA)</h2>
            <div className="text-muted leading-relaxed space-y-4">
              <p>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
                <li>Right to deletion of personal information</li>
                <li>Right to non-discrimination for exercising CCPA rights</li>
              </ul>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or 
              prominent notice on the Platform. The "Last Updated" date at the top indicates when the policy was last 
              revised.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            <div className="text-muted leading-relaxed">
              <p className="mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="space-y-2">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@dude.box" className="text-accent hover:underline">
                    privacy@dude.box
                  </a>
                </li>
                <li>
                  <strong>General Inquiries:</strong>{" "}
                  <a href="mailto:support@dude.box" className="text-accent hover:underline">
                    support@dude.box
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
