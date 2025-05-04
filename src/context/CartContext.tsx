'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopifyProduct, ShopifyVariant } from '@/utils/shopify';

// Define cart item type
export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
  variantId?: string;
}

// Define cart context type
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ShopifyProduct, variant: ShopifyVariant, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  checkout: () => Promise<string>;
  isCheckingOut: boolean;
  isClearing: boolean;
}

// Create the context with a default empty implementation
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: async () => {},
  isCartOpen: false,
  toggleCart: () => {},
  totalItems: 0,
  subtotal: 0,
  checkout: async () => '',
  isCheckingOut: false,
  isClearing: false,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component that wraps the app and provides cart functionality
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('dudebox_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      
      // Load Shopify cart ID
      const savedCartId = localStorage.getItem('dudebox_shopify_cart_id');
      if (savedCartId) {
        setShopifyCartId(savedCartId);
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('dudebox_cart', JSON.stringify(cart));
      
      // Calculate totals
      const items = cart.reduce((total, item) => total + item.quantity, 0);
      setTotalItems(items);
      
      const total = cart.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0);
      setSubtotal(total);
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);
  
  // Save Shopify cart ID to localStorage when it changes
  useEffect(() => {
    if (shopifyCartId) {
      localStorage.setItem('dudebox_shopify_cart_id', shopifyCartId);
    } else {
      localStorage.removeItem('dudebox_shopify_cart_id');
    }
  }, [shopifyCartId]);
  
  // Add a product to the cart
  const addToCart = (product: ShopifyProduct, variant: ShopifyVariant, quantity: number) => {
    setCart(prevCart => {
      // Check if the specific variant already exists in cart
      const existingItem = prevCart.find(item => 
        item.productId === product.id && 
        item.variantId === variant.id // Use the passed variant ID
      );
      
      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map(item => 
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart using the specific variant details
        const newItem: CartItem = {
          id: `${product.id}_${variant.id}_${Date.now()}`, // Create unique cart item ID using variant
          productId: product.id,
          title: `${product.title} ${variant.title !== 'Default Title' ? `- ${variant.title}` : ''}`, // Add variant title if not default
          price: variant.price.amount, // Use the passed variant price
          quantity: quantity,
          image: variant.image?.originalSrc || product.images.edges[0]?.node.originalSrc || '/android-chrome-512x512.png',
          variantId: variant.id // Use the passed variant ID
        };
        return [...prevCart, newItem];
      }
    });
    
    // Open cart drawer when adding items
    setIsCartOpen(true);
  };
  
  // Remove an item from the cart
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  // Update the quantity of an item in the cart
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear the entire cart (both local and Shopify)
  const clearCart = async (): Promise<void> => {
    try {
      setIsClearing(true);
      
      // Clear local cart first
      setCart([]);
      
      // Clear Shopify cart if we have a cart ID
      if (shopifyCartId) {
        const response = await fetch('/api/cart/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartId: shopifyCartId }),
        });
        
        const data = await response.json();
        
        if (data.success && data.newCartId) {
          // Update with new empty cart ID
          setShopifyCartId(data.newCartId);
        }
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setIsClearing(false);
    }
  };
  
  // Toggle cart open/closed
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  // Checkout function to create a Shopify cart and redirect to checkout
  const checkout = async (): Promise<string> => {
    try {
      setIsCheckingOut(true);
      
      // Format cart items for the API
      const checkoutItems = cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));
      
      // Call our API to create a Shopify cart
      const response = await fetch('/api/cart/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: checkoutItems }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }
      
      // Save the cart ID for future reference (if we can extract it from the checkout URL)
      if (data.checkoutUrl) {
        // Shopify checkout URLs sometimes contain the cart ID
        const matches = data.checkoutUrl.match(/\/([a-zA-Z0-9]+)\?/);
        if (matches && matches[1]) {
          setShopifyCartId(matches[1]);
        }
      }
      
      return data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      toggleCart,
      totalItems,
      subtotal,
      checkout,
      isCheckingOut,
      isClearing
    }}>
      {children}
    </CartContext.Provider>
  );
};
