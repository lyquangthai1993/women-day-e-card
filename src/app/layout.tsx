import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppConfig } from '../lib/i18n';

const siteName = "Happy Vietnamese Women's Day 20/10 - E-Card";
const siteDescription =
  "Create and send heartfelt Vietnamese Women's Day 20/10 greeting e-cards with personalized botanical floral themes, live preview, high-res download, and sweet ice cream pass.";
const siteUrl = 'https://women-day-e-card.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: "20/10 E-Card",
  keywords: [
    "20/10",
    "Vietnamese Women's Day",
    "E-Card",
    "Greeting Card",
    "Thiệp 20/10",
    "Ngày Phụ Nữ Việt Nam",
  ],
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: '20/10 E-Card & Ice Cream Pass',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        secureUrl: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
  },
  other: {
    'og:image:secure_url': `${siteUrl}/og-image.jpg`,
    'og:image:type': 'image/jpeg',
    'og:image:width': '1200',
    'og:image:height': '630',
  },
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
  const locale = AppConfig.defaultLocale;

  return (
    <html lang={locale} className="h-full bg-slate-50">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Charm:wght@400;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="image_src" href="https://women-day-e-card.vercel.app/og-image.jpg" />
      </head>
      <body className="min-h-full flex flex-col text-slate-800 antialiased selection:bg-rose-200">
        {children}
      </body>
    </html>
  );
}
