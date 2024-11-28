// src/app/shop/page.tsx
'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import LoadingSkeleton from '@/components/Loading';
import { getAllProducts } from '@/lib/shopify';
import { useState, useEffect } from 'react';
import { ShopifyProduct } from '@/types/shopify';

// Transform function to ensure all required fields are present
function transformShopifyProduct(shopifyProduct: ShopifyProduct): ShopifyProduct {
  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    priceRange: shopifyProduct.priceRange,
    images: shopifyProduct.images,
    variants: {
      edges: shopifyProduct.variants.edges.map(({ node }) => ({
        node: {
          id: node.id,
          title: node.title,
          availableForSale: node.availableForSale,
          selectedOptions: node.selectedOptions,
          price: node.price
        }
      }))
    }
  };
}

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await getAllProducts();
        if (Array.isArray(response)) {
          // Transform each product to ensure type safety
          const transformedProducts = response.map(product => 
            transformShopifyProduct(product as ShopifyProduct)
          );
          setProducts(transformedProducts);
        } else {
          console.error('Unexpected response structure:', response);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <ClientLayout>
      <main className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="flex-grow container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-[2100px] mx-auto">
            <Suspense fallback={<LoadingSkeleton />}>
              <div className="w-full flex justify-center">
                {loading ? (
                  <div className="w-full max-w-7xl">
                    <LoadingSkeleton />
                  </div>
                ) : (
                  <div className="w-full max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
        <Analytics />
      </main>
    </ClientLayout>
  );
}