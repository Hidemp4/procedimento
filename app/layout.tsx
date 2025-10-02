import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layouts/header";
import { SideBar } from "@/components/layouts/side-bar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">
        <Header/>
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-5">{children}</div>
        </div>
      </body>
    </html>
  );
}
