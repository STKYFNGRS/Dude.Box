'use client';

import { useState, useEffect } from 'react';
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
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        price: {
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

interface VariantOption {
  size: string;
  variantId: string;
  price: number;
  availableForSale: boolean;
}

// Helper function to get size weight
function getSizeWeight(size: string): number {
  // Normalize size format (2XL and XXL should be treated the same)
  const normalizedSize = size.toUpperCase().trim();
  
  // Handle numeric sizes (for shoes)
  const numericSize = parseFloat(normalizedSize);
  if (!isNaN(numericSize)) {
    return numericSize;
  }

  // Standardize size formats
  const sizeMap: { [key: string]: number } = {
    'XS': 10,
    'S': 20,
    'M': 30,
    'L': 40,
    'XL': 50,
    'XXL': 60,
    '2XL': 60,  // Same as XXL
    'XXXL': 70,
    '3XL': 70,  // Same as XXXL
    '4XL': 80,
    '5XL': 90,
  };

  // Handle special cases like "2XL" or "XXL"
  if (normalizedSize.includes('XL')) {
    if (normalizedSize.startsWith('2')) return 60;  // 2XL
    if (normalizedSize.startsWith('3')) return 70;  // 3XL
    if (normalizedSize.startsWith('4')) return 80;  // 4XL
    if (normalizedSize.startsWith('5')) return 90;  // 5XL
    if (normalizedSize.startsWith('XX')) return 60; // XXL
    if (normalizedSize.startsWith('XXX')) return 70; // XXXL
    if (normalizedSize === 'XL') return 50;         // XL
  }

  return sizeMap[normalizedSize] ?? 999; // Unknown sizes go to the end
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const basePrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const imageUrl = product.images.edges[0]?.node.url;
  const defaultVariantId = product.variants.edges[0]?.node.id;

  // Process variants on component mount
  useEffect(() => {
    try {
      const processedVariants: VariantOption[] = product.variants.edges
        .map(({ node }) => {
          const sizeOption = node.selectedOptions.find(opt => 
            opt.name.toLowerCase() === 'size' ||
            opt.name.toLowerCase() === 'shoe size'
          );
          
          if (sizeOption) {
            return {
              size: sizeOption.value,
              variantId: node.id,
              price: parseFloat(node.price.amount),
              availableForSale: node.availableForSale
            };
          }
          return null;
        })
        .filter((variant): variant is VariantOption => variant !== null)
        .sort((a, b) => {
          const aWeight = getSizeWeight(a.size);
          const bWeight = getSizeWeight(b.size);
          return aWeight - bWeight; // Sort from smallest to largest
        });

      setVariants(processedVariants);
      
      // If there's only one variant or no size variants, we don't need size selection
      if (processedVariants.length === 1) {
        setSelectedSize(processedVariants[0].size);
      } else if (processedVariants.length === 0) {
        setSelectedSize('default');
      }
    } catch (error) {
      console.error('Error processing variants:', error);
      setVariants([]);
      setSelectedSize('default');
    }
  }, [product]);

  // Check if product needs size selection (more than one size variant)
  const needsSizeSelection = variants.length > 1;

  // Get the actual price based on selected size
  const getVariantPrice = (size: string): number => {
    if (!needsSizeSelection) return basePrice;
    const variant = variants.find(v => v.size === size);
    return variant ? variant.price : basePrice;
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (needsSizeSelection && !selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to the cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAdding(true);
      
      let variantId = defaultVariantId;
      let price = basePrice;
      let variantTitle = '';

      if (variants.length > 0) {
        const selectedVariant = needsSizeSelection 
          ? variants.find(v => v.size === selectedSize)
          : variants[0];
          
        if (selectedVariant) {
          variantId = selectedVariant.variantId;
          price = selectedVariant.price;
          variantTitle = needsSizeSelection ? ` - Size ${selectedSize}` : '';
        }
      }

      await addToCart({
        id: product.id,
        title: `${product.title}${variantTitle}`,
        price,
        quantity: 1,
        image: imageUrl || '',
        variantId,
        size: selectedSize,
      });
      
      toast({
        title: "Added to Cart",
        description: `${product.title}${variantTitle} has been added to your cart.`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add the item to the cart. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Show current price based on selected size or base price
  const currentPrice = selectedSize && needsSizeSelection ? getVariantPrice(selectedSize) : basePrice;

  return (
    <div className="group bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
      <div className="relative aspect-square">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
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

          {needsSizeSelection && (
            <Select value={selectedSize} onValueChange={handleSizeChange}>
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem 
                    key={variant.variantId} 
                    value={variant.size}
                    disabled={!variant.availableForSale}
                  >
                    Size {variant.size}
                    {!variant.availableForSale && ' (Out of Stock)'}
                    {variant.price !== basePrice ? ` - $${variant.price.toFixed(2)}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button 
            className={`w-full ${isAdding ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={handleAddToCart}
            disabled={isAdding || (needsSizeSelection && !selectedSize)}
          >
            {isAdding ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                {needsSizeSelection && !selectedSize ? 'Select Size' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}