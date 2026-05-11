// ============================================================
// POWERMRO — SAMPLE DATA & TYPES
// ============================================================

export type EquipmentStatus = "Operational" | "Under Maintenance" | "Critical";
export type MaintenanceStatus = "Scheduled" | "In Progress" | "Completed";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface SensorReading {
  timestamp: number;
  temperature: number; // °C
  pressure: number;    // bar
  vibration: number;   // mm/s
  rpm: number;
  healthScore: number; // 0–100
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  installDate: string;
  lastService: string;
  currentHealth: number;
  status: EquipmentStatus;
  sensors: {
    temperature: number;
    pressure: number;
    vibration: number;
    rpm: number;
  };
}

export interface MaintenanceJob {
  id: string;
  equipmentId: string;
  type: string;
  scheduledDate: string;
  technician: string;
  priority: Priority;
  status: MaintenanceStatus;
  notes: string;
  estimatedHours: number;
}

export interface RepairRecord {
  id: string;
  equipmentId: string;
  faultType: string;
  repairDate: string;
  duration: number; // hours
  cost: number;     // ₹
  technician: string;
  rootCause: string;
  resolution: string;
}

// ---------------------------------------------------------------
// EQUIPMENT BASE DATA
// ---------------------------------------------------------------
export const EQUIPMENT_LIST: Equipment[] = [
  {
    id: "Engine-01",
    name: "Gas Turbine Alpha",
    type: "Gas Turbine",
    location: "Bay A - Unit 1",
    installDate: "2019-03-15",
    lastService: "2024-11-20",
    currentHealth: 87,
    status: "Operational",
    sensors: { temperature: 78, pressure: 12.4, vibration: 3.2, rpm: 8500 },
  },
  {
    id: "Engine-02",
    name: "Diesel Power Unit Beta",
    type: "Diesel Engine",
    location: "Bay A - Unit 2",
    installDate: "2020-07-10",
    lastService: "2025-01-05",
    currentHealth: 62,
    status: "Operational",
    sensors: { temperature: 89, pressure: 10.1, vibration: 5.8, rpm: 6200 },
  },
  {
    id: "Engine-03",
    name: "Compressor Gamma",
    type: "Gas Compressor",
    location: "Bay B - Unit 1",
    installDate: "2018-11-22",
    lastService: "2024-09-14",
    currentHealth: 35,
    status: "Critical",
    sensors: { temperature: 97, pressure: 8.3, vibration: 9.1, rpm: 4800 },
  },
  {
    id: "Engine-04",
    name: "Power Generator Delta",
    type: "Generator",
    location: "Bay B - Unit 2",
    installDate: "2021-02-08",
    lastService: "2025-03-10",
    currentHealth: 74,
    status: "Operational",
    sensors: { temperature: 72, pressure: 11.6, vibration: 2.9, rpm: 7300 },
  },
  {
    id: "Engine-05",
    name: "Turbine Epsilon",
    type: "Steam Turbine",
    location: "Bay C - Unit 1",
    installDate: "2019-09-30",
    lastService: "2024-12-22",
    currentHealth: 55,
    status: "Under Maintenance",
    sensors: { temperature: 85, pressure: 9.7, vibration: 6.4, rpm: 5600 },
  },
  {
    id: "Engine-06",
    name: "Motor Unit Zeta",
    type: "Electric Motor",
    location: "Bay C - Unit 2",
    installDate: "2022-04-17",
    lastService: "2025-02-28",
    currentHealth: 91,
    status: "Operational",
    sensors: { temperature: 65, pressure: 13.2, vibration: 1.8, rpm: 9200 },
  },
];

// ---------------------------------------------------------------
// TECHNICIANS
// ---------------------------------------------------------------
export const TECHNICIANS = [
  "Rajesh Kumar",
  "Amit Sharma",
  "Priya Nair",
  "Suresh Patel",
];

// ---------------------------------------------------------------
// FAULT TYPES
// ---------------------------------------------------------------
export const FAULT_TYPES = [
  "Bearing Failure",
  "Oil Leak",
  "Vibration Anomaly",
  "Overheating",
  "Pressure Drop",
  "Electrical Fault",
];

// ---------------------------------------------------------------
// MAINTENANCE JOBS (initial)
// ---------------------------------------------------------------
export const INITIAL_MAINTENANCE_JOBS: MaintenanceJob[] = [
  {
    id: "MJ-001",
    equipmentId: "Engine-01",
    type: "Scheduled Inspection",
    scheduledDate: "2025-06-05",
    technician: "Rajesh Kumar",
    priority: "Medium",
    status: "Scheduled",
    notes: "Quarterly inspection — check lubrication and seals.",
    estimatedHours: 4,
  },
  {
    id: "MJ-002",
    equipmentId: "Engine-03",
    type: "Emergency Repair",
    scheduledDate: "2025-05-12",
    technician: "Amit Sharma",
    priority: "Critical",
    status: "In Progress",
    notes: "Vibration anomaly detected. Bearing replacement required.",
    estimatedHours: 12,
  },
  {
    id: "MJ-003",
    equipmentId: "Engine-05",
    type: "Preventive Maintenance",
    scheduledDate: "2025-05-15",
    technician: "Priya Nair",
    priority: "High",
    status: "In Progress",
    notes: "Oil change and filter replacement.",
    estimatedHours: 6,
  },
  {
    id: "MJ-004",
    equipmentId: "Engine-02",
    type: "Lubrication Service",
    scheduledDate: "2025-06-20",
    technician: "Suresh Patel",
    priority: "Low",
    status: "Scheduled",
    notes: "Routine lubrication — all bearings and joints.",
    estimatedHours: 3,
  },
  {
    id: "MJ-005",
    equipmentId: "Engine-04",
    type: "Calibration",
    scheduledDate: "2025-07-01",
    technician: "Rajesh Kumar",
    priority: "Medium",
    status: "Scheduled",
    notes: "Annual sensor calibration and alignment check.",
    estimatedHours: 8,
  },
  {
    id: "MJ-006",
    equipmentId: "Engine-06",
    type: "Scheduled Inspection",
    scheduledDate: "2025-05-28",
    technician: "Priya Nair",
    priority: "Low",
    status: "Scheduled",
    notes: "Monthly inspection — visual check and performance test.",
    estimatedHours: 2,
  },
];

// ---------------------------------------------------------------
// REPAIR HISTORY — 12 months of realistic data
// ---------------------------------------------------------------
export const REPAIR_HISTORY: RepairRecord[] = [
  // Engine-01
  { id: "RH-001", equipmentId: "Engine-01", faultType: "Bearing Failure", repairDate: "2024-06-10", duration: 14, cost: 85000, technician: "Rajesh Kumar", rootCause: "Insufficient lubrication leading to metal fatigue", resolution: "Full bearing replacement and lubrication system flush" },
  { id: "RH-002", equipmentId: "Engine-01", faultType: "Oil Leak", repairDate: "2024-08-22", duration: 5, cost: 22000, technician: "Amit Sharma", rootCause: "Gasket degradation due to thermal cycling", resolution: "Replaced all gaskets and seals in the oil circuit" },
  { id: "RH-003", equipmentId: "Engine-01", faultType: "Vibration Anomaly", repairDate: "2024-11-15", duration: 8, cost: 45000, technician: "Rajesh Kumar", rootCause: "Rotor imbalance after partial repair in prior maintenance", resolution: "Dynamic balancing performed on rotor assembly" },
  // Engine-02
  { id: "RH-004", equipmentId: "Engine-02", faultType: "Overheating", repairDate: "2024-05-03", duration: 10, cost: 68000, technician: "Priya Nair", rootCause: "Clogged cooling passages and low coolant level", resolution: "Cooling system flush, thermostat replacement, and refill" },
  { id: "RH-005", equipmentId: "Engine-02", faultType: "Pressure Drop", repairDate: "2024-07-19", duration: 6, cost: 31000, technician: "Suresh Patel", rootCause: "Worn piston rings causing blow-by", resolution: "Piston ring set replacement and cylinder honing" },
  { id: "RH-006", equipmentId: "Engine-02", faultType: "Electrical Fault", repairDate: "2024-10-08", duration: 4, cost: 18000, technician: "Amit Sharma", rootCause: "Corroded sensor connectors in high-humidity environment", resolution: "Connector replacement and weatherproof harness installation" },
  { id: "RH-007", equipmentId: "Engine-02", faultType: "Oil Leak", repairDate: "2025-01-30", duration: 3, cost: 15000, technician: "Priya Nair", rootCause: "Micro-crack in oil filter housing", resolution: "Oil filter housing replaced" },
  // Engine-03
  { id: "RH-008", equipmentId: "Engine-03", faultType: "Vibration Anomaly", repairDate: "2024-04-14", duration: 18, cost: 145000, technician: "Rajesh Kumar", rootCause: "Cracked impeller blade causing severe imbalance", resolution: "Full impeller replacement and dynamic balancing" },
  { id: "RH-009", equipmentId: "Engine-03", faultType: "Bearing Failure", repairDate: "2024-07-28", duration: 22, cost: 210000, technician: "Amit Sharma", rootCause: "Progressive bearing wear—monitoring alerts ignored", resolution: "Main bearing replacement and shaft inspection" },
  { id: "RH-010", equipmentId: "Engine-03", faultType: "Overheating", repairDate: "2024-09-12", duration: 8, cost: 55000, technician: "Suresh Patel", rootCause: "Blocked heat exchanger fins", resolution: "Heat exchanger chemical cleaning and performance test" },
  { id: "RH-011", equipmentId: "Engine-03", faultType: "Pressure Drop", repairDate: "2025-02-20", duration: 16, cost: 120000, technician: "Rajesh Kumar", rootCause: "Seal ring degradation in compressor stage", resolution: "Seal ring replacement and pressure testing" },
  // Engine-04
  { id: "RH-012", equipmentId: "Engine-04", faultType: "Electrical Fault", repairDate: "2024-05-25", duration: 6, cost: 42000, technician: "Priya Nair", rootCause: "Voltage regulator failure causing transient spikes", resolution: "Voltage regulator board replaced and grounding verified" },
  { id: "RH-013", equipmentId: "Engine-04", faultType: "Vibration Anomaly", repairDate: "2024-09-09", duration: 4, cost: 28000, technician: "Suresh Patel", rootCause: "Loose coupling bolts in drive shaft", resolution: "Torqued all coupling bolts to specification" },
  { id: "RH-014", equipmentId: "Engine-04", faultType: "Oil Leak", repairDate: "2025-03-05", duration: 5, cost: 25000, technician: "Amit Sharma", rootCause: "Worn output shaft seal", resolution: "Output shaft seal replacement" },
  // Engine-05
  { id: "RH-015", equipmentId: "Engine-05", faultType: "Bearing Failure", repairDate: "2024-06-18", duration: 20, cost: 175000, technician: "Rajesh Kumar", rootCause: "Water ingress contaminating bearing lubricant", resolution: "Bearing replacement and improved moisture seal installation" },
  { id: "RH-016", equipmentId: "Engine-05", faultType: "Pressure Drop", repairDate: "2024-08-30", duration: 7, cost: 38000, technician: "Priya Nair", rootCause: "Degraded steam control valve", resolution: "Steam control valve complete replacement" },
  { id: "RH-017", equipmentId: "Engine-05", faultType: "Overheating", repairDate: "2024-12-12", duration: 9, cost: 62000, technician: "Suresh Patel", rootCause: "Insulation breakdown on exhaust casing", resolution: "Exhaust casing re-insulated with high-temperature matting" },
  // Engine-06
  { id: "RH-018", equipmentId: "Engine-06", faultType: "Electrical Fault", repairDate: "2024-07-05", duration: 3, cost: 19000, technician: "Amit Sharma", rootCause: "Variable frequency drive firmware fault", resolution: "VFD firmware updated and parameters reconfigured" },
  { id: "RH-019", equipmentId: "Engine-06", faultType: "Vibration Anomaly", repairDate: "2024-10-22", duration: 5, cost: 32000, technician: "Priya Nair", rootCause: "Rotor winding short causing magnetic asymmetry", resolution: "Rotor rewound and insulation class upgraded" },
  { id: "RH-020", equipmentId: "Engine-06", faultType: "Oil Leak", repairDate: "2025-02-14", duration: 2, cost: 14500, technician: "Rajesh Kumar", rootCause: "Bearing housing O-ring perished", resolution: "O-ring replacement with upgraded EPDM material" },
];

// ---------------------------------------------------------------
// MONTHLY REPORT DATA
// ---------------------------------------------------------------
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export interface MonthlyCostEntry {
  month: string;
  "Engine-01": number;
  "Engine-02": number;
  "Engine-03": number;
  "Engine-04": number;
  "Engine-05": number;
  "Engine-06": number;
}

export interface MonthlyDowntimeEntry {
  month: string;
  "Engine-01": number;
  "Engine-02": number;
  "Engine-03": number;
  "Engine-04": number;
  "Engine-05": number;
  "Engine-06": number;
}

export const MONTHLY_COST_DATA: MonthlyCostEntry[] = MONTHS.map((month, i) => ({
  month,
  "Engine-01": [0, 0, 0, 0, 0, 85000, 0, 22000, 0, 0, 45000, 0][i],
  "Engine-02": [0, 0, 0, 0, 68000, 0, 31000, 0, 0, 18000, 0, 0][i],
  "Engine-03": [0, 0, 0, 145000, 0, 0, 210000, 0, 55000, 0, 0, 0][i],
  "Engine-04": [0, 0, 0, 0, 42000, 0, 0, 0, 28000, 0, 0, 0][i],
  "Engine-05": [0, 0, 0, 0, 0, 175000, 0, 38000, 0, 0, 0, 62000][i],
  "Engine-06": [0, 0, 0, 0, 0, 0, 19000, 0, 0, 32000, 0, 0][i],
}));

export const MONTHLY_DOWNTIME_DATA: MonthlyDowntimeEntry[] = MONTHS.map((month, i) => ({
  month,
  "Engine-01": [0, 0, 0, 0, 0, 14, 0, 5, 0, 0, 8, 0][i],
  "Engine-02": [0, 0, 0, 0, 10, 0, 6, 0, 0, 4, 0, 3][i],
  "Engine-03": [0, 0, 0, 18, 0, 0, 22, 0, 8, 0, 0, 16][i],
  "Engine-04": [0, 0, 0, 0, 6, 0, 0, 0, 4, 0, 5, 0][i],
  "Engine-05": [0, 0, 0, 0, 0, 20, 0, 7, 0, 0, 0, 9][i],
  "Engine-06": [0, 0, 0, 0, 0, 0, 3, 0, 0, 5, 0, 2][i],
}));

// Fault distribution
export const FAULT_DISTRIBUTION = [
  { name: "Bearing Failure", value: 4, color: "#EF4444" },
  { name: "Vibration Anomaly", value: 4, color: "#F59E0B" },
  { name: "Oil Leak", value: 4, color: "#00A3E0" },
  { name: "Overheating", value: 3, color: "#F97316" },
  { name: "Pressure Drop", value: 3, color: "#8B5CF6" },
  { name: "Electrical Fault", value: 3, color: "#10B981" },
];

// Reliability scores
export const RELIABILITY_SCORES = [
  { id: "Engine-01", uptime: 94.2 },
  { id: "Engine-02", uptime: 88.7 },
  { id: "Engine-03", uptime: 71.3 },
  { id: "Engine-04", uptime: 96.5 },
  { id: "Engine-05", uptime: 82.1 },
  { id: "Engine-06", uptime: 98.2 },
];
