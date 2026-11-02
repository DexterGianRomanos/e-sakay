import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Sakay | Southern Leyte Commuter Hub',
  description: 'Transit tracking and LTFRB fare calculator for Southern Leyte',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta name="color-scheme" content="only light" />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}