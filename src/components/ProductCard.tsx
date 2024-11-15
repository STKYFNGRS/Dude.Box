'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/app/components/CartContext';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Size variants for different product types with prices
const PRODUCT_SIZES = {
  'Dude Tee': [
    { size: 'S', variantId: 'gid://shopify/ProductVariant/51671100129648', price: 19.99 },
    { size: 'M', variantId: 'gid://shopify/ProductVariant/51671100162416', price: 19.99 },
    { size: 'L', variantId: 'gid://shopify/ProductVariant/51671100195184', price: 19.99 },
    { size: 'XL', variantId: 'gid://shopify/ProductVariant/51671100227952', price: 19.99 },
    { size: '2XL', variantId: 'gid://shopify/ProductVariant/51671100260720', price: 21.99 }
  ],
  'Dude Comfort Hoodie': [
    { size: 'S', variantId: 'gid://shopify/ProductVariant/51671341138288', price: 29.99 },
    { size: 'M', variantId: 'gid://shopify/ProductVariant/51671341171056', price: 29.99 },
    { size: 'L', variantId: 'gid://shopify/ProductVariant/51671341203824', price: 29.99 },
    { size: 'XL', variantId: 'gid://shopify/ProductVariant/51671341236592', price: 29.99 },
    { size: '2XL', variantId: 'gid://shopify/ProductVariant/51671341269360', price: 31.99 }
  ],
  'Dude Recovery Slides': [
    { size: '6', variantId: 'gid://shopify/ProductVariant/51671352312176', price: 38.99 },
    { size: '7', variantId: 'gid://shopify/ProductVariant/51671352344944', price: 38.99 },
    { size: '8', variantId: 'gid://shopify/ProductVariant/51671352377712', price: 38.99 },
    { size: '9', variantId: 'gid://shopify/ProductVariant/51671352410480', price: 38.99 },
    { size: '10', variantId: 'gid://shopify/ProductVariant/51671352443248', price: 38.99 },
    { size: '11', variantId: 'gid://shopify/ProductVariant/51671352476016', price: 38.99 },
    { size: '12', variantId: 'gid://shopify/ProductVariant/51671352508784', price: 38.99 }
  ]
};

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode?: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title?: string;
        price?: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const basePrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const imageUrl = product.images.edges[0]?.node.url;
  const defaultVariantId = product.variants.edges[0]?.node.id;
  
  // Check if product needs size selection
  const productSizes = PRODUCT_SIZES[product.title as keyof typeof PRODUCT_SIZES];
  const needsSize = Boolean(productSizes);

  // Get the actual price based on selected size
  const getVariantPrice = (size: string) => {
    if (!needsSize) return basePrice;
    const variant = productSizes.find(s => s.size === size);
    return variant ? variant.price : basePrice;
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (needsSize && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAdding(true);
      
      let variantId = defaultVariantId;
      let price = basePrice;
      let variantTitle = '';

      if (needsSize) {
        const selectedVariant = productSizes.find(s => s.size === selectedSize);
        if (selectedVariant) {
          variantId = selectedVariant.variantId;
          price = selectedVariant.price;
          variantTitle = ` - Size ${selectedSize}`;
        }
      }

      await addToCart({
        id: product.id,
        title: `${product.title}${variantTitle}`,
        price,
        quantity: 1,
        image: imageUrl,
        variantId
      });
      
      toast({
        title: "Added to cart",
        description: `${product.title}${variantTitle} has been added to your cart.`,
        duration: 2000,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Show current price based on selected size or base price
  const currentPrice = selectedSize ? getVariantPrice(selectedSize) : basePrice;

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
              ${currentPrice.toFixed(2)}
            </span>
          </div>

          {needsSize && (
            <Select value={selectedSize} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {productSizes.map((sizeOption) => (
                  <SelectItem key={sizeOption.variantId} value={sizeOption.size}>
                    Size {sizeOption.size} {sizeOption.price !== basePrice ? ` - $${sizeOption.price.toFixed(2)}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button 
            className={`w-full ${isAdding ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}