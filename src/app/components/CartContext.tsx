'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useToast } from '@/components/ui/use-toast';
import { 
  CartItem,
  CartNode,
  ShopifyCartCreateResponse,
  ShopifyCartQueryResponse 
} from '@/types/shopify';

interface CartContextType {
  items: CartItem[];
  cartId: string | null;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Move environment checks outside of component to prevent layout shifts
const checkEnvironment = () => {
  if (typeof window === 'undefined') return; // Skip on server-side

  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) {
    console.error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined');
    return false;
  }

  if (!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not defined');
    return false;
  }

  return true;
};

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace('https://', '').replace('http://', '') || '';

const client = createStorefrontApiClient({
  storeDomain: `https://${storeDomain}`,
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
});

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { toast } = useToast();
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  }, [items]);

  const createCart = useCallback(async (): Promise<string> => {
    if (!checkEnvironment()) {
      return '';
    }

    try {
      const mutation = `#graphql
        mutation CartCreate {
          cartCreate {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
  
      const response = await client.request<ShopifyCartCreateResponse>(mutation);

      if (!response?.data?.data?.cartCreate) {
        console.warn('No response data received from Shopify API');
        return '';
      }

      const { cart, userErrors } = response.data.data.cartCreate;

      if (userErrors.length > 0) {
        console.warn('Shopify returned user errors:', userErrors);
        return '';
      }

      if (!cart?.id) {
        console.warn('Cart creation failed: Missing cart ID in response');
        return '';
      }

      return cart.id;
    } catch (error) {
      console.warn('Cart creation error:', error);
      // Only show toast for user-initiated actions, not initial load
      if (isInitialized) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create cart. Please try again.",
        });
      }
      return '';
    }
  }, [toast, isInitialized]);
  
  const fetchCart = useCallback(async (id: string): Promise<void> => {
    if (!id) return;
    
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

      const response = await client.request<ShopifyCartQueryResponse>(query, {
        variables: { cartId: id }
      });

      if (!response?.data?.data?.cart?.lines?.edges) {
        setItems([]);
        return;
      }

      const cartData = response.data.data.cart;
      setItems(cartData.lines.edges.map(({ node }: { node: CartNode }) => ({
        id: node.id,
        title: node.merchandise.product.title,
        price: parseFloat(node.merchandise.priceV2.amount),
        quantity: node.quantity,
        image: node.merchandise.product.images.edges[0]?.node.url ?? '',
        variantId: node.merchandise.id
      })));
    } catch (error) {
      console.warn('Error fetching cart:', error);
      if (String(error).includes('Cart not found')) {
        setCartId(null);
        localStorage.removeItem('shopifyCartId');
        // Only show toast for user-initiated actions
        if (isInitialized) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Cart not found. Creating a new cart.",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, isInitialized]);

  useEffect(() => {
    const initCart = async () => {
      if (!checkEnvironment()) return;

      try {
        const storedCartId = localStorage.getItem('shopifyCartId');
        
        if (storedCartId) {
          setCartId(storedCartId);
          await fetchCart(storedCartId);
        } else {
          const newCartId = await createCart();
          if (newCartId) {
            localStorage.setItem('shopifyCartId', newCartId);
            setCartId(newCartId);
          }
        }
      } catch (error) {
        console.warn('Error initializing cart:', error);
        localStorage.removeItem('shopifyCartId');
        setCartId(null);
      } finally {
        setIsInitialized(true);
      }
    };

    if (typeof window !== 'undefined') {
      initCart();
    }
  }, [createCart, fetchCart]);


  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = useCallback(async (product: CartItem) => {
    if (!cartId) return;
    setIsLoading(true);
    try {
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
  
      await fetchCart(cartId);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart. Please try again."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);
  
  const removeFromCart = useCallback(async (variantId: string) => {
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
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart."
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart. Please try again."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);
  
  const updateQuantity = useCallback(async (variantId: string, quantity: number) => {
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
      toast({
        title: "Cart updated",
        description: "Item quantity has been updated."
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity. Please try again."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);
  
  const clearCart = useCallback(async () => {
    if (!cartId) return;
    setIsLoading(true);
    try {
      const newCartId = await createCart();
      localStorage.setItem('shopifyCartId', newCartId);
      setCartId(newCartId);
      setItems([]);
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart."
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart. Please try again."
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, createCart, toast]);

  return (
    <CartContext.Provider value={{
      items,
      cartId,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isLoading,
      total,
      itemCount,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}