import '@/app/globals.css';
import { Providers } from '@/app/providers';

export const metadata = {
  title: 'Dude.Box',
  description: 'Dude.Box Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body suppressHydrationWarning={true} className="min-h-screen flex flex-col bg-background">
        <Providers>
          <main className="flex-grow flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}