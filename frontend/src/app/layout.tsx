import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PramaanAI | Unified AI-Powered Fraud Detection Platform",
  description:
    "PramaanAI unifies Email, SMS, Call Transcript, and Document verification into a single AI-powered fraud detection engine with explainable results.",
  metadataBase: new URL("https://pramaan.ai"),
  openGraph: {
    title: "PramaanAI - Unified Cybersecurity Fraud Detection",
    description:
      "A state-of-the-art AI-powered cybersecurity platform that analyzes threats across Email, SMS, voice transcript, and documentation channels.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-bg-dark text-gray-100`}
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "glass-panel text-white border border-white/10",
              style: {
                background: "rgba(17, 24, 39, 0.95)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
