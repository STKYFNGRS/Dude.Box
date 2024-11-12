export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    variantId: string;
    sizeVariants?: {
      size: string;
      variantId: string;
      price: number;
    }[];
  }