'use client';

import clsx from 'clsx';
import Image from 'next/image';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div className="p-2 bg-black rounded-lg border border-neutral-800">
      <div
        className={clsx(
          'flex flex-none items-center justify-center',
          {
            'h-[60px] w-[60px]': !size || size === 'sm'
          }
        )}
      >
        <Image
          src="/logos/Final Favicon Logo No Background.png"
          alt="DUDE.BOX Logo"
          width={60}
          height={60}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}