"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Address = {
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
};

export function EditAddressForm() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Address>({
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "US",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const response = await fetch("/api/customer/address");
      if (response.ok) {
        const data = await response.json();
        if (data.address) {
          setAddress(data.address);
          setFormData({
            address1: data.address.address1 || "",
            address2: data.address.address2 || "",
            city: data.address.city || "",
            province: data.address.province || "",
            zip: data.address.zip || "",
            country: data.address.country || "US",
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/customer/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update address.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Address updated successfully!");
      
      await fetchAddress();
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setError("Unable to update address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (address) {
      setFormData({
        address1: address.address1 || "",
        address2: address.address2 || "",
        city: address.city || "",
        province: address.province || "",
        zip: address.zip || "",
        country: address.country || "US",
      });
    }
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  if (isLoading) {
    return <div className="text-sm muted">Loading address...</div>;
  }

  if (isEditing || !address) {
    return (
      <form onSubmit={handleSubmit} className="text-sm space-y-4">
        <label className="text-sm flex flex-col gap-2">
          <span className="muted">Street Address</span>
          <input
            type="text"
            value={formData.address1}
            onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
            placeholder="123 Main St"
            required
          />
        </label>
        <label className="text-sm flex flex-col gap-2">
          <span className="muted">Apartment, suite, etc. (optional)</span>
          <input
            type="text"
            value={formData.address2}
            onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
            className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
            placeholder="Apt 4B"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm flex flex-col gap-2">
            <span className="muted">City</span>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              placeholder="San Diego"
              required
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            <span className="muted">State</span>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              placeholder="CA"
              required
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm flex flex-col gap-2">
            <span className="muted">ZIP Code</span>
            <input
              type="text"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              placeholder="92101"
              required
            />
          </label>
          <label className="text-sm flex flex-col gap-2">
            <span className="muted">Country</span>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </label>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="solid-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em] disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
          {address && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="outline-button rounded px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  return (
    <div className="text-sm space-y-2">
      {successMessage ? (
        <div className="mb-3 p-2 bg-accent/20 border border-accent rounded text-sm">
          {successMessage}
        </div>
      ) : null}
      <div>
        <div>{address.address1}</div>
        {address.address2 && <div>{address.address2}</div>}
        <div>
          {address.city}, {address.province} {address.zip}
        </div>
        <div>{address.country}</div>
      </div>
      <div className="pt-4">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
        >
          Edit Address
        </button>
      </div>
    </div>
  );
}
