export interface ShopifyImage {
  url: string;
  altText?: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title?: string;
        price?: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variantId: string;
}

export interface ShopifyCartCreateResponse {
  cartCreate?: {
    cart: {
      id: string;
      checkoutUrl: string;
    };
  };
}

export interface ShopifyCartResponse {
  cart?: {
    lines: {
      edges: Array<{
        node: CartNode;
      }>;
    };
  };
}

export interface CartNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    product: {
      title: string;
      images: {
        edges: Array<{
          node: {
            url: string;
          };
        }>;
      };
    };
  };
}