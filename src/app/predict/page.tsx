"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  CalendarCheck,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Info,
  Wrench,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { format, parseISO, addDays, differenceInDays } from "date-fns";
import AppShell from "@/components/AppShell";
import { EQUIPMENT_LIST, REPAIR_HISTORY, INITIAL_MAINTENANCE_JOBS } from "@/lib/data";

// ---------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------
interface PredictionResult {
  equipmentId: string;
  lastServiceDate: string;
  avgInterval: number;
  nextPredictedDate: string;
  rulDays: number;
  rulPercent: number;
  confidence: number;
  recommendation: string;
  urgency: "low" | "medium" | "high" | "critical";
  history: { date: string; type: string; cost: number }[];
}

// ---------------------------------------------------------------
// PREDICTION ENGINE
// ---------------------------------------------------------------
function predict(equipmentId: string): PredictionResult {
  const records = REPAIR_HISTORY.filter((r) => r.equipmentId === equipmentId)
    .sort((a, b) => a.repairDate.localeCompare(b.repairDate));

  const history = records.map((r) => ({ date: r.repairDate, type: r.faultType, cost: r.cost }));

  // Calculate intervals
  const intervals: number[] = [];
  for (let i = 1; i < records.length; i++) {
    const days = differenceInDays(parseISO(records[i].repairDate), parseISO(records[i - 1].repairDate));
    if (days > 0) intervals.push(days);
  }

  const avgInterval = intervals.length > 0
    ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
    : 90;

  const lastDate = records[records.length - 1]?.repairDate ?? "2025-01-01";
  const nextDate = format(addDays(parseISO(lastDate), avgInterval), "yyyy-MM-dd");
  const daysRemaining = Math.max(0, differenceInDays(parseISO(nextDate), new Date()));
  const rulPercent = Math.min(100, Math.round((daysRemaining / avgInterval) * 100));

  // Confidence based on data richness
  const confidence = Math.min(95, 60 + intervals.length * 5);

  let urgency: PredictionResult["urgency"] = "low";
  let recommendation = "";

  if (daysRemaining <= 7) {
    urgency = "critical";
    recommendation = `URGENT: Schedule maintenance immediately — service overdue or due within 7 days.`;
  } else if (daysRemaining <= 21) {
    urgency = "high";
    recommendation = `Schedule maintenance within the next week. Service is due on ${format(parseISO(nextDate), "dd MMM yyyy")}.`;
  } else if (daysRemaining <= 45) {
    urgency = "medium";
    recommendation = `Plan maintenance soon. Predicted service window: ${format(parseISO(nextDate), "dd MMM yyyy")}.`;
  } else {
    urgency = "low";
    recommendation = `No immediate action required. Next service predicted for ${format(parseISO(nextDate), "dd MMM yyyy")}.`;
  }

  return {
    equipmentId,
    lastServiceDate: lastDate,
    avgInterval,
    nextPredictedDate: nextDate,
    rulDays: daysRemaining,
    rulPercent,
    confidence,
    recommendation,
    urgency,
    history,
  };
}

// ---------------------------------------------------------------
// CUSTOM TOOLTIP
// ---------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#162A42", border: "1px solid rgba(0,163,224,0.3)" }}>
      <div className="text-gray-400 mb-1">{label}</div>
      <div className="text-white font-semibold">Cost: ₹{payload[0]?.value?.toLocaleString("en-IN")}</div>
    </div>
  );
}

// ---------------------------------------------------------------
// TIMELINE DOT
// ---------------------------------------------------------------
function TimelineEvent({ event, index, total }: { event: { date: string; type: string; cost: number }; index: number; total: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="flex gap-4" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {/* Line + dot */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ scale: hover ? 1.3 : 1 }}
          className="w-3 h-3 rounded-full border-2 flex-shrink-0"
          style={{
            background: index === total - 1 ? "#00A3E0" : "#1C344F",
            borderColor: index === total - 1 ? "#00A3E0" : "#2D4F6E",
            boxShadow: index === total - 1 ? "0 0 10px rgba(0,163,224,0.5)" : "none",
          }}
        />
        {index < total - 1 && <div className="w-px flex-1 my-1" style={{ background: "#1C344F", minHeight: 24 }} />}
      </div>
      {/* Content */}
      <motion.div
        animate={{ x: hover ? 4 : 0 }}
        className="pb-5 flex-1"
      >
        <div className="text-xs text-gray-500 mb-1">{format(parseISO(event.date), "dd MMM yyyy")}</div>
        <div className="text-sm font-medium text-gray-200">{event.type}</div>
        <div className="text-xs text-amber-400 mt-0.5">₹{event.cost.toLocaleString("en-IN")}</div>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------
// RUL PROGRESS BAR
// ---------------------------------------------------------------
function RULBar({ percent, urgency }: { percent: number; urgency: string }) {
  const color = urgency === "critical" ? "#EF4444" : urgency === "high" ? "#F59E0B" : urgency === "medium" ? "#F59E0B" : "#10B981";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Remaining Useful Life</span>
        <span className="text-lg font-bold" style={{ color }}>{percent}%</span>
      </div>
      <div className="progress-bar h-4">
        <motion.div
          className="progress-fill rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-600">
        <span>0%</span>
        <span>Service Due</span>
        <span>100%</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------
export default function PredictPage() {
  const [selectedId, setSelectedId] = useState("Engine-01");
  const [showDropdown, setShowDropdown] = useState(false);

  const prediction = useMemo(() => predict(selectedId), [selectedId]);

  const urgencyStyles: Record<string, { bg: string; border: string; text: string; icon: React.ElementType }> = {
    low: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)", text: "#34D399", icon: CheckCircle },
    medium: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)", text: "#FCD34D", icon: Info },
    high: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#FBBF24", icon: AlertTriangle },
    critical: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", text: "#FCA5A5", icon: AlertTriangle },
  };

  const ug = urgencyStyles[prediction.urgency];
  const UrgIcon = ug.icon;

  // Chart data — cumulative cost over time
  const chartData = prediction.history.map((h, i) => ({
    date: format(parseISO(h.date), "MMM yy"),
    cost: h.cost,
    cumulative: prediction.history.slice(0, i + 1).reduce((s, x) => s + x.cost, 0),
  }));

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Predict Next Service</h1>
        <p className="text-sm text-gray-400 mt-1">
          AI-assisted maintenance interval prediction based on repair history
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Equipment Selector */}
        <div className="xl:col-span-1 space-y-4">
          {/* Selector */}
          <div className="glass-card">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Equipment</div>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: "rgba(0,163,224,0.08)",
                  border: "1px solid rgba(0,163,224,0.25)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" style={{ boxShadow: "0 0 6px rgba(0,163,224,0.6)" }} />
                  <span className="font-semibold text-white">{selectedId}</span>
                  <span className="text-xs text-gray-500">
                    {EQUIPMENT_LIST.find((e) => e.id === selectedId)?.name}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full mt-2 w-full rounded-xl overflow-hidden z-10"
                    style={{ background: "#112236", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
                  >
                    {EQUIPMENT_LIST.map((eq) => (
                      <button
                        key={eq.id}
                        onClick={() => { setSelectedId(eq.id); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left"
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedId === eq.id ? "#00A3E0" : "#2D4F6E" }} />
                        <div>
                          <div className="text-sm font-medium text-gray-200">{eq.id}</div>
                          <div className="text-xs text-gray-500">{eq.name}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="glass-card space-y-4">
            <h3 className="section-title">Prediction Metrics</h3>
            {[
              { label: "Last Service", value: format(parseISO(prediction.lastServiceDate), "dd MMM yyyy"), icon: Wrench, color: "#00A3E0" },
              { label: "Avg Maintenance Interval", value: `${prediction.avgInterval} days`, icon: Clock, color: "#F59E0B" },
              { label: "Predicted Next Service", value: format(parseISO(prediction.nextPredictedDate), "dd MMM yyyy"), icon: CalendarCheck, color: "#10B981" },
              { label: "Days Remaining", value: `${prediction.rulDays} days`, icon: TrendingUp, color: "#8B5CF6" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="text-sm font-semibold text-white">{value}</div>
                </div>
              </div>
            ))}

            {/* Confidence */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Model Confidence</span>
                <span className="text-xs font-bold text-blue-400">{prediction.confidence}%</span>
              </div>
              <div className="progress-bar h-2">
                <motion.div
                  className="progress-fill"
                  style={{ background: "linear-gradient(90deg, #00A3E080, #00A3E0)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${prediction.confidence}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-[10px] text-gray-600 mt-1.5">Based on {prediction.history.length} historical events</p>
            </div>
          </div>
        </div>

        {/* Right: Main Prediction Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Recommendation Card */}
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6"
            style={{ background: ug.bg, border: `1px solid ${ug.border}` }}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${ug.border}`, borderWidth: 1, borderStyle: "solid" }}>
                <UrgIcon className="w-5 h-5" style={{ color: ug.text }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ug.text }}>
                    {prediction.urgency.toUpperCase()} PRIORITY
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: ug.border, color: ug.text }}>
                    AI Recommendation
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-200">{prediction.recommendation}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Schedule by: <span className="font-semibold" style={{ color: ug.text }}>
                    {format(parseISO(prediction.nextPredictedDate), "dd MMMM yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RUL Bar */}
          <div className="glass-card">
            <RULBar percent={prediction.rulPercent} urgency={prediction.urgency} />
          </div>

          {/* Chart — cost over time */}
          <div className="glass-card">
            <h3 className="section-title mb-1">Repair Cost History</h3>
            <p className="section-subtitle mb-4">Individual repair event costs for {selectedId}</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.05)" />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#00A3E0"
                  strokeWidth={2}
                  dot={{ fill: "#00A3E0", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#00A3E0", stroke: "rgba(0,163,224,0.3)", strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Maintenance Timeline */}
          <div className="glass-card">
            <h3 className="section-title mb-4">Maintenance Timeline</h3>
            <div className="pl-2">
              {prediction.history.map((event, i) => (
                <TimelineEvent key={i} event={event} index={i} total={prediction.history.length} />
              ))}
              {/* Next predicted (future) */}
              <div className="flex gap-4 opacity-60">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-dashed flex-shrink-0"
                    style={{ borderColor: "#F59E0B" }} />
                </div>
                <div className="pb-2">
                  <div className="text-xs text-amber-400 mb-0.5">
                    {format(parseISO(prediction.nextPredictedDate), "dd MMM yyyy")} — PREDICTED
                  </div>
                  <div className="text-sm font-medium text-gray-400">Next Maintenance Event</div>
                  <div className="text-xs text-gray-600 mt-0.5">Based on {prediction.avgInterval}-day avg interval</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
