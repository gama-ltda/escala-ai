import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '⚽ escala-aí - Organize sua pelada com inteligência',
  description: 'Automatize a organização da sua pelada. Times equilibrados, controle automático e muito mais!',
  keywords: ['futebol', 'pelada', 'organização', 'times', 'amador'],
  authors: [{ name: 'escala-aí Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2E7D32',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '⚽ escala-aí - Organize sua pelada com inteligência',
    description: 'Automatize a organização da sua pelada. Times equilibrados, controle automático e muito mais!',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}