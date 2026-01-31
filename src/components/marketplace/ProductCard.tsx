"use client";

import Link from "next/link";
import Image from "next/image";

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const price = parseFloat(product.price.toString());
  const isSubscription = product.interval === "month";

  return (
    <Link
      href={`https://${product.store.subdomain}.dude.box/products/${product.id}`}
      className="card-hover rounded-lg p-6 group block"
    >
      {/* Product Image */}
      <div className="aspect-square rounded-lg border-2 border-border bg-background/40 mb-4 flex items-center justify-center overflow-hidden group-hover:border-accent transition-all duration-300 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted font-semibold">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="section-title text-lg group-hover:text-accent transition-colors line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price and Store */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">
              ${price.toFixed(2)}
              {isSubscription && <span className="text-xs text-muted-foreground">/mo</span>}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {product.store.logo_url && (
                <Image
                  src={product.store.logo_url}
                  alt={product.store.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {product.store.name}
              </span>
            </div>
          </div>
          <div className="outline-button rounded-full px-4 py-2 text-xs font-semibold group-hover:border-accent group-hover:text-accent">
            View
          </div>
        </div>
      </div>
    </Link>
  );
}
