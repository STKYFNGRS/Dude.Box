import { Product } from '@/types/product';

// Move this to a separate file later if needed
export const products: Product[] = [
    {
      id: 1,
      name: "Dude Mood Mug",
      description: "Thermal Reactive Coffee Cup",
      price: 24.99,
      image: "/product-images/Dude Mood Coffee Mug.jpg",
      category: "Accessories",
      variantId: "gid://shopify/ProductVariant/60311584461663273532"
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
    // ... rest of your products
  ];