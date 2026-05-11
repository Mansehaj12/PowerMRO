"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  TrendingDown,
  Wrench,
  DollarSign,
  Activity,
  Shield,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import AppShell from "@/components/AppShell";
import {
  MONTHLY_COST_DATA,
  MONTHLY_DOWNTIME_DATA,
  FAULT_DISTRIBUTION,
  RELIABILITY_SCORES,
  REPAIR_HISTORY,
} from "@/lib/data";

// ---------------------------------------------------------------
// CHART COLORS
// ---------------------------------------------------------------
const ENGINE_COLORS: Record<string, string> = {
  "Engine-01": "#00A3E0",
  "Engine-02": "#10B981",
  "Engine-03": "#EF4444",
  "Engine-04": "#8B5CF6",
  "Engine-05": "#F59E0B",
  "Engine-06": "#F97316",
};

const ENGINE_IDS = ["Engine-01", "Engine-02", "Engine-03", "Engine-04", "Engine-05", "Engine-06"];

// ---------------------------------------------------------------
// CUSTOM TOOLTIPS
// ---------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CostTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: { value: number }) => s + p.value, 0);
  return (
    <div className="rounded-xl p-3 text-xs min-w-[160px]"
      style={{ background: "#0D1B2A", border: "1px solid rgba(0,163,224,0.2)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      <div className="font-semibold text-white mb-2">{label}</div>
      {payload.map((p: { name: string; value: number; color: string }) => p.value > 0 && (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-400">{p.name}</span>
          </div>
          <span className="font-medium text-white">₹{(p.value / 1000).toFixed(0)}k</span>
        </div>
      ))}
      {total > 0 && (
        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
          <span className="text-gray-400">Total</span>
          <span className="font-bold text-amber-400">₹{(total / 1000).toFixed(0)}k</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DowntimeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: { value: number }) => s + p.value, 0);
  return (
    <div className="rounded-xl p-3 text-xs min-w-[150px]"
      style={{ background: "#0D1B2A", border: "1px solid rgba(239,68,68,0.2)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      <div className="font-semibold text-white mb-2">{label}</div>
      {payload.map((p: { name: string; value: number; color: string }) => p.value > 0 && (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-400">{p.name}</span>
          </div>
          <span className="font-medium text-white">{p.value}h</span>
        </div>
      ))}
      {total > 0 && (
        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
          <span className="text-gray-400">Total</span>
          <span className="font-bold text-red-400">{total}h</span>
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs"
      style={{ background: "#0D1B2A", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
      <div className="font-semibold text-white">{payload[0].name}</div>
      <div className="text-gray-400 mt-0.5">{payload[0].value} incidents</div>
    </div>
  );
}

// ---------------------------------------------------------------
// SECTION HEADER
// ---------------------------------------------------------------
function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(0,163,224,0.12)", border: "1px solid rgba(0,163,224,0.25)" }}>
        <Icon className="w-4.5 h-4.5 text-blue-400" style={{ width: 18, height: 18, color: "#00A3E0" }} />
      </div>
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// REPORT GENERATOR
// ---------------------------------------------------------------
function generateReport() {
  const totalCost = REPAIR_HISTORY.reduce((s, r) => s + r.cost, 0);
  const totalHours = REPAIR_HISTORY.reduce((s, r) => s + r.duration, 0);
  const avgReliability = (RELIABILITY_SCORES.reduce((s, r) => s + r.uptime, 0) / RELIABILITY_SCORES.length).toFixed(1);

  const lines = [
    "POWERMRO — MAINTENANCE ANALYTICS REPORT",
    "=========================================",
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    "",
    "EXECUTIVE SUMMARY",
    "-----------------",
    `Total Maintenance Cost (YTD): ₹${totalCost.toLocaleString("en-IN")}`,
    `Total Downtime Hours (YTD): ${totalHours}h`,
    `Fleet Average Reliability: ${avgReliability}%`,
    `Total Repair Events: ${REPAIR_HISTORY.length}`,
    "",
    "RELIABILITY BY EQUIPMENT",
    "------------------------",
    ...RELIABILITY_SCORES.map((r) => `  ${r.id}: ${r.uptime}% uptime`),
    "",
    "FAULT DISTRIBUTION",
    "------------------",
    ...FAULT_DISTRIBUTION.map((f) => `  ${f.name}: ${f.value} incidents`),
    "",
    "Report generated by PowerMRO v2.4.1 | Rolls-Royce Power Systems",
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PowerMRO-Report-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------
// RADAR DATA
// ---------------------------------------------------------------
const radarData = RELIABILITY_SCORES.map((r) => ({
  subject: r.id.replace("Engine-", "E-"),
  reliability: r.uptime,
  fullMark: 100,
}));

// ---------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------
export default function ReportsPage() {
  const [activeEngines, setActiveEngines] = useState<Set<string>>(new Set(ENGINE_IDS));

  const toggleEngine = (id: string) => {
    setActiveEngines((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });
  };

  const totalCost = REPAIR_HISTORY.reduce((s, r) => s + r.cost, 0);
  const totalDowntime = REPAIR_HISTORY.reduce((s, r) => s + r.duration, 0);
  const avgUptime = (RELIABILITY_SCORES.reduce((s, r) => s + r.uptime, 0) / RELIABILITY_SCORES.length).toFixed(1);

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-sm text-gray-400 mt-1">
            12-month maintenance performance overview
          </p>
        </div>
        <button onClick={generateReport} className="btn-primary self-start sm:self-auto">
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Maintenance Cost", value: `₹${(totalCost / 100000).toFixed(2)}L`, icon: DollarSign, color: "#F59E0B", sub: "YTD across all equipment" },
          { label: "Total Downtime", value: `${totalDowntime}h`, icon: TrendingDown, color: "#EF4444", sub: "Combined hours lost" },
          { label: "Fleet Reliability", value: `${avgUptime}%`, icon: Shield, color: "#10B981", sub: "Average uptime score" },
          { label: "Repair Events", value: REPAIR_HISTORY.length, icon: Wrench, color: "#00A3E0", sub: "Total incidents logged" },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-gray-500 font-medium">{label}</div>
              <div className="text-[10px] text-gray-600">{sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Engine Filter */}
      <div className="glass rounded-xl px-4 py-3 flex flex-wrap gap-2 items-center mb-6">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Filter:</span>
        {ENGINE_IDS.map((id) => (
          <button
            key={id}
            onClick={() => toggleEngine(id)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              background: activeEngines.has(id) ? `${ENGINE_COLORS[id]}22` : "rgba(255,255,255,0.04)",
              color: activeEngines.has(id) ? ENGINE_COLORS[id] : "#4B5563",
              border: `1px solid ${activeEngines.has(id) ? ENGINE_COLORS[id] + "50" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            {id}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Monthly Cost Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <SectionHeader title="Monthly Maintenance Cost" subtitle="Repair expenditure breakdown by equipment (₹)" icon={DollarSign} />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_COST_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => v > 0 ? `₹${(v / 1000).toFixed(0)}k` : ""} />
              <Tooltip content={<CostTooltip />} />
              {ENGINE_IDS.filter((id) => activeEngines.has(id)).map((id) => (
                <Bar key={id} dataKey={id} stackId="a" fill={ENGINE_COLORS[id]} radius={id === "Engine-06" ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Downtime Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card"
        >
          <SectionHeader title="Equipment Downtime Hours" subtitle="Monthly downtime per unit (hours)" icon={TrendingDown} />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_DOWNTIME_DATA} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${v}h`} />
              <Tooltip content={<DowntimeTooltip />} />
              <Legend
                formatter={(value) => <span style={{ color: "#6B7280", fontSize: 11 }}>{value}</span>}
                iconType="circle"
                iconSize={6}
              />
              {ENGINE_IDS.filter((id) => activeEngines.has(id)).map((id) => (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  stroke={ENGINE_COLORS[id]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fault Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card"
        >
          <SectionHeader title="Fault Type Distribution" subtitle="Breakdown of incident categories" icon={Activity} />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie
                  data={FAULT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {FAULT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {FAULT_DISTRIBUTION.map((f) => (
                <div key={f.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: f.color }} />
                    <span className="text-xs text-gray-400 truncate">{f.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white ml-2">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reliability Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card"
        >
          <SectionHeader title="Fleet Reliability Radar" subtitle="Uptime % comparison across all units" icon={Shield} />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 5, right: 30, bottom: 5, left: 30 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Radar
                name="Uptime %"
                dataKey="reliability"
                stroke="#00A3E0"
                fill="#00A3E0"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Reliability Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        <SectionHeader title="Equipment Reliability Scorecard" subtitle="Annual uptime performance per unit" icon={BarChart3} />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <th className="table-header text-left">Equipment</th>
                <th className="table-header text-left hidden md:table-cell">Type</th>
                <th className="table-header text-left">Uptime %</th>
                <th className="table-header text-left">Score Bar</th>
                <th className="table-header text-center">Grade</th>
                <th className="table-header text-right hidden lg:table-cell">Total Repair Cost</th>
              </tr>
            </thead>
            <tbody>
              {RELIABILITY_SCORES.sort((a, b) => b.uptime - a.uptime).map((r, i) => {
                const equipment = ({ "Engine-01": "Gas Turbine", "Engine-02": "Diesel Engine", "Engine-03": "Gas Compressor", "Engine-04": "Generator", "Engine-05": "Steam Turbine", "Engine-06": "Electric Motor" } as Record<string, string>)[r.id];
                const cost = REPAIR_HISTORY.filter((rh) => rh.equipmentId === r.id).reduce((s, rh) => s + rh.cost, 0);
                const grade = r.uptime >= 95 ? "A+" : r.uptime >= 90 ? "A" : r.uptime >= 85 ? "B+" : r.uptime >= 80 ? "B" : "C";
                const gradeColor = r.uptime >= 95 ? "#10B981" : r.uptime >= 90 ? "#10B981" : r.uptime >= 85 ? "#00A3E0" : r.uptime >= 80 ? "#F59E0B" : "#EF4444";
                const color = ENGINE_COLORS[r.id];

                return (
                  <tr key={r.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-mono w-4">#{i + 1}</span>
                        <span className="font-bold" style={{ color }}>{r.id}</span>
                      </div>
                    </td>
                    <td className="table-cell text-gray-400 hidden md:table-cell">{equipment}</td>
                    <td className="table-cell">
                      <span className="font-bold text-white">{r.uptime}%</span>
                    </td>
                    <td className="table-cell w-40">
                      <div className="progress-bar h-2">
                        <div className="progress-fill" style={{ width: `${r.uptime}%`, background: `linear-gradient(90deg, ${color}60, ${color})` }} />
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <span className="font-bold text-lg" style={{ color: gradeColor }}>{grade}</span>
                    </td>
                    <td className="table-cell text-right hidden lg:table-cell">
                      <span className="text-amber-400 font-semibold">₹{cost.toLocaleString("en-IN")}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppShell>
  );
}
