import React from "react";
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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app";

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(APP_URL),
  title: "ARC Your AI Fitness Copilot",

  // ── Favicons & Touch Icons ────────────────────────────────────────────────
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  description:
    "Join the waitlist for ARC. Your AI copilot for fitness. Training plans, nutrition targets, and habit tracking built around you.",
  keywords: [
    "fitness app",
    "AI workout",
    "habit tracker",
    "nutrition tracking",
    "ARC Fitness",
    "iOS Android fitness",
  ],

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: "/",
  },

  // ── OpenGraph (Facebook / LinkedIn) ───────────────────────────────────────
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "ARC",
    title: "ARC Your AI Fitness Copilot",
    description:
      "Join the waitlist for ARC. The first 100 users get 3 months of Pro free.",
    images: [
      {
        url: "/arc-preview-v2.png", // resolved to APP_URL/arc-preview-v2.png via metadataBase
        width: 1200,
        height: 630,
        alt: "ARC Your AI Fitness Copilot",
      },
    ],
  },

  // ── Twitter Card ──────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@arcfitnessapp",
    creator: "@arcfitnessapp",
    title: "ARC Your AI Fitness Copilot",
    description:
      "Join the waitlist for ARC an AI copilot for training, nutrition, and habits.",
    images: [
      {
        url: "/arc-preview-v2.png", // resolved to APP_URL/arc-preview-v2.png via metadataBase
        alt: "ARC AI-Powered Fitness Copilot",
      },
    ],
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
          {/*
            FIX: Changed display=block → display=swap.
            'block' causes FOIT (invisible text) if Google Fonts is slow.
            'swap' ensures text is visible with a system font while the custom
            font loads — then swaps in. Much better for LCP and user experience.
          */}
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
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
