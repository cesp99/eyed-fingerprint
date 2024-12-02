import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eyed™ Browser Fingerprint Detector",
  description: "Unlock the secrets of your online presence! Use the Eyed™ Browser Fingerprint Detector to assess your privacy and learn how to stay safe from tracking.",
  keywords: "Eyed Out Browser, browser fingerprint, privacy check, online privacy, tracking protection",
  openGraph: {
    title: "Eyed™ Browser Fingerprint Detector",
    description: "Unlock the secrets of your online presence! Use the Eyed™ Browser Fingerprint Detector to assess your privacy and learn how to stay safe from tracking.",
    images: [
      {
        url: "/og.jpg", 
        alt: "Eyed™ Browser Fingerprint Detector",
      },
    ],
    siteName: "Eyed™ Browser Fingerprint Detector",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#16131F]`}
      >
        {children}
      </body>
    </html>
  );
}
