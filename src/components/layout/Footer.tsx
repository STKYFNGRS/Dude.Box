import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/Logo.png"
                alt="Dude.Box"
                width={90}
                height={26}
                className="h-6 w-auto opacity-50 hover:opacity-80 transition-opacity"
              />
            </Link>
            <span className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} Dude Dot Box LLC
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
