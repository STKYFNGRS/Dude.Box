export type CartAttributes = {
  isGift?: boolean;
  giftNote?: string;
};

const STORAGE_KEY = "dudebox.cart.attributes";

export const readCartAttributes = (): CartAttributes => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as CartAttributes;
  } catch {
    return {};
  }
};

export const writeCartAttributes = (attributes: CartAttributes) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attributes));
};
