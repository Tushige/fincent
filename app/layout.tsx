import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, Urbanist } from "next/font/google";
import {ProgressBar, ProgressBarProvider} from 'react-transition-progress'
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-plex-serif'
})
// const urbanist = Urbanist({subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-urbanist'})
const urbanist = Urbanist({
  subsets: ['latin']
})
export const metadata: Metadata = {
  title: "Fincent",
  description: "Financial dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDark = true;
  return (
    <html lang="en">
      <body className={cn(urbanist.className, {dark: isDark}, 'text-foreground')}>
        <ProgressBarProvider>
          <ProgressBar className="fixed h-1 shadow-lg shadow-red-500/20 bg-red-500 top-0"/>
          {children}
        </ProgressBarProvider>
      </body>
    </html>
  );
}
