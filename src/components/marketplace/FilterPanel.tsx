"use client";

import { useState } from "react";

interface Store {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

interface FilterPanelProps {
  stores: Store[];
  selectedStores: string[];
  onStoresChange: (stores: string[]) => void;
  productType: string;
  onProductTypeChange: (type: string) => void;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
}

export function FilterPanel({
  stores,
  selectedStores,
  onStoresChange,
  productType,
  onProductTypeChange,
  minPrice,
  maxPrice,
  onPriceChange,
}: FilterPanelProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice?.toString() || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice?.toString() || "");

  const handleStoreToggle = (storeId: string) => {
    if (selectedStores.includes(storeId)) {
      onStoresChange(selectedStores.filter((id) => id !== storeId));
    } else {
      onStoresChange([...selectedStores, storeId]);
    }
  };

  const handlePriceApply = () => {
    const min = localMinPrice ? parseFloat(localMinPrice) : undefined;
    const max = localMaxPrice ? parseFloat(localMaxPrice) : undefined;
    onPriceChange(min, max);
  };

  const handlePriceClear = () => {
    setLocalMinPrice("");
    setLocalMaxPrice("");
    onPriceChange(undefined, undefined);
  };

  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="minPrice" className="text-xs text-muted-foreground mb-1 block">
              Min Price ($)
            </label>
            <input
              id="minPrice"
              type="number"
              min="0"
              step="0.01"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              placeholder="0"
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="text-xs text-muted-foreground mb-1 block">
              Max Price ($)
            </label>
            <input
              id="maxPrice"
              type="number"
              min="0"
              step="0.01"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              placeholder="Any"
              className="input w-full text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePriceApply}
              className="outline-button rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] flex-1"
            >
              Apply
            </button>
            <button
              onClick={handlePriceClear}
              className="text-xs text-muted-foreground hover:text-foreground px-4"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Store Filter */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em]">
          Stores ({stores.length})
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stores.map((store) => (
            <label
              key={store.id}
              className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedStores.includes(store.id)}
                onChange={() => handleStoreToggle(store.id)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm flex-1">{store.name}</span>
              <span className="text-xs text-muted-foreground">
                {store._count.products}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Product Type Filter */}
      <div>
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-[0.2em]">Product Type</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
            <input
              type="radio"
              name="productType"
              checked={productType === "all"}
              onChange={() => onProductTypeChange("all")}
              className="w-4 h-4 border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">All Products</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
            <input
              type="radio"
              name="productType"
              checked={productType === "one_time"}
              onChange={() => onProductTypeChange("one_time")}
              className="w-4 h-4 border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">One-Time Purchase</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors">
            <input
              type="radio"
              name="productType"
              checked={productType === "month"}
              onChange={() => onProductTypeChange("month")}
              className="w-4 h-4 border-border text-primary focus:ring-primary"
            />
            <span className="text-sm">Subscription</span>
          </label>
        </div>
      </div>
    </div>
  );
}
