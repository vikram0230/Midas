import Provider from "@/app/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://midas.com/"),
  title: {
    default: 'Midas',
    template: `%s | Midas`
  },
  description: "Your AI Financial Planner"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
