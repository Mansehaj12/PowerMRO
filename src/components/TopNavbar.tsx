"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, X, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Alert {
  id: string;
  message: string;
  type: "danger" | "warning";
}

interface TopNavbarProps {
  alerts: Alert[];
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

export default function TopNavbar({ alerts, onMobileMenuToggle, mobileMenuOpen }: TopNavbarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-64 z-20 flex items-center gap-4 px-6 h-16 border-b border-white/[0.07]"
      style={{
        background: "rgba(10, 22, 40, 0.9)",
        backdropFilter: "blur(20px)",
        transition: "left 0.3s ease",
      }}
    >
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
      >
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Live Alert Ticker */}
      {visibleAlerts.length > 0 && (
        <div
          className="flex-1 overflow-hidden hidden md:block rounded-lg"
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <div className="flex items-center h-8">
            <div
              className="flex-shrink-0 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wider"
              style={{
                color: "#EF4444",
                borderRight: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ALERT</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="alert-ticker-inner text-xs text-red-300 py-1.5 px-4">
                {visibleAlerts.map((a) => a.message).join("  ·  ")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer on mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right: Clock + Status + Notifications */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Live Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <div className="live-dot" />
          <span className="text-xs font-medium text-green-400">LIVE</span>
        </div>

        {/* Clock */}
        <div className="hidden md:block text-right min-w-[80px]">
          {mounted && (
            <>
              <div className="text-sm font-semibold text-white font-mono" style={{ fontVariantNumeric: "tabular-nums" }}>
                {format(currentTime, "HH:mm:ss")}
              </div>
              <div className="text-[10px] text-gray-500">
                {format(currentTime, "dd MMM yyyy")}
              </div>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl transition-all duration-200"
            style={{
              background: showNotifications
                ? "rgba(0,163,224,0.15)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Bell className="w-4.5 h-4.5 text-gray-300" style={{ width: 18, height: 18 }} />
            {visibleAlerts.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  color: "white",
                  boxShadow: "0 0 10px rgba(239,68,68,0.5)",
                }}
              >
                {visibleAlerts.length}
              </motion.span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "#112236",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-electric" style={{ color: "#00A3E0" }} />
                    <span className="text-sm font-semibold text-white">Active Alerts</span>
                  </div>
                  <span className="text-xs text-gray-400">{visibleAlerts.length} active</span>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {visibleAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <span className="text-sm text-gray-400">All systems nominal</span>
                    </div>
                  ) : (
                    visibleAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                      >
                        <AlertTriangle
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: alert.type === "danger" ? "#EF4444" : "#F59E0B" }}
                        />
                        <p className="text-xs text-gray-300 flex-1">{alert.message}</p>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {visibleAlerts.length > 0 && (
                  <div className="px-4 py-3">
                    <button
                      onClick={() => setDismissedAlerts(alerts.map((a) => a.id))}
                      className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      Dismiss all
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #00A3E0, #005F82)",
            boxShadow: "0 0 15px rgba(0,163,224,0.3)",
          }}
        >
          MS
        </div>
      </div>
    </header>
  );
}
