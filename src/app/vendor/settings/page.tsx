import { requireVendor } from "@/lib/vendor";
import { EditStoreForm } from "@/components/vendor/EditStoreForm";
import { StoreCustomizationForm } from "@/components/vendor/StoreCustomizationForm";
import { DeleteStoreButton } from "@/components/vendor/DeleteStoreButton";

export const dynamic = "force-dynamic";

export default async function VendorSettingsPage() {
  const store = await requireVendor();
  
  // Get user profile picture from store owner
  const userProfilePicture = store.owner?.profile_image_url || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage your store information and policies
        </p>
      </div>

      <div className="card rounded-lg p-6">
        <EditStoreForm store={store} userProfilePicture={userProfilePicture} />
      </div>

      {/* Storefront Customization */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Storefront Customization</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Customize your store's appearance with your own colors and welcome message.
        </p>
        <StoreCustomizationForm store={store} />
      </div>

      {/* Stripe Connect Status */}
      <div className="card rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Payment Settings</h2>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Stripe Status
            </div>
            {store.stripe_onboarded ? (
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-medium">
                  ✓ Connected
                </span>
                <span className="text-xs text-muted-foreground">
                  ({store.stripe_account_id})
                </span>
              </div>
            ) : (
              <div>
                <span className="text-amber-500 font-medium">
                  Not Connected
                </span>
                <a
                  href={`/api/stores/connect-stripe?storeId=${store.id}`}
                  className="block mt-3 solid-button rounded-full px-6 py-2 text-sm w-fit"
                >
                  Connect Stripe Account
                </a>
              </div>
            )}
          </div>
          {store.stripe_onboarded && (
            <div className="text-sm text-muted-foreground">
              You'll receive payouts from Stripe according to their standard
              payout schedule (typically 2 days after each sale).
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card rounded-lg p-6 border-red-500/20">
        <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-4">
          These actions cannot be undone. Please be careful.
        </p>
        <DeleteStoreButton storeName={store.name} />
      </div>
    </div>
  );
}
