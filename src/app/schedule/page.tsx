"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Search,
  User,
  Tag,
  SortAsc,
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isToday } from "date-fns";
import AppShell from "@/components/AppShell";
import { INITIAL_MAINTENANCE_JOBS, EQUIPMENT_LIST, TECHNICIANS, MaintenanceJob, Priority } from "@/lib/data";

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------
function priorityOrder(p: Priority): number {
  return { Critical: 0, High: 1, Medium: 2, Low: 3 }[p];
}

function statusIcon(status: string) {
  if (status === "Completed") return <CheckCircle2 className="w-4 h-4 text-green-400" />;
  if (status === "In Progress") return <Clock className="w-4 h-4 text-blue-400" />;
  return <AlertCircle className="w-4 h-4 text-gray-400" />;
}

function priorityBadge(p: Priority) {
  const cls: Record<Priority, string> = {
    Critical: "badge-danger",
    High: "badge-warning",
    Medium: "badge-info",
    Low: "badge-muted",
  };
  return <span className={cls[p]}>{p}</span>;
}

function statusBadge(s: string) {
  if (s === "Completed") return <span className="badge-success">{s}</span>;
  if (s === "In Progress") return <span className="badge-info">{s}</span>;
  return <span className="badge-muted">{s}</span>;
}

// ---------------------------------------------------------------
// ADD JOB MODAL
// ---------------------------------------------------------------
function AddJobModal({ onClose, onAdd }: { onClose: () => void; onAdd: (job: MaintenanceJob) => void }) {
  const [form, setForm] = useState({
    equipmentId: "Engine-01",
    type: "Scheduled Inspection",
    scheduledDate: format(new Date(), "yyyy-MM-dd"),
    technician: TECHNICIANS[0],
    priority: "Medium" as Priority,
    notes: "",
    estimatedHours: "4",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job: MaintenanceJob = {
      id: `MJ-${String(Date.now()).slice(-5)}`,
      ...form,
      estimatedHours: parseInt(form.estimatedHours),
      status: "Scheduled",
    };
    onAdd(job);
    onClose();
  };

  const inputCls = "input-field";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden z-10"
        style={{
          background: "#112236",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(0,163,224,0.15)", border: "1px solid rgba(0,163,224,0.3)" }}>
              <Plus className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">New Maintenance Job</h2>
              <p className="text-xs text-gray-500">Schedule a maintenance task</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Equipment ID</label>
              <select className={inputCls} value={form.equipmentId}
                onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}>
                {EQUIPMENT_LIST.map((eq) => (
                  <option key={eq.id} value={eq.id} style={{ background: "#112236" }}>{eq.id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select className={inputCls} value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}>
                {["Critical", "High", "Medium", "Low"].map((p) => (
                  <option key={p} value={p} style={{ background: "#112236" }}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Maintenance Type</label>
            <select className={inputCls} value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {["Scheduled Inspection", "Preventive Maintenance", "Emergency Repair", "Lubrication Service", "Calibration", "Overhaul"].map((t) => (
                <option key={t} value={t} style={{ background: "#112236" }}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Scheduled Date</label>
              <input type="date" className={inputCls} value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} required />
            </div>
            <div>
              <label className={labelCls}>Est. Hours</label>
              <input type="number" className={inputCls} value={form.estimatedHours} min="1" max="72"
                onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })} required />
            </div>
          </div>

          <div>
            <label className={labelCls}>Technician</label>
            <select className={inputCls} value={form.technician}
              onChange={(e) => setForm({ ...form, technician: e.target.value })}>
              {TECHNICIANS.map((t) => (
                <option key={t} value={t} style={{ background: "#112236" }}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Describe the maintenance task…" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">
              <Plus className="w-4 h-4" /> Schedule Job
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ---------------------------------------------------------------
// MINI CALENDAR
// ---------------------------------------------------------------
function MiniCalendar({ jobs, currentMonth, onChange }: {
  jobs: MaintenanceJob[];
  currentMonth: Date;
  onChange: (d: Date) => void;
}) {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const startDow = start.getDay();

  const jobDates = new Set(jobs.map((j) => j.scheduledDate));

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <button onClick={() => onChange(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => onChange(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-600 uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const hasEvent = jobDates.has(dateStr);
          const today = isToday(day);
          return (
            <div
              key={dateStr}
              className={`calendar-day ${today ? "today" : ""} ${hasEvent ? "has-event" : ""}`}
              style={{
                fontSize: 12,
                color: today ? "#00A3E0" : "#6B7280",
              }}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-[11px] text-gray-500">Scheduled maintenance</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------
export default function SchedulePage() {
  const [jobs, setJobs] = useState<MaintenanceJob[]>(INITIAL_MAINTENANCE_JOBS);
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filterEquipment, setFilterEquipment] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const addJob = (job: MaintenanceJob) => setJobs((prev) => [job, ...prev]);

  const markComplete = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Completed" } : j))
    );
  };

  const markInProgress = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id && j.status === "Scheduled" ? { ...j, status: "In Progress" } : j))
    );
  };

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => filterEquipment === "All" || j.equipmentId === filterEquipment)
      .filter((j) => filterPriority === "All" || j.priority === filterPriority)
      .filter((j) => filterStatus === "All" || j.status === filterStatus)
      .filter(
        (j) =>
          searchQuery === "" ||
          j.equipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          j.technician.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));
  }, [jobs, filterEquipment, filterPriority, filterStatus, searchQuery]);

  const selectCls = "input-field py-1.5 text-xs";

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Maintenance Schedule</h1>
          <p className="text-sm text-gray-400 mt-1">
            {jobs.filter((j) => j.status !== "Completed").length} active jobs ·{" "}
            {jobs.filter((j) => j.priority === "Critical" || j.priority === "High").length} high priority
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Schedule New Job
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left: Calendar + Stats */}
        <div className="xl:col-span-1 space-y-4">
          <MiniCalendar jobs={jobs} currentMonth={currentMonth} onChange={setCurrentMonth} />

          {/* Status Summary */}
          <div className="glass-card">
            <h3 className="section-title mb-4">Job Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Scheduled", count: jobs.filter((j) => j.status === "Scheduled").length, color: "#9CA3AF" },
                { label: "In Progress", count: jobs.filter((j) => j.status === "In Progress").length, color: "#00A3E0" },
                { label: "Completed", count: jobs.filter((j) => j.status === "Completed").length, color: "#10B981" },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-sm text-gray-400">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Jobs Table */}
        <div className="xl:col-span-3 space-y-4">
          {/* Filters */}
          <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search jobs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gray-500" />
                <select className={selectCls} value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)}>
                  <option style={{ background: "#112236" }}>All</option>
                  {EQUIPMENT_LIST.map((eq) => (
                    <option key={eq.id} style={{ background: "#112236" }}>{eq.id}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <select className={selectCls} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  {["All", "Critical", "High", "Medium", "Low"].map((p) => (
                    <option key={p} style={{ background: "#112236" }}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <SortAsc className="w-3.5 h-3.5 text-gray-500" />
                <select className={selectCls} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  {["All", "Scheduled", "In Progress", "Completed"].map((s) => (
                    <option key={s} style={{ background: "#112236" }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <th className="table-header text-left">Job ID</th>
                    <th className="table-header text-left">Equipment</th>
                    <th className="table-header text-left">Type</th>
                    <th className="table-header text-left">Date</th>
                    <th className="table-header text-left hidden md:table-cell">Technician</th>
                    <th className="table-header text-center">Priority</th>
                    <th className="table-header text-center">Status</th>
                    <th className="table-header text-center hidden lg:table-cell">Hours</th>
                    <th className="table-header text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredJobs.map((job, i) => (
                      <motion.tr
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="table-row"
                      >
                        <td className="table-cell">
                          <span className="font-mono text-xs text-gray-400">{job.id}</span>
                        </td>
                        <td className="table-cell">
                          <span className="font-semibold text-electric" style={{ color: "#00A3E0" }}>{job.equipmentId}</span>
                        </td>
                        <td className="table-cell text-gray-300">{job.type}</td>
                        <td className="table-cell whitespace-nowrap">
                          <span className="text-gray-300">{format(parseISO(job.scheduledDate), "dd MMM yyyy")}</span>
                        </td>
                        <td className="table-cell hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-gray-600" />
                            <span className="text-gray-400 text-xs">{job.technician}</span>
                          </div>
                        </td>
                        <td className="table-cell text-center">{priorityBadge(job.priority)}</td>
                        <td className="table-cell text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {statusIcon(job.status)}
                            {statusBadge(job.status)}
                          </div>
                        </td>
                        <td className="table-cell text-center hidden lg:table-cell">
                          <span className="text-gray-400 text-xs">{job.estimatedHours}h</span>
                        </td>
                        <td className="table-cell text-center">
                          <div className="flex items-center justify-center gap-1">
                            {job.status === "Scheduled" && (
                              <button
                                onClick={() => markInProgress(job.id)}
                                className="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                                style={{
                                  background: "rgba(0,163,224,0.1)",
                                  color: "#38BDF8",
                                  border: "1px solid rgba(0,163,224,0.2)",
                                }}
                              >
                                Start
                              </button>
                            )}
                            {job.status === "In Progress" && (
                              <button
                                onClick={() => markComplete(job.id)}
                                className="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                                style={{
                                  background: "rgba(16,185,129,0.1)",
                                  color: "#34D399",
                                  border: "1px solid rgba(16,185,129,0.2)",
                                }}
                              >
                                Complete
                              </button>
                            )}
                            {job.status === "Completed" && (
                              <span className="text-xs text-gray-600 italic">Done</span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="table-cell text-center py-12">
                        <div className="flex flex-col items-center gap-2 text-gray-600">
                          <CalendarDays className="w-8 h-8" />
                          <span className="text-sm">No maintenance jobs match the current filters</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      <AnimatePresence>
        {showModal && <AddJobModal onClose={() => setShowModal(false)} onAdd={addJob} />}
      </AnimatePresence>
    </AppShell>
  );
}
