"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Filter,
  ClipboardList,
  AlertTriangle,
  Wrench,
  DollarSign,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import AppShell from "@/components/AppShell";
import { REPAIR_HISTORY, EQUIPMENT_LIST, FAULT_TYPES, RepairRecord } from "@/lib/data";

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------
function faultBadgeColor(fault: string): { bg: string; text: string; border: string } {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    "Bearing Failure": { bg: "rgba(239,68,68,0.12)", text: "#FCA5A5", border: "rgba(239,68,68,0.3)" },
    "Oil Leak": { bg: "rgba(0,163,224,0.12)", text: "#38BDF8", border: "rgba(0,163,224,0.3)" },
    "Vibration Anomaly": { bg: "rgba(245,158,11,0.12)", text: "#FCD34D", border: "rgba(245,158,11,0.3)" },
    "Overheating": { bg: "rgba(249,115,22,0.12)", text: "#FDBA74", border: "rgba(249,115,22,0.3)" },
    "Pressure Drop": { bg: "rgba(139,92,246,0.12)", text: "#C4B5FD", border: "rgba(139,92,246,0.3)" },
    "Electrical Fault": { bg: "rgba(16,185,129,0.12)", text: "#6EE7B7", border: "rgba(16,185,129,0.3)" },
  };
  return map[fault] ?? { bg: "rgba(75,85,99,0.2)", text: "#9CA3AF", border: "rgba(75,85,99,0.3)" };
}

function formatCost(cost: number): string {
  return `₹${cost.toLocaleString("en-IN")}`;
}

// ---------------------------------------------------------------
// EXPANDABLE ROW
// ---------------------------------------------------------------
function RepairRow({ record, index }: { record: RepairRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const colors = faultBadgeColor(record.faultType);

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="table-row cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="table-cell">
          <span className="font-mono text-xs text-gray-500">{record.id}</span>
        </td>
        <td className="table-cell">
          <span className="font-bold text-sm" style={{ color: "#00A3E0" }}>{record.equipmentId}</span>
        </td>
        <td className="table-cell">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {record.faultType}
          </span>
        </td>
        <td className="table-cell whitespace-nowrap">
          <span className="text-gray-300">{format(parseISO(record.repairDate), "dd MMM yyyy")}</span>
        </td>
        <td className="table-cell">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-300">{record.duration}h</span>
          </div>
        </td>
        <td className="table-cell">
          <span className="font-semibold text-amber-400">{formatCost(record.cost)}</span>
        </td>
        <td className="table-cell hidden md:table-cell">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-gray-600" />
            <span className="text-gray-400 text-xs">{record.technician}</span>
          </div>
        </td>
        <td className="table-cell text-center">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-gray-400 mx-auto" />
            : <ChevronDown className="w-4 h-4 text-gray-400 mx-auto" />
          }
        </td>
      </motion.tr>
      {expanded && (
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <td colSpan={8} className="px-6 pb-4 pt-0" style={{ background: "rgba(0,163,224,0.03)" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-white/[0.04]">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Root Cause
                </div>
                <p className="text-sm text-gray-300">{record.rootCause}</p>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3 h-3 text-green-400" />
                  Resolution
                </div>
                <p className="text-sm text-gray-300">{record.resolution}</p>
              </div>
            </div>
          </td>
        </motion.tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------
// CSV EXPORT
// ---------------------------------------------------------------
function exportCSV(records: RepairRecord[]) {
  const headers = ["ID", "Equipment", "Fault Type", "Repair Date", "Duration (hrs)", "Cost (INR)", "Technician", "Root Cause", "Resolution"];
  const rows = records.map((r) => [
    r.id, r.equipmentId, r.faultType, r.repairDate,
    r.duration, r.cost, r.technician,
    `"${r.rootCause}"`, `"${r.resolution}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `repair-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------
export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEquipment, setFilterEquipment] = useState("All");
  const [filterFault, setFilterFault] = useState("All");
  const [sortField, setSortField] = useState<"repairDate" | "cost" | "duration">("repairDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  };

  const filteredRecords = useMemo(() => {
    return REPAIR_HISTORY
      .filter((r) => filterEquipment === "All" || r.equipmentId === filterEquipment)
      .filter((r) => filterFault === "All" || r.faultType === filterFault)
      .filter(
        (r) =>
          searchQuery === "" ||
          r.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.faultType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "repairDate") cmp = a.repairDate.localeCompare(b.repairDate);
        if (sortField === "cost") cmp = a.cost - b.cost;
        if (sortField === "duration") cmp = a.duration - b.duration;
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [searchQuery, filterEquipment, filterFault, sortField, sortDir]);

  // Summary stats
  const totalCost = REPAIR_HISTORY.reduce((s, r) => s + r.cost, 0);
  const avgDuration = (REPAIR_HISTORY.reduce((s, r) => s + r.duration, 0) / REPAIR_HISTORY.length).toFixed(1);
  const selectCls = "input-field py-1.5 text-xs";

  const SortButton = ({ field, label }: { field: typeof sortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 hover:text-white transition-colors"
    >
      {label}
      {sortField === field && (
        sortDir === "desc"
          ? <ChevronDown className="w-3 h-3 text-electric" style={{ color: "#00A3E0" }} />
          : <ChevronUp className="w-3 h-3 text-electric" style={{ color: "#00A3E0" }} />
      )}
    </button>
  );

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Repair History</h1>
          <p className="text-sm text-gray-400 mt-1">
            Complete log of all maintenance and repair events
          </p>
        </div>
        <button
          onClick={() => exportCSV(filteredRecords)}
          className="btn-secondary self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Repairs", value: REPAIR_HISTORY.length, icon: ClipboardList, color: "#00A3E0" },
          { label: "Total Cost", value: formatCost(totalCost), icon: DollarSign, color: "#F59E0B" },
          { label: "Avg Duration", value: `${avgDuration}h`, icon: Clock, color: "#10B981" },
          { label: "Fault Types", value: FAULT_TYPES.length, icon: AlertTriangle, color: "#EF4444" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search equipment, fault, technician…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select className={selectCls} value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)}>
              <option style={{ background: "#112236" }}>All</option>
              {EQUIPMENT_LIST.map((eq) => (
                <option key={eq.id} style={{ background: "#112236" }}>{eq.id}</option>
              ))}
            </select>
          </div>
          <select className={selectCls} value={filterFault} onChange={(e) => setFilterFault(e.target.value)}>
            <option style={{ background: "#112236" }}>All</option>
            {FAULT_TYPES.map((f) => (
              <option key={f} style={{ background: "#112236" }}>{f}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-500 ml-auto">
          {filteredRecords.length} of {REPAIR_HISTORY.length} records
        </span>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <th className="table-header text-left">Record ID</th>
                <th className="table-header text-left">Equipment</th>
                <th className="table-header text-left">Fault Type</th>
                <th className="table-header text-left">
                  <SortButton field="repairDate" label="Date" />
                </th>
                <th className="table-header text-left">
                  <SortButton field="duration" label="Duration" />
                </th>
                <th className="table-header text-left">
                  <SortButton field="cost" label="Cost" />
                </th>
                <th className="table-header text-left hidden md:table-cell">Technician</th>
                <th className="table-header text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, i) => (
                <RepairRow key={record.id} record={record} index={i} />
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                      <ClipboardList className="w-8 h-8" />
                      <span className="text-sm">No repair records match the filters</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-3 text-right">
        Click any row to expand root cause and resolution details
      </p>
    </AppShell>
  );
}
