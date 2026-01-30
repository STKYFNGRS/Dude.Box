"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VendorApplicationCheckout } from "./vendor/VendorApplicationCheckout";
import { CheckoutErrorBoundary } from "./ErrorBoundary";

export function BecomeVendorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    subdomain: "",
    name: "",
    description: "",
    contact_email: "",
  });

  const handleSubdomainChange = async (value: string) => {
    // Convert to lowercase, remove spaces and special chars
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, subdomain: cleaned });
    
    // Check availability if valid length
    if (cleaned.length >= 3) {
      setCheckingSubdomain(true);
      setSubdomainAvailable(null);
      
      try {
        const response = await fetch(`/api/stores/check-subdomain?subdomain=${cleaned}`);
        const data = await response.json();
        setSubdomainAvailable(data.available);
      } catch (err) {
        setSubdomainAvailable(null);
      } finally {
        setCheckingSubdomain(false);
      }
    } else {
      setSubdomainAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError("");
      
      // Explicit validation before showing modal
      if (!formData.subdomain || formData.subdomain.length < 3) {
        setError("Please enter a subdomain (at least 3 characters)");
        return;
      }
      
      if (!formData.name || formData.name.trim().length === 0) {
        setError("Please enter your store name");
        return;
      }
      
      if (!formData.contact_email || !formData.contact_email.includes("@")) {
        setError("Please enter a valid contact email");
        return;
      }
      
      if (!termsAccepted) {
        setError("Please accept the terms and conditions to continue");
        return;
      }
      
      if (subdomainAvailable === false) {
        setError("This subdomain is not available. Please choose another one.");
        return;
      }
      
      if (checkingSubdomain) {
        setError("Please wait while we check subdomain availability");
        return;
      }
      
      console.log("🔵 BecomeVendorForm: Opening checkout modal");
      console.log("Form data:", formData);
      
      // Show embedded checkout
      setShowCheckout(true);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleCheckoutSuccess = () => {
    // Redirect to success page
    router.push("/members/become-vendor/payment-success");
  };

  const handleCheckoutError = (errorMessage: string) => {
    setError(errorMessage);
    setShowCheckout(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* Subdomain Field with Availability Check */}
      <div className="card rounded-lg p-6 border-accent/20">
        <label htmlFor="subdomain" className="block text-sm font-semibold mb-3 text-foreground">
          Your Store Subdomain <span className="text-error">*</span>
        </label>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 relative">
            <input
              id="subdomain"
              type="text"
              value={formData.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              className="input w-full text-base font-medium"
              placeholder="yourstore"
              required
              pattern="[a-z0-9\-]{3,63}"
              minLength={3}
              maxLength={63}
              disabled={loading}
            />
            {checkingSubdomain && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!checkingSubdomain && subdomainAvailable !== null && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {subdomainAvailable ? (
                  <span className="text-success text-lg">✓</span>
                ) : (
                  <span className="text-error text-lg">✗</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center px-4 bg-panel border border-border rounded-lg text-sm text-muted">
            .dude.box
          </div>
        </div>
        {formData.subdomain && (
          <div className="mt-3 p-3 bg-background/50 border border-border/50 rounded-lg">
            <p className="text-xs text-muted mb-1">Your store will be available at:</p>
            <p className="text-sm font-medium text-accent">https://{formData.subdomain || "yourstore"}.dude.box</p>
          </div>
        )}
        {subdomainAvailable === false && (
          <p className="text-xs text-error mt-2">This subdomain is already taken. Please choose another.</p>
        )}
        {subdomainAvailable === true && (
          <p className="text-xs text-success mt-2">Great! This subdomain is available.</p>
        )}
        <p className="text-xs text-muted mt-2">
          3-63 characters • lowercase letters, numbers, and hyphens only • {formData.subdomain.length}/63
        </p>
      </div>

      {/* Store Information */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold mb-2 text-foreground">
          Store Name <span className="text-error">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input w-full text-base"
          placeholder="My Awesome Store"
          required
          maxLength={100}
          disabled={loading}
        />
        <p className="text-xs text-muted mt-2">
          This is how your store will appear to customers
        </p>
      </div>

      <div>
        <label
          htmlFor="contact_email"
          className="block text-sm font-semibold mb-2 text-foreground"
        >
          Contact Email <span className="text-error">*</span>
        </label>
        <input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) =>
            setFormData({ ...formData, contact_email: e.target.value })
          }
          className="input w-full text-base"
          placeholder="contact@example.com"
          required
          disabled={loading}
        />
        <p className="text-xs text-muted mt-2">
          Customers will use this email for order inquiries and support
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold mb-2 text-foreground"
        >
          Store Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input w-full text-base"
          rows={5}
          placeholder="Tell customers about your store, your craft, and what makes your products special..."
          maxLength={1000}
          disabled={loading}
        />
        <p className="text-xs text-muted mt-2">
          {formData.description.length}/1000 characters
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-5">
        <div className="flex gap-3">
          <div className="text-info text-xl flex-shrink-0">ℹ️</div>
          <div className="text-sm text-foreground">
            <p className="font-semibold mb-2">What happens next:</p>
            <ol className="space-y-1 text-muted list-decimal list-inside">
              <li>You'll pay the $5 application fee + $5/month subscription</li>
              <li>Your application will be reviewed by our team</li>
              <li>Once approved, you'll connect your Stripe account</li>
              <li>You can then add products and customize your storefront</li>
              <li>Set your shipping and return policies in store settings</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Terms Acceptance */}
      <div className="border-t border-border pt-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 mt-1 rounded border-2 border-border checked:bg-accent checked:border-accent transition-all flex-shrink-0"
            required
            disabled={loading}
          />
          <div className="text-sm">
            <span className="text-foreground font-medium">
              I accept the{" "}
              <a 
                href="/legal/vendor-terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline font-semibold"
              >
                Vendor Terms of Service
              </a>
            </span>
            <p className="text-muted text-xs mt-2 mb-2">
              By checking this box, I understand and agree that:
            </p>
            <ul className="text-muted text-xs space-y-1.5 list-none">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>The <strong>$5 application fee</strong> is non-refundable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>The <strong>$5 monthly subscription</strong> is non-refundable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Dude.Box reserves the right to approve or reject applications without providing a reason</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>I am responsible for all product fulfillment and shipping to customers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>The platform charges a <strong>1% fee per sale</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                <span>Dude.Box provides the storefront technology only - not fulfillment services</span>
              </li>
            </ul>
          </div>
        </label>
      </div>

      <button
        type="submit"
        className="solid-button rounded-full px-8 py-3 text-sm w-full sm:w-auto font-semibold"
        disabled={
          loading || 
          !termsAccepted || 
          (formData.subdomain.length >= 3 && subdomainAvailable === false)
        }
      >
        Proceed to Payment →
      </button>

      {/* Embedded Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-3xl my-8">
            {/* Header */}
            <div className="border-b border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Complete Your Application</h2>
                  <p className="text-sm text-muted mt-1">
                    Secure payment powered by Stripe
                  </p>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-muted hover:text-foreground text-2xl leading-none transition-colors"
                  aria-label="Close checkout"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Application Summary */}
            <div className="p-6 border-b border-border bg-accent/5">
              <h3 className="font-semibold text-foreground mb-4">Application Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted block mb-1">Store Name:</span>
                  <span className="font-medium text-foreground">{formData.name}</span>
                </div>
                <div>
                  <span className="text-muted block mb-1">Subdomain:</span>
                  <span className="font-medium text-accent">{formData.subdomain}.dude.box</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted block mb-1">Contact Email:</span>
                  <span className="font-medium text-foreground">{formData.contact_email}</span>
                </div>
              </div>
            </div>

            {/* Checkout Content with Error Boundary */}
            <div className="p-6">
              {error && (
                <div className="bg-error/10 text-error border border-error/20 p-4 rounded-lg text-sm mb-6 animate-fade-in">
                  {error}
                </div>
              )}
              <CheckoutErrorBoundary>
                <VendorApplicationCheckout
                  applicationData={formData}
                  onSuccess={handleCheckoutSuccess}
                  onError={handleCheckoutError}
                />
              </CheckoutErrorBoundary>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
