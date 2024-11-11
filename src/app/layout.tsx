import { Metadata } from 'next';
import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: 'Dude',
  description: 'Supporting everyday Dudes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}