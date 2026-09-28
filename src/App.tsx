import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Stethoscope, 
  HelpCircle,
  Inbox,
  Filter,
  Pill,
  Smartphone,
  ArrowRight
} from 'lucide-react';

import { 
  RefillRequest, 
  AuditEvent, 
  PortalRole, 
  ToastMessage,
  HospitalUser
} from './types/refill';
import { INITIAL_REFILLS, INITIAL_AUDIT_LOGS, HOSPITAL_USERS } from './data/refillsData';

import { Header } from './components/Header';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { MetricsDashboard } from './components/MetricsDashboard';
import { RefillTicket } from './components/RefillTicket';
import { ResolvedTicket } from './components/ResolvedTicket';
import { FilterBar } from './components/FilterBar';
import { AIExplainabilityModal } from './components/AIExplainabilityModal';
import { GtmRoiModal } from './components/GtmRoiModal';
import { AuditLogDrawer } from './components/AuditLogDrawer';
import { ToastContainer } from './components/ToastContainer';
import { PortalContextBanner } from './components/PortalContextBanner';
import { LiveDemoModal } from './components/LiveDemoModal';
import { LiveDemoBanner } from './components/LiveDemoBanner';
import { LowSupplyAlertBanner } from './components/LowSupplyAlertBanner';
import { PatientMobileModal } from './components/PatientMobileModal';
import { playClinicalSuccessChime } from './utils/audio';

export const App: React.FC = () => {
  // Primary State
  const [refills, setRefills] = useState<RefillRequest[]>(INITIAL_REFILLS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // UI & Workspace State
  const [portalRole, setPortalRole] = useState<PortalRole>('physician');
  const [currentUser, setCurrentUser] = useState<HospitalUser>(HOSPITAL_USERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlocker, setSelectedBlocker] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [viewTab, setViewTab] = useState<'blocked' | 'resolved'>('blocked');
  const [isLowSupplyOnly, setIsLowSupplyOnly] = useState(false);
  
  // Modals & Drawers
  const [selectedExplainabilityRefill, setSelectedExplainabilityRefill] = useState<RefillRequest | null>(null);
  const [isGtmOpen, setIsGtmOpen] = useState(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isPulsingPipeline, setIsPulsingPipeline] = useState(false);
  const [isLiveDemoOpen, setIsLiveDemoOpen] = useState(false);
  const [liveDemoInitialMed, setLiveDemoInitialMed] = useState<string | undefined>(undefined);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper: Trigger Toast Notification
  const addToast = (type: ToastMessage['type'], title: string, description: string, meta?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = {
      id,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      meta
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 5.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper: Trigger Pipeline Pulse
  const pulsePipeline = () => {
    setIsPulsingPipeline(true);
    setTimeout(() => setIsPulsingPipeline(false), 2400);
  };

  // Helper: Confetti on Resolution
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#06b6d4', '#6366f1']
      });
    } catch (e) {
      // ignore
    }
  };

  // Live Demo Handlers
  const handleOpenLiveDemo = (medName?: string) => {
    setLiveDemoInitialMed(medName);
    setIsLiveDemoOpen(true);
  };

  const handleAddSimulatedRefill = (newRefill: RefillRequest, andResolve: boolean = false) => {
    pulsePipeline();

    if (andResolve) {
      triggerConfetti();
      setViewTab('resolved');

      setRefills((prev) => [newRefill, ...prev]);

      const txId = newRefill.resolutionDetails?.txId || `SURESCRIPTS-FHIR-TX-${Math.floor(100000 + Math.random() * 900000)}`;
      const audit: AuditEvent = {
        id: `aud-${Date.now()}`,
        refillId: newRefill.id,
        patientName: newRefill.patient.name,
        medicationName: newRefill.medication.name,
        timestamp: new Date().toISOString(),
        actor: 'Dr. Sarah Chen, MD',
        actorRole: 'Physician',
        action: 'Simulated Refill Resolved & eRx Dispatched',
        details: `End-to-end live demonstration completed for ${newRefill.medication.name}. Cryptographic Surescripts FHIR signature verified.`,
        fhirTransactionId: txId,
        status: 'success'
      };
      setAuditLogs((prev) => [audit, ...prev]);

      addToast(
        'erx_fhir',
        'Live Demonstration Refill Resolved',
        `Prescription for ${newRefill.medication.name} successfully resolved and transmitted to pharmacy.`,
        txId
      );

      setTimeout(() => {
        addToast(
          'sms',
          'Patient SMS Notification Dispatched',
          `SMS sent to ${newRefill.patient.phone}: "Your prescription for ${newRefill.medication.name} is ready for pickup."`,
          'Twilio Gateway'
        );
      }, 700);
    } else {
      setViewTab('blocked');
      setRefills((prev) => [newRefill, ...prev]);

      const audit: AuditEvent = {
        id: `aud-${Date.now()}`,
        refillId: newRefill.id,
        patientName: newRefill.patient.name,
        medicationName: newRefill.medication.name,
        timestamp: new Date().toISOString(),
        actor: 'RefillFlow Intake Switch',
        actorRole: 'System',
        action: 'Simulated Refill Ingested into Queue',
        details: `Prescription intake for ${newRefill.medication.name} processed. Blocked reason: "${newRefill.blocker}".`,
        fhirTransactionId: `INGEST-${Date.now()}`,
        status: 'warning'
      };
      setAuditLogs((prev) => [audit, ...prev]);

      addToast(
        'info',
        'Simulated Refill Added to Queue',
        `${newRefill.medication.name} for ${newRefill.patient.name} added to Active Blocked Queue for triage.`,
        newRefill.rxNumber
      );
    }
  };

  // Hospital Account Role Switcher Handler
  const handleRoleChange = (role: PortalRole) => {
    setPortalRole(role);
    const matched = HOSPITAL_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addToast(
        'info',
        `Switched to ${matched.name}`,
        `Now operating as ${matched.title} (${matched.facility.split('(')[0]}). Workspace adjusted to your clinical role.`,
        matched.role.toUpperCase()
      );
    }
  };

  // Patient Mobile Companion App Refill Request Handler
  const handlePatientMobileRequest = (medicationName: string, daysRemaining = 4) => {
    pulsePipeline();

    const rxId = `rf-mob-${Date.now().toString().slice(-4)}`;
    const rxNumber = `RX-${Math.floor(100000 + Math.random() * 900000)}-MOB`;

    const newRefill: RefillRequest = {
      id: rxId,
      rxNumber,
      patient: {
        id: 'pt-8821',
        name: currentUser.role === 'patient' ? currentUser.name : 'Eleanor Vance',
        age: 64,
        gender: 'F',
        dob: '1962-04-12',
        phone: '(555) 234-8901',
        mrn: 'MRN-449102-B'
      },
      medication: {
        name: medicationName,
        genericName: medicationName.split(' ')[0],
        dosage: 'Maintenance Regimen',
        frequency: 'Daily as directed',
        route: 'Oral',
        quantity: 90,
        daysSupply: 90,
        daysRemaining: daysRemaining,
        sig: `Take 1 dose daily as directed for maintenance therapy`,
        therapeuticClass: 'Maintenance Medication'
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
        clinic: 'MetroHealth Primary Care & Diabetes Institute',
        specialty: 'Internal Medicine',
        npi: '1922039182'
      },
      insurance: {
        payer: 'Blue Cross Blue Shield IL',
        bin: '004336',
        pcn: 'MEDDPRX',
        rxGroup: 'BCBSIL01',
        memberId: 'XEH889102341'
      },
      status: 'Blocked',
      blocker: 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)',
      blockerDetails: `Prescription refill submitted via MyMetroHealth Mobile App. Current supply has only ${daysRemaining} days remaining. Queued for Dr. Sarah Chen's In Basket triage.`,
      urgency: daysRemaining <= 5 ? 'critical' : 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pipelineStage: 'provider_ehr',
      aiRecommendation: {
        actionTitle: 'Review Chart & Issue 30-Day Safety Bridge',
        actionType: 'bridge_and_lab',
        confidenceScore: 95,
        suggestedDuration: '30-Day Bridge Supply',
        reasoning: `Patient requested refill via mobile app with only ${daysRemaining} days supply left. High adherence history on file. Recommends issuing 30-day bridge to ensure continuous therapy.`,
        riskScore: 'Low Risk',
        confidenceBreakdown: [
          { metric: 'Medication Adherence History', score: 96 },
          { metric: 'Renal & Safety Profile Stable', score: 98 },
          { metric: 'Low Discontinuation Hazard', score: 94 }
        ]
      },
      clinicalEvidence: {
        lastVisitDaysAgo: 45,
        lastVisitDate: '2026-08-14',
        lastVisitProvider: 'Dr. Sarah Chen, MD',
        labs: [
          { name: 'HbA1c', value: '7.0%', date: '2026-03-12', status: 'due', referenceRange: '< 7.0%' },
          { name: 'eGFR', value: '80 mL/min', date: '2026-08-14', status: 'normal', referenceRange: '> 60' },
          { name: 'Serum Creatinine', value: '0.90 mg/dL', date: '2026-08-14', status: 'normal', referenceRange: '0.59 - 1.04' }
        ],
        adherenceRate: 95,
        drugInteractions: {
          severity: 'none',
          notes: 'No contraindications or duplicate therapies.'
        },
        vitals: {
          bp: '124/80 mmHg',
          pulse: 72,
          weight: '166 lbs',
          bmi: 27.0
        },
        clinicalRationale: 'Continuous pharmacotherapy preserves clinical stability. Safe for physician bridge or full renewal.',
        guidelineCitation: 'Clinical Practice Guidelines 2026: Mobile Patient Intake Protocol.'
      }
    };

    setRefills((prev) => [newRefill, ...prev]);
    setViewTab('blocked');

    const audit: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId: newRefill.id,
      patientName: newRefill.patient.name,
      medicationName: newRefill.medication.name,
      timestamp: new Date().toISOString(),
      actor: `${newRefill.patient.name} (Mobile App)`,
      actorRole: 'System',
      action: 'Patient Mobile Refill Requested',
      details: `Patient requested refill for ${newRefill.medication.name} via MyMetroHealth Mobile App. Supply has ${daysRemaining} days left.`,
      fhirTransactionId: `MOBILE-INTAKE-${Date.now()}`,
      status: 'info'
    };
    setAuditLogs((prev) => [audit, ...prev]);

    addToast(
      'sms',
      'Mobile Refill Request Submitted',
      `Request for ${medicationName} sent to Dr. Sarah Chen's clinic In Basket. Patient SMS confirmation sent.`,
      rxNumber
    );
  };

  // Action 1: One-Click Approve & Issue eRx
  const handleApprove = (refill: RefillRequest, note?: string) => {
    playClinicalSuccessChime();
    triggerConfetti();
    pulsePipeline();

    const txId = `SURESCRIPTS-FHIR-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const resolvedBy = portalRole === 'pharmacy' ? 'Dr. James Holloway, PharmD' : 'Dr. Sarah Chen, MD';

    // Optimistically update refill object with doctor changes preserved
    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refill.id) {
          return {
            ...refill,
            status: 'Resolved',
            pipelineStage: 'resolved',
            updatedAt: new Date().toISOString(),
            resolutionDetails: {
              actionTaken: 'Approved & eRx Transmitted',
              resolvedBy,
              timestamp: new Date().toISOString(),
              note: note || `Approved ${refill.medication.daysSupply}-day supply with Surescripts cryptographic signature. Guideline criteria verified.`,
              txId
            }
          };
        }
        return r;
      })
    );

    // Append to Audit Trail
    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId: refill.id,
      patientName: refill.patient.name,
      medicationName: refill.medication.name,
      timestamp: new Date().toISOString(),
      actor: resolvedBy,
      actorRole: portalRole === 'pharmacy' ? 'Pharmacist' : 'Physician',
      action: 'eRx Approved & Transmitted',
      details: `One-Click sign-off executed. Transmitted via Surescripts FHIR API with payload validation.`,
      fhirTransactionId: txId,
      status: 'success'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    // Simulated Webhooks
    addToast(
      'erx_fhir',
      'eRx Transmitted via Surescripts FHIR API',
      `Electronic prescription for ${refill.medication.name} sent to ${refill.pharmacy.name}.`,
      txId
    );

    setTimeout(() => {
      addToast(
        'sms',
        'SMS Dispatched to Patient',
        `SMS sent to ${refill.patient.phone}: "Your refill for ${refill.medication.name} has been approved and is being filled at ${refill.pharmacy.name}."`,
        'Twilio SMS Gateway'
      );
    }, 700);

    if (selectedExplainabilityRefill?.id === refill.id) {
      setSelectedExplainabilityRefill(null);
    }
  };

  // Action: Doctor Fast 1-Click Approve (Quick sign-off for doctor)
  const handleDoctorFastApprove = () => {
    // Find next pending prescription to sign off
    // Prioritize high-confidence safe tickets, or any blocked ticket in the queue
    const pendingTickets = refills.filter((r) => r.status === 'Blocked');
    if (pendingTickets.length === 0) {
      addToast('info', 'All Refills Signed Off', "There are no pending blocked refill tickets in Dr. Sarah Chen's In Basket.");
      return;
    }

    // Pick top priority (highest confidence or critical)
    const target = pendingTickets.find((r) => r.aiRecommendation.confidenceScore >= 90) || pendingTickets[0];

    handleApprove(
      target, 
      `⚡ Rapid 1-Click Sign-Off executed by Dr. Sarah Chen, MD. Pharmacotherapy continuous compliance verified via Surescripts FHIR API.`
    );
  };

  // Action 2: Order Lab & 30-Day Bridge Supply
  const handleBridgeLab = (refill: RefillRequest, note?: string) => {
    playClinicalSuccessChime();
    triggerConfetti();
    pulsePipeline();

    const txId = `QUEST-BRIDGE-${Math.floor(100000 + Math.random() * 900000)}`;
    const resolvedBy = 'Dr. Sarah Chen, MD';

    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refill.id) {
          return {
            ...refill,
            status: 'Resolved',
            pipelineStage: 'resolved',
            updatedAt: new Date().toISOString(),
            resolutionDetails: {
              actionTaken: '30-Day Bridge + Lab Order Dispatched',
              resolvedBy,
              timestamp: new Date().toISOString(),
              note: note || `Issued 30-day bridge supply to maintain pharmacotherapy while routine monitoring lab is processed.`,
              txId
            }
          };
        }
        return r;
      })
    );

    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId: refill.id,
      patientName: refill.patient.name,
      medicationName: refill.medication.name,
      timestamp: new Date().toISOString(),
      actor: resolvedBy,
      actorRole: 'Physician',
      action: 'Bridge Dispensed & Lab Requisitioned',
      details: `Generated Quest Diagnostics FHIR ServiceRequest lab order and issued 30-day bridge eRx to avoid therapy abandonment.`,
      fhirTransactionId: txId,
      status: 'success'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    addToast(
      'erx_fhir',
      '30-Day Safety Bridge eRx Issued',
      `Bridge supply for ${refill.medication.name} transmitted to ${refill.pharmacy.name}.`,
      txId
    );

    setTimeout(() => {
      addToast(
        'sms',
        'Quest e-Lab Requisition & Patient SMS',
        `Requisition queued. Patient notified: "A 30-day bridge is ready at ${refill.pharmacy.name}. Please complete your lab draw before next refill."`,
        'Lab Interop'
      );
    }, 800);

    if (selectedExplainabilityRefill?.id === refill.id) {
      setSelectedExplainabilityRefill(null);
    }
  };

  // Action 3: Request Telehealth Visit
  const handleTelehealth = (refill: RefillRequest, note?: string) => {
    pulsePipeline();
    const txId = `TELEHEALTH-INVITE-${Math.floor(100000 + Math.random() * 900000)}`;

    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refill.id) {
          return {
            ...refill,
            status: 'Resolved',
            pipelineStage: 'resolved',
            updatedAt: new Date().toISOString(),
            resolutionDetails: {
              actionTaken: 'Telehealth Link Dispatched + 14-Day Bridge',
              resolvedBy: 'Medical Assistant & Dr. Sarah Chen, MD',
              timestamp: new Date().toISOString(),
              note: note || `Scheduled mandatory telehealth evaluation and issued 14-day bridge supply under DEA telehealth flexibilities.`,
              txId
            }
          };
        }
        return r;
      })
    );

    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId: refill.id,
      patientName: refill.patient.name,
      medicationName: refill.medication.name,
      timestamp: new Date().toISOString(),
      actor: 'Medical Assistant',
      actorRole: 'Medical_Assistant',
      action: 'Telehealth Link Sent to Patient',
      details: `Dispatched instant 1-click video booking invitation to patient phone. Safety bridge issued.`,
      fhirTransactionId: txId,
      status: 'info'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    addToast(
      'sms',
      'Telehealth Video Booking Link Sent',
      `SMS dispatched to ${refill.patient.name}: "Please tap to complete your required video checkup: https://metrohealth.care/rx-visit/${refill.id}"`,
      'Patient Engagement'
    );

    if (selectedExplainabilityRefill?.id === refill.id) {
      setSelectedExplainabilityRefill(null);
    }
  };

  // Action 4: Deny with structured reason
  const handleDeny = (refill: RefillRequest, reason: string) => {
    const txId = `DENIAL-NCPDP-${Math.floor(100000 + Math.random() * 900000)}`;

    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refill.id) {
          return {
            ...r,
            status: 'Resolved',
            pipelineStage: 'resolved',
            updatedAt: new Date().toISOString(),
            resolutionDetails: {
              actionTaken: 'Prescription Denied by Clinician',
              resolvedBy: 'Dr. Sarah Chen, MD',
              timestamp: new Date().toISOString(),
              note: reason,
              txId
            }
          };
        }
        return r;
      })
    );

    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      refillId: refill.id,
      patientName: refill.patient.name,
      medicationName: refill.medication.name,
      timestamp: new Date().toISOString(),
      actor: 'Dr. Sarah Chen, MD',
      actorRole: 'Physician',
      action: 'Refill Request Denied',
      details: `Clinician denied refill. Reason: "${reason}". NCPDP denial packet transmitted to retail pharmacy.`,
      fhirTransactionId: txId,
      status: 'warning'
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    addToast(
      'erx_fhir',
      'Denial Transmitted via NCPDP SCRIPT',
      `Pharmacy ${refill.pharmacy.name} informed of refusal for ${refill.patient.name}. Reason: ${reason.slice(0, 50)}...`,
      txId
    );

    if (selectedExplainabilityRefill?.id === refill.id) {
      setSelectedExplainabilityRefill(null);
    }
  };

  // Re-open / Re-triage ticket back to blocked
  const handleReopen = (refill: RefillRequest) => {
    setRefills((prev) =>
      prev.map((r) => {
        if (r.id === refill.id) {
          return {
            ...r,
            status: 'Blocked',
            pipelineStage: 'provider_ehr',
            resolutionDetails: undefined
          };
        }
        return r;
      })
    );

    addToast(
      'info',
      'Ticket Restored to Active Queue',
      `${refill.patient.name}'s refill request moved back to In Basket triage for re-evaluation.`,
      'Queue State Reset'
    );
  };

  // Batch actions
  const handleBatchAction = (actionType: string) => {
    if (actionType === 'batch_approve_high') {
      const highConfidenceRxs = refills.filter(
        (r) => r.status === 'Blocked' && r.aiRecommendation.confidenceScore >= 92
      );
      if (highConfidenceRxs.length === 0) {
        addToast('info', 'No Qualifying Refills', 'No remaining blocked tickets have confidence score >= 92%.');
        return;
      }

      highConfidenceRxs.forEach((r, idx) => {
        setTimeout(() => {
          handleApprove(r);
        }, idx * 250);
      });

      addToast(
        'erx_fhir',
        `Batch Signing ${highConfidenceRxs.length} Safe Prescriptions`,
        `Automated bulk FHIR sign-off executed for high-confidence refills.`,
        'Bulk HITL Protocol'
      );
    } else if (actionType === 'batch_ping') {
      addToast(
        'erx_fhir',
        'NCPDP Status Ping Sent to 6 Prescriber Clinics',
        'Electronic reminders queued into MetroHealth & Lakeview Cardiology In Baskets.',
        'NCPDP RefillReminder'
      );
    } else if (actionType === 'batch_pa') {
      addToast(
        'pa_portal',
        'AI Prior Auth Packets Transmitted',
        'OptumRx & Humana electronic PA portals updated with auto-generated Form 68-B & clinical notes.',
        'CoverMyMeds / FHIR ePA'
      );
    } else if (actionType === 'batch_sms') {
      addToast(
        'sms',
        'Patient Status Broadcast Dispatched',
        'Automated SMS updates sent to 8 patients detailing current refill review status.',
        'Patient Communications'
      );
    }
  };

  // Reset entire dataset to initial state
  const handleResetData = () => {
    setRefills(INITIAL_REFILLS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addToast('info', 'Dataset Reset', 'RefillFlow AI reloaded initial 8 clinical cases and baseline metrics.');
  };

  // Filter calculations
  const blockedRefills = refills.filter((r) => r.status === 'Blocked');
  const resolvedRefills = refills.filter((r) => r.status === 'Resolved' || r.status === 'Fulfilled');

  // Low supply calculation (medications with <= 10 days remaining)
  const lowSupplyCount = blockedRefills.filter(
    (r) => r.medication.daysRemaining !== undefined && r.medication.daysRemaining <= 10
  ).length;

  const displayedRefills = (viewTab === 'blocked' ? blockedRefills : resolvedRefills).filter((r) => {
    // Filter for low supply if active
    if (isLowSupplyOnly) {
      if (r.medication.daysRemaining === undefined || r.medication.daysRemaining > 10) {
        return false;
      }
    }

    // Search filter
    const matchesSearch =
      r.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.provider.clinic.toLowerCase().includes(searchQuery.toLowerCase());

    // Blocker filter
    const matchesBlocker = selectedBlocker === 'all' || r.blocker === selectedBlocker;

    // Urgency filter
    const matchesUrgency = selectedUrgency === 'all' || r.urgency === selectedUrgency;

    return matchesSearch && matchesBlocker && matchesUrgency;
  });

  const highConfidenceCount = blockedRefills.filter((r) => r.aiRecommendation.confidenceScore >= 92).length;

  return (
    <div className="min-h-screen bg-[#08101c] text-slate-100 flex flex-col selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Top Header with Hospital Multi-Account Switcher */}
      <Header
        portalRole={portalRole}
        onRoleChange={handleRoleChange}
        currentUser={currentUser}
        onOpenGtm={() => setIsGtmOpen(true)}
        onOpenAuditLog={() => setIsAuditLogOpen(true)}
        onOpenLiveDemo={() => handleOpenLiveDemo()}
        onOpenMobile={() => setIsMobileOpen(true)}
        onDoctorFastApprove={handleDoctorFastApprove}
        pendingDoctorApprovals={blockedRefills.length}
        onResetData={handleResetData}
        activeCount={blockedRefills.length}
        resolvedCount={resolvedRefills.length}
        auditCount={auditLogs.length}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        
        {/* Module A.0: Hospital Critical Low-Supply Alert Banner (≤ 10 Days Remaining) */}
        <LowSupplyAlertBanner
          refills={refills}
          onFilterLowSupply={() => {
            setIsLowSupplyOnly(true);
            setViewTab('blocked');
          }}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        {/* Module A.1: Portal Context Banner (Physician vs Pharmacy vs Patient) */}
        <PortalContextBanner
          portalRole={portalRole}
          onBatchAction={handleBatchAction}
          pendingCount={blockedRefills.length}
          highConfidenceCount={highConfidenceCount}
          onOpenMobile={() => setIsMobileOpen(true)}
          onOpenLiveDemo={() => handleOpenLiveDemo()}
          onDoctorFastApprove={handleDoctorFastApprove}
        />

        {/* Module A.2: Interactive Live Demonstration Banner (Enter Any Medicine) */}
        <LiveDemoBanner
          onOpenDemo={handleOpenLiveDemo}
        />

        {/* Module C.1: Real-time Pipeline Visualizer Stream */}
        <PipelineVisualizer
          refills={refills}
          isPulsing={isPulsingPipeline}
        />

        {/* Module C.2: Metrics Dashboard & Bottleneck Heatmap Matrix */}
        <MetricsDashboard
          resolvedCount={resolvedRefills.length}
        />

        {/* Search, Blocker Categories, Low Supply Filter, and Queue Switcher */}
        <FilterBar
          portalRole={portalRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedBlocker={selectedBlocker}
          onBlockerChange={setSelectedBlocker}
          selectedUrgency={selectedUrgency}
          onUrgencyChange={setSelectedUrgency}
          viewTab={viewTab}
          onTabChange={setViewTab}
          blockedCount={blockedRefills.length}
          resolvedCount={resolvedRefills.length}
          onOpenLiveDemo={() => handleOpenLiveDemo()}
          lowSupplyCount={lowSupplyCount}
          isLowSupplyOnly={isLowSupplyOnly}
          onToggleLowSupplyOnly={() => setIsLowSupplyOnly(!isLowSupplyOnly)}
        />

        {/* Active Ticket List View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 tracking-wide flex items-center gap-2">
              {viewTab === 'blocked' ? (
                <>
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span>ACTIONABLE BLOCKED REFILLS ({displayedRefills.length})</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>FULFILLED & DISPATCHED PRESCRIPTIONS ({displayedRefills.length})</span>
                </>
              )}
            </h3>
            <span className="text-xs text-slate-500">
              {portalRole === 'pharmacy' ? 'Filtered by Pharmacy Outreach' : 'Filtered by Practice In Basket'}
            </span>
          </div>

          {/* Ticket Cards Stream */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {displayedRefills.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-white">No refills match your filter criteria</h4>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting the search query, selecting &ldquo;All Blockers&rdquo;, or toggling between active blocked and resolved queues.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBlocker('all');
                      setSelectedUrgency('all');
                    }}
                    className="mt-4 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : viewTab === 'blocked' ? (
                displayedRefills.map((refill) => (
                  <RefillTicket
                    key={refill.id}
                    refill={refill}
                    portalRole={portalRole}
                    onOpenExplainability={(r) => setSelectedExplainabilityRefill(r)}
                    onQuickApprove={(r) => handleApprove(r)}
                    onQuickBridgeLab={(r) => handleBridgeLab(r)}
                    onQuickTelehealth={(r) => handleTelehealth(r)}
                    onQuickDeny={(r) => handleDeny(r, 'In-person comprehensive evaluation required.')}
                  />
                ))
              ) : (
                displayedRefills.map((refill) => (
                  <ResolvedTicket
                    key={refill.id}
                    refill={refill}
                    onReopen={handleReopen}
                  />
                ))
              )}
            </AnimatePresence>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">RefillFlow AI &trade;</span>
            <span>&bull;</span>
            <span>Intelligent Prescription Refill Resolution Engine</span>
            <span>&bull;</span>
            <span className="text-emerald-400">SOC2 Type II & HIPAA Certified</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsGtmOpen(true)}
              className="text-amber-400 hover:underline"
            >
              Commercial Funnel & ROI Engine
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsAuditLogOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              EHR FHIR Audit Trail
            </button>
            <span>&bull;</span>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-white"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Floating 1-Tap Bar (Dual Doctor Fast Approve & Patient Refill) */}
      <div className="fixed bottom-3 left-3 right-3 z-40 md:hidden flex gap-2">
        {portalRole === 'physician' ? (
          <>
            <button
              onClick={handleDoctorFastApprove}
              className="flex-1 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 p-3 text-white font-black shadow-2xl shadow-emerald-500/50 ring-2 ring-emerald-300 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                    <span>⚡ DOCTOR FAST APPROVE</span>
                    <span className="rounded bg-black/30 text-[9px] px-1.5 py-0.2 font-black uppercase text-emerald-200">
                      {blockedRefills.length} Left
                    </span>
                  </div>
                  <div className="text-[10px] text-emerald-100 font-medium">
                    1-Click Sign-off next pending Rx
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-2xl border-2 border-purple-400/80 bg-gradient-to-r from-purple-600/40 to-indigo-600/40 p-3 text-white font-bold shadow-lg shadow-purple-950/40 active:scale-[0.98] transition-all flex items-center justify-center"
              title="Open Patient Mobile Companion App"
            >
              <Smartphone className="h-5 w-5 text-purple-300" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsMobileOpen(true)}
            className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 p-3.5 text-white font-black shadow-2xl shadow-cyan-500/50 ring-2 ring-cyan-300 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
                <Pill className="h-5 w-5 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                  <span>💊 1-TAP MEDICINE REFILL</span>
                  <span className="rounded bg-rose-500 text-[9px] px-1.5 py-0.2 font-black uppercase text-white animate-pulse">
                    Mobile
                  </span>
                </div>
                <div className="text-[10px] text-cyan-100 font-medium">
                  Tap here to refill prescriptions on your phone
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-white/20 rounded-xl px-2.5 py-1 text-xs font-bold">
              <span>Refill</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        )}
      </div>

      {/* Patient Mobile Smartphone Companion App Simulator */}
      <PatientMobileModal
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        refills={refills}
        onRequestRefill={handlePatientMobileRequest}
        patientName={currentUser.role === 'patient' ? currentUser.name : 'Eleanor Vance'}
        onSwitchRole={handleRoleChange}
      />

      {/* Live Demonstration & Prescription Refill Flow Modal */}
      <LiveDemoModal
        isOpen={isLiveDemoOpen}
        onClose={() => setIsLiveDemoOpen(false)}
        onAddToQueue={handleAddSimulatedRefill}
        initialMedication={liveDemoInitialMed}
      />

      {/* AI Explainability & Clinical Decisioning Modal */}
      <AIExplainabilityModal
        refill={selectedExplainabilityRefill}
        onClose={() => setSelectedExplainabilityRefill(null)}
        onApprove={handleApprove}
        onBridgeLab={handleBridgeLab}
        onTelehealth={handleTelehealth}
        onDeny={handleDeny}
      />

      {/* Commercial GTM & ROI Calculator Modal */}
      <GtmRoiModal
        isOpen={isGtmOpen}
        onClose={() => setIsGtmOpen(false)}
      />

      {/* Tamper-Evident EHR & Surescripts FHIR Audit Log Drawer */}
      <AuditLogDrawer
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        logs={auditLogs}
      />

      {/* Downstream Webhook & Patient SMS Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />

    </div>
  );
};

export default App;
