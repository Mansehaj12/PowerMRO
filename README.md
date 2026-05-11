# ⚡ PowerMRO - Industrial Management System

![PowerMRO Banner](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

🔴 **Live Demo:** [https://power-mro.vercel.app/](https://power-mro.vercel.app/)

PowerMRO is a premium, production-grade **Maintenance, Repair, and Overhaul (MRO)** dashboard designed to simulate enterprise-level equipment health monitoring and predictive analytics. 

This project was built specifically to demonstrate full-stack engineering, data visualization, and UI/UX design capabilities in the context of industrial systems—such as those used by **Rolls-Royce Power Systems**.

---

## 🚀 Key Features

### 1. Real-Time Equipment Health Dashboard
- **Live Sensor Simulation:** A background engine dynamically generates and updates equipment telemetry (Temperature, Pressure, Vibration, RPM) every 2.5 seconds.
- **Automated Alerts:** The system actively monitors sensor thresholds. If a machine enters a critical state (e.g., Temperature > 95°C), it triggers a broadcast alert in the top navigation ticker and an active banner above the equipment cards.

### 2. Maintenance Schedule
- **Interactive Calendar:** Visual representation of upcoming maintenance tasks.
- **Job Management:** Operators can seamlessly schedule new maintenance jobs, assign priorities, and track states (`Scheduled` → `In Progress` → `Completed`).

### 3. Repair History & Root Cause Analysis
- **Comprehensive Logging:** A searchable, filterable repository of all past maintenance events.
- **Detailed Drill-Downs:** Expandable rows provide deep dives into root-cause analyses and specific parts replaced.
- **CSV Export:** One-click functionality to download repair history for external auditing.

### 4. Predictive Service Analytics (AI Simulation)
- **RUL Calculation:** Estimates the Remaining Useful Life (RUL) of equipment by analyzing historical intervals between maintenance events.
- **Actionable Recommendations:** Generates priority-based service recommendations with confidence scores, helping transition from *reactive* to *proactive* maintenance.

### 5. Fleet Analytics & Reports
- **Data Visualization:** Built with Recharts to display interactive charts for YTD maintenance costs, downtime trends, and fault distributions.
- **Reliability Scorecards:** Radar charts breaking down the operational uptime of different engine units.
- **Automated Reporting:** Generates downloadable, plain-text summary reports of fleet performance.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism utilities
- **Animations:** [Framer Motion](https://www.framer.com/motion/) for fluid transitions and micro-interactions
- **Charts:** [Recharts](https://recharts.org/) for responsive, dynamic data visualization
- **Icons:** [Lucide React](https://lucide.dev/)
- **Date Formatting:** [date-fns](https://date-fns.org/)

---

## 💻 Getting Started (Local Development)

Follow these steps to run the application locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher is recommended).

### 1. Clone the repository
```bash
git clone https://github.com/Mansehaj12/PowerMRO.git
cd PowerMRO
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open the application
Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the live dashboard.

---

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New Project** and import this GitHub repository.
3. Vercel will automatically detect the Next.js framework. No extra configuration is needed.
4. Click **Deploy** and wait for the build to finish.

---

*Designed and developed to showcase enterprise-grade frontend engineering for industrial tech.*
