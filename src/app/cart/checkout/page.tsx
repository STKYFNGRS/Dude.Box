import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutStoreGroup } from "@/components/CheckoutStoreGroup";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/portal/login?redirect=/cart/checkout");
  }

  // Get user's cart
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/portal/login");
  }

  const cart = await prisma.cart.findFirst({
    where: { user_id: user.id },
    include: {
      items: {
        include: {
          product: true,
          store: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="card rounded-lg p-12 text-center">
          <div className="text-4xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to get started!
          </p>
          <a href="/" className="solid-button rounded-full px-6 py-3 text-sm inline-block">
            Browse Stores
          </a>
        </div>
      </div>
    );
  }

  // Group items by store
  const itemsByStore: {
    [storeId: string]: {
      store: any;
      items: any[];
      total: number;
    };
  } = {};

  cart.items.forEach((item) => {
    if (!itemsByStore[item.store.id]) {
      itemsByStore[item.store.id] = {
        store: item.store,
        items: [],
        total: 0,
      };
    }
    itemsByStore[item.store.id].items.push(item);
    itemsByStore[item.store.id].total +=
      parseFloat(item.product.price.toString()) * item.quantity;
  });

  const storeGroups = Object.values(itemsByStore);
  const grandTotal = storeGroups.reduce((sum, group) => sum + group.total, 0);
  const platformFee = grandTotal * 0.1;

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Review your order from {storeGroups.length} store
          {storeGroups.length !== 1 ? "s" : ""}
        </p>
      </div>

      {storeGroups.length > 1 && (
        <div className="card rounded-lg p-4 bg-blue-500/10 border-blue-500/20">
          <div className="text-sm">
            <strong>Multi-Store Checkout:</strong> You're purchasing from{" "}
            {storeGroups.length} different stores. You'll complete a separate
            checkout for each store to ensure each maker receives payment
            directly.
          </div>
        </div>
      )}

      {/* Store Groups */}
      <div className="space-y-6">
        {storeGroups.map((group, index) => (
          <CheckoutStoreGroup
            key={group.store.id}
            store={group.store}
            items={group.items}
            total={group.total}
            storeNumber={index + 1}
            totalStores={storeGroups.length}
          />
        ))}
      </div>

      {/* Order Summary */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee (10%)</span>
            <span>${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span>Grand Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Platform fee supports the Dude.Box marketplace. Each maker receives
          90% of their sale price.
        </div>
      </div>
    </div>
  );
}
