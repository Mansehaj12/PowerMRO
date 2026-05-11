"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface Alert {
  id: string;
  message: string;
  type: "danger" | "warning";
}

interface AppShellProps {
  children: React.ReactNode;
  alerts?: Alert[];
}

export default function AppShell({ children, alerts = [] }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: "#0D1B2A" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <TopNavbar
        alerts={alerts}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
        mobileMenuOpen={mobileOpen}
      />
      {/* Main content */}
      <main
        className="lg:ml-64 pt-16 min-h-screen transition-all duration-300"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
