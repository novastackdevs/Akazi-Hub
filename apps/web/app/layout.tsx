import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Akazi Hub — Find work. Build teams. Move forward.',
  description: 'The talent marketplace connecting ambitious people and great employers across Africa.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
