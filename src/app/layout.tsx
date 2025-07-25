
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GenZ Friend',
  description: 'A supportive space for your mental wellness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body className="font-body antialiased">
        <AuthProvider>
            <ThemeProvider
              attribute="data-theme"
              defaultTheme="default"
              enableSystem={false}
            >
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
              </div>
              <Toaster />
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
