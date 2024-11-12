'use client';

import { ClientLayout } from '@/app/components/Client-Layout';
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import LoadingSkeleton from '@/components/Loading';
import { ShopifyProduct } from '@/types/shopify';

export default function Shop() {
  const transformedProducts: ShopifyProduct[] = [
    {
      id: "gid://shopify/Product/1",
      title: "Dude Mood Mug",
      description: "Thermal Reactive Coffee Cup.",
      handle: "dude-mood-mug",
      priceRange: {
        minVariantPrice: {
          amount: "24.99",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Dude Mood Coffee Mug.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/51671353262448"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/2",
      title: "We Ride At Dawn",
      description: "Light Roast For A Clear Mind.",
      handle: "we-ride-at-dawn-coffee",
      priceRange: {
        minVariantPrice: {
          amount: "19.99",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Light Roast Coffee Dude Front.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/51671353262449"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/3",
      title: "Night Watch",
      description: "Dark Roast Coffee - A bold, full-bodied blend for the nighttime guardians. Rich chocolate and caramel notes.",
      handle: "night-watch-coffee",
      priceRange: {
        minVariantPrice: {
          amount: "19.99",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Dark Roast Coffee Dude Front.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/51671353262450"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/4",
      title: "The Balanced Blade",
      description: "Medium Roast Coffee - Perfect harmony of strength and smoothness. Notes of nuts and dark chocolate.",
      handle: "balanced-blade-coffee",
      priceRange: {
        minVariantPrice: {
          amount: "19.99",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Medium Roast Coffee Dude Front.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/51671353262451"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/5",
      title: "Dude Tee",
      description: "Classic Black T-Shirt - Premium cotton blend.",
      handle: "dude-box-essential-t",
      priceRange: {
        minVariantPrice: {
          amount: "24.38",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Dude Tee.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/51671353262452"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/6",
      title: "Dude Comfort Hoodie",
      description: "Premium Black Hoodie",
      handle: "dawn-patrol-hoodie",
      priceRange: {
        minVariantPrice: {
          amount: "59.99",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Dude Hoodie.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/51671353262453"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/7",
      title: "It's A Pickleball Kit, Dude",
      description: "Premium quality pickleball with the iconic Dude Box logo.",
      handle: "dude-box-pickleball",
      priceRange: {
        minVariantPrice: {
          amount: "51.99",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Pickleball.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/21092167863112677120"
            }
          }
        ]
      }
    },
    {
      id: "gid://shopify/Product/8",
      title: "Dude Recovery Slides",
      description: "Because Your Feet Earned This.",
      handle: "dude-box-slides",
      priceRange: {
        minVariantPrice: {
          amount: "45.42",
          currencyCode: "USD"
        }
      },
      images: {
        edges: [
          {
            node: {
              url: "/product-images/Slides.jpg"
            }
          }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: "gid://shopify/ProductVariant/24419442339251658478"
            }
          }
        ]
      }
    }
  ];

  return (
    <ClientLayout>
      <div className="pt-24 min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
          {/* Collection Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              The Origin Collection (Coming Soon)
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our first drop. Eight pieces designed to support your journey from dawn to dusk, 
              from grinding to unwinding.
            </p>
          </div>

          {/* Product Grid */}
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {transformedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Suspense>

          {/* Mission Statement */}
          <div className="text-center text-gray-400 max-w-3xl mx-auto pb-8">
            <p>
              Every purchase supports our mission to create free mental health resources 
              and community spaces for men who are ready to write a different story.
            </p>
          </div>
        </div>
        <Analytics />
      </div>
    </ClientLayout>
  );
}