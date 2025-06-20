import './globals.css';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinEx App",
  description: "AI-powered financial dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 