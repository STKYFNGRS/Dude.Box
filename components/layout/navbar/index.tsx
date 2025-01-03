import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';

const { SITE_NAME } = process.env;

const STATIC_PAGES = [
  { title: 'About', path: '/about' },
  { title: 'Web3', path: '/web3' }
];

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  const allMenuItems = [...menu, ...STATIC_PAGES];

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
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
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden absolute left-1/2 transform -translate-x-1/2 md:block">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-sm items-center">
            {STATIC_PAGES.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
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