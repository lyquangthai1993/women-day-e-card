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
      <body className="min-h-full flex flex-col text-slate-800 antialiased selection:bg-rose-200">
        {children}
      </body>
    </html>
  );
}
