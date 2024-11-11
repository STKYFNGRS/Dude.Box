'use client';

import { ProductCard } from '@/components/ProductCard';
import { ShopifyProduct } from '@/types/shopify';

interface ProductListProps {
  initialProducts: ShopifyProduct[];
}

export default function ProductList({ initialProducts }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {initialProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}