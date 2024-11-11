'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import type { CartItem, CartNode } from '@/types/shopify';

interface CartContextType {
  items: CartItem[];
  cartId: string | null;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined');
}

if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not defined');
}

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN.replace('https://', '').replace('http://', '');

const client = createStorefrontApiClient({
  storeDomain: `https://${storeDomain}`,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  apiVersion: '2024-01'
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createCart = async (): Promise<string> => {
    try {
      console.log('Creating cart...');
      const mutation = `#graphql
        mutation CartCreate {
          cartCreate(input: {}) {
            cart {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const response = await client.request(mutation);
      console.log('Cart creation response:', response);

      if (!response?.data?.cartCreate?.cart?.id) {
        console.error('Cart creation failed:', response?.data?.cartCreate?.userErrors);
        throw new Error('Failed to create cart: Invalid response structure');
      }

      const newCartId = response.data.cartCreate.cart.id;
      console.log('Cart created successfully:', newCartId);
      return newCartId;
    } catch (error) {
      console.error('Cart creation error:', error);
      throw new Error('Failed to create cart');
    }
  };


  const fetchCart = async (id: string) => {
    setIsLoading(true);
    try {
      const query = `#graphql
        query GetCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        images(first: 1) {
                          edges {
                            node {
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const response = await client.request(query, {
        variables: { cartId: id }
      });

      if (!response?.data?.cart?.lines?.edges) {
        return;
      }

      const cartLines = response.data.cart.lines.edges;
      setItems(cartLines.map(({ node }: { node: CartNode }) => ({
        id: node.id,
        title: node.merchandise.product.title,
        price: parseFloat(node.merchandise.priceV2.amount),
        quantity: node.quantity,
        image: node.merchandise.product.images.edges[0]?.node.url ?? '',
        variantId: node.merchandise.id
      })));
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Clear cart if it's invalid
      if (String(error).includes('Cart not found')) {
        setCartId(null);
        localStorage.removeItem('shopifyCartId');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: CartItem) => {
    setIsLoading(true);
    try {
      if (!cartId) {
        const newCartId = await createCart();
        localStorage.setItem('shopifyCartId', newCartId);
        setCartId(newCartId);
      }

      const mutation = `#graphql
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      await client.request(mutation, {
        variables: {
          cartId,
          lines: [{ merchandiseId: product.variantId, quantity: product.quantity }]
        }
      });

      await fetchCart(cartId!);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (variantId: string) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const mutation = `#graphql
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      await client.request(mutation, {
        variables: {
          cartId,
          lineIds: [variantId]
        }
      });

      await fetchCart(cartId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (variantId: string, quantity: number) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const mutation = `#graphql
        mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      await client.request(mutation, {
        variables: {
          cartId,
          lines: [{ id: variantId, quantity }]
        }
      });

      await fetchCart(cartId);
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const newCartId = await createCart();
      localStorage.setItem('shopifyCartId', newCartId);
      setCartId(newCartId);
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initCart = async () => {
      try {
        console.log('Initializing cart...');
        const storedCartId = localStorage.getItem('shopifyCartId');
        
        if (storedCartId) {
          console.log('Found stored cart ID:', storedCartId);
          setCartId(storedCartId);
          await fetchCart(storedCartId);
        } else {
          console.log('No stored cart ID found, creating new cart...');
          const newCartId = await createCart();
          console.log('Storing new cart ID:', newCartId);
          localStorage.setItem('shopifyCartId', newCartId);
          setCartId(newCartId);
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        localStorage.removeItem('shopifyCartId');
        setCartId(null);
      }
    };

    initCart();
  }, []);

  return (
    <CartContext.Provider value={{
      items,
      cartId,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};