import type {Metadata} from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { MoodProvider } from '@/hooks/use-mood';

export const metadata: Metadata = {
  title: 'Zenalth',
  description: 'A supportive space for your mental wellness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="default"
          enableSystem={false}
        >
          <MoodProvider>
            <AppShell>
              {children}
            </AppShell>
          </MoodProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
