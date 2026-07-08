import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ARC Fitness — AI-Powered Fitness. Launching Soon.",
  description:
    "Join the waitlist for ARC Fitness — the AI fitness coach that tracks workouts, habits, and nutrition in one beautiful app. iOS & Android. Coming July 2026.",
  keywords: [
    "fitness app",
    "AI workout",
    "habit tracker",
    "nutrition tracking",
    "ARC Fitness",
    "iOS Android fitness",
  ],
  openGraph: {
    type: "website",
    title: "ARC Fitness is launching soon 🚀",
    description:
      "Be first. Get 3 months Pro free. Join thousands of founding members waiting for the most intelligent fitness app ever built.",
    siteName: "ARC Fitness",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARC Fitness — AI-Powered Fitness. Launching Soon.",
    description:
      "Join the waitlist for ARC Fitness — AI coaching for workouts, habits & nutrition. iOS & Android.",
    creator: "@arcfitnessapp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <ClerkProvider unsafe_disableDevelopmentModeConsoleWarning>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=block"
            rel="stylesheet"
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
