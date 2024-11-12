'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from "lucide-react"; // Changed from importing multiple unused icons
import { useToast } from "@/hooks/use-toast";
import { useCart } from '../app/components/CartContext';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false); // Renamed from isAdding to match usage
  
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const imageUrl = product.images.edges[0]?.node.url;
  const variantId = product.variants.edges[0]?.node.id;

  const handleAddToCart = async () => {
    console.log('Adding to cart:', {
      id: product.id,
      title: product.title,
      price,
      quantity: 1,
      image: imageUrl,
      variantId
    });
    
    try {
      setAdding(true);
      
      await addToCart({
        id: product.id,
        title: product.title,
        price,
        quantity: 1,
        image: imageUrl,
        variantId: variantId
      });
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
      <div className="relative aspect-square">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.handle}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">
              ${price.toFixed(2)}
            </span>
          </div>

          <button 
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center transition-all gap-2
              ${adding 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'} 
              text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? (
              <>
                <ShoppingCart className="h-4 w-4" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}