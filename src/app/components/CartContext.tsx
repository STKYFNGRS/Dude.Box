'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useToast } from '@/components/ui/use-toast';
import { CartItem } from '@/types/shopify';

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

const client = createStorefrontApiClient({
  storeDomain: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`,
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

  const createCart = useCallback(async (): Promise<string> => {
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
  
      const response = await client.request(mutation);
      console.log('Cart creation response:', response);

      const cart = response?.data?.cartCreate?.cart;
      const userErrors = response?.data?.cartCreate?.userErrors || [];

      if (userErrors.length > 0) {
        throw new Error(userErrors[0].message);
      }

      if (!cart?.id) {
        throw new Error('Cart creation failed: Missing cart ID in response');
      }

      return cart.id;
    } catch (error) {
      console.error('Cart creation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create cart. Please try again.",
      });
      return '';
    }
  }, [toast]);

  const addToCart = useCallback(async (product: CartItem) => {
    console.log('addToCart called with:', product);
    if (!cartId) {
      console.error('No cart ID available');
      return;
    }

    setIsLoading(true);
    try {
      const mutation = `#graphql
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const response = await client.request(mutation, {
        variables: {
          cartId,
          lines: [{ merchandiseId: product.variantId, quantity: product.quantity }]
        }
      });

      if (response?.data?.cartLinesAdd?.userErrors?.length > 0) {
        throw new Error(response.data.cartLinesAdd.userErrors[0].message);
      }

      setItems(prevItems => [...prevItems, product]);
      setItemCount(prev => prev + product.quantity);
      setIsOpen(true);
      
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
    } finally {
      setIsLoading(false);
    }
  }, [cartId, toast]);

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

      setItems(prevItems => prevItems.filter(item => item.id !== variantId));
      setItemCount(prev => prev - 1);

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
    } finally {
      setIsLoading(false);
    }
  }, [cartId, toast]);

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

      setItems(prevItems => 
        prevItems.map(item => 
          item.id === variantId ? { ...item, quantity } : item
        )
      );

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
    } finally {
      setIsLoading(false);
    }
  }, [cartId, toast]);

  const clearCart = useCallback(async () => {
    setItems([]);
    setItemCount(0);
    if (!cartId) return;
    try {
      const newCartId = await createCart();
      setCartId(newCartId);
      localStorage.setItem('shopifyCartId', newCartId);

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
    }
  }, [cartId, createCart, toast]);

  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem('shopifyCartId');
      if (storedCartId) {
        console.log('Found stored cart ID:', storedCartId);
        setCartId(storedCartId);
      } else {
        console.log('Creating new cart...');
        const newCartId = await createCart();
        if (newCartId) {
          console.log('Created new cart ID:', newCartId);
          localStorage.setItem('shopifyCartId', newCartId);
          setCartId(newCartId);
        }
      }
    };

    initCart();
  }, [createCart]); // Added createCart to dependencies

  // Calculate total price
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const contextValue = {
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
  };

  return (
    <CartContext.Provider value={contextValue}>
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
};