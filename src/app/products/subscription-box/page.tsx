import { redirect } from "next/navigation";

export default function SubscriptionBoxPage() {
  // Redirect to vendor registration - subscription boxes are no longer offered
  redirect("/members/become-vendor");
}
