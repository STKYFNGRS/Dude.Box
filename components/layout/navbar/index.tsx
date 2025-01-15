import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';

const { SITE_NAME } = process.env;

const STATIC_PAGES = [
  { title: 'Mint', path: '/web3' }
];

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  const allMenuItems = [...menu, ...STATIC_PAGES];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 lg:px-6 bg-black/30 backdrop-blur-xl border-b border-neutral-800">
      {/* Mobile Layout */}
      <div className="md:hidden flex w-full justify-between items-center">
        <div className="flex-none">
          <Suspense fallback={null}>
            <MobileMenu menu={allMenuItems} />
          </Suspense>
        </div>
        <div className="flex-none">
          <Link href="/" prefetch={true} className="flex items-center justify-center">
            <LogoSquare />
          </Link>
        </div>
        <div className="flex-none">
          <CartModal />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-400 underline-offset-4 hover:text-white transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
     
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-sm items-center">
            {STATIC_PAGES.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className="text-neutral-400 underline-offset-4 hover:text-white transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-end md:block">
            <CartModal />
          </div>
        </div>
      </div>
    </nav>
  );
}