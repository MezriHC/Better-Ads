import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SessionProvider } from "./_shared/components/SessionProvider";
import { AuthGuard } from "./_shared/components/AuthGuard";



export const metadata: Metadata = {
  title: "Better Ads",
  description: "Create amazing ads with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
            <AuthGuard>
              {children}
            </AuthGuard>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
