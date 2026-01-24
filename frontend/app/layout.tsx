import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppNav } from "@/components/AppNav";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { AuthProvider } from "@/context/auth-context";

const fontSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CRUD App",
  description: "Frontend for auth, categories and products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          fontDisplay.variable,
          fontMono.variable,
          fontSans.variable,
          "antialiased",
        )}
      >
        <AuthProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
          >
            Saltar al contenido
          </a>
          <AppNav />
          <main id="content" className="w-full">
            {children}
          </main>
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
