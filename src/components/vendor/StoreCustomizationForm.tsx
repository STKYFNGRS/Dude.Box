"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Store {
  id: string;
  name: string;
  custom_colors_enabled: boolean;
  primary_color: string | null;
  secondary_color: string | null;
  background_color: string | null;
  text_color: string | null;
  custom_text: string | null;
}

export function StoreCustomizationForm({ store }: { store: Store }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(store.custom_colors_enabled);
  
  const [colors, setColors] = useState({
    primary_color: store.primary_color || "#3b82f6",
    secondary_color: store.secondary_color || "#8b5cf6",
    background_color: store.background_color || "#ffffff",
    text_color: store.text_color || "#000000",
  });
  
  const [customText, setCustomText] = useState(store.custom_text || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/vendor/store/customization", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        custom_colors_enabled: enabled,
        ...colors,
        custom_text: customText,
      }),
    });

    if (res.ok) {
      router.refresh();
      alert("Customization saved!");
    } else {
      alert("Failed to save customization");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">
            Enable Custom Colors
          </span>
        </label>
      </div>

      {enabled && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Primary Color (Buttons)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.primary_color}
                onChange={(e) => setColors({...colors, primary_color: e.target.value})}
                className="w-12 h-12 rounded border"
              />
              <input
                type="text"
                value={colors.primary_color}
                onChange={(e) => setColors({...colors, primary_color: e.target.value})}
                className="flex-1 px-3 py-2 rounded border"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Secondary Color (Accents)
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.secondary_color}
                onChange={(e) => setColors({...colors, secondary_color: e.target.value})}
                className="w-12 h-12 rounded border"
              />
              <input
                type="text"
                value={colors.secondary_color}
                onChange={(e) => setColors({...colors, secondary_color: e.target.value})}
                className="flex-1 px-3 py-2 rounded border"
                placeholder="#8b5cf6"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.background_color}
                onChange={(e) => setColors({...colors, background_color: e.target.value})}
                className="w-12 h-12 rounded border"
              />
              <input
                type="text"
                value={colors.background_color}
                onChange={(e) => setColors({...colors, background_color: e.target.value})}
                className="flex-1 px-3 py-2 rounded border"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Text Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={colors.text_color}
                onChange={(e) => setColors({...colors, text_color: e.target.value})}
                className="w-12 h-12 rounded border"
              />
              <input
                type="text"
                value={colors.text_color}
                onChange={(e) => setColors({...colors, text_color: e.target.value})}
                className="flex-1 px-3 py-2 rounded border"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-1 block">
          Custom Welcome Message
        </label>
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          className="w-full px-3 py-2 rounded border min-h-[100px]"
          placeholder="Welcome to my store! I handcraft unique items..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="solid-button rounded-full px-6 py-2 text-sm"
      >
        {loading ? "Saving..." : "Save Customization"}
      </button>
    </form>
  );
}
