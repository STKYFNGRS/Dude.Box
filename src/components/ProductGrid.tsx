export interface ShopifyProduct {
    id: string;
    title: string;
    description: string;
    handle: string;
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
  
  export interface ProductConnection {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  }
  
  export interface ShopifyQueryResponse {
    data?: {
      products?: ProductConnection;
      product?: ShopifyProduct;
    };
  }