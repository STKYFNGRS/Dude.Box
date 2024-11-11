import '@/app/globals.css';
import { ServerLayout } from '@/app/components/ServerLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning={true}>
        <ServerLayout>
          {children}
        </ServerLayout>
      </body>
    </html>
  );
}