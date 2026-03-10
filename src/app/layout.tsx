import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gavroch.dev — AI-Native Full-Stack Studio",
  description:
    "We listen. We build. We ship. AI-native full-stack web development studio. The Gen Z spirit to unlock your full potential.",
  openGraph: {
    title: "Gavroch.dev — AI-Native Full-Stack Studio",
    description:
      "We listen. We build. We ship. AI-native full-stack web development studio.",
    url: "https://gavroch-dev.vercel.app",
    siteName: "Gavroch.dev",
    images: [
      {
        url: "https://gavroch-dev.vercel.app/img/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gavroch.dev",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gavroch.dev — AI-Native Full-Stack Studio",
    description:
      "We listen. We build. We ship. AI-native full-stack web development studio.",
    images: ["https://gavroch-dev.vercel.app/img/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
