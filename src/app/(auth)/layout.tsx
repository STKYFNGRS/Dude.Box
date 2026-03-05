import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="w-full py-4 px-6">
        <Link href="/" className="inline-block">
          <Image
            src="/Logo.png"
            alt="Dude.Box"
            width={140}
            height={40}
            priority
          />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
