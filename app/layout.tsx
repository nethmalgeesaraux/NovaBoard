import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import DashboardWrapper from "./DashboardWrapper";
import StoreProvider from "./redux";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovaBoard | NovaStack Studio",
  description: "Streamline projects, manage sprints, and track tasks effortlessly with NovaBoard — the internal project management hub for NovaStack Studio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Suspense fallback={null}>
            <DashboardWrapper>{children}</DashboardWrapper>
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
