import type { Metadata } from "next";
import * as Sentry from '@sentry/nextjs';
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./provider";
import "react-vertical-timeline-component/style.min.css";

const inter = Inter({ subsets: ["latin"] });

export function generateMetadata(): Metadata {
  return {
    title: "Mahanth Vamsi's Portfolio",
    description:
      "Welcome to the portfolio of Mahanth Vamsi, a passionate developer showcasing projects and skills.",
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
