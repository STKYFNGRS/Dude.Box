"use client";

import { MemberLoginForm } from "@/components/MemberLoginForm";
import { Section } from "@/components/Section";
import { useSearchParams } from "next/navigation";

export default function PortalLoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  
  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title="Login"
        description="Access is reserved for verified members."
      />
      <div className="card rounded-lg p-6 max-w-lg">
        <MemberLoginForm redirectTo={redirect || undefined} />
      </div>
    </div>
  );
}
