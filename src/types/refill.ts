export type RefillStatus = 
  | 'Ingested' 
  | 'Blocked' 
  | 'AI_Evaluating' 
  | 'HITL_Review' 
  | 'Resolved' 
  | 'Fulfilled';

export type BlockerReason = 
  | 'No Refills Remaining (Requires New Rx)'
  | 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)'
  | 'Prior Authorization Required by PBM'
  | 'Patient Needs Follow-up Visit';

export interface ClinicalLab {
  name: string;
  value: string;
  date: string;
  status: 'normal' | 'abnormal' | 'due' | 'critical';
  referenceRange: string;
}

export interface ClinicalEvidence {
  lastVisitDaysAgo: number;
  lastVisitDate: string;
  lastVisitProvider: string;
  labs: ClinicalLab[];
  adherenceRate: number; // e.g. 94
  drugInteractions: {
    severity: 'none' | 'low' | 'moderate' | 'high';
    notes: string;
  };
  vitals?: {
    bp?: string;
    pulse?: number;
    weight?: string;
    bmi?: number;
  };
  clinicalRationale: string;
  guidelineCitation: string;
}

export interface AIRecommendation {
  actionTitle: string;
  actionType: 'approve_erx' | 'telehealth_visit' | 'bridge_and_lab' | 'deny';
  confidenceScore: number; // e.g. 94
  suggestedDuration: string;
  reasoning: string;
  riskScore: 'Low Risk' | 'Moderate Risk' | 'Guarded';
  confidenceBreakdown: {
    metric: string;
    score: number;
  }[];
}

export interface RefillRequest {
  id: string;
  rxNumber: string;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: 'M' | 'F' | 'Other';
    dob: string;
    phone: string;
    mrn: string;
  };
  medication: {
    name: string;
    genericName: string;
    dosage: string;
    frequency: string;
    route: string;
    quantity: number;
    daysSupply: number;
    daysRemaining?: number; // Days of supply remaining before patient runs out
    sig: string;
    deaSchedule?: 'Schedule II' | 'Schedule III' | 'Schedule IV' | 'Non-controlled';
    therapeuticClass: string;
  };
  pharmacy: {
    name: string;
    npi: string;
    phone: string;
    address: string;
    pharmacist: string;
  };
  provider: {
    name: string;
    clinic: string;
    specialty: string;
    npi: string;
  };
  insurance: {
    payer: string;
    bin: string;
    pcn: string;
    rxGroup: string;
    memberId: string;
    paStatus?: 'Not Required' | 'Expired' | 'Pending Clinical Notes' | 'Formulary Tier 3';
  };
  status: RefillStatus;
  blocker: BlockerReason;
  blockerDetails: string;
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  pipelineStage: 'patient' | 'pharmacy' | 'pbm' | 'provider_ehr' | 'resolved';
  aiRecommendation: AIRecommendation;
  clinicalEvidence: ClinicalEvidence;
  resolutionDetails?: {
    actionTaken: string;
    resolvedBy: string;
    timestamp: string;
    note?: string;
    txId: string;
  };
}

export interface AuditEvent {
  id: string;
  refillId: string;
  patientName: string;
  medicationName: string;
  timestamp: string;
  actor: string;
  actorRole: 'AI_Engine' | 'Physician' | 'Medical_Assistant' | 'Pharmacist' | 'Surescripts_FHIR' | 'System';
  action: string;
  details: string;
  fhirTransactionId: string;
  status: 'success' | 'warning' | 'info';
}

export type PortalRole = 'physician' | 'pharmacy' | 'patient';

export interface HospitalUser {
  id: string;
  name: string;
  role: PortalRole;
  title: string;
  badge: string;
  facility: string;
  avatar: string;
  email: string;
  npi?: string;
  phone?: string;
}

export interface ToastMessage {
  id: string;
  type: 'erx_fhir' | 'sms' | 'pa_portal' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  meta?: string;
}
