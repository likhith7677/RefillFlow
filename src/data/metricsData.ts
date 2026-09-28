export interface BottleneckItem {
  id: string;
  category: string;
  count: number;
  percentage: number;
  legacyDelay: string;
  aiDelay: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  description: string;
  primaryAction: string;
  color: string;
}

export const BOTTLENECK_HEATMAP: BottleneckItem[] = [
  {
    id: 'b-pa',
    category: 'Prior Authorization (PBM)',
    count: 342,
    percentage: 42,
    legacyDelay: '5.4 days',
    aiDelay: '14 minutes',
    severity: 'critical',
    description: 'PBM form rejections, formulary step-therapy requirements, and missing clinical justification.',
    primaryAction: 'Auto-synthesizes EHR clinical notes into FHIR PA packets with pre-attached lab proof.',
    color: '#f43f5e'
  },
  {
    id: 'b-labs',
    category: 'Missing Monitoring Labs',
    count: 251,
    percentage: 31,
    legacyDelay: '4.8 days',
    aiDelay: '18 minutes',
    severity: 'high',
    description: 'Refill blocked pending routine HbA1c, lipid profile, potassium, or therapeutic drug monitoring.',
    primaryAction: 'Issues 30-day safety bridge supply and queues electronic e-lab requisition to Quest/Labcorp.',
    color: '#f59e0b'
  },
  {
    id: 'b-provider',
    category: 'Provider Approval Backlog',
    count: 148,
    percentage: 18,
    legacyDelay: '3.6 days',
    aiDelay: '45 seconds',
    severity: 'moderate',
    description: 'Exhausted refills sitting in Doctor / MA In Basket queues between clinical clinic shifts.',
    primaryAction: '1-Click HITL triage with 94%+ confidence scores and instant EHR sign-off.',
    color: '#06b6d4'
  },
  {
    id: 'b-contact',
    category: 'Patient Follow-up & Vitals',
    count: 73,
    percentage: 9,
    legacyDelay: '6.2 days',
    aiDelay: '1.2 hours',
    severity: 'low',
    description: 'Mandatory annual face-to-face visits or controlled substance agreement renewals.',
    primaryAction: 'Automated SMS dispatch with one-click telehealth scheduling and temporary safety bridge.',
    color: '#8b5cf6'
  }
];

export const HOURLY_THROUGHPUT = [
  { time: '08:00', incoming: 42, aiResolved: 35, manualReview: 7, legacyBaseline: 12 },
  { time: '09:00', incoming: 85, aiResolved: 71, manualReview: 14, legacyBaseline: 18 },
  { time: '10:00', incoming: 128, aiResolved: 104, manualReview: 24, legacyBaseline: 24 },
  { time: '11:00', incoming: 142, aiResolved: 118, manualReview: 24, legacyBaseline: 28 },
  { time: '12:00', incoming: 96, aiResolved: 82, manualReview: 14, legacyBaseline: 22 },
  { time: '13:00', incoming: 114, aiResolved: 95, manualReview: 19, legacyBaseline: 26 },
  { time: '14:00', incoming: 138, aiResolved: 116, manualReview: 22, legacyBaseline: 29 },
  { time: '15:00', incoming: 120, aiResolved: 101, manualReview: 19, legacyBaseline: 25 },
  { time: '16:00', incoming: 88, aiResolved: 74, manualReview: 14, legacyBaseline: 20 },
  { time: '17:00', incoming: 52, aiResolved: 46, manualReview: 6, legacyBaseline: 15 }
];

export const GTM_FUNNEL_STAGES = [
  {
    stage: 'Prospects (TAM)',
    count: 2450,
    label: 'Target Health Systems & Retail Pharmacy Groups',
    conversionRate: '100%',
    metric: '2,450 accounts mapped',
    status: 'Market Landscape',
    color: '#64748b'
  },
  {
    stage: 'TOFU (Outreach)',
    count: 420,
    label: 'Automated EHR Refill Gap Audits Dispatched',
    conversionRate: '17.1%',
    metric: '420 MSOs & FQHCs in dialogue',
    status: 'In Evaluation',
    color: '#38bdf8'
  },
  {
    stage: 'MOFU (Clinical Pilot)',
    count: 84,
    label: '60-Day Sandboxed HITL Clinical Pilots Running',
    conversionRate: '20.0%',
    metric: '84 Pilot sites live (Athena & Epic)',
    status: 'Active Testing',
    color: '#f59e0b'
  },
  {
    stage: 'BOFU (Procurement)',
    count: 26,
    label: 'Enterprise BAAs & EHR App Orchard Contracts',
    conversionRate: '31.0%',
    metric: '26 contracts closing in Q3/Q4',
    status: 'Legal & Security Review',
    color: '#10b981'
  },
  {
    stage: 'Customer Success',
    count: 19,
    label: 'Enterprise Multi-Clinic Deployments',
    conversionRate: '73.1%',
    metric: '142% Net Revenue Retention, 0.8% Churn',
    status: 'Production Scale',
    color: '#a855f7'
  }
];
