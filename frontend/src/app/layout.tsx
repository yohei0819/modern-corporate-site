import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import { organizationJsonLd, webSiteJsonLd } from '@/lib/json-ld';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'CORP. - 採用サイト',
    template: '%s | CORP.',
  },
  description: 'テクノロジーで未来を創る。CORP.の採用情報サイトです。募集職種、社員紹介、働く環境など採用に関する情報をお届けします。',
  metadataBase: new URL('https://frontend-yohei0819.vercel.app'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'CORP. 採用サイト',
    title: 'CORP. - 採用サイト',
    description: 'テクノロジーで未来を創る。CORP.の採用情報・募集職種・社員紹介をお届けします。',
    url: 'https://frontend-yohei0819.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CORP. - 採用サイト',
    description: 'テクノロジーで未来を創る。CORP.の採用情報・募集職種・社員紹介をお届けします。',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://recruit-api-sop3.onrender.com" />
        <link rel="dns-prefetch" href="https://recruit-api-sop3.onrender.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd()) }}
          />
          <a href="#main-content" className="skip-link">
            メインコンテンツへスキップ
          </a>
          <Header />
          <main id="main-content" className="flex-1 page-transition">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
