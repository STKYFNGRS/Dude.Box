'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { useToast } from '@/components/ui/use-toast';
import { 
  CartItem,
  CartLineNode
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

// Move client initialization outside component
const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
  apiVersion: '2024-01'
});

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
  }, [isInitialized, toast]);

  const fetchCart = useCallback(async (id: string) => {
    if (!id) return;
    
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
        .map(({ node }: { node: CartLineNode }) => {
          if (!node?.merchandise?.product) return null;
          
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
            size: sizeOption?.value
          };
        })
        .filter((item: CartItem | null): item is CartItem => item !== null);
  
      setItems(validItems);
    } catch (error) {
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
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  useEffect(() => {
    let mounted = true;

    const initCart = async () => {
      if (!mounted) return;

      try {
        const storedCartId = localStorage.getItem('shopifyCartId');
        const storedCheckoutUrl = localStorage.getItem('shopifyCheckoutUrl');
        
        if (storedCartId && storedCheckoutUrl) {
          setCartId(storedCartId);
          setCheckoutUrl(storedCheckoutUrl);
          await fetchCart(storedCartId);
        } else {
          const { id, checkoutUrl: newCheckoutUrl } = await createCart();
          if (mounted) {
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
        if (mounted) {
          setCartId(null);
          setCheckoutUrl(null);
        }
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    if (typeof window !== 'undefined') {
      initCart();
    }

    return () => {
      mounted = false;
    };
  }, [createCart, fetchCart]);

  // Rest of the cart methods...
  const addToCart = useCallback(async (product: CartItem) => {
    if (!cartId) return;
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
    } finally {
      setIsLoading(false);
    }
  }, [cartId, fetchCart, toast]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const { id, checkoutUrl: newCheckoutUrl } = await createCart();
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
    } finally {
      setIsLoading(false);
    }
  }, [createCart, toast]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

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

  const value = useMemo(() => ({
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
  }), [
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
    isOpen
  ]);

  return (
    <CartContext.Provider value={value}>
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