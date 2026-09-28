# RefillFlow EHR 🏥⚡
> **Autonomous Clinical Prescription Refill Interoperability & Mobile Care Platform**  
> Direct Surescripts FHIR & Epic EHR Integrated • 1-Tap Mobile Patient Refills • 1-Click Doctor Sign-Off

---

## 🌟 Overview
**RefillFlow** is a modern hospital-grade clinical prescription management and refill triage platform designed to eliminate physician administrative burnout, prevent patient pharmacotherapy gaps, and automate retail pharmacy coordination.

Equipped with an **Autonomous Clinical AI Engine**, RefillFlow automatically queries patient EHR charts, evaluates clinical guidelines (ADA, ACC/AHA), detects critical low-supply depletions ($\le 10$ days remaining), and formats ready-to-sign Surescripts FHIR transaction payloads.

---

## 🚀 Key Features

### 1. ⚡ Doctor 1-Click Fast Approval Desk
- **Card-Header Quick Sign-Off**: Top-level 1-click approve button directly on every patient ticket without scrolling past labs.
- **Top Navigation Fast-Approve Action**: Instant `[ ⚡ Doctor Fast Approve ]` button with real-time pending queue counter.
- **Batch Signing**: Instant bulk sign-off for all guidelines-compliant, high-confidence ($\ge 92\%$) refills with cryptographic audit logging.
- **Clinical Action Suite**: 1-click full approval, 30-day safety bridge with lab requisition, telehealth evaluation links, or structured denial.

### 2. 📱 Patient Mobile Companion App (Medical Equipment Skeuomorphism)
- **1-Tap Medicine Refill Bar**: Prominent, thumb-friendly sticky action bar for smartphone users.
- **Amber Prescription Pill Bottles**: Styled after real pharmacy vials with childproof ribbed safety caps (`PUSH DOWN & TURN TO OPEN`).
- **Clinical Telemetry & Vitals Monitor**:
  - Live cardiac ECG sinus rhythm waveform (`/\_/\/\_`).
  - Digital 7-segment LED countdown showing days supply remaining (urgent red pulse for $\le 2$ days).
  - Fluid / capsule titration gauge (`0d CRITICAL | 10d ALERT | 20d | 30d FULL`).
- **Interactive 2-Way Twilio SMS Gateway**: Live automated SMS updates between clinic, retail pharmacy (CVS #4421), and patient.

### 3. 🧠 Autonomous Clinical AI Engine
- **Guidelines Adherence**: Automatic evaluation of HbA1c, eGFR, serum creatinine, and blood pressure.
- **Immediate Critical Depletion Warnings**: Flashing red emergency ribbons for medications with $\le 2$ days supply (Grace Taylor, Sophia Chen).
- **FHIR Payload Verification**: Generates valid Surescripts `MedicationRequest` payloads with cryptographic transaction hashes.

### 4. 🏢 Multi-Account Hospital Role Switcher
- **Physician (Dr. Sarah Chen, MD)**: Internal medicine triage, custom dose titration drawer, 1-click eRx dispatch.
- **Pharmacist (Dr. James Holloway, PharmD)**: Retail pharmacy dispensing queue and PBM prior authorization oversight.
- **Patient (Eleanor Vance)**: Personal medication cabinet, supply tracking, and 1-tap renewal requests.

---

## 🛠️ Tech Stack
- **Framework**: React 19, TypeScript
- **Bundler & Tooling**: Vite, Oxlint
- **Styling**: TailwindCSS, CSS Variables, Glassmorphism
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **Audio**: Web Audio API synthesized hospital chimes and telemetry tones

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation
```bash
git clone https://github.com/likhith7677/refillflow.git
cd refillflow
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) or the displayed port in your browser.

### Production Build
```bash
npm run build
```

---

## 🔒 Compliance & Standards
- **HL7® FHIR® R4**: `MedicationRequest`, `Patient`, `Observation` compliant
- **Surescripts® Interop**: NCPDP SCRIPT 2017071
- **HIPAA**: Tamper-evident immutable audit trails with transaction identifiers
