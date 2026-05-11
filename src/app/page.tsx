"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Thermometer,
  Gauge,
  Zap,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import AppShell from "@/components/AppShell";
import { EQUIPMENT_LIST, Equipment } from "@/lib/data";

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------
interface LiveSensor {
  temperature: number;
  pressure: number;
  vibration: number;
  rpm: number;
  healthScore: number;
}

interface Alert {
  id: string;
  message: string;
  type: "danger" | "warning";
}

type EquipmentLiveState = {
  [id: string]: LiveSensor;
};

type SparklineData = {
  [id: string]: { v: number }[];
};

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------
function fluc(base: number, range: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, base + (Math.random() - 0.5) * range * 2));
}

function calcHealth(s: LiveSensor): number {
  let h = 100;
  if (s.temperature > 90) h -= (s.temperature - 90) * 1.5;
  if (s.temperature > 95) h -= 15;
  if (s.vibration > 7) h -= (s.vibration - 7) * 5;
  if (s.vibration > 8.5) h -= 15;
  if (s.pressure < 9) h -= (9 - s.pressure) * 3;
  return Math.max(0, Math.min(100, h));
}

function healthColor(h: number): string {
  if (h >= 70) return "#10B981";
  if (h >= 40) return "#F59E0B";
  return "#EF4444";
}

function statusLabel(h: number): string {
  if (h >= 70) return "Operational";
  if (h >= 40) return "Degraded";
  return "Critical";
}

function statusBadgeClass(h: number): string {
  if (h >= 70) return "badge-success";
  if (h >= 40) return "badge-warning";
  return "badge-danger";
}

// ---------------------------------------------------------------
// MINI SPARKLINE CHART
// ---------------------------------------------------------------
function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#sg-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip content={() => null} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------
// EQUIPMENT CARD
// ---------------------------------------------------------------
function EquipmentCard({
  equipment,
  live,
  sparkline,
  lastUpdated,
}: {
  equipment: Equipment;
  live: LiveSensor;
  sparkline: { v: number }[];
  lastUpdated: number;
}) {
  const health = live.healthScore;
  const color = healthColor(health);
  const prevHealth = useRef(health);
  const trend = health > prevHealth.current ? "up" : health < prevHealth.current ? "down" : "flat";
  prevHealth.current = health;

  const sensors = [
    { icon: Thermometer, label: "Temp", value: `${live.temperature.toFixed(1)}°C`, warn: live.temperature > 90, crit: live.temperature > 95 },
    { icon: Gauge, label: "Press", value: `${live.pressure.toFixed(2)} bar`, warn: live.pressure < 10, crit: live.pressure < 9 },
    { icon: Activity, label: "Vibr", value: `${live.vibration.toFixed(2)} mm/s`, warn: live.vibration > 7, crit: live.vibration > 8.5 },
    { icon: RotateCcw, label: "RPM", value: `${Math.round(live.rpm).toLocaleString()}`, warn: false, crit: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="glass-card relative overflow-hidden"
      style={{
        borderColor: health < 40 ? "rgba(239,68,68,0.3)" : health < 70 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Health indicator bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl overflow-hidden bg-white/[0.05]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Alert glow for critical */}
      {health < 40 && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 30px rgba(239,68,68,0.08)" }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 8px ${color}`,
                animation: health < 40 ? "pulse 1s ease-in-out infinite" : undefined,
              }}
            />
            <h3 className="font-bold text-white text-base">{equipment.id}</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 ml-4">{equipment.name}</p>
        </div>
        <span className={statusBadgeClass(health)}>{statusLabel(health)}</span>
      </div>

      {/* Health Score */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Health Score</div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={Math.round(health)}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold sensor-value"
              style={{ color }}
            >
              {Math.round(health)}
            </motion.span>
            <span className="text-gray-500 text-sm">%</span>
            {trend === "up" && <TrendingUp className="w-4 h-4 text-green-400" />}
            {trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
            {trend === "flat" && <Minus className="w-4 h-4 text-gray-500" />}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-600">{equipment.location}</div>
          <div className="text-[10px] text-gray-600 mt-0.5">{equipment.type}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar mb-4">
        <motion.div
          className="progress-fill"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          animate={{ width: `${health}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Sparkline */}
      <div className="mb-4 -mx-1">
        <Sparkline data={sparkline} color={color} />
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 gap-2">
        {sensors.map(({ icon: Icon, label, value, warn, crit }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
            style={{
              background: crit
                ? "rgba(239,68,68,0.1)"
                : warn
                ? "rgba(245,158,11,0.1)"
                : "rgba(255,255,255,0.04)",
              border: crit
                ? "1px solid rgba(239,68,68,0.25)"
                : warn
                ? "1px solid rgba(245,158,11,0.2)"
                : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Icon
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{
                color: crit ? "#EF4444" : warn ? "#F59E0B" : "#4B5563",
              }}
            />
            <div className="min-w-0">
              <div className="text-[10px] text-gray-500 font-medium">{label}</div>
              <div
                className="text-xs font-semibold sensor-value truncate"
                style={{
                  color: crit ? "#FCA5A5" : warn ? "#FCD34D" : "#D1D5DB",
                }}
              >
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Last updated */}
      <div className="flex items-center gap-1.5 mt-3">
        <Clock className="w-3 h-3 text-gray-600" />
        <span className="text-[10px] text-gray-600">
          Updated {lastUpdated}s ago
        </span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------
// STAT CARD
// ---------------------------------------------------------------
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------
// MAIN DASHBOARD
// ---------------------------------------------------------------
export default function DashboardPage() {
  // Initialize live state from base data
  const initLive = (): EquipmentLiveState => {
    const state: EquipmentLiveState = {};
    EQUIPMENT_LIST.forEach((eq) => {
      const base: LiveSensor = {
        ...eq.sensors,
        healthScore: eq.currentHealth,
      };
      state[eq.id] = base;
    });
    return state;
  };

  const [liveState, setLiveState] = useState<EquipmentLiveState>(initLive);
  const [sparklines, setSparklines] = useState<SparklineData>(() => {
    const s: SparklineData = {};
    EQUIPMENT_LIST.forEach((eq) => {
      s[eq.id] = Array.from({ length: 10 }, () => ({ v: eq.currentHealth }));
    });
    return s;
  });
  const [lastUpdated, setLastUpdated] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const alertTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Sensor thresholds
  const checkAlerts = useCallback((id: string, s: LiveSensor): Alert[] => {
    const newAlerts: Alert[] = [];
    if (s.temperature > 95) {
      newAlerts.push({
        id: `${id}-temp`,
        message: `⚠ ${id}: Temperature critical at ${s.temperature.toFixed(1)}°C (Threshold: 95°C)`,
        type: "danger",
      });
    }
    if (s.vibration > 8.5) {
      newAlerts.push({
        id: `${id}-vib`,
        message: `⚠ ${id}: Excessive vibration ${s.vibration.toFixed(2)} mm/s (Threshold: 8.5 mm/s)`,
        type: "danger",
      });
    }
    if (s.healthScore < 40) {
      newAlerts.push({
        id: `${id}-health`,
        message: `🔴 ${id}: Health score critical at ${Math.round(s.healthScore)}% — Immediate maintenance required`,
        type: "danger",
      });
    }
    return newAlerts;
  }, []);

  // Live sensor simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveState((prev) => {
        const next = { ...prev };
        const newAlerts: Alert[] = [];

        EQUIPMENT_LIST.forEach((eq) => {
          const base = eq.sensors;
          const current = prev[eq.id];
          const newSensor: LiveSensor = {
            temperature: fluc(current.temperature, 1.5, base.temperature - 8, base.temperature + 15),
            pressure: fluc(current.pressure, 0.3, base.pressure - 3, base.pressure + 3),
            vibration: fluc(current.vibration, 0.4, 0.5, 12),
            rpm: fluc(current.rpm, 80, base.rpm - 500, base.rpm + 500),
            healthScore: 0,
          };
          newSensor.healthScore = calcHealth(newSensor);
          next[eq.id] = newSensor;
          newAlerts.push(...checkAlerts(eq.id, newSensor));
        });

        // Merge alerts (no duplicates)
        setAlerts((prev) => {
          const existing = new Set(prev.map((a) => a.id));
          const toAdd = newAlerts.filter((a) => !existing.has(a.id));
          if (toAdd.length === 0) return prev;

          // Auto-dismiss after 10s
          toAdd.forEach((a) => {
            if (alertTimeouts.current.has(a.id)) return;
            const t = setTimeout(() => {
              setAlerts((p) => p.filter((x) => x.id !== a.id));
              alertTimeouts.current.delete(a.id);
            }, 10000);
            alertTimeouts.current.set(a.id, t);
          });

          return [...prev, ...toAdd];
        });

        return next;
      });

      setSparklines((prev) => {
        const next = { ...prev };
        EQUIPMENT_LIST.forEach((eq) => {
          const currentHealth = liveState[eq.id]?.healthScore ?? eq.currentHealth;
          const arr = [...(prev[eq.id] || []), { v: currentHealth }];
          next[eq.id] = arr.slice(-12);
        });
        return next;
      });

      setLastUpdated(0);
    }, 2500);

    return () => clearInterval(interval);
  }, [checkAlerts, liveState]);

  // Last updated counter
  useEffect(() => {
    const tick = setInterval(() => setLastUpdated((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    const timeouts = alertTimeouts.current;
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, []);

  // Summary stats
  const stats = {
    total: EQUIPMENT_LIST.length,
    operational: EQUIPMENT_LIST.filter((e) => liveState[e.id]?.healthScore >= 70).length,
    maintenance: EQUIPMENT_LIST.filter(
      (e) => liveState[e.id]?.healthScore >= 40 && liveState[e.id]?.healthScore < 70
    ).length,
    critical: EQUIPMENT_LIST.filter((e) => liveState[e.id]?.healthScore < 40).length,
  };

  return (
    <AppShell alerts={alerts}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Health Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time sensor monitoring across all active power units
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style={{ background: "rgba(0,163,224,0.1)", border: "1px solid rgba(0,163,224,0.2)" }}>
          <div className="live-dot" />
          <span className="text-blue-300 font-medium">Auto-refresh every 2.5s</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Equipment" value={stats.total} icon={Zap} color="#00A3E0" />
        <StatCard label="Operational" value={stats.operational} icon={CheckCircle} color="#10B981" sub="Health > 70%" />
        <StatCard label="Under Maintenance" value={stats.maintenance} icon={AlertTriangle} color="#F59E0B" sub="Health 40–70%" />
        <StatCard label="Critical" value={stats.critical} icon={AlertTriangle} color="#EF4444" sub="Health < 40%" />
      </div>

      {/* Active Alerts Banner */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 rounded-xl overflow-hidden"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="flex-1 overflow-hidden">
                <div className="alert-ticker-inner text-sm text-red-300">
                  {alerts.map((a) => a.message).join("   ·   ")}
                </div>
              </div>
              <span className="text-xs font-bold text-red-400 flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(239,68,68,0.2)" }}>
                {alerts.length} ALERT{alerts.length > 1 ? "S" : ""}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {EQUIPMENT_LIST.map((eq, i) => (
          <motion.div
            key={eq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <EquipmentCard
              equipment={eq}
              live={liveState[eq.id] ?? {
                temperature: eq.sensors.temperature,
                pressure: eq.sensors.pressure,
                vibration: eq.sensors.vibration,
                rpm: eq.sensors.rpm,
                healthScore: eq.currentHealth,
              }}
              sparkline={sparklines[eq.id] ?? []}
              lastUpdated={lastUpdated}
            />
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/[0.06]">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Health Legend:</span>
        {[
          { color: "#10B981", label: "Operational (>70%)" },
          { color: "#F59E0B", label: "Degraded (40–70%)" },
          { color: "#EF4444", label: "Critical (<40%)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
