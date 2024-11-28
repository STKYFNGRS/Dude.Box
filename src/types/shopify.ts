// Basic Shopify types
interface ShopifyResponse<T> {
  data: T;
}

export interface ShopifyUserError {
  field: string;
  message: string;
}

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

// Product types
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
        altText: string; // Made required
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string; // Made required
        availableForSale: boolean; // Added
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

// Cart types
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
    selectedOptions?: Array<{
      name: string;
      value: string;
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
  size?: string;
}

// Shopify API Response types
export interface ShopifyCartCreateData {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    } | null;
    userErrors: ShopifyUserError[];
  };
}

export type ShopifyCartCreateResponse = ShopifyResponse<{
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    } | null;
    userErrors: ShopifyUserError[];
  };
}>;

export interface ShopifyCartQueryData {
  cart: {
    id: string;
    lines: {
      edges: Array<{
        node: CartNode;
      }>;
    };
  } | null;
}

export type ShopifyCartQueryResponse = ShopifyResponse<{
  cart: {
    id: string;
    lines: {
      edges: Array<{
        node: CartNode;
      }>;
    };
  };
}>;

// Type guards
export function isCartCreateResponse(data: unknown): data is ShopifyCartCreateResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    typeof (data as Record<string, unknown>).data === 'object' &&
    (data as Record<string, unknown>).data !== null &&
    'cartCreate' in (data as Record<string, { cartCreate: unknown }>).data
  );
}