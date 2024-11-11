'use client';

import { Suspense, useState } from 'react';  // Add useState here
import { Analytics } from "@vercel/analytics/react";
import Layout from "../components/Layout";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCart } from '../../components/CartContext';

// Types
interface SizeVariant {
  size: string;
  variantId: string;
  price: number;
}

// Update Product interface to include optional size variants
interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  variantId: string;
  sizeVariants?: SizeVariant[];
}


// Product data - you'll need to update these with actual Shopify variant IDs
const products: Product[] = [
  {
    id: 1,
    name: "Dude Mood Mug",
    description: "Thermal Reactive Coffee Cup",
    price: 24.99,
    image: "/product-images/Dude Mood Coffee Mug.jpg",
    category: "Accessories",
    variantId: "gid://shopify/ProductVariant/51671353262448"
  },
  {
    id: 2,
    name: "We Ride At Dawn",
    description: "A Light Roast For Clear Minds",
    price: 19.99,
    image: "/product-images/Light Roast Coffee Dude Front.jpg",
    category: "Coffee",
    variantId: "" // Need Shopify variant ID
  },
  {
    id: 3,
    name: "Peak Dude Roast",
    description: "Because Mornings Don't Have To Suck",
    price: 19.99,
    image: "/product-images/Medium Roast Coffee Dude Front.jpg",
    category: "Coffee",
    variantId: "" // Need Shopify variant ID
  },
  {
    id: 4,
    name: "Welcome To The Dark Side, Dude",
    description: "A French Roast That Punches Back",
    price: 19.99,
    image: "/product-images/Dark Roast Coffee Dude Front.jpg",
    category: "Coffee",
    variantId: "" // Need Shopify variant ID
  },
  {
    id: 5,
    name: "It's a Pickleball Kit, Dude",
    description: "Game On",
    price: 39.99,
    image: "/product-images/Pickleball.jpg",
    category: "Sports",
    variantId: "" // Need Shopify variant ID
  },
  {
    id: 6,
    name: "Dude Comfort Hoodie",
    description: "You Need This",
    price: 49.99,
    image: "/product-images/Dude Hoodie.jpg",
    category: "Apparel",
    variantId: "" // Need Shopify variant ID
  },
  {
    id: 7,
    name: "Dude Basic Tee",
    description: "Daily Comfort",
    price: 24.38,
    image: "/product-images/Dude Tee.jpg",
    category: "Apparel",
    variantId: "gid://shopify/ProductVariant/2149321637120640523", // Default to S size
    sizeVariants: [
      { size: "S", variantId: "gid://shopify/ProductVariant/2149321637120640523", price: 24.38 },
      { size: "M", variantId: "gid://shopify/ProductVariant/28311494208242985258", price: 24.38 },
      { size: "L", variantId: "gid://shopify/ProductVariant/3293190012195205780", price: 24.38 },
      { size: "XL", variantId: "gid://shopify/ProductVariant/13770242355059580237", price: 24.38 },
      { size: "2XL", variantId: "gid://shopify/ProductVariant/42070007226088609001", price: 26.78 },
      { size: "3XL", variantId: "gid://shopify/ProductVariant/23849466172648052366", price: 30.77 }
    ]
  },
  {
    id: 8,
    name: "Dude Recovery Slides",
    description: "Because Your Feet Earned This",
    price: 34.99,
    image: "/product-images/Slides.jpg",
    category: "Footwear",
    variantId: "" // Need Shopify variant ID
  }
];











function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden animate-pulse">
          <div className="p-4">
            <div className="aspect-square bg-gray-900 rounded-md mb-4" />
            <div className="h-6 bg-gray-900 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-900 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-900 rounded w-1/3 mb-4" />
            <div className="h-10 bg-gray-900 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, isLoading } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeVariants ? product.sizeVariants[0].size : ''
  );
  const [error, setError] = useState<string | null>(null);

  const currentVariant = product.sizeVariants?.find(v => v.size === selectedSize);
  const currentPrice = currentVariant?.price ?? product.price;
  const currentVariantId = currentVariant?.variantId ?? product.variantId;

  const handleAddToCart = async () => {
    if (product.sizeVariants && !selectedSize) {
      setError('Please select a size');
      return;
    }

    setError(null);
    try {
      await addToCart({
        id: product.id.toString(),
        variantId: currentVariantId,
        title: product.name + (selectedSize ? ` - ${selectedSize}` : ''),
        price: currentPrice,
        quantity: 1,
        image: product.image
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
      <div className="p-4">
        <div className="aspect-square relative mb-4 bg-gray-900 rounded-md overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-300 text-sm mb-4">{product.description}</p>
        <div className="text-sm text-gray-400 mb-2">{product.category}</div>
        
        {product.sizeVariants && (
          <div className="mb-4">
            <label htmlFor="size" className="block text-sm font-medium text-gray-300 mb-2">
              Size
            </label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {product.sizeVariants.map((variant) => (
                <option key={variant.size} value={variant.size}>
                  {variant.size} - ${variant.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-xl font-bold mb-4">${currentPrice.toFixed(2)}</div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2 mb-2">
            {error}
          </div>
        )}
        
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="w-full max-w-7xl p-4">
          {/* Collection Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              The Origin Collection
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our first drop. Eight pieces designed to support your journey from dawn to dusk, 
              from grinding to unwinding.
            </p>
          </div>

          {/* Product Grid */}
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>

          {/* Mission Statement */}
          <div className="mt-12 text-center text-gray-400 max-w-3xl mx-auto">
            <p>
              Every purchase supports our mission to create free mental health resources 
              and community spaces for men who are ready to write a different story.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </Layout>
  );
}