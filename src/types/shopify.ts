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

export interface ShopifyCartCreateMutation {
  data: {
    cartCreate: {
      cart: {
        id: string;
      };
    };
  };
}

export interface ShopifyCartQuery {
  data: {
    cart: {
      lines: {
        edges: Array<{
          node: CartNode;
        }>;
      };
    };
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