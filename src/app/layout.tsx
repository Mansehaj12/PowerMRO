import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PowerMRO — Industrial MRO Management System",
  description:
    "Enterprise-grade Maintenance, Repair & Overhaul management platform for industrial power systems. Real-time equipment health monitoring, predictive analytics, and maintenance scheduling.",
  keywords: [
    "MRO",
    "Maintenance Management",
    "Equipment Health",
    "Predictive Analytics",
    "Power Systems",
    "Industrial IoT",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-navy-800 text-gray-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}
