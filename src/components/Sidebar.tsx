"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  BrainCircuit,
  BarChart3,
  Zap,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, description: "Real-time equipment health" },
  { href: "/schedule", label: "Maintenance Schedule", icon: CalendarDays, description: "Upcoming maintenance jobs" },
  { href: "/history", label: "Repair History", icon: ClipboardList, description: "Full repair log" },
  { href: "/predict", label: "Predict Service", icon: BrainCircuit, description: "AI-driven predictions" },
  { href: "/reports", label: "Reports", icon: BarChart3, description: "Analytics & insights" },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-full z-40 flex flex-col
          border-r border-white/[0.07]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform lg:transition-none duration-300
        `}
        style={{
          background: "linear-gradient(180deg, #0A1628 0%, #0D1B2A 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]">
          <div
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #00A3E0, #005F82)",
              boxShadow: "0 0 20px rgba(0,163,224,0.4)",
            }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-white font-bold text-lg leading-none">PowerMRO</div>
                <div className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-widest font-medium">
                  Industrial Systems
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-3 mb-3"
              >
                Navigation
              </motion.div>
            )}
          </AnimatePresence>

          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                style={{
                  background: active
                    ? "linear-gradient(135deg, rgba(0,163,224,0.18), rgba(0,163,224,0.08))"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(0,163,224,0.25)"
                    : "1px solid transparent",
                }}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: "#00A3E0" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className="flex-shrink-0 w-5 h-5 transition-colors duration-200"
                  style={{ color: active ? "#00A3E0" : "#4B5563" }}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                    >
                      <div
                        className="text-sm font-medium leading-none"
                        style={{ color: active ? "#E5E7EB" : "#6B7280" }}
                      >
                        {item.label}
                      </div>
                      {active && (
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {item.description}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div
                    className="absolute left-14 bg-navy-600 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                    style={{
                      background: "#162A42",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-white/[0.07] space-y-1">
          {[
            { icon: Settings, label: "Settings", href: "/settings" },
            { icon: HelpCircle, label: "Help & Support", href: "#" },
          ].map(({ icon: Icon, label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
                style={{
                  color: active ? "#00A3E0" : "#4B5563",
                  background: active ? "rgba(0,163,224,0.1)" : "transparent",
                }}
              >
                <Icon className="flex-shrink-0 w-5 h-5" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                      style={{ color: active ? "#E5E7EB" : "" }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/[0.05] transition-all duration-200 mt-2 border border-white/[0.06]"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium"
                >
                  Collapse sidebar
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Version Badge */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 pb-4 text-[10px] text-gray-600"
            >
              PowerMRO v2.4.1 · Rolls-Royce Power Systems
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
}
