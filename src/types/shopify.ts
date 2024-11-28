export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode?: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
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

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
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

export interface CartNode {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{
      node: CartItem;
    }>;
  };
  estimatedCost?: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}