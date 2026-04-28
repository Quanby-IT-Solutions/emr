import { PrismaClient } from '../src/generated/client/client'

const prisma = new PrismaClient()

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function daysFromNow(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

function todayAt(h: number, m = 0): Date {
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d
}

function medDetail(medication: string, dose: string, route: string, frequency: string, indication: string, isHighRisk = false) {
  return { medication, dose, route, frequency, indication, isHighRisk, isProspective: false }
}

function labDetail(testPanel: string, specimenType: string, stat = false) {
  return { testPanel, specimenType, stat }
}

async function main() {
  // ── Maria Santos (MRN invariant: MRN-100482) ──────────────────────────────
  await prisma.patient.upsert({
    where: { mrn: 'MRN-100482' },
    update: {},
    create: {
      id: 'pat_maria',
      mrn: 'MRN-100482',
      firstName: 'Maria',
      lastName: 'Santos',
      dateOfBirth: new Date('1978-03-15'),
      gender: 'Female',
      contactPhone: '+63-917-555-0100',
      email: 'maria.santos@example.com',
      address: { street: '45 Sampaguita St', city: 'Quezon City', province: 'Metro Manila', zip: '1100' },
      isVipOrConfidential: false,
    },
  })

  const maria = await prisma.patient.findUniqueOrThrow({ where: { mrn: 'MRN-100482' } })

  // Allergies (2)
  await prisma.allergy.upsert({
    where: { id: 'alg_maria_01' },
    update: {},
    create: { id: 'alg_maria_01', patientId: maria.id, substance: 'Penicillin', reaction: 'Urticaria, angioedema', severity: 'MODERATE', status: 'ACTIVE' },
  })
  await prisma.allergy.upsert({
    where: { id: 'alg_maria_02' },
    update: {},
    create: { id: 'alg_maria_02', patientId: maria.id, substance: 'Sulfonamides', reaction: 'Rash, pruritus', severity: 'MILD', status: 'ACTIVE' },
  })

  // Patient histories (3)
  const histories = [
    { id: 'phx_maria_01', type: 'MEDICAL_HISTORY',  entry: 'Hypertension (essential), well-controlled on Lisinopril',   icd10Code: 'I10',    status: 'ACTIVE',     onset: new Date('2010-01-01') },
    { id: 'phx_maria_02', type: 'MEDICAL_HISTORY',  entry: 'Type 2 Diabetes Mellitus, HbA1c 7.2% last quarter',         icd10Code: 'E11.9',  status: 'ACTIVE',     onset: new Date('2015-06-01') },
    { id: 'phx_maria_03', type: 'SURGICAL_HISTORY', entry: 'Appendectomy 2005, uncomplicated',                           icd10Code: 'Z87.39', status: 'HISTORICAL', onset: new Date('2005-03-01') },
  ] as const
  for (const h of histories) {
    await prisma.patientHistory.upsert({
      where: { id: h.id },
      update: {},
      create: { id: h.id, patientId: maria.id, type: h.type, entry: h.entry, icd10Code: h.icd10Code, status: h.status, onsetDate: h.onset },
    })
  }

  // Insurance (1 active)
  await prisma.patientInsurance.upsert({
    where: { id: 'pins_maria_01' },
    update: {},
    create: { id: 'pins_maria_01', patientId: maria.id, providerName: 'PhilHealth', policyNumber: 'PH-2024-100482', groupNumber: 'GRP-QC-001', priority: 'PRIMARY', isActive: true },
  })

  // Today's appointment with the seeded clinician
  await prisma.appointment.upsert({
    where: { id: 'appt_maria_today' },
    update: {},
    create: { id: 'appt_maria_today', patientId: maria.id, providerId: 'stf_clinician', startTime: todayAt(9, 0), endTime: todayAt(9, 30), status: 'SCHEDULED', appointmentType: 'Follow-up visit' },
  })

  // ── Supporting patients (10) ──────────────────────────────────────────────
  const supportingPats = [
    { id: 'pat_s01', mrn: 'MRN-200001', firstName: 'Juan',       lastName: 'dela Cruz',   dob: '1965-07-20', gender: 'Male'   },
    { id: 'pat_s02', mrn: 'MRN-200002', firstName: 'Linda',      lastName: 'Bautista',    dob: '1952-11-03', gender: 'Female' },
    { id: 'pat_s03', mrn: 'MRN-200003', firstName: 'Roberto',    lastName: 'Villanueva',  dob: '1970-04-18', gender: 'Male'   },
    { id: 'pat_s04', mrn: 'MRN-200004', firstName: 'Carmen',     lastName: 'Reyes',       dob: '1988-09-25', gender: 'Female' },
    { id: 'pat_s05', mrn: 'MRN-200005', firstName: 'Eduardo',    lastName: 'Mendoza',     dob: '1975-02-14', gender: 'Male'   },
    { id: 'pat_s06', mrn: 'MRN-200006', firstName: 'Flordeliza', lastName: 'Aquino',      dob: '1960-06-08', gender: 'Female' },
    { id: 'pat_s07', mrn: 'MRN-200007', firstName: 'Gregorio',   lastName: 'Macaraeg',   dob: '1948-12-30', gender: 'Male'   },
    { id: 'pat_s08', mrn: 'MRN-200008', firstName: 'Herminia',   lastName: 'Castro',      dob: '1982-08-11', gender: 'Female' },
    { id: 'pat_s09', mrn: 'MRN-200009', firstName: 'Ignacio',    lastName: 'Soriano',     dob: '1991-01-22', gender: 'Male'   },
    { id: 'pat_s10', mrn: 'MRN-200010', firstName: 'Josefina',   lastName: 'Lim',         dob: '1968-05-17', gender: 'Female' },
  ]
  for (const p of supportingPats) {
    await prisma.patient.upsert({
      where: { mrn: p.mrn },
      update: {},
      create: { id: p.id, mrn: p.mrn, firstName: p.firstName, lastName: p.lastName, dateOfBirth: new Date(p.dob), gender: p.gender, isVipOrConfidential: false },
    })
  }

  // ── Encounters ────────────────────────────────────────────────────────────
  // Juan — active inpatient, Med-Surg (primary encounter for flowsheet/notes)
  await prisma.encounter.upsert({
    where: { id: 'enc_s01' },
    update: {},
    create: { id: 'enc_s01', patientId: 'pat_s01', type: 'INPATIENT', status: 'ACTIVE', startDateTime: daysAgo(4), admissionDateTime: daysAgo(4), currentLocationId: 'loc_ms_01', attendingProviderId: 'stf_clinician', codingStatus: 'PENDING' },
  })
  await prisma.location.update({ where: { id: 'loc_ms_01' }, data: { status: 'OCCUPIED' } })

  // Linda — active inpatient, ICU
  await prisma.encounter.upsert({
    where: { id: 'enc_s02' },
    update: {},
    create: { id: 'enc_s02', patientId: 'pat_s02', type: 'INPATIENT', status: 'ACTIVE', startDateTime: daysAgo(7), admissionDateTime: daysAgo(7), currentLocationId: 'loc_icu_01', attendingProviderId: 'stf_doctor3', codingStatus: 'PENDING' },
  })
  await prisma.location.update({ where: { id: 'loc_icu_01' }, data: { status: 'OCCUPIED' } })

  // Roberto — active inpatient, Med-Surg
  await prisma.encounter.upsert({
    where: { id: 'enc_s03' },
    update: {},
    create: { id: 'enc_s03', patientId: 'pat_s03', type: 'INPATIENT', status: 'ACTIVE', startDateTime: daysAgo(2), admissionDateTime: daysAgo(2), currentLocationId: 'loc_ms_02', attendingProviderId: 'stf_doctor2', codingStatus: 'PENDING' },
  })
  await prisma.location.update({ where: { id: 'loc_ms_02' }, data: { status: 'OCCUPIED' } })

  // Carmen — active emergency
  await prisma.encounter.upsert({
    where: { id: 'enc_s04' },
    update: {},
    create: { id: 'enc_s04', patientId: 'pat_s04', type: 'EMERGENCY', status: 'ACTIVE', startDateTime: todayAt(6, 30), currentLocationId: 'loc_er_01', attendingProviderId: 'stf_doctor2' },
  })
  await prisma.location.update({ where: { id: 'loc_er_01' }, data: { status: 'OCCUPIED' } })

  // Eduardo — active emergency
  await prisma.encounter.upsert({
    where: { id: 'enc_s05' },
    update: {},
    create: { id: 'enc_s05', patientId: 'pat_s05', type: 'EMERGENCY', status: 'ACTIVE', startDateTime: todayAt(7, 15), currentLocationId: 'loc_er_02', attendingProviderId: 'stf_doctor2' },
  })
  await prisma.location.update({ where: { id: 'loc_er_02' }, data: { status: 'OCCUPIED' } })

  // Flordeliza — discharged inpatient
  await prisma.encounter.upsert({
    where: { id: 'enc_s06' },
    update: {},
    create: { id: 'enc_s06', patientId: 'pat_s06', type: 'INPATIENT', status: 'DISCHARGED', startDateTime: daysAgo(14), admissionDateTime: daysAgo(14), endDateTime: daysAgo(10), attendingProviderId: 'stf_clinician', dischargeDisposition: 'Home', codingStatus: 'COMPLETED' },
  })

  // Gregorio — discharged outpatient
  await prisma.encounter.upsert({
    where: { id: 'enc_s07' },
    update: {},
    create: { id: 'enc_s07', patientId: 'pat_s07', type: 'OUTPATIENT', status: 'DISCHARGED', startDateTime: daysAgo(20), endDateTime: daysAgo(20), attendingProviderId: 'stf_clinician', dischargeDisposition: 'Home', codingStatus: 'COMPLETED' },
  })

  // Herminia — planned outpatient
  await prisma.encounter.upsert({
    where: { id: 'enc_s08' },
    update: {},
    create: { id: 'enc_s08', patientId: 'pat_s08', type: 'OUTPATIENT', status: 'PLANNED', startDateTime: daysFromNow(2), attendingProviderId: 'stf_clinician' },
  })

  // Ignacio — active outpatient today
  await prisma.encounter.upsert({
    where: { id: 'enc_s09' },
    update: {},
    create: { id: 'enc_s09', patientId: 'pat_s09', type: 'OUTPATIENT', status: 'ACTIVE', startDateTime: todayAt(8, 0), attendingProviderId: 'stf_clinician' },
  })

  // ── Orders (~30 total) ────────────────────────────────────────────────────
  type OrderRow = { id: string; type: string; status: string; priority: string; details: object; indication?: string }

  const orderSets: Array<{ encId: string; placerId: string; rows: OrderRow[] }> = [
    {
      encId: 'enc_s01', placerId: 'stf_clinician',
      rows: [
        { id: 'ord_s01_m1', type: 'MEDICATION', status: 'VERIFIED',    priority: 'ROUTINE', details: medDetail('Metoprolol Succinate', '50mg', 'PO', 'Once daily', 'Hypertension') },
        { id: 'ord_s01_m2', type: 'MEDICATION', status: 'PLACED',      priority: 'ROUTINE', details: medDetail('Furosemide', '40mg', 'IV', 'Once daily', 'Fluid overload') },
        { id: 'ord_s01_m3', type: 'MEDICATION', status: 'IN_PROGRESS', priority: 'URGENT',  details: medDetail('Morphine Sulfate', '2mg', 'IV', 'Q4H PRN', 'Acute pain', true) },
        { id: 'ord_s01_m4', type: 'MEDICATION', status: 'VERIFIED',    priority: 'ROUTINE', details: medDetail('Lisinopril', '10mg', 'PO', 'Once daily', 'Hypertension') },
        { id: 'ord_s01_l1', type: 'LAB',        status: 'IN_PROGRESS', priority: 'ROUTINE', details: labDetail('CBC with differential', 'Whole blood'),                           indication: 'Monitor complete blood count' },
        { id: 'ord_s01_l2', type: 'LAB',        status: 'COMPLETED',   priority: 'ROUTINE', details: labDetail('Basic metabolic panel', 'Whole blood'),                           indication: 'Baseline metabolic profile' },
        { id: 'ord_s01_l3', type: 'LAB',        status: 'PLACED',      priority: 'STAT',    details: labDetail('Troponin I', 'Whole blood', true),                                indication: 'Rule out ACS' },
      ],
    },
    {
      encId: 'enc_s02', placerId: 'stf_doctor3',
      rows: [
        { id: 'ord_s02_m1', type: 'MEDICATION', status: 'VERIFIED',    priority: 'URGENT',  details: medDetail('Heparin Sodium', '5000 units', 'IV', 'Q8H', 'DVT prophylaxis', true) },
        { id: 'ord_s02_m2', type: 'MEDICATION', status: 'PLACED',      priority: 'STAT',    details: medDetail('Vancomycin HCl', '1g', 'IV', 'Q12H', 'MRSA pneumonia', true) },
        { id: 'ord_s02_m3', type: 'MEDICATION', status: 'VERIFIED',    priority: 'ROUTINE', details: medDetail('Insulin Glargine', '20 units', 'SC', 'Once daily at bedtime', 'Hyperglycemia management', true) },
        { id: 'ord_s02_l1', type: 'LAB',        status: 'IN_PROGRESS', priority: 'STAT',    details: labDetail('Blood culture aerobic', 'Blood', true),                           indication: 'Sepsis workup' },
        { id: 'ord_s02_l2', type: 'LAB',        status: 'COMPLETED',   priority: 'ROUTINE', details: labDetail('Comprehensive metabolic panel', 'Whole blood'),                   indication: 'ICU monitoring' },
      ],
    },
    {
      encId: 'enc_s03', placerId: 'stf_doctor2',
      rows: [
        { id: 'ord_s03_m1', type: 'MEDICATION', status: 'PLACED',      priority: 'ROUTINE', details: medDetail('Amoxicillin', '500mg', 'PO', 'Q8H', 'Community acquired pneumonia') },
        { id: 'ord_s03_m2', type: 'MEDICATION', status: 'VERIFIED',    priority: 'ROUTINE', details: medDetail('Acetaminophen', '1000mg', 'PO', 'Q6H PRN', 'Fever/pain') },
        { id: 'ord_s03_l1', type: 'LAB',        status: 'IN_PROGRESS', priority: 'ROUTINE', details: labDetail('CBC with differential', 'Whole blood'),                           indication: 'Monitor for infection clearance' },
        { id: 'ord_s03_l2', type: 'LAB',        status: 'PLACED',      priority: 'ROUTINE', details: labDetail('Prothrombin time (PT/INR)', 'Whole blood'),                       indication: 'Baseline coagulation' },
      ],
    },
    {
      encId: 'enc_s04', placerId: 'stf_doctor2',
      rows: [
        { id: 'ord_s04_m1', type: 'MEDICATION', status: 'PLACED',      priority: 'URGENT',  details: medDetail('Ondansetron HCl', '4mg', 'IV', 'Q8H PRN', 'Nausea/vomiting') },
        { id: 'ord_s04_m2', type: 'MEDICATION', status: 'IN_PROGRESS', priority: 'URGENT',  details: medDetail('Acetaminophen', '1000mg', 'IV', 'Q6H', 'Fever') },
        { id: 'ord_s04_l1', type: 'LAB',        status: 'IN_PROGRESS', priority: 'STAT',    details: labDetail('CBC with differential', 'Whole blood', true),                     indication: 'Rule out infection' },
        { id: 'ord_s04_l2', type: 'LAB',        status: 'PLACED',      priority: 'STAT',    details: labDetail('Basic metabolic panel', 'Whole blood', true),                     indication: 'Assess dehydration' },
      ],
    },
    {
      encId: 'enc_s05', placerId: 'stf_doctor2',
      rows: [
        { id: 'ord_s05_m1', type: 'MEDICATION', status: 'PLACED',      priority: 'STAT',    details: medDetail('Aspirin', '325mg', 'PO', 'Once', 'Chest pain rule-out ACS') },
        { id: 'ord_s05_m2', type: 'MEDICATION', status: 'VERIFIED',    priority: 'STAT',    details: medDetail('Morphine Sulfate', '4mg', 'IV', 'Once PRN', 'Acute chest pain', true) },
        { id: 'ord_s05_l1', type: 'LAB',        status: 'IN_PROGRESS', priority: 'STAT',    details: labDetail('Troponin I', 'Whole blood', true),                                indication: 'ACS rule-out' },
        { id: 'ord_s05_l2', type: 'LAB',        status: 'PLACED',      priority: 'STAT',    details: labDetail('BNP', 'Whole blood', true),                                       indication: 'Heart failure assessment' },
      ],
    },
    {
      encId: 'enc_s06', placerId: 'stf_clinician',
      rows: [
        { id: 'ord_s06_m1', type: 'MEDICATION', status: 'COMPLETED',   priority: 'ROUTINE', details: medDetail('Ceftriaxone', '1g', 'IV', 'Once daily', 'Urinary tract infection') },
        { id: 'ord_s06_l1', type: 'LAB',        status: 'COMPLETED',   priority: 'ROUTINE', details: labDetail('Urinalysis', 'Urine'),                                            indication: 'UTI workup' },
        { id: 'ord_s06_l2', type: 'LAB',        status: 'COMPLETED',   priority: 'ROUTINE', details: labDetail('Urine culture with colony count', 'Urine'),                       indication: 'Identify organism and sensitivities' },
      ],
    },
    {
      encId: 'enc_s07', placerId: 'stf_clinician',
      rows: [
        { id: 'ord_s07_m1', type: 'MEDICATION', status: 'COMPLETED',   priority: 'ROUTINE', details: medDetail('Atorvastatin', '40mg', 'PO', 'Once daily at bedtime', 'Hypercholesterolemia') },
        { id: 'ord_s07_l1', type: 'LAB',        status: 'COMPLETED',   priority: 'ROUTINE', details: labDetail('Lipid panel', 'Whole blood'),                                     indication: 'Cardiovascular risk assessment' },
        { id: 'ord_s07_l2', type: 'LAB',        status: 'COMPLETED',   priority: 'ROUTINE', details: labDetail('Hemoglobin A1c', 'Whole blood'),                                  indication: 'Diabetes screening' },
      ],
    },
  ]

  for (const { encId, placerId, rows } of orderSets) {
    for (const o of rows) {
      await prisma.order.upsert({
        where: { id: o.id },
        update: {},
        create: {
          id: o.id,
          encounterId: encId,
          placerId,
          orderType: o.type as never,
          status: o.status as never,
          priority: o.priority as never,
          details: o.details,
          clinicalIndication: o.indication ?? null,
        },
      })
    }
  }

  // ── OrderVerifications (pharmacist verified MEDICATION orders) ────────────
  const verifiedMedOrders = ['ord_s01_m1', 'ord_s01_m4', 'ord_s02_m1', 'ord_s02_m3', 'ord_s03_m2', 'ord_s05_m2']
  for (const ordId of verifiedMedOrders) {
    await prisma.orderVerification.upsert({
      where: { id: `ovrf_${ordId}` },
      update: {},
      create: { id: `ovrf_${ordId}`, orderId: ordId, pharmacistId: 'stf_pharmacist', verifiedAt: daysAgo(1), status: 'VERIFIED', notes: 'Reviewed and verified. No contraindications noted.' },
    })
  }

  // ── FlowsheetObservations (~20 rows on enc_s01) ───────────────────────────
  type ObsSpec = { type: string; unit: string; byDay: string[] }
  const obsSpecs: ObsSpec[] = [
    { type: 'HEART_RATE',       unit: 'BPM',     byDay: ['88', '92', '86', '90'] },
    { type: 'SYSTOLIC_BP',      unit: 'MMHG',    byDay: ['138', '142', '135', '140'] },
    { type: 'DIASTOLIC_BP',     unit: 'MMHG',    byDay: ['88', '90', '86', '88'] },
    { type: 'TEMPERATURE',      unit: 'CELSIUS', byDay: ['37.2', '37.5', '37.1', '36.9'] },
    { type: 'RESPIRATORY_RATE', unit: 'BRPM',    byDay: ['18', '20', '17', '19'] },
  ]

  let obsSeq = 0
  for (let day = 3; day >= 0; day--) {
    for (const spec of obsSpecs) {
      obsSeq++
      const recAt = daysAgo(day)
      recAt.setHours(8, 0, 0, 0)
      const id = `fobs_s01_${String(obsSeq).padStart(2, '0')}`
      await prisma.flowsheetObservation.upsert({
        where: { id },
        update: {},
        create: { id, encounterId: 'enc_s01', recorderId: 'stf_nurse', recordedAt: recAt, observationType: spec.type as never, value: spec.byDay[3 - day], unit: spec.unit as never },
      })
    }
  }

  // ── ClinicalNotes (~15) ───────────────────────────────────────────────────
  type NoteRow = { id: string; encId: string; authorId: string; noteType: string; status: string; title: string; content: string }
  const notes: NoteRow[] = [
    { id: 'cn_s01_01', encId: 'enc_s01', authorId: 'stf_clinician', noteType: 'H_AND_P',          status: 'SIGNED', title: 'History & Physical',           content: 'Juan dela Cruz, 58M. Presents with worsening dyspnea on exertion and bilateral leg edema x3 days. Hx of HTN, HFrEF. On exam: bibasilar crackles, 2+ pitting edema. BNP elevated. Plan: diuresis, cardiology consult.' },
    { id: 'cn_s01_02', encId: 'enc_s01', authorId: 'stf_clinician', noteType: 'PROGRESS_NOTE',    status: 'SIGNED', title: 'Progress Note Day 2',           content: 'Patient responding to IV furosemide. Weight down 1.2kg. Dyspnea improved. BP 138/88. Continue current regimen. Repeat BMP tomorrow.' },
    { id: 'cn_s01_03', encId: 'enc_s01', authorId: 'stf_clinician', noteType: 'PROGRESS_NOTE',    status: 'SIGNED', title: 'Progress Note Day 3',           content: 'Further clinical improvement. Lungs clear on auscultation. Edema resolving. Transitioning to oral furosemide. Plan for discharge tomorrow.' },
    { id: 'cn_s01_04', encId: 'enc_s01', authorId: 'stf_nurse',     noteType: 'NURSING_NOTE',     status: 'SIGNED', title: 'Nursing Note',                  content: 'VS stable. IV access patent at right antecubital. Patient tolerating soft diet. Ambulating to bathroom with minimal assistance. Pain 3/10.' },
    { id: 'cn_s01_05', encId: 'enc_s01', authorId: 'stf_clinician', noteType: 'PROGRESS_NOTE',    status: 'DRAFT',  title: 'Progress Note Day 4',           content: 'Patient clinically stable. Discharge planning in progress. Pending social work clearance.' },
    { id: 'cn_s02_01', encId: 'enc_s02', authorId: 'stf_doctor3',   noteType: 'H_AND_P',          status: 'SIGNED', title: 'ICU Admission H&P',             content: 'Linda Bautista, 71F. Transferred to ICU for septic shock secondary to healthcare-associated pneumonia. Intubated in ED. On vasopressors. Blood cultures sent.' },
    { id: 'cn_s02_02', encId: 'enc_s02', authorId: 'stf_doctor3',   noteType: 'PROGRESS_NOTE',    status: 'SIGNED', title: 'ICU Progress Note',             content: 'Vasopressor requirements down-trending. Renal function improving (Cr 1.8 from 2.4). Cultures with gram-positive cocci — vancomycin appropriate. Sedation hold per protocol.' },
    { id: 'cn_s02_03', encId: 'enc_s02', authorId: 'stf_nurse3',    noteType: 'NURSING_NOTE',     status: 'SIGNED', title: 'ICU Nursing Note',              content: 'Patient sedated on propofol infusion. ETT in place, secured at 22cm mark. Vent settings unchanged. Continuous cardiac monitoring. Foley intact, UO adequate.' },
    { id: 'cn_s03_01', encId: 'enc_s03', authorId: 'stf_doctor2',   noteType: 'H_AND_P',          status: 'SIGNED', title: 'Admission H&P',                 content: 'Roberto Villanueva, 53M. CAP with RLL consolidation on CXR. O2 sat 92% on RA on presentation. Now 96% on 2L NC. Initiated amoxicillin. Will monitor for response.' },
    { id: 'cn_s04_01', encId: 'enc_s04', authorId: 'stf_doctor2',   noteType: 'TRIAGE_NOTE',      status: 'SIGNED', title: 'ER Triage Note',                'content': 'Carmen Reyes, 35F. N/V x24h, unable to tolerate PO, dry mucous membranes. HR 104, BP 98/62. Starting IVF resuscitation and antiemetics. Labs and IV access obtained.' },
    { id: 'cn_s05_01', encId: 'enc_s05', authorId: 'stf_doctor2',   noteType: 'TRIAGE_NOTE',      status: 'SIGNED', title: 'ER Triage Note',                content: 'Eduardo Mendoza, 48M. Chest pain 7/10 radiating to left arm, onset 90 min ago. Diaphoretic. 12-lead ECG in progress. Troponin ordered STAT. Aspirin given. High suspicion ACS.' },
    { id: 'cn_s06_01', encId: 'enc_s06', authorId: 'stf_clinician', noteType: 'PROGRESS_NOTE',    status: 'SIGNED', title: 'Final Progress Note',           content: 'Flordeliza Aquino tolerating PO antibiotics well. Afebrile x48h. UA improving. Safe for discharge with oral ciprofloxacin to complete 7-day course.' },
    { id: 'cn_s06_02', encId: 'enc_s06', authorId: 'stf_clinician', noteType: 'DISCHARGE_SUMMARY', status: 'SIGNED', title: 'Discharge Summary',            content: 'Flordeliza Aquino discharged home after 4-day inpatient treatment for complicated UTI. Prescribed ciprofloxacin 500mg BID x5 days remaining. Follow-up in 2 weeks with PCP.' },
    { id: 'cn_s07_01', encId: 'enc_s07', authorId: 'stf_clinician', noteType: 'H_AND_P',          status: 'SIGNED', title: 'Annual Wellness Visit',         content: 'Gregorio Macaraeg, 77M. Annual wellness exam. HTN controlled. Lipid panel ordered — last result from 18 months ago. BMI 26. Fall risk screening: low. Flu and pneumococcal vaccines up to date.' },
    { id: 'cn_s07_02', encId: 'enc_s07', authorId: 'stf_clinician', noteType: 'DISCHARGE_SUMMARY', status: 'SIGNED', title: 'Visit Summary',                content: 'Annual visit completed. Initiated atorvastatin 40mg per elevated LDL on today\'s lipid panel. Labs reviewed with patient. Follow-up in 6 weeks for lipid recheck and medication tolerance.' },
  ]

  for (const n of notes) {
    await prisma.clinicalNote.upsert({
      where: { id: n.id },
      update: {},
      create: { id: n.id, encounterId: n.encId, authorId: n.authorId, noteType: n.noteType as never, title: n.title, content: n.content, status: n.status as never, isSensitive: false, signedAt: n.status === 'SIGNED' ? daysAgo(1) : null },
    })
  }

  // ── Invoices (~5) ─────────────────────────────────────────────────────────
  type LineItemRow = { id: string; cmiId: string; desc: string; qty: number; unit: number }
  type InvoiceRow  = { id: string; patientId: string; encounterId: string | null; status: string; total: number; paid: number; issueDate: Date; dueDate: Date; lineItems: LineItemRow[] }

  const invoices: InvoiceRow[] = [
    {
      id: 'inv_s06_01', patientId: 'pat_s06', encounterId: 'enc_s06', status: 'PAID', total: 41000, paid: 41000,
      issueDate: daysAgo(9), dueDate: daysAgo(1),
      lineItems: [
        { id: 'ili_s06_01', cmiId: 'cmi_99222', desc: 'Hospital admission, moderate complexity', qty: 1, unit: 30000 },
        { id: 'ili_s06_02', cmiId: 'cmi_81003', desc: 'Urinalysis, automated',                   qty: 1, unit: 3500  },
        { id: 'ili_s06_03', cmiId: 'cmi_87088', desc: 'Urine culture with colony count',         qty: 1, unit: 7500  },
      ],
    },
    {
      id: 'inv_s07_01', patientId: 'pat_s07', encounterId: 'enc_s07', status: 'PAID', total: 38000, paid: 38000,
      issueDate: daysAgo(19), dueDate: daysAgo(5),
      lineItems: [
        { id: 'ili_s07_01', cmiId: 'cmi_99221', desc: 'Hospital admission, low complexity', qty: 1, unit: 23000 },
        { id: 'ili_s07_02', cmiId: 'cmi_80061', desc: 'Lipid panel',                       qty: 1, unit: 8500  },
        { id: 'ili_s07_03', cmiId: 'cmi_83036', desc: 'Hemoglobin A1c',                    qty: 1, unit: 6500  },
      ],
    },
    {
      id: 'inv_s04_01', patientId: 'pat_s04', encounterId: 'enc_s04', status: 'ISSUED', total: 31500, paid: 0,
      issueDate: daysAgo(0), dueDate: daysFromNow(30),
      lineItems: [
        { id: 'ili_s04_01', cmiId: 'cmi_99283', desc: 'Emergency dept visit, moderate complexity', qty: 1, unit: 25000 },
        { id: 'ili_s04_02', cmiId: 'cmi_85025', desc: 'CBC with automated differential',           qty: 1, unit: 6500  },
      ],
    },
    {
      id: 'inv_s09_01', patientId: 'pat_s09', encounterId: null, status: 'PAID', total: 16000, paid: 16000,
      issueDate: daysAgo(25), dueDate: daysAgo(10),
      lineItems: [
        { id: 'ili_s09_01', cmiId: 'cmi_80053', desc: 'Comprehensive metabolic panel', qty: 1, unit: 9500 },
        { id: 'ili_s09_02', cmiId: 'cmi_85025', desc: 'CBC with automated differential', qty: 1, unit: 6500 },
      ],
    },
    {
      id: 'inv_s10_01', patientId: 'pat_s10', encounterId: null, status: 'PAID', total: 17000, paid: 17000,
      issueDate: daysAgo(12), dueDate: daysAgo(2),
      lineItems: [
        { id: 'ili_s10_01', cmiId: 'cmi_80048', desc: 'Basic metabolic panel (BMP)', qty: 1, unit: 7500 },
        { id: 'ili_s10_02', cmiId: 'cmi_93000', desc: 'ECG 12-lead with interpretation', qty: 1, unit: 9500 },
      ],
    },
  ]

  for (const inv of invoices) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: {},
      create: { id: inv.id, patientId: inv.patientId, encounterId: inv.encounterId ?? undefined, status: inv.status as never, totalAmountInCents: inv.total, amountPaidInCents: inv.paid, issueDate: inv.issueDate, dueDate: inv.dueDate },
    })
    for (const li of inv.lineItems) {
      await prisma.invoiceLineItem.upsert({
        where: { id: li.id },
        update: {},
        create: { id: li.id, invoiceId: inv.id, chargeMasterItemId: li.cmiId, description: li.desc, quantity: li.qty, unitPriceInCents: li.unit, totalPriceInCents: li.unit * li.qty },
      })
    }
  }

  // ── AuditLog backfill (~50 rows spanning past 30 days) ───────────────────
  // BigInt autoincrement — use count gate for idempotency
  const existingAuditCount = await prisma.auditLog.count()
  if (existingAuditCount < 50) {
    const templates = [
      { userId: 'user_admin',      actionType: 'LOGIN',       entityType: 'User',                entityId: 'user_admin'      },
      { userId: 'user_clinician',  actionType: 'READ',        entityType: 'Patient',             entityId: 'pat_s01'         },
      { userId: 'user_clinician',  actionType: 'CREATE',      entityType: 'Order',               entityId: 'ord_s01_m1'      },
      { userId: 'user_nurse',      actionType: 'UPDATE',      entityType: 'Encounter',           entityId: 'enc_s01'         },
      { userId: 'user_pharmacist', actionType: 'CREATE',      entityType: 'OrderVerification',   entityId: 'ord_s01_m1'      },
      { userId: 'user_clinician',  actionType: 'READ',        entityType: 'Patient',             entityId: 'pat_s02'         },
      { userId: 'user_labtech',    actionType: 'UPDATE',      entityType: 'Order',               entityId: 'ord_s01_l1'      },
      { userId: 'user_registrar',  actionType: 'CREATE',      entityType: 'Patient',             entityId: 'pat_s03'         },
      { userId: 'user_clinician',  actionType: 'CREATE',      entityType: 'ClinicalNote',        entityId: 'cn_s01_01'       },
      { userId: 'user_biller',     actionType: 'READ',        entityType: 'Invoice',             entityId: 'inv_s06_01'      },
      { userId: 'user_nurse',      actionType: 'CREATE',      entityType: 'FlowsheetObservation',entityId: 'enc_s01'         },
      { userId: 'user_himcoder',   actionType: 'UPDATE',      entityType: 'Encounter',           entityId: 'enc_s06'         },
      { userId: 'user_scheduler',  actionType: 'CREATE',      entityType: 'Appointment',         entityId: 'appt_maria_today'},
      { userId: 'user_auditor',    actionType: 'READ',        entityType: 'AuditLog',            entityId: 'system'          },
      { userId: 'user_clinician',  actionType: 'BREAK_GLASS', entityType: 'Patient',             entityId: 'pat_s02'         },
      { userId: 'user_nurse2',     actionType: 'LOGIN',       entityType: 'User',                entityId: 'user_nurse2'     },
      { userId: 'user_nurse',      actionType: 'READ',        entityType: 'Patient',             entityId: 'pat_s01'         },
      { userId: 'user_pharmacist', actionType: 'READ',        entityType: 'Order',               entityId: 'ord_s02_m1'      },
      { userId: 'user_labtech',    actionType: 'UPDATE',      entityType: 'Order',               entityId: 'ord_s02_l1'      },
      { userId: 'user_biller',     actionType: 'UPDATE',      entityType: 'Invoice',             entityId: 'inv_s07_01'      },
    ] as const

    const auditRows = []
    for (let i = 0; i < 50; i++) {
      const tmpl = templates[i % templates.length]
      const ts = new Date()
      ts.setDate(ts.getDate() - Math.floor((i / 50) * 30))
      ts.setHours((i % 14) + 7, (i * 7) % 60, 0, 0)
      auditRows.push({
        timestamp: ts,
        userId: tmpl.userId,
        actionType: tmpl.actionType as never,
        entityType: tmpl.entityType,
        entityId: tmpl.entityId,
        details: { seedRow: i + 1 },
        ipAddress: `192.168.1.${(i % 20) + 10}`,
      })
    }
    await prisma.auditLog.createMany({ data: auditRows })
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
