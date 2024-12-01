import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UnifiedLayout } from "@/components/layouts/unified-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal AI Assistant",
  description: "AI-powered legal assistant application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UnifiedLayout>{children}</UnifiedLayout>
      </body>
    </html>
  );
}
