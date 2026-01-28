"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function BecomeVendorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    subdomain: "",
    name: "",
    description: "",
    contact_email: "",
    shipping_policy: "",
    return_policy: "",
  });

  const handleSubdomainChange = (value: string) => {
    // Convert to lowercase, remove spaces and special chars
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, subdomain: cleaned });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stores/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create store");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium mb-2">
          Store Subdomain <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            id="subdomain"
            type="text"
            value={formData.subdomain}
            onChange={(e) => handleSubdomainChange(e.target.value)}
            className="input flex-1"
            placeholder="yourstore"
            required
            pattern="[a-z0-9-]{3,63}"
            minLength={3}
            maxLength={63}
            disabled={loading}
          />
          <span className="text-sm text-muted-foreground">.dude.box</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          3-63 characters, lowercase letters, numbers, and hyphens only
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Store Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input w-full"
          placeholder="Your Store Name"
          required
          maxLength={100}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="contact_email"
          className="block text-sm font-medium mb-2"
        >
          Contact Email <span className="text-red-500">*</span>
        </label>
        <input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) =>
            setFormData({ ...formData, contact_email: e.target.value })
          }
          className="input w-full"
          placeholder="store@example.com"
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Customers will see this email for order inquiries
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-2"
        >
          Store Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input w-full"
          rows={4}
          placeholder="Tell customers about your store and products..."
          maxLength={1000}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="shipping_policy"
          className="block text-sm font-medium mb-2"
        >
          Shipping Policy
        </label>
        <textarea
          id="shipping_policy"
          value={formData.shipping_policy}
          onChange={(e) =>
            setFormData({ ...formData, shipping_policy: e.target.value })
          }
          className="input w-full"
          rows={3}
          placeholder="Describe your shipping methods, timeframes, and costs..."
          maxLength={1000}
          disabled={loading}
        />
      </div>

      <div>
        <label
          htmlFor="return_policy"
          className="block text-sm font-medium mb-2"
        >
          Return Policy
        </label>
        <textarea
          id="return_policy"
          value={formData.return_policy}
          onChange={(e) =>
            setFormData({ ...formData, return_policy: e.target.value })
          }
          className="input w-full"
          rows={3}
          placeholder="Describe your return policy..."
          maxLength={1000}
          disabled={loading}
        />
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="text-sm">
          <strong>Next Steps:</strong> After submitting, your store will be
          reviewed by our team. Once approved, you'll be able to connect your
          Stripe account and start adding products.
        </div>
      </div>

      <button
        type="submit"
        className="solid-button rounded-full px-8 py-3 text-sm w-full sm:w-auto"
        disabled={loading}
      >
        {loading ? "Creating Store..." : "Submit for Approval"}
      </button>
    </form>
  );
}
