"use client";

import { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/marketplace/SearchBar";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { SortDropdown } from "@/components/marketplace/SortDropdown";
import { Spinner } from "@/components/ui/Spinner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: any;
  interval: string;
  image_url: string | null;
  store: {
    id: string;
    name: string;
    subdomain: string;
    logo_url: string | null;
  };
}

interface Store {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

interface MarketplaceData {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  stores: Store[];
}

export default function MarketplacePage() {
  const [data, setData] = useState<MarketplaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [productType, setProductType] = useState("all");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  // Filters sidebar visibility for mobile
  const [showFilters, setShowFilters] = useState(false);

  // Fetch marketplace data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
      if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
      if (selectedStores.length > 0) params.append('stores', selectedStores.join(','));
      if (productType !== 'all') params.append('productType', productType);
      params.append('sortBy', sortBy);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/marketplace?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStores, productType, minPrice, maxPrice, sortBy, page]);

  // Fetch data on filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStores, productType, minPrice, maxPrice, sortBy]);

  const handleLoadMore = () => {
    if (data && page < data.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <Container className="py-12">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto animate-fade-in">
        <span className="text-xs uppercase tracking-[0.35em] text-accent font-semibold mb-4 block">
          Discover Unique Products
        </span>
        <h1 className="section-title text-5xl md:text-6xl mb-6 bg-gradient-to-br from-foreground to-muted bg-clip-text text-transparent">
          Marketplace
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          Browse handcrafted products from independent makers across all stores.
        </p>
      </div>

      {/* Search and Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />
        </div>
        <div className="flex items-center gap-4">
          <SortDropdown value={sortBy} onChange={setSortBy} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden outline-button rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] leading-none"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className={`md:block ${showFilters ? 'block' : 'hidden'} md:col-span-1`}>
          <div className="card rounded-lg p-6 sticky top-24">
            {data && (
              <FilterPanel
                stores={data.stores}
                selectedStores={selectedStores}
                onStoresChange={setSelectedStores}
                productType={productType}
                onProductTypeChange={setProductType}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {error && (
            <div className="card rounded-lg p-8 text-center text-red-500 mb-6">
              {error}
            </div>
          )}

          {loading && !data ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : data && data.products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {data.products.length} of {data.pagination.totalCount} products
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {data.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {data.pagination.page < data.pagination.totalPages && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="solid-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="card rounded-lg p-16 text-center animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">No Products Found</h3>
              <p className="text-muted mb-6 leading-relaxed">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStores([]);
                  setProductType("all");
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                }}
                className="outline-button rounded-full px-8 py-3 text-sm uppercase tracking-[0.25em] font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
