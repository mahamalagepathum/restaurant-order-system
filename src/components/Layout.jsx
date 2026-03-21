import React from "react";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}