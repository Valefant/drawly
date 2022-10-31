import './globals.css';
import { Gloria_Hallelujah } from '@next/font/google';
import pkg from '../package.json';

const font = Gloria_Hallelujah({ weight: '400', subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const title = `App | ${pkg.name}`;

  return (
    <html lang="en" className={font.className}>
      <head>
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
