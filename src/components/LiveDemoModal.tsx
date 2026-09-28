import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  FlaskConical, 
  Video, 
  Building2, 
  Stethoscope, 
  Smartphone, 
  FileCode, 
  Send, 
  ArrowRight, 
  Clock, 
  Check, 
  Activity, 
  ShieldAlert, 
  FileCheck, 
  Zap, 
  Search, 
  Terminal, 
  Lock,
  ChevronRight,
  Flame,
  UserCheck
} from 'lucide-react';
import { RefillRequest, BlockerReason, AuditEvent, RefillStatus } from '../types/refill';
import { playClinicalSuccessChime } from '../utils/audio';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToQueue: (refill: RefillRequest, andResolve?: boolean) => void;
  initialMedication?: string;
}

// Drug clinical profile model
interface DrugProfile {
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  daysSupply: number;
  quantity: number;
  therapeuticClass: string;
  blocker: BlockerReason;
  blockerDetails: string;
  actionType: 'approve_erx' | 'bridge_and_lab' | 'telehealth_visit' | 'deny';
  actionTitle: string;
  confidenceScore: number;
  guideline: string;
  labs: { name: string; value: string; date: string; status: 'normal' | 'due' | 'abnormal' }[];
  adherenceRate: number;
  rationale: string;
}

// Built-in clinical pharmacological knowledge base
const DRUG_KNOWLEDGE_BASE: Record<string, DrugProfile> = {
  metformin: {
    name: 'Metformin HCl 1000mg',
    genericName: 'Metformin Hydrochloride',
    dosage: '1000 mg twice daily with meals',
    frequency: 'Oral with breakfast and dinner',
    daysSupply: 90,
    quantity: 180,
    therapeuticClass: 'Biguanide Antidiabetic Agent',
    blocker: 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)',
    blockerDetails: 'Hemoglobin A1c is overdue by 16 days (standard 90-180d cadence for unadjusted diabetes regimen). eGFR and Creatinine remain stable.',
    actionType: 'bridge_and_lab',
    actionTitle: 'Order Standing Lab & Issue 30-Day Bridge Supply',
    confidenceScore: 96,
    guideline: 'ADA 2026 Standards of Care in Diabetes §9: Issue 30d safety bridge to prevent glycemic rebound while standing A1c lab draws.',
    labs: [
      { name: 'HbA1c', value: '7.1%', date: '2026-03-12', status: 'due' },
      { name: 'eGFR (CKD-EPI)', value: '78 mL/min/1.73m²', date: '2026-07-15', status: 'normal' },
      { name: 'Serum Creatinine', value: '0.88 mg/dL', date: '2026-07-15', status: 'normal' }
    ],
    adherenceRate: 94,
    rationale: 'Patient has high medication adherence (94%) and baseline renal function is preserved (eGFR 78 mL/min). A 30-day bridge avoids acute decompensation while standing lab order is dispatched via Quest FHIR interface.'
  },
  ozempic: {
    name: 'Ozempic 1mg/dose (4mg/3mL)',
    genericName: 'Semaglutide Injection',
    dosage: '1 mg / 0.74 mL subcutaneous weekly',
    frequency: 'Once weekly subcutaneous injection into abdomen',
    daysSupply: 28,
    quantity: 1,
    therapeuticClass: 'GLP-1 Receptor Agonist',
    blocker: 'Prior Authorization Required by PBM',
    blockerDetails: 'Annual Prior Authorization expired on 2026-09-15. OptumRx PBM rejected claim code: 75 (Prior Authorization Required). Automated CoverMyMeds ePA needed.',
    actionType: 'approve_erx',
    actionTitle: 'Auto-Submit CoverMyMeds ePA & Issue 30-Day Transition Bridge',
    confidenceScore: 95,
    guideline: 'CMS 2026 ePA Interoperability Mandate: Fast-track continuation of GLP-1 therapy given documented baseline A1c reduction and BMI criteria.',
    labs: [
      { name: 'HbA1c Reduction', value: '-1.4% (from 8.6%)', date: '2026-06-10', status: 'normal' },
      { name: 'BMI Tracker', value: '28.4 kg/m²', date: '2026-06-10', status: 'normal' }
    ],
    adherenceRate: 96,
    rationale: 'Prior Metformin failure and active glycemic response documented on file in EHR. Compiled clinical packet qualifies for immediate electronic PA re-authorization.'
  },
  lisinopril: {
    name: 'Lisinopril 20mg Tablet',
    genericName: 'Lisinopril',
    dosage: '20 mg once daily every morning',
    frequency: 'Oral daily morning tablet for blood pressure',
    daysSupply: 90,
    quantity: 90,
    therapeuticClass: 'ACE Inhibitor / Antihypertensive',
    blocker: 'No Refills Remaining (Requires New Rx)',
    blockerDetails: 'Original prescription authorized 3 refills, all exhausted. Pharmacy sent standard refill authorization request via NCPDP SCRIPT.',
    actionType: 'approve_erx',
    actionTitle: 'One-Click Approve & Issue 90-Day Renewal eRx',
    confidenceScore: 98,
    guideline: 'ACC/AHA 2025 Hypertension Guidelines: 90-day renewal recommended given normal serum creatinine (0.9 mg/dL) & controlled BP.',
    labs: [
      { name: 'Blood Pressure', value: '124/80 mmHg', date: '2026-08-14', status: 'normal' },
      { name: 'Serum Potassium (K+)', value: '4.4 mEq/L', date: '2026-08-14', status: 'normal' },
      { name: 'Serum Creatinine', value: '0.90 mg/dL', date: '2026-08-14', status: 'normal' }
    ],
    adherenceRate: 97,
    rationale: 'High medication adherence (97%) and hemodynamics perfectly controlled. Safe for immediate 90-day maintenance supply renewal via Surescripts.'
  },
  adderall: {
    name: 'Adderall XR 20mg Capsule',
    genericName: 'Dextroamphetamine-Amphetamine ER',
    dosage: '20 mg once daily in the morning',
    frequency: 'Oral extended-release capsule every morning upon waking',
    daysSupply: 30,
    quantity: 30,
    therapeuticClass: 'CNS Stimulant (DEA Schedule II)',
    blocker: 'Patient Needs Follow-up Visit',
    blockerDetails: 'DEA Schedule II annual evaluation expired. Mandatory clinical evaluation required before next controlled substance dispensing.',
    actionType: 'telehealth_visit',
    actionTitle: 'Instant Telehealth Video Booking Link + 14-Day Safety Bridge',
    confidenceScore: 89,
    guideline: 'DEA Telehealth Flexibilities Act 2026: 14-day bridge allowed when immediate video telehealth evaluation is scheduled with prescriber.',
    labs: [
      { name: 'State PDMP Query', value: 'Zero Overlaps / Clean', date: '2026-09-28', status: 'normal' },
      { name: 'Resting Pulse / BP', value: '74 bpm &bull; 118/76', date: '2026-05-18', status: 'normal' }
    ],
    adherenceRate: 92,
    rationale: 'Controlled substance compliance verified across Illinois ILPMP database. Automated 1-click video booking invitation sent to patient mobile to maintain compliance.'
  },
  eliquis: {
    name: 'Eliquis (Apixaban) 5mg Tablet',
    genericName: 'Apixaban',
    dosage: '5 mg twice daily every 12 hours',
    frequency: 'Oral tablet twice daily for stroke prevention in AFib',
    daysSupply: 90,
    quantity: 180,
    therapeuticClass: 'Direct Oral Anticoagulant (DOAC)',
    blocker: 'No Refills Remaining (Requires New Rx)',
    blockerDetails: 'Patient has only 1 day of pills left! Missed DOAC doses rapidly spike ischemic stroke risk. Immediate renewal required.',
    actionType: 'approve_erx',
    actionTitle: 'Emergency Fast-Track 90-Day Renewal & Surescripts Dispatch',
    confidenceScore: 97,
    guideline: '2023 ACC/AHA/ACCP Atrial Fibrillation Guidelines: Zero drug holidays. Missed DOAC doses double thromboembolism hazard within 24 hours.',
    labs: [
      { name: 'eGFR Renal Clearance', value: '64 mL/min', date: '2026-08-20', status: 'normal' },
      { name: 'Bleeding Assessment (HAS-BLED)', value: '1 (Low Risk)', date: '2026-08-20', status: 'normal' }
    ],
    adherenceRate: 98,
    rationale: 'Critical maintenance pharmacotherapy. Patient has only 1 day remaining. AI fast-tracks authorization directly to retail pharmacy to avoid interruption.'
  }
};

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
  onAddToQueue,
  initialMedication
}) => {
  const [medInput, setMedInput] = useState('Metformin HCl 1000mg');
  const [pipelineState, setPipelineState] = useState<'idle' | 'analyzing' | 'ready_for_signature' | 'dispatched'>('idle');
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<DrugProfile>(DRUG_KNOWLEDGE_BASE.metformin);
  const [txId, setTxId] = useState('SURESCRIPTS-FHIR-TX-849201');

  // Match or generate profile dynamically based on input
  const resolveDrugProfile = (input: string): DrugProfile => {
    const query = input.toLowerCase().trim();
    if (query.includes('ozempic') || query.includes('semaglutide') || query.includes('wegovy') || query.includes('mounjaro')) {
      return DRUG_KNOWLEDGE_BASE.ozempic;
    }
    if (query.includes('lisinopril') || query.includes('losartan') || query.includes('amlodipine') || query.includes('blood pressure')) {
      return DRUG_KNOWLEDGE_BASE.lisinopril;
    }
    if (query.includes('adderall') || query.includes('ritalin') || query.includes('stimulant') || query.includes('adhd')) {
      return DRUG_KNOWLEDGE_BASE.adderall;
    }
    if (query.includes('eliquis') || query.includes('apixaban') || query.includes('xarelto') || query.includes('blood thinner')) {
      return DRUG_KNOWLEDGE_BASE.eliquis;
    }
    if (query.includes('metformin') || query.includes('glucophage') || query.includes('diabetes')) {
      return DRUG_KNOWLEDGE_BASE.metformin;
    }

    // Dynamic fallback for any custom drug entered
    return {
      name: input,
      genericName: input.split(' ')[0],
      dosage: 'Standard Maintenance Regimen',
      frequency: 'Daily as directed by prescriber',
      daysSupply: 90,
      quantity: 90,
      therapeuticClass: 'Maintenance Pharmacotherapy',
      blocker: 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)',
      blockerDetails: `Administrative safety threshold reached for ${input}. Baseline safety panels and adherence history verified in EHR.`,
      actionType: 'bridge_and_lab',
      actionTitle: 'Issue 30-Day Bridge Supply & Requisition Routine Safety Lab',
      confidenceScore: 94,
      guideline: 'Clinical Practice Guidelines 2026: Continuity of chronic disease pharmacotherapy protocol.',
      labs: [
        { name: 'Comprehensive Metabolic Panel', value: 'Normal', date: '2026-07-20', status: 'normal' },
        { name: 'Routine Annual Bloodwork', value: 'Due for Renewal', date: '2026-09-20', status: 'due' }
      ],
      adherenceRate: 95,
      rationale: `RefillFlow AI verified medication possession ratio (95%) and absence of acute toxicity flags for ${input}. Recommends safety bridge to prevent therapy abandonment.`
    };
  };

  useEffect(() => {
    if (initialMedication) {
      setMedInput(initialMedication);
      setActiveProfile(resolveDrugProfile(initialMedication));
    }
  }, [initialMedication, isOpen]);

  if (!isOpen) return null;

  // Run autonomous analysis
  const handleStartAnalysis = (drugName: string) => {
    const profile = resolveDrugProfile(drugName);
    setActiveProfile(profile);
    setPipelineState('analyzing');
    setActiveAnalysisStep(1);
    setTelemetryLogs([]);

    const steps = [
      `[0.1s] Ingesting prescription request for "${profile.name}" from CVS Pharmacy #4421...`,
      `[0.3s] Querying Epic FHIR R4 Endpoint (https://fhir.metrohealth.org/r4/Patient/pt-8821)... [200 OK]`,
      `[0.6s] Longitudinal Chart Parsed: Eleanor Vance (64yo F, MRN-449102-B). Adherence: ${profile.adherenceRate}%`,
      `[0.9s] Autonomous Blocker Diagnostic: Intercept triggered -> "${profile.blocker}"`,
      `[1.2s] Clinical Engine Evaluated: Cross-referencing ${profile.guideline.slice(0, 45)}...`,
      `[1.5s] Formulated HITL Action: "${profile.actionTitle}" (Confidence: ${profile.confidenceScore}%)`,
      `[1.8s] Generating cryptographic FHIR MedicationRequest payload... Ready for Clinician Review.`
    ];

    steps.forEach((log, index) => {
      setTimeout(() => {
        setTelemetryLogs((prev) => [...prev, log]);
        setActiveAnalysisStep(index + 1);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setPipelineState('ready_for_signature');
          }, 300);
        }
      }, (index + 1) * 280);
    });
  };

  // Clinician signs off
  const handleSigneRx = () => {
    playClinicalSuccessChime();
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#10b981', '#6366f1']
      });
    } catch (e) {
      // ignore
    }

    const generatedTx = `SURESCRIPTS-FHIR-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    setTxId(generatedTx);
    setPipelineState('dispatched');
  };

  // Convert to full RefillRequest and push to workspace
  const handleCompleteAndPush = (andResolve: boolean) => {
    const rxId = `rf-sim-${Date.now().toString().slice(-4)}`;
    const rxNumber = `RX-${Math.floor(100000 + Math.random() * 900000)}-LIVE`;

    const newRefill: RefillRequest = {
      id: rxId,
      rxNumber,
      patient: {
        id: 'pt-8821',
        name: 'Eleanor Vance',
        age: 64,
        gender: 'F',
        dob: '1962-04-12',
        phone: '(555) 234-8901',
        mrn: 'MRN-449102-B'
      },
      medication: {
        name: activeProfile.name,
        genericName: activeProfile.genericName,
        dosage: activeProfile.dosage,
        frequency: activeProfile.frequency,
        route: 'Oral',
        quantity: activeProfile.quantity,
        daysSupply: activeProfile.daysSupply,
        daysRemaining: 4,
        sig: `Take ${activeProfile.dosage} daily`,
        therapeuticClass: activeProfile.therapeuticClass
      },
      pharmacy: {
        name: 'CVS Pharmacy #4421',
        npi: '1487692011',
        phone: '(555) 390-4100',
        address: '742 Evergreen Terrace, Springfield, IL',
        pharmacist: 'Dr. James Holloway, PharmD'
      },
      provider: {
        name: 'Dr. Sarah Chen, MD',
        clinic: 'MetroHealth Primary Care',
        specialty: 'Internal Medicine',
        npi: '1922039182'
      },
      insurance: {
        payer: 'Blue Cross Blue Shield IL',
        bin: '004336',
        pcn: 'MEDDPRX',
        rxGroup: 'BCBSIL01',
        memberId: 'DEMO8891023'
      },
      status: andResolve ? 'Resolved' : 'Blocked',
      blocker: activeProfile.blocker,
      blockerDetails: activeProfile.blockerDetails,
      urgency: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pipelineStage: andResolve ? 'resolved' : 'provider_ehr',
      aiRecommendation: {
        actionTitle: activeProfile.actionTitle,
        actionType: activeProfile.actionType,
        confidenceScore: activeProfile.confidenceScore,
        suggestedDuration: `${activeProfile.daysSupply}-Day Supply`,
        reasoning: activeProfile.rationale,
        riskScore: 'Low Risk',
        confidenceBreakdown: [
          { metric: 'Medication Adherence (MPR > 90%)', score: activeProfile.adherenceRate },
          { metric: 'Renal & Safety Profile', score: 98 },
          { metric: 'Clinical Guideline Adherence', score: 96 }
        ]
      },
      clinicalEvidence: {
        lastVisitDaysAgo: 65,
        lastVisitDate: '2026-07-20',
        lastVisitProvider: 'Dr. Sarah Chen, MD',
        labs: activeProfile.labs.map(l => ({ ...l, referenceRange: 'Normal clinical standard' })),
        adherenceRate: activeProfile.adherenceRate,
        drugInteractions: { severity: 'none', notes: 'Zero acute drug-drug contraindications.' },
        vitals: { bp: '124/80 mmHg', pulse: 72, weight: '166 lbs', bmi: 27.0 },
        clinicalRationale: activeProfile.rationale,
        guidelineCitation: activeProfile.guideline
      },
      resolutionDetails: andResolve ? {
        actionTaken: activeProfile.actionTitle,
        resolvedBy: 'Dr. Sarah Chen, MD',
        timestamp: new Date().toISOString(),
        note: `Approved via RefillFlow AI Clinical Engine. Surescripts cryptographic signature verified.`,
        txId: txId
      } : undefined
    };

    onAddToQueue(newRefill, andResolve);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-cyan-950/50 text-slate-100"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3.5">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 shadow-md shadow-cyan-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  Autonomous Refill Resolution Engine
                </h2>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/40">
                  REAL-WORLD AI DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Enter any medication &bull; RefillFlow AI autonomously queries the EHR, detects blockers, applies clinical guidelines, and prepares eRx sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setPipelineState('idle');
                setTelemetryLogs([]);
              }}
              className="flex items-center space-x-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
              title="Reset Demo"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-900/60">

          {/* SECTION 1: Clean Real-World Medicine Search & Intake */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Enter Medication to Refill (Patient or Pharmacy Request):
            </label>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (medInput.trim()) {
                  handleStartAnalysis(medInput.trim());
                }
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  placeholder="e.g. Metformin 1000mg, Ozempic, Lisinopril 20mg, Adderall XR, Eliquis, Lipitor..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={pipelineState === 'analyzing' || !medInput.trim()}
                className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 shrink-0"
              >
                <Zap className="h-4 w-4" />
                <span>{pipelineState === 'analyzing' ? 'Analyzing EHR Records...' : 'Run Autonomous Resolution'}</span>
              </button>
            </form>

            {/* Quick 1-Click Common Prescriptions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-[11px] text-slate-400">Quick Test Drugs:</span>
              {[
                { label: 'Metformin 1000mg', drug: 'Metformin HCl 1000mg' },
                { label: 'Ozempic 1mg', drug: 'Ozempic 1mg/dose (4mg/3mL)' },
                { label: 'Lisinopril 20mg', drug: 'Lisinopril 20mg Tablet' },
                { label: 'Adderall XR 20mg', drug: 'Adderall XR 20mg Capsule' },
                { label: 'Eliquis 5mg', drug: 'Eliquis (Apixaban) 5mg Tablet' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMedInput(item.drug);
                    handleStartAnalysis(item.drug);
                  }}
                  className={`rounded-lg px-2 py-1 text-[11px] font-medium border transition-colors ${
                    medInput === item.drug
                      ? 'border-cyan-400/80 bg-cyan-950/60 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: Real-Time Autonomous Engine Telemetry & Pipeline */}
          {(pipelineState === 'analyzing' || telemetryLogs.length > 0) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5" />
                  EHR &amp; INTEROPERABILITY ENGINE STREAM
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  HL7 FHIR R4 &bull; NCPDP SCRIPT
                </span>
              </div>

              {/* Console log ticker */}
              <div className="font-mono text-[11px] space-y-1 bg-black/60 rounded-xl p-3 max-h-36 overflow-y-auto border border-slate-800/60">
                {telemetryLogs.map((log, i) => (
                  <div key={i} className="text-slate-300 flex items-start gap-2">
                    <span className="text-teal-400 shrink-0">&bull;</span>
                    <span className={i === telemetryLogs.length - 1 ? 'text-cyan-300 font-semibold' : 'text-slate-400'}>
                      {log}
                    </span>
                  </div>
                ))}
                {pipelineState === 'analyzing' && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs animate-pulse pt-1">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                    <span>RefillFlow Clinical AI evaluating risk profile &amp; formulary...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: Autonomous Diagnosis & Clinician HITL Desk */}
          {(pipelineState === 'ready_for_signature' || pipelineState === 'dispatched') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-teal-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 space-y-4 shadow-xl shadow-teal-950/20"
            >
              {/* Header: Autonomous Clinical Diagnosis */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      CLINICAL SIGN-OFF DESK &bull; DR. SARAH CHEN, MD
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Patient: <strong className="text-slate-200">Eleanor Vance (64yo F)</strong> &bull; MRN: <span className="font-mono text-slate-300">MRN-449102-B</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-bold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{activeProfile.confidenceScore}% AI Confidence</span>
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                    Low Clinical Risk
                  </span>
                </div>
              </div>

              {/* 2-Column Clinical Insight Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Left Box: Autonomous Blocker Diagnostic */}
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-3.5 space-y-2">
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    Autonomously Detected Blocker
                  </span>
                  <div className="text-xs font-bold text-white">{activeProfile.blocker}</div>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    {activeProfile.blockerDetails}
                  </p>
                  <div className="pt-1.5 border-t border-rose-900/40 text-[10px] text-rose-300 flex items-center justify-between">
                    <span>NCPDP Reject Intercept</span>
                    <span>Adherence: <strong className="text-white">{activeProfile.adherenceRate}%</strong></span>
                  </div>
                </div>

                {/* Right Box: AI Recommendation & Guideline Citation */}
                <div className="rounded-xl border border-teal-500/40 bg-teal-950/20 p-3.5 space-y-2">
                  <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                    Evidence-Based AI Recommendation
                  </span>
                  <div className="text-xs font-bold text-white">{activeProfile.actionTitle}</div>
                  <p className="text-[11px] text-teal-200/90 leading-relaxed">
                    {activeProfile.rationale}
                  </p>
                  <div className="pt-1.5 border-t border-teal-900/40 text-[10px] text-teal-300">
                    <strong>Guideline Citation: </strong>{activeProfile.guideline}
                  </div>
                </div>
              </div>

              {/* Extracted Safety Labs */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  EHR Safety Labs &amp; Vitals Cross-Referenced by Engine:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {activeProfile.labs.map((lab, i) => (
                    <div key={i} className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                      <div className="text-[10px] text-slate-400">{lab.name}:</div>
                      <div className={`font-bold ${lab.status === 'due' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {lab.value} <span className="text-[9px] font-normal text-slate-400">({lab.date})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinician Action Desk */}
              {pipelineState === 'ready_for_signature' ? (
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block mr-1.5"></span>
                    Prescriber Signature Required for Electronic Transmission
                  </div>

                  <button
                    onClick={handleSigneRx}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/35 ring-2 ring-emerald-400/60 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve &amp; Sign eRx via Surescripts FHIR</span>
                  </button>
                </div>
              ) : (
                /* Dispatched Confirmation */
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>eRx Digitally Signed &amp; Dispatched via Surescripts FHIR Network!</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Surescripts eRx Payload:</div>
                      <div className="font-mono text-[11px] text-slate-200">TX: {txId}</div>
                      <div className="text-[10px] text-emerald-400">Dispensing: CVS Pharmacy #4421</div>
                    </div>

                    <div className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-mono">Twilio Patient SMS Delivered:</div>
                      <div className="text-[11px] text-slate-200 italic">
                        &ldquo;Dr. Sarah Chen approved your refill for {activeProfile.name}. Ready at CVS Pharmacy.&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Push to live workspace buttons */}
                  <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleCompleteAndPush(false)}
                      className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 border border-slate-700"
                    >
                      Add to Blocked Queue
                    </button>
                    <button
                      onClick={() => handleCompleteAndPush(true)}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30"
                    >
                      Complete &amp; View in Fulfilled Queue &rarr;
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
