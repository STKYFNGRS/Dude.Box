import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  cartBuyerIdentityUpdate,
  cartCreate,
  cartLinesAdd,
  cartLinesRemove,
  cartLinesUpdate,
  getCart,
  getCheckoutUrl,
} from "@/lib/shopify";

const CART_COOKIE_NAME = "dudebox_cart";

type CartAction =
  | { action: "addLines"; lines: Array<{ merchandiseId: string; quantity: number }> }
  | { action: "updateLines"; lines: Array<{ id: string; quantity: number }> }
  | { action: "removeLines"; lineIds: string[] }
  | { action: "associateCustomer"; customerAccessToken: string }
  | { action: "getCheckoutUrl" };

const setCartCookie = (cartId: string, response: NextResponse) => {
  response.cookies.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
};

const readCartId = () => cookies().get(CART_COOKIE_NAME)?.value ?? null;

export async function GET() {
  try {
    const existingCartId = readCartId();
    if (existingCartId) {
      const cart = await getCart(existingCartId);
      return NextResponse.json({ cartId: existingCartId, cart });
    }

    const cart = await cartCreate();
    const response = NextResponse.json({ cartId: cart.id, cart });
    setCartCookie(cart.id, response);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Unable to initialize cart." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CartAction;
    const existingCartId = readCartId();
    let cartId = existingCartId;
    let cart;

    if (!cartId) {
      cart = await cartCreate();
      cartId = cart.id;
    }

    if (!cartId) {
      return NextResponse.json({ error: "Cart not available." }, { status: 500 });
    }

    switch (body.action) {
      case "addLines": {
        cart = await cartLinesAdd(cartId, body.lines);
        const response = NextResponse.json({ cartId, cart });
        if (cartId !== existingCartId) {
          setCartCookie(cartId, response);
        }
        return response;
      }
      case "updateLines": {
        cart = await cartLinesUpdate(cartId, body.lines);
        const response = NextResponse.json({ cartId, cart });
        if (cartId !== existingCartId) {
          setCartCookie(cartId, response);
        }
        return response;
      }
      case "removeLines": {
        cart = await cartLinesRemove(cartId, body.lineIds);
        const response = NextResponse.json({ cartId, cart });
        if (cartId !== existingCartId) {
          setCartCookie(cartId, response);
        }
        return response;
      }
      case "associateCustomer": {
        cart = await cartBuyerIdentityUpdate(cartId, body.customerAccessToken);
        const response = NextResponse.json({ cartId, cart });
        if (cartId !== existingCartId) {
          setCartCookie(cartId, response);
        }
        return response;
      }
      case "getCheckoutUrl": {
        const checkoutUrl = await getCheckoutUrl(cartId);
        const response = NextResponse.json({ cartId, checkoutUrl });
        if (cartId !== existingCartId) {
          setCartCookie(cartId, response);
        }
        return response;
      }
      default:
        return NextResponse.json({ error: "Unsupported cart action." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Unable to update cart." }, { status: 500 });
  }
}
