'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useToast } from '@/components/ui/use-toast';
import { 
  CartItem,
  CartNode,
} from '@/types/shopify';

interface CartContextType {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  initiateCheckout: () => void;
  isLoading: boolean;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Move environment checks outside of component
const checkEnvironment = () => {
  if (typeof window === 'undefined') return false;

  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    console.error('Missing required Shopify environment variables');
    return false;
  }

  return {
    domain: domain.replace(/^https?:\/\//, '').trim(),
    token: token.trim()
  };
};

const env = checkEnvironment();
const client = env ? createStorefrontApiClient({
  storeDomain: `https://${env.domain}`,
  publicAccessToken: env.token,
  apiVersion: '2024-01'
}) : null;

export function CartProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const { toast } = useToast();
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  }, [items]);

  const createCart = useCallback(async () => {
    if (!client || !env) {
      console.error('Shopify client not properly initialized');
      return { id: '', checkoutUrl: '' };
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
  
      const response = await client.request(mutation);

      const cartData = response?.data?.cartCreate;
      
      if (!cartData) {
        throw new Error('Invalid response format from Shopify API');
      }

      if (cartData.userErrors.length > 0) {
        const errorMessage = cartData.userErrors.map((error: { message: string }) => error.message).join(', ');

        throw new Error(`Shopify API errors: ${errorMessage}`);
      }

      if (!cartData.cart?.id || !cartData.cart?.checkoutUrl) {
        throw new Error('Missing cart ID or checkout URL from Shopify');
      }

      return {
        id: cartData.cart.id,
        checkoutUrl: cartData.cart.checkoutUrl
      };
    } catch (error) {
      console.error('Cart creation error:', error);
      if (isInitialized) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create cart",
        });
      }
      throw error;
    }
  }, [toast, isInitialized]);
  
  const fetchCart = useCallback(async (id: string): Promise<void> => {
    if (!id || !client) {
      console.error('Invalid cart ID or client not initialized');
      return;
    }
    
    setIsLoading(true);
    try {
      const query = `#graphql
        query GetCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      selectedOptions {
                        name
                        value
                      }
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
  
      const cartData = response?.data?.cart;
      if (!cartData?.lines?.edges) {
        throw new Error('Invalid cart data structure');
      }
  
      setCheckoutUrl(cartData.checkoutUrl);
      const validItems = cartData.lines.edges
        .map(({ node }: { node: CartNode }) => {
          if (!node?.merchandise?.product) return null;
          
          // Find size from selectedOptions
          const sizeOption = node.merchandise.selectedOptions?.find(
            option => option.name.toLowerCase() === 'size'
          );
  
          return {
            id: node.id,
            title: node.merchandise.product.title,
            price: parseFloat(node.merchandise.priceV2.amount),
            quantity: node.quantity,
            image: node.merchandise.product.images.edges[0]?.node?.url ?? '',
            variantId: node.merchandise.id,
            size: sizeOption?.value  // Add size if it exists
          };
        })
        .filter((item: CartItem | null): item is CartItem => item !== null);
  
      setItems(validItems);
    } catch (error: unknown) {
      console.error('Error fetching cart:', error);
      if (error instanceof Error || (typeof error === 'object' && error && 'toString' in error)) {
        if (String(error).includes('Cart not found')) {
          setCartId(null);
          setCheckoutUrl(null);
          localStorage.removeItem('shopifyCartId');
          localStorage.removeItem('shopifyCheckoutUrl');
          if (isInitialized) {
            toast({
              variant: "destructive",
              title: "Cart Error",
              description: "Cart not found. Creating a new cart.",
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, isInitialized]);

  useEffect(() => {
    const initCart = async () => {
      if (!client) return;

      try {
        const storedCartId = localStorage.getItem('shopifyCartId');
        const storedCheckoutUrl = localStorage.getItem('shopifyCheckoutUrl');
        
        if (storedCartId && storedCheckoutUrl) {
          setCartId(storedCartId);
          setCheckoutUrl(storedCheckoutUrl);
          await fetchCart(storedCartId);
        } else {
          const { id, checkoutUrl: newCheckoutUrl } = await createCart();
          if (id && newCheckoutUrl) {
            localStorage.setItem('shopifyCartId', id);
            localStorage.setItem('shopifyCheckoutUrl', newCheckoutUrl);
            setCartId(id);
            setCheckoutUrl(newCheckoutUrl);
          }
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        localStorage.removeItem('shopifyCartId');
        localStorage.removeItem('shopifyCheckoutUrl');
        setCartId(null);
        setCheckoutUrl(null);
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
    if (!cartId || !client) return;
    setIsLoading(true);
    try {
      const mutation = `#graphql
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
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
  
      const response = await client.request(mutation, {
        variables: {
          cartId,
          lines: [{ merchandiseId: product.variantId, quantity: product.quantity }]
        }
      });

      if (!response?.data?.cartLinesAdd) {
        throw new Error('Failed to add item to cart');
      }

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
        description: error instanceof Error ? error.message : "Failed to add item to cart"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);

  const removeFromCart = useCallback(async (variantId: string) => {
    if (!cartId || !client) return;
    setIsLoading(true);
    try {
      const mutation = `#graphql
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
  
      const response = await client.request(mutation, {
        variables: {
          cartId,
          lineIds: [variantId]
        }
      });

      if (!response?.data?.cartLinesRemove) {
        throw new Error('Failed to remove item from cart');
      }
  
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
        description: error instanceof Error ? error.message : "Failed to remove item from cart"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);
  
  const updateQuantity = useCallback(async (variantId: string, quantity: number) => {
    if (!cartId || !client) return;
    setIsLoading(true);
    try {
      const mutation = `#graphql
        mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
  
      const response = await client.request(mutation, {
        variables: {
          cartId,
          lines: [{ id: variantId, quantity }]
        }
      });

      if (!response?.data?.cartLinesUpdate) {
        throw new Error('Failed to update quantity');
      }
  
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
        description: error instanceof Error ? error.message : "Failed to update quantity"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);
  
  const clearCart = useCallback(async () => {
    if (!client) return;
    setIsLoading(true);
    try {
      const { id, checkoutUrl: newCheckoutUrl } = await createCart();
      if (!id || !newCheckoutUrl) {
        throw new Error('Failed to create new cart');
      }
      localStorage.setItem('shopifyCartId', id);
      localStorage.setItem('shopifyCheckoutUrl', newCheckoutUrl);
      setCartId(id);
      setCheckoutUrl(newCheckoutUrl);
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
        description: error instanceof Error ? error.message : "Failed to clear cart"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [createCart, toast]);

  const initiateCheckout = useCallback(() => {
    if (!checkoutUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to proceed to checkout. Please try again."
      });
      return;
    }
    window.location.href = checkoutUrl;
  }, [checkoutUrl, toast]);

  return (
    <CartContext.Provider value={{
      items,
      cartId,
      checkoutUrl,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      initiateCheckout,
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