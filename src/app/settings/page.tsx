"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Paintbrush, Database, Settings2 } from "lucide-react";
import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  const sections = [
    {
      title: "Profile Settings",
      icon: User,
      description: "Manage your personal information and preferences.",
      options: ["Update Profile", "Change Password", "Role Management"],
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Configure how and when you receive alerts.",
      options: ["Email Notifications", "SMS Alerts", "Critical Threshold Alerts"],
    },
    {
      title: "Security",
      icon: Shield,
      description: "Manage security and two-factor authentication.",
      options: ["Two-Factor Auth", "Active Sessions", "Access Logs"],
    },
    {
      title: "Appearance",
      icon: Paintbrush,
      description: "Customize the dashboard look and feel.",
      options: ["Dark/Light Mode", "Compact View", "Color Accents"],
    },
    {
      title: "Data Management",
      icon: Database,
      description: "Manage simulated sensor data and retention.",
      options: ["Export All Data", "Clear Cache", "Simulation Settings"],
    },
  ];

  return (
    <AppShell>
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/[0.1]">
          <Settings2 className="w-6 h-6 text-gray-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your PowerMRO application preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card flex flex-col h-full hover:bg-white/[0.03] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(0,163,224,0.1)",
                    border: "1px solid rgba(0,163,224,0.2)",
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#00A3E0" }} />
                </div>
                <h3 className="font-semibold text-gray-100">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6 flex-1">{section.description}</p>
              
              <div className="space-y-2 border-t border-white/[0.06] pt-4">
                {section.options.map((opt) => (
                  <div key={opt} className="text-sm text-gray-300 hover:text-white transition-colors py-1 flex items-center justify-between">
                    <span>{opt}</span>
                    <span className="text-gray-600 text-xs font-mono">→</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
