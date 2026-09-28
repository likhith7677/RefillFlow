import { RefillRequest, HospitalUser } from '../types/refill';

export const INITIAL_REFILLS: RefillRequest[] = [
  {
    id: 'rf-101',
    rxNumber: 'RX-789210-CV',
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
      name: 'Metformin HCl 1000mg',
      genericName: 'Metformin Hydrochloride',
      dosage: '1000 mg',
      frequency: 'Twice daily with meals',
      route: 'Oral tablet',
      quantity: 180,
      daysSupply: 90,
      daysRemaining: 4,
      sig: 'Take 1 tablet by mouth twice daily with morning and evening meals',
      therapeuticClass: 'Biguanide Antidiabetic Agent'
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
    blockerDetails: 'Hemoglobin A1c is overdue by 16 days (standard 90-180d cadence for unadjusted diabetes regimen). eGFR and Creatinine remain stable.',
    urgency: 'high',
    createdAt: '2026-09-27T08:15:00Z',
    updatedAt: '2026-09-27T08:15:00Z',
    pipelineStage: 'provider_ehr',
    aiRecommendation: {
      actionTitle: 'Order Lab Workup & Issue 30-Day Bridge Supply',
      actionType: 'bridge_and_lab',
      confidenceScore: 96,
      suggestedDuration: '30-Day Bridge Supply',
      reasoning: 'Patient has high medication adherence (94%) and baseline renal function is preserved (eGFR 78 mL/min). A 30-day bridge supply avoids acute glycemic rebound while standing lab order is dispatched via Quest FHIR interface.',
      riskScore: 'Low Risk',
      confidenceBreakdown: [
        { metric: 'Renal Safety (eGFR > 60)', score: 98 },
        { metric: 'Medication Possession Ratio (MPR > 90%)', score: 95 },
        { metric: 'No Acute Hypoglycemic Events Reported', score: 96 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 74,
      lastVisitDate: '2026-07-15',
      lastVisitProvider: 'Dr. Sarah Chen, MD',
      labs: [
        { name: 'HbA1c', value: '7.1%', date: '2026-03-12', status: 'due', referenceRange: '< 7.0%' },
        { name: 'eGFR (CKD-EPI)', value: '78 mL/min/1.73m²', date: '2026-07-15', status: 'normal', referenceRange: '> 60' },
        { name: 'Serum Creatinine', value: '0.88 mg/dL', date: '2026-07-15', status: 'normal', referenceRange: '0.59 - 1.04' },
        { name: 'Urine Microalbumin/Cr', value: '18 mg/g', date: '2026-03-12', status: 'normal', referenceRange: '< 30 mg/g' }
      ],
      adherenceRate: 94,
      drugInteractions: {
        severity: 'none',
        notes: 'No contraindications or nephrotoxic co-prescriptions (no NSAID overuse, no iodinated radiocontrast scheduled).'
      },
      vitals: {
        bp: '128/82 mmHg',
        pulse: 72,
        weight: '168 lbs',
        bmi: 27.2
      },
      clinicalRationale: 'American Diabetes Association (ADA 2026) recommends annual or semiannual A1c tracking. Metformin continuation safe with eGFR > 45 mL/min. Bridge prescription prevents glycemic decompensation.',
      guidelineCitation: 'ADA Standards of Care in Diabetes — Section 9: Pharmacologic Approaches to Glycemic Treatment (2026).'
    }
  },
  {
    id: 'rf-102',
    rxNumber: 'RX-991203-WG',
    patient: {
      id: 'pt-5120',
      name: 'Marcus Brody',
      age: 52,
      gender: 'M',
      dob: '1974-09-03',
      phone: '(555) 789-1122',
      mrn: 'MRN-881900-C'
    },
    medication: {
      name: 'Lisinopril 20mg Tablet',
      genericName: 'Lisinopril',
      dosage: '20 mg',
      frequency: 'Once daily in the morning',
      route: 'Oral tablet',
      quantity: 90,
      daysSupply: 90,
      daysRemaining: 7,
      sig: 'Take 1 tablet by mouth daily every morning for blood pressure',
      therapeuticClass: 'ACE Inhibitor / Antihypertensive'
    },
    pharmacy: {
      name: 'Walgreens Community Pharmacy #1042',
      npi: '1093829103',
      phone: '(555) 882-9900',
      address: '1204 North Michigan Ave, Chicago, IL',
      pharmacist: 'Dr. Rebecca Martinez, PharmD'
    },
    provider: {
      name: 'Dr. Marcus Vance, MD',
      clinic: 'Lakeview Cardiovascular & Family Medicine',
      specialty: 'Family Medicine',
      npi: '1447291038'
    },
    insurance: {
      payer: 'UnitedHealthcare Community Plan',
      bin: '610494',
      pcn: '9999',
      rxGroup: 'UHCIL72',
      memberId: 'UHC-49102830'
    },
    status: 'Blocked',
    blocker: 'No Refills Remaining (Requires New Rx)',
    blockerDetails: 'Original prescription authorized 3 refills, all exhausted. Pharmacy sent standard refill authorization request via NCPDP SCRIPT.',
    urgency: 'high',
    createdAt: '2026-09-27T09:30:00Z',
    updatedAt: '2026-09-27T09:30:00Z',
    pipelineStage: 'provider_ehr',
    aiRecommendation: {
      actionTitle: 'One-Click Approve 90-Day Refill & Issue eRx',
      actionType: 'approve_erx',
      confidenceScore: 94,
      suggestedDuration: '90-Day Supply (3 Refills)',
      reasoning: 'Patient logged home BP readings averaging 124/82 mmHg 14 days ago. Basic Metabolic Panel (BMP) from 45 days ago confirms normal Potassium (4.3 mEq/L) and normal Creatinine (0.9 mg/dL). No signs of cough or angioedema.',
      riskScore: 'Low Risk',
      confidenceBreakdown: [
        { metric: 'Potassium Stability (< 5.0 mEq/L)', score: 97 },
        { metric: 'Normotensive Home Logs (< 130/80)', score: 93 },
        { metric: 'Prior Rx Adherence (PDC 96%)', score: 94 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 45,
      lastVisitDate: '2026-08-13',
      lastVisitProvider: 'Dr. Marcus Vance, MD',
      labs: [
        { name: 'Serum Potassium (K+)', value: '4.3 mEq/L', date: '2026-08-13', status: 'normal', referenceRange: '3.5 - 5.0' },
        { name: 'Serum Creatinine', value: '0.91 mg/dL', date: '2026-08-13', status: 'normal', referenceRange: '0.70 - 1.30' },
        { name: 'Blood Urea Nitrogen (BUN)', value: '14 mg/dL', date: '2026-08-13', status: 'normal', referenceRange: '7 - 20' }
      ],
      adherenceRate: 96,
      drugInteractions: {
        severity: 'none',
        notes: 'Patient not taking potassium-sparing diuretics (spironolactone/triamterene) or potassium supplements.'
      },
      vitals: {
        bp: '124/82 mmHg',
        pulse: 68,
        weight: '182 lbs',
        bmi: 25.8
      },
      clinicalRationale: 'ACC/AHA 2024 Hypertension Management guidelines recommend maintaining 90-day mail/retail fills for stable patients with controlled BP and documented normal electrolytes within 6 months.',
      guidelineCitation: 'AHA/ACC Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure.'
    }
  },
  {
    id: 'rf-103',
    rxNumber: 'RX-441092-OS',
    patient: {
      id: 'pt-3091',
      name: 'Sophia Chen',
      age: 29,
      gender: 'F',
      dob: '1997-02-18',
      phone: '(555) 441-3320',
      mrn: 'MRN-228190-A'
    },
    medication: {
      name: 'Adderall XR 20mg Capsule',
      genericName: 'Dextroamphetamine-Amphetamine ER',
      dosage: '20 mg',
      frequency: 'Once daily in the morning',
      route: 'Oral extended-release capsule',
      quantity: 30,
      daysSupply: 30,
      daysRemaining: 2,
      sig: 'Take 1 capsule by mouth every morning upon waking. Avoid late afternoon doses.',
      deaSchedule: 'Schedule II',
      therapeuticClass: 'CNS Stimulant / ADHD Agent'
    },
    pharmacy: {
      name: 'Osco Drug #3119',
      npi: '1882901192',
      phone: '(555) 771-0021',
      address: '3300 W Belmont Ave, Chicago, IL',
      pharmacist: 'Dr. Kevin Patel, PharmD'
    },
    provider: {
      name: 'Dr. Emily Thornton, MD',
      clinic: 'Northwestern Neuropsychiatric Specialists',
      specialty: 'Psychiatry & Behavioral Health',
      npi: '1772819034'
    },
    insurance: {
      payer: 'Aetna Commercial PPO',
      bin: '610502',
      pcn: 'AETNARX',
      rxGroup: 'AET9941',
      memberId: 'W440192831'
    },
    status: 'Blocked',
    blocker: 'Patient Needs Follow-up Visit',
    blockerDetails: 'Schedule II Controlled Substance mandate: Federal DEA & state law prohibit automatic refills. Patient last completed an evaluation 185 days ago (mandatory 6-month review due).',
    urgency: 'critical',
    createdAt: '2026-09-27T10:05:00Z',
    updatedAt: '2026-09-27T10:05:00Z',
    pipelineStage: 'provider_ehr',
    aiRecommendation: {
      actionTitle: 'Request Telehealth Visit & Issue 14-Day Bridge',
      actionType: 'telehealth_visit',
      confidenceScore: 89,
      suggestedDuration: '14-Day Bridge Supply + Telehealth Link',
      reasoning: 'State Prescription Monitoring Program (PDMP) checked today: 0 overlapping controlled substance fills, 0 multiple prescribers. Controlled Substance Agreement active. Issue 14-day bridge supply and instant telehealth booking link to prevent abrupt discontinuation syndrome.',
      riskScore: 'Moderate Risk',
      confidenceBreakdown: [
        { metric: 'State PDMP / NarxCare Overdose Score (< 200)', score: 99 },
        { metric: 'Signed Controlled Substance Agreement on file', score: 95 },
        { metric: 'Tox Screen Negative for Illicits (within 1 yr)', score: 88 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 185,
      lastVisitDate: '2026-03-26',
      lastVisitProvider: 'Dr. Emily Thornton, MD',
      labs: [
        { name: 'Urine Drug Screen (Tox Panel)', value: 'Prescribed Amphetamines (+) / Illicits (-)', date: '2025-11-14', status: 'normal', referenceRange: 'Expected' },
        { name: 'State PDMP NarxCare Score', value: '110 (Low Risk)', date: '2026-09-27', status: 'normal', referenceRange: '< 200' }
      ],
      adherenceRate: 98,
      drugInteractions: {
        severity: 'none',
        notes: 'No MAO inhibitors, no sympathomimetic co-prescriptions, no documented arrhythmia.'
      },
      vitals: {
        bp: '118/76 mmHg',
        pulse: 78,
        weight: '135 lbs',
        bmi: 21.8
      },
      clinicalRationale: 'DEA Ryan Haight Act Telehealth Flexibility rules and AAP/APA ADHD clinical practice guidelines support temporary bridge prescribing when an active telehealth appointment is confirmed within 14 days.',
      guidelineCitation: 'DEA & SAMHSA Telemedicine Flexibilities for Controlled Substances (2026 Update).'
    }
  },
  {
    id: 'rf-104',
    rxNumber: 'RX-102938-OP',
    patient: {
      id: 'pt-9014',
      name: 'Robert Miller',
      age: 58,
      gender: 'M',
      dob: '1968-07-22',
      phone: '(555) 912-4455',
      mrn: 'MRN-773410-X'
    },
    medication: {
      name: 'Ozempic 1mg/0.75mL Pen',
      genericName: 'Semaglutide Injection',
      dosage: '1 mg / 0.75 mL pen',
      frequency: 'Inject subcutaneously once weekly',
      route: 'Subcutaneous autoinjector',
      quantity: 3,
      daysSupply: 84,
      daysRemaining: 5,
      sig: 'Inject 1mg subcutaneously once weekly on Mondays into abdomen or thigh',
      therapeuticClass: 'GLP-1 Receptor Agonist'
    },
    pharmacy: {
      name: 'Optum Specialty Pharmacy',
      npi: '1992019941',
      phone: '(800) 711-4555',
      address: '6800 West 115th St, Overland Park, KS',
      pharmacist: 'Dr. David Foster, PharmD'
    },
    provider: {
      name: 'Dr. Sarah Chen, MD',
      clinic: 'MetroHealth Primary Care & Diabetes Institute',
      specialty: 'Endocrinology',
      npi: '1922039182'
    },
    insurance: {
      payer: 'OptumRx / UnitedHealthcare Commercial',
      bin: '610011',
      pcn: 'OPTUMRX',
      rxGroup: 'UHCRX90',
      memberId: 'OPT-992144810',
      paStatus: 'Expired'
    },
    status: 'Blocked',
    blocker: 'Prior Authorization Required by PBM',
    blockerDetails: 'Annual Prior Authorization expired on 2026-09-15. OptumRx PBM rejected claim code: 75 (Prior Authorization Required). Continuation of therapy criteria must be submitted.',
    urgency: 'critical',
    createdAt: '2026-09-27T11:20:00Z',
    updatedAt: '2026-09-27T11:20:00Z',
    pipelineStage: 'pbm',
    aiRecommendation: {
      actionTitle: 'Auto-Generate AI Prior Auth Packet & Expedite to PBM',
      actionType: 'approve_erx',
      confidenceScore: 92,
      suggestedDuration: '12-Month PA Renewal',
      reasoning: 'Patient meets 100% of OptumRx GLP-1 continuation criteria: Baseline HbA1c 8.9% -> Current 6.8% (delta -2.1% exceeds the 0.5% required threshold). 14 lbs weight reduction documented. Metformin tolerance failure on file. RefillFlow AI prepared Form 68-B with pre-attached lab proof.',
      riskScore: 'Low Risk',
      confidenceBreakdown: [
        { metric: 'HbA1c Reduction > 0.5% (Achieved 2.1%)', score: 99 },
        { metric: 'Prior Failure of First-Line Metformin on file', score: 95 },
        { metric: 'Zero gap in medication possession (PDC 98%)', score: 91 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 38,
      lastVisitDate: '2026-08-20',
      lastVisitProvider: 'Dr. Sarah Chen, MD',
      labs: [
        { name: 'Baseline HbA1c (Pre-treatment)', value: '8.9%', date: '2025-08-10', status: 'abnormal', referenceRange: '< 7.0%' },
        { name: 'Current HbA1c', value: '6.8%', date: '2026-08-20', status: 'normal', referenceRange: '< 7.0%' },
        { name: 'Lipase / Amylase', value: '28 U/L (Normal)', date: '2026-08-20', status: 'normal', referenceRange: '10 - 73' },
        { name: 'eGFR', value: '82 mL/min', date: '2026-08-20', status: 'normal', referenceRange: '> 60' }
      ],
      adherenceRate: 98,
      drugInteractions: {
        severity: 'none',
        notes: 'No personal or family history of Medullary Thyroid Carcinoma (MTC) or MEN2 syndrome.'
      },
      vitals: {
        bp: '122/78 mmHg',
        pulse: 74,
        weight: '204 lbs (down from 218 lbs)',
        bmi: 29.1
      },
      clinicalRationale: 'OptumRx 2026 Commercial Formulary Benefit Guidelines require documented HbA1c reduction >= 0.5% from baseline or maintenance of goal < 7.0% for annual renewal. Full clinical criteria satisfied.',
      guidelineCitation: 'OptumRx Clinical Pharmacy Criteria: Glucagon-Like Peptide-1 (GLP-1) Receptor Agonists Policy.'
    }
  },
  {
    id: 'rf-105',
    rxNumber: 'RX-554109-WL',
    patient: {
      id: 'pt-4481',
      name: 'Maria Rodriguez',
      age: 47,
      gender: 'F',
      dob: '1979-11-05',
      phone: '(555) 662-8921',
      mrn: 'MRN-339102-M'
    },
    medication: {
      name: 'Atorvastatin Calcium 40mg',
      genericName: 'Atorvastatin',
      dosage: '40 mg',
      frequency: 'Once daily at bedtime',
      route: 'Oral tablet',
      quantity: 90,
      daysSupply: 90,
      daysRemaining: 9,
      sig: 'Take 1 tablet by mouth daily at bedtime for cholesterol reduction',
      therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)'
    },
    pharmacy: {
      name: 'Walgreens Pharmacy #4190',
      npi: '1334901928',
      phone: '(555) 431-8800',
      address: '4817 N Clark St, Chicago, IL',
      pharmacist: 'Dr. Arthur Pendelton, PharmD'
    },
    provider: {
      name: 'Dr. Marcus Vance, MD',
      clinic: 'Lakeview Cardiovascular & Family Medicine',
      specialty: 'Family Medicine',
      npi: '1447291038'
    },
    insurance: {
      payer: 'Cigna Health & Life',
      bin: '017010',
      pcn: '02100',
      rxGroup: 'CG7819',
      memberId: 'CG-88291034'
    },
    status: 'Blocked',
    blocker: 'Routine Monitoring Lab Due (e.g., A1c, Lipid panel)',
    blockerDetails: 'Annual fasting lipid panel and hepatic panel (ALT/AST) recommended. Last panel recorded 370 days ago.',
    urgency: 'moderate',
    createdAt: '2026-09-27T12:00:00Z',
    updatedAt: '2026-09-27T12:00:00Z',
    pipelineStage: 'provider_ehr',
    aiRecommendation: {
      actionTitle: 'One-Click Approve 90-Day Refill & Order Standing Lab',
      actionType: 'bridge_and_lab',
      confidenceScore: 93,
      suggestedDuration: '90-Day Refill + Lab Requisition',
      reasoning: 'Patient has tolerated 40mg statin without myalgia or hepatic complaints for 3 consecutive years. Current ACC/AHA guidelines strongly caution against statin holidays or withholding refills merely due to delayed routine lipid tracking. Issue full 90-day fill while queuing electronic LabCorp order.',
      riskScore: 'Low Risk',
      confidenceBreakdown: [
        { metric: 'Statin Tolerance History (36+ months stable)', score: 98 },
        { metric: 'Hepatic Enzyme Normalcy at Last Screen', score: 94 },
        { metric: 'Cardiovascular Risk Benefit Ratio', score: 96 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 110,
      lastVisitDate: '2026-06-09',
      lastVisitProvider: 'Dr. Marcus Vance, MD',
      labs: [
        { name: 'Lipid Panel: LDL-C', value: '82 mg/dL', date: '2025-09-18', status: 'normal', referenceRange: '< 100 mg/dL' },
        { name: 'Lipid Panel: Total Cholesterol', value: '164 mg/dL', date: '2025-09-18', status: 'normal', referenceRange: '< 200 mg/dL' },
        { name: 'Alanine Aminotransferase (ALT)', value: '22 U/L', date: '2025-09-18', status: 'normal', referenceRange: '7 - 35 U/L' },
        { name: 'Annual Lipid Panel & LFTs', value: 'Due (Overdue by 10d)', date: '2026-09-18', status: 'due', referenceRange: 'Annual' }
      ],
      adherenceRate: 92,
      drugInteractions: {
        severity: 'none',
        notes: 'No CYP3A4 inhibitors (grapefruit juice excessive intake absent, no clarithromycin/azole antifungals).'
      },
      vitals: {
        bp: '116/74 mmHg',
        pulse: 66,
        weight: '148 lbs',
        bmi: 24.3
      },
      clinicalRationale: 'ACC/AHA Cholesterol Clinical Practice Guidelines establish that statin therapy should not be interrupted for administrative lab delays; routine LFT monitoring during maintenance therapy is no longer required unless symptomatic.',
      guidelineCitation: '2018 AHA/ACC/AACVPR/AAPA/ABC/ACPM/ADA/AGS Guideline on the Management of Blood Cholesterol.'
    }
  },
  {
    id: 'rf-106',
    rxNumber: 'RX-772910-CV',
    patient: {
      id: 'pt-1109',
      name: 'David Kim',
      age: 34,
      gender: 'M',
      dob: '1992-05-14',
      phone: '(555) 332-9011',
      mrn: 'MRN-902144-K'
    },
    medication: {
      name: 'ProAir HFA (Albuterol) Inhaler',
      genericName: 'Albuterol Sulfate Inhalation Aerosol',
      dosage: '90 mcg / actuation (200 doses)',
      frequency: '1-2 puffs Q4-6H PRN wheezing/shortness of breath',
      route: 'Oral inhalation',
      quantity: 1,
      daysSupply: 30,
      daysRemaining: 3,
      sig: 'Inhale 2 puffs by mouth every 4 to 6 hours as needed for shortness of breath or cough',
      therapeuticClass: 'Short-Acting Beta-2 Agonist (SABA) Bronchodilator'
    },
    pharmacy: {
      name: 'CVS Pharmacy #8820',
      npi: '1552809110',
      phone: '(555) 902-1200',
      address: '2050 W Diversey Pkwy, Chicago, IL',
      pharmacist: 'Dr. Jason Lee, PharmD'
    },
    provider: {
      name: 'Dr. Sarah Chen, MD',
      clinic: 'MetroHealth Primary Care & Pulmonary Center',
      specialty: 'Internal Medicine',
      npi: '1922039182'
    },
    insurance: {
      payer: 'Blue Cross Blue Shield IL PPO',
      bin: '004336',
      pcn: 'MEDDPRX',
      rxGroup: 'BCBSIL01',
      memberId: 'XEH-33019280'
    },
    status: 'Blocked',
    blocker: 'Patient Needs Follow-up Visit',
    blockerDetails: 'Excessive SABA refill velocity flag: 3rd albuterol canister requested in 52 days. Indicates poor asthma control and potential acute exacerbation risk.',
    urgency: 'critical',
    createdAt: '2026-09-27T13:10:00Z',
    updatedAt: '2026-09-27T13:10:00Z',
    pipelineStage: 'provider_ehr',
    aiRecommendation: {
      actionTitle: 'Order Lab Workup & Issue 30-day Bridge Supply',
      actionType: 'telehealth_visit',
      confidenceScore: 87,
      suggestedDuration: 'Bridge Inhaler + Urgent Pulm Escalation',
      reasoning: 'Patient is relying heavily on rescue bronchodilators without an active Inhaled Corticosteroid (ICS-Formoterol controller). GINA 2026 guidelines warn that >= 3 canisters/year correlates with markedly elevated emergency hospitalization. Issue 1 rescue canister for immediate safety and mandate urgent asthma step-up consult.',
      riskScore: 'Guarded',
      confidenceBreakdown: [
        { metric: 'Safety Bridge Provided (avoid acute suffocation)', score: 99 },
        { metric: 'High SABA Overuse Flag Triggered', score: 98 },
        { metric: 'GINA Step 2/3 Escalation Urgency', score: 92 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 160,
      lastVisitDate: '2026-04-20',
      lastVisitProvider: 'Dr. Sarah Chen, MD',
      labs: [
        { name: 'SABA Canisters Dispensed (Past 90 Days)', value: '3 Canisters', date: '2026-09-27', status: 'critical', referenceRange: '< 2 / year' },
        { name: 'Asthma Control Test (ACT) Score', value: '14 (Uncontrolled)', date: '2026-04-20', status: 'abnormal', referenceRange: '> 19 (Controlled)' },
        { name: 'Peak Expiratory Flow (PEF)', value: '410 L/min (78% predicted)', date: '2026-04-20', status: 'normal', referenceRange: '> 80%' }
      ],
      adherenceRate: 70,
      drugInteractions: {
        severity: 'low',
        notes: 'No concurrent non-selective beta-blockers prescribed.'
      },
      vitals: {
        bp: '126/80 mmHg',
        pulse: 88,
        weight: '172 lbs',
        bmi: 24.0
      },
      clinicalRationale: 'Global Initiative for Asthma (GINA 2026) recommends immediate controller therapy (ICS-formoterol) whenever SABA usage exceeds 2 canisters per year. Patient must not be left without emergency rescue inhaler.',
      guidelineCitation: 'GINA Global Strategy for Asthma Management and Prevention (2026 Report).'
    }
  },
  {
    id: 'rf-107',
    rxNumber: 'RX-883901-AM',
    patient: {
      id: 'pt-7712',
      name: 'Grace Taylor',
      age: 71,
      gender: 'F',
      dob: '1955-08-30',
      phone: '(555) 774-0988',
      mrn: 'MRN-661209-T'
    },
    medication: {
      name: 'Eliquis (Apixaban) 5mg Tablet',
      genericName: 'Apixaban',
      dosage: '5 mg',
      frequency: 'Twice daily with or without food',
      route: 'Oral tablet',
      quantity: 180,
      daysSupply: 90,
      daysRemaining: 1,
      sig: 'Take 1 tablet by mouth twice daily every 12 hours for stroke prevention in AFib',
      therapeuticClass: 'Direct Oral Anticoagulant (DOAC) / Factor Xa Inhibitor'
    },
    pharmacy: {
      name: 'Walgreens Pharmacy #2991',
      npi: '1772901140',
      phone: '(555) 881-2299',
      address: '1500 S Michigan Ave, Chicago, IL',
      pharmacist: 'Dr. Gregory Houseman, PharmD'
    },
    provider: {
      name: 'Dr. Marcus Vance, MD',
      clinic: 'Lakeview Cardiovascular & Family Medicine',
      specialty: 'Cardiovascular Medicine',
      npi: '1447291038'
    },
    insurance: {
      payer: 'Medicare Part D / SilverScript',
      bin: '004336',
      pcn: 'MEDDADV',
      rxGroup: 'RX6612',
      memberId: 'MED-7719203810'
    },
    status: 'Blocked',
    blocker: 'No Refills Remaining (Requires New Rx)',
    blockerDetails: 'High-risk oral anticoagulant: 90-day supply expired with 0 refills remaining. Abrupt cessation carries severe ischemic stroke risk (CHA2DS2-VASc score = 4).',
    urgency: 'critical',
    createdAt: '2026-09-27T13:45:00Z',
    updatedAt: '2026-09-27T13:45:00Z',
    pipelineStage: 'provider_ehr',
    aiRecommendation: {
      actionTitle: 'One-Click Approve 90-Day Refill & Issue eRx',
      actionType: 'approve_erx',
      confidenceScore: 98,
      suggestedDuration: '90-Day Supply (3 Refills)',
      reasoning: 'Critical continuity medication. Patient CHA2DS2-VASc = 4 (Female, Age 71, Hypertension, Vascular history). Renal function is well preserved (CrCl 62 mL/min meets criteria for standard 5mg dose; does not satisfy 2.5mg dose reduction criteria). Zero bleeding admissions in past 24 months.',
      riskScore: 'Low Risk',
      confidenceBreakdown: [
        { metric: 'Renal Clearance (CrCl > 50 mL/min)', score: 99 },
        { metric: 'Dosing Criteria Verification (5mg BID appropriate)', score: 98 },
        { metric: 'Thromboembolic Stroke Prevention Imperative', score: 100 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 52,
      lastVisitDate: '2026-08-06',
      lastVisitProvider: 'Dr. Marcus Vance, MD',
      labs: [
        { name: 'Creatinine Clearance (Cockcroft-Gault)', value: '62 mL/min', date: '2026-08-06', status: 'normal', referenceRange: '> 50 mL/min' },
        { name: 'Serum Creatinine', value: '1.02 mg/dL', date: '2026-08-06', status: 'normal', referenceRange: '0.59 - 1.04' },
        { name: 'Hemoglobin / Hematocrit', value: '13.2 g/dL / 39.4%', date: '2026-08-06', status: 'normal', referenceRange: '12.0 - 15.5 g/dL' },
        { name: 'Platelet Count', value: '235,000 /uL', date: '2026-08-06', status: 'normal', referenceRange: '150k - 450k' }
      ],
      adherenceRate: 99,
      drugInteractions: {
        severity: 'none',
        notes: 'No dual antiplatelet therapy (DAPT), no SSRI/NSAID co-ingestion, no dual P-gp & strong CYP3A4 inhibitors.'
      },
      vitals: {
        bp: '126/78 mmHg',
        pulse: 70,
        weight: '146 lbs',
        bmi: 24.8
      },
      clinicalRationale: 'ACC/AHA/ACCP Atrial Fibrillation Guidelines highlight that missed DOAC doses rapidly eliminate anticoagulant effect (half-life 12h), significantly spiking ischemic stroke hazard. Continuous uninterrupted therapy is mandatory.',
      guidelineCitation: '2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation.'
    }
  },
  {
    id: 'rf-108',
    rxNumber: 'RX-665120-PR',
    patient: {
      id: 'pt-6520',
      name: 'Jamal Washington',
      age: 41,
      gender: 'M',
      dob: '1985-06-19',
      phone: '(555) 819-3344',
      mrn: 'MRN-552190-J'
    },
    medication: {
      name: 'Duloxetine HCl 60mg Capsule',
      genericName: 'Duloxetine',
      dosage: '60 mg',
      frequency: 'Once daily with food',
      route: 'Oral delayed-release capsule',
      quantity: 90,
      daysSupply: 90,
      daysRemaining: 8,
      sig: 'Take 1 capsule by mouth daily every morning with food for depression and neuropathic pain',
      therapeuticClass: 'Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)'
    },
    pharmacy: {
      name: 'CVS Pharmacy #3310',
      npi: '1449019283',
      phone: '(555) 710-8822',
      address: '1100 N Dearborn St, Chicago, IL',
      pharmacist: 'Dr. Megan O\'Reilly, PharmD'
    },
    provider: {
      name: 'Dr. Sarah Chen, MD',
      clinic: 'MetroHealth Primary Care & Behavioral Health',
      specialty: 'Internal Medicine',
      npi: '1922039182'
    },
    insurance: {
      payer: 'Humana Commercial HMO',
      bin: '610502',
      pcn: 'HUMANARX',
      rxGroup: 'HUM992',
      memberId: 'HUM-88192031',
      paStatus: 'Formulary Tier 3'
    },
    status: 'Blocked',
    blocker: 'Prior Authorization Required by PBM',
    blockerDetails: 'PBM step-therapy re-check: Payer requires documentation of prior SSRI failure before approving continuing SNRI coverage.',
    urgency: 'high',
    createdAt: '2026-09-27T14:20:00Z',
    updatedAt: '2026-09-27T14:20:00Z',
    pipelineStage: 'pbm',
    aiRecommendation: {
      actionTitle: 'One-Click Approve & Issue eRx',
      actionType: 'approve_erx',
      confidenceScore: 94,
      suggestedDuration: '30-Day Bridge + Electronic Step-Therapy Exemption',
      reasoning: 'EHR clinical records from 2024 document prior 6-month trial of Sertraline (discontinued due to severe GI intolerance) and Escitalopram (lack of therapeutic efficacy for peripheral neuropathy). RefillFlow AI compiled FHIR clinical summary for automated PBM step-therapy override approval.',
      riskScore: 'Low Risk',
      confidenceBreakdown: [
        { metric: 'Documented Prior SSRI Trial & Failure in EHR', score: 96 },
        { metric: 'Dual Indication (MDD + Diabetic Neuropathy)', score: 92 },
        { metric: 'Discontinuation Syndrome Prevention Urgency', score: 95 }
      ]
    },
    clinicalEvidence: {
      lastVisitDaysAgo: 60,
      lastVisitDate: '2026-07-29',
      lastVisitProvider: 'Dr. Sarah Chen, MD',
      labs: [
        { name: 'PHQ-9 Depression Screener', value: '5 (Mild / Controlled)', date: '2026-07-29', status: 'normal', referenceRange: '< 9 (Well Controlled)' },
        { name: 'Prior Trial: Sertraline 50mg', value: 'Failed (Adverse GI events)', date: '2024-03-10', status: 'normal', referenceRange: 'Documentation on file' },
        { name: 'Prior Trial: Escitalopram 10mg', value: 'Ineffective for neuropathic pain', date: '2024-09-15', status: 'normal', referenceRange: 'Documentation on file' }
      ],
      adherenceRate: 95,
      drugInteractions: {
        severity: 'none',
        notes: 'No serotonergic agents (no tramadol, triptans, or linezolid). Zero serotonin syndrome risk markers.'
      },
      vitals: {
        bp: '124/80 mmHg',
        pulse: 76,
        weight: '190 lbs',
        bmi: 26.5
      },
      clinicalRationale: 'APA Guidelines for Major Depressive Disorder and Neuropathic Pain management state that patients stabilized on duloxetine with dual indications should not be forced backwards into step-therapy re-trials.',
      guidelineCitation: 'American Psychiatric Association Practice Guideline for the Treatment of Patients with Major Depressive Disorder.'
    }
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-901',
    refillId: 'rf-107',
    patientName: 'Grace Taylor',
    medicationName: 'Eliquis 5mg',
    timestamp: '2026-09-27T13:46:12Z',
    actor: 'RefillFlow AI Clinical Engine',
    actorRole: 'AI_Engine' as const,
    action: 'FHIR Ingestion & Risk Scoring Complete',
    details: 'Calculated CHA2DS2-VASc = 4; Checked CrCl 62 mL/min; Confidence 98% for renewal; Flagged for 1-click HITL review.',
    fhirTransactionId: 'FHIR-TX-889102-AI',
    status: 'info' as const
  },
  {
    id: 'aud-902',
    refillId: 'rf-104',
    patientName: 'Robert Miller',
    medicationName: 'Ozempic 1mg Pen',
    timestamp: '2026-09-27T11:21:40Z',
    actor: 'PBM Connector (OptumRx SCRIPT)',
    actorRole: 'System' as const,
    action: 'Prior Authorization Rejection (Code 75)',
    details: 'Claim rejected at retail counter. RefillFlow AI intercepted rejection webhook, extracted HbA1c trajectory (-2.1%), and generated PA Form 68-B.',
    fhirTransactionId: 'FHIR-TX-109244-PBM',
    status: 'warning' as const
  },
  {
    id: 'aud-903',
    refillId: 'rf-101',
    patientName: 'Eleanor Vance',
    medicationName: 'Metformin 1000mg',
    timestamp: '2026-09-27T08:16:04Z',
    actor: 'RefillFlow AI Clinical Engine',
    actorRole: 'AI_Engine' as const,
    action: 'EHR Lab Registry Correlated',
    details: 'HbA1c identified as 16 days past due. Renal safety validated (eGFR 78). Generated Quest Diagnostics electronic requisition and 30-day bridge recommendation.',
    fhirTransactionId: 'FHIR-TX-448102-LAB',
    status: 'info' as const
  }
];

export const HOSPITAL_USERS: HospitalUser[] = [
  {
    id: 'user-physician',
    name: 'Dr. Sarah Chen, MD',
    role: 'physician',
    title: 'Attending Physician & Endocrinologist',
    badge: 'Clinical Prescriber',
    facility: 'MetroHealth Primary Care & Diabetes Institute',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    email: 's.chen@metrohealth.care',
    npi: '1922039182',
    phone: '(555) 234-9000'
  },
  {
    id: 'user-pharmacist',
    name: 'Dr. James Holloway, PharmD',
    role: 'pharmacy',
    title: 'Chief Clinical Pharmacist & RPh',
    badge: 'Pharmacy Dispenser',
    facility: 'CVS Pharmacy #4421 (Springfield Health Hub)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    email: 'j.holloway@cvshealth.com',
    npi: '1487692011',
    phone: '(555) 390-4100'
  },
  {
    id: 'user-patient',
    name: 'Eleanor Vance',
    role: 'patient',
    title: 'Patient Account Holder',
    badge: 'MyMetroHealth Patient Portal',
    facility: 'MetroHealth Network (Patient ID: pt-8821)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    email: 'e.vance@gmail.com',
    phone: '(555) 234-8901'
  }
];

