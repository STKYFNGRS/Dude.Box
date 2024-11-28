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