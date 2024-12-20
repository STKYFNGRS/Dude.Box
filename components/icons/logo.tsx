import Image from 'next/image';

interface LogoIconProps extends React.ComponentProps<'div'> {
  width?: string | number;
  height?: string | number;
  fill?: string;
}

export default function LogoIcon({ width, height, fill, ...props }: LogoIconProps) {
  return (
    <div {...props}>
      <Image
        src="/logos/Final Favicon Logo No Background.png"
        alt="Logo"
        width={width ? Number(width) : 300}
        height={height ? Number(height) : 300}
        className={`w-full h-full object-contain ${fill === 'white' ? 'brightness-0 invert' : ''}`}
        priority
      />
    </div>
  );
}
