"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SHIPPING_TEMPLATES, RETURN_TEMPLATES } from "@/lib/policy-templates";

interface Store {
  id: string;
  name: string;
  description: string | null;
  contact_email: string;
  shipping_policy: string | null;
  return_policy: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

export function EditStoreForm({ store }: { store: Store }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description || "",
    contact_email: store.contact_email,
    shipping_policy: store.shipping_policy || "",
    return_policy: store.return_policy || "",
    logo_url: store.logo_url || "",
    banner_url: store.banner_url || "",
  });
  
  const [selectedShippingTemplate, setSelectedShippingTemplate] = useState("");
  const [selectedReturnTemplate, setSelectedReturnTemplate] = useState("");
  const [imageErrors, setImageErrors] = useState({ logo: false, banner: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/vendor/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update store");
      }

      setSuccess(true);
      router.refresh();
      
      setTimeout(() => setSuccess(false), 3000);
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
      {success && (
        <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded text-sm">
          Store updated successfully!
        </div>
      )}

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
          required
          disabled={loading}
        />
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
          maxLength={1000}
          disabled={loading}
        />
      </div>

      {/* Logo URL Input */}
      <div>
        <label htmlFor="logo_url" className="block text-sm font-medium mb-2">
          Store Logo URL
        </label>
        <input
          id="logo_url"
          type="url"
          value={formData.logo_url}
          onChange={(e) => {
            setFormData({ ...formData, logo_url: e.target.value });
            setImageErrors({ ...imageErrors, logo: false });
          }}
          className="input w-full mb-2"
          placeholder="https://example.com/your-logo.png"
          disabled={loading}
        />
        {formData.logo_url && (
          <div className="relative w-full h-24 bg-border/20 rounded flex items-center justify-center overflow-hidden">
            {!imageErrors.logo ? (
              <Image
                src={formData.logo_url}
                alt="Logo preview"
                width={200}
                height={80}
                className="object-contain max-h-20"
                onError={() => setImageErrors({ ...imageErrors, logo: true })}
              />
            ) : (
              <span className="text-xs text-red-500">Invalid image URL</span>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Recommended: 400x100px PNG or JPG. Appears in store header.
        </p>
      </div>

      {/* Banner URL Input */}
      <div>
        <label htmlFor="banner_url" className="block text-sm font-medium mb-2">
          Store Banner URL
        </label>
        <input
          id="banner_url"
          type="url"
          value={formData.banner_url}
          onChange={(e) => {
            setFormData({ ...formData, banner_url: e.target.value });
            setImageErrors({ ...imageErrors, banner: false });
          }}
          className="input w-full mb-2"
          placeholder="https://example.com/your-banner.jpg"
          disabled={loading}
        />
        {formData.banner_url && (
          <div className="relative w-full h-48 bg-border/20 rounded overflow-hidden">
            {!imageErrors.banner ? (
              <Image
                src={formData.banner_url}
                alt="Banner preview"
                fill
                className="object-cover"
                onError={() => setImageErrors({ ...imageErrors, banner: true })}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-xs text-red-500">Invalid image URL</span>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Recommended: 1200x400px JPG or PNG. Appears at top of store page.
        </p>
      </div>

      {/* Shipping Policy with Templates */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Shipping Policy
        </label>
        <select
          value={selectedShippingTemplate}
          onChange={(e) => {
            setSelectedShippingTemplate(e.target.value);
            const template = SHIPPING_TEMPLATES.find(t => t.id === e.target.value);
            if (template) {
              setFormData({ ...formData, shipping_policy: template.text });
            }
          }}
          className="input w-full mb-2"
          disabled={loading}
        >
          <option value="">-- Select a template (optional) --</option>
          {SHIPPING_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <textarea
          id="shipping_policy"
          value={formData.shipping_policy}
          onChange={(e) =>
            setFormData({ ...formData, shipping_policy: e.target.value })
          }
          className="input w-full"
          rows={6}
          maxLength={1000}
          placeholder="Describe your shipping times, costs, and methods..."
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Select a template above to auto-fill, then customize as needed.
        </p>
      </div>

      {/* Return Policy with Templates */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Return Policy
        </label>
        <select
          value={selectedReturnTemplate}
          onChange={(e) => {
            setSelectedReturnTemplate(e.target.value);
            const template = RETURN_TEMPLATES.find(t => t.id === e.target.value);
            if (template) {
              setFormData({ ...formData, return_policy: template.text });
            }
          }}
          className="input w-full mb-2"
          disabled={loading}
        >
          <option value="">-- Select a template (optional) --</option>
          {RETURN_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <textarea
          id="return_policy"
          value={formData.return_policy}
          onChange={(e) =>
            setFormData({ ...formData, return_policy: e.target.value })
          }
          className="input w-full"
          rows={6}
          maxLength={1000}
          placeholder="Describe your return/exchange policy..."
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Select a template above to auto-fill, then customize as needed.
        </p>
      </div>

      <button
        type="submit"
        className="solid-button rounded-full px-8 py-3 text-sm"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
