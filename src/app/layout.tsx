import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thiệp Chúc Mừng 20/10 - E-Card',
  description: 'Tạo và chia sẻ thiệp chúc mừng ngày Phụ nữ Việt Nam 20/10 với mã nhận diện thiết bị và vé nhận kem.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full bg-slate-50">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Charm:wght@400;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col text-slate-800 antialiased selection:bg-rose-200">
        {children}
      </body>
    </html>
  );
}
