import { MemberLoginForm } from "@/components/MemberLoginForm";
import { Section } from "@/components/Section";

export default function PortalLoginPage() {
  return (
    <div className="flex flex-col gap-10">
      <Section
        eyebrow="Member Portal"
        title="Login"
        description="Access is reserved for verified members."
      />
      <div className="card rounded-lg p-6 max-w-lg">
        <MemberLoginForm />
      </div>
    </div>
  );
}
