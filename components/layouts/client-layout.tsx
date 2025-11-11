"use client";

import { Header } from "./header";
import { SideBar } from "./side-bar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 bg-white overflow-y-auto pl-20 pr-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
