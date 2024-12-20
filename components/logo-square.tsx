import clsx from 'clsx';
import LogoIcon from './icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' | undefined }) {
  return (
    <div
      className={clsx(
        'flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black',
        {
          'h-[100px] w-[100px] rounded-xl': !size,
          'h-[60px] w-[60px] rounded-lg': size === 'sm'
        }
      )}
    >
      <LogoIcon
        className={clsx({
          'h-[100px] w-[100px]': !size,
          'h-[60px] w-[60px]': size === 'sm'
        })}
      />
    </div>
  );
}
