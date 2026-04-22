import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dashboard Olímpico 2026',
  description: 'Acompanhe seu desempenho em olimpíadas acadêmicas como um atleta de alto rendimento',
  keywords: ['olimpíadas', 'acadêmico', 'matemática', 'física', 'química', 'desempenho'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.svg',
    apple: '/icons/icon-192x192.svg',
  },
  openGraph: {
    title: 'Dashboard Olímpico 2026',
    description: 'Acompanhe seu desempenho em olimpíadas acadêmicas',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  );
}
