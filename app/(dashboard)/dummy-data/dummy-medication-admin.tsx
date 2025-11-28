export interface Medications {
    medicationId: string
    medicationGenericName: string
    medicationBrandName: string
    medicationClassification: string
    dosageForm: string
    dosageUnit: string
    routeOfAdministration: string
}

export interface MedicationProfile {
   patient: {
     patientId: string
     patientName: string
     ageSex: string
     currentPhysician: string
     currentWard: string
     currentRoom: string
     chiefComplaint: string
     diagnosis: string
     allergies: string
     lastAdministeredMedication: string
     lastTimeAdministered: string
     dosageGiven: string
     medicationOrders:
     {
        medicationOrderId: string
        medicationDetails: {
            medicationId: string
            medicationGenericName: string
            medicationBrandName: string
            medicationClassification: string
            dosageForm: string
            dosageUnit: string
        }
        orderedDosage: string
        orderedFrequency: string
        routeOfAdministration: string
        timeAdminSchedule: string[] 
        startDate: Date
        stopDate: Date
        physician: string
        specialInstructions: string
        status: "PENDING" |"ACTIVE" | "ON HOLD" | "FLAGGED" | "EXPIRED" | "DISCONTINUED" | "COMPLETED" | "CANCELLED"
     }[]
     administeredMedicationRecords:
     {
        medicationId: string
        medicationGenericName: string
        medicationBrandName: string
        medicationClassification: string
        dosageAdministered: string
        timeAdministered: string
        dateAdministered: Date
        administeringNurse: string
        isAdministered: boolean
        nurseNotes: string
     }[]
   }
}

export const MedicationList: Medications[] = [
    {
        medicationId: "MED-001",
        medicationGenericName: "atorvastatin",
        medicationBrandName: "Lipitor",
        medicationClassification: "HMG-CoA Reductase Inhibitor (Statin)",
        dosageForm: "tablet",
        dosageUnit: "40mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-002",
        medicationGenericName: "metformin",
        medicationBrandName: "Glucophage",
        medicationClassification: "Biguanide Antidiabetic",
        dosageForm: "tablet",
        dosageUnit: "1000mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-003",
        medicationGenericName: "lisinopril",
        medicationBrandName: "Prinivil",
        medicationClassification: "ACE Inhibitor",
        dosageForm: "tablet",
        dosageUnit: "10mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-004",
        medicationGenericName: "amlodipine",
        medicationBrandName: "Norvasc",
        medicationClassification: "Calcium Channel Blocker",
        dosageForm: "tablet",
        dosageUnit: "10mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-005",
        medicationGenericName: "levothyroxine",
        medicationBrandName: "Synthroid",
        medicationClassification: "Thyroid Hormone",
        dosageForm: "tablet",
        dosageUnit: "75mcg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-006",
        medicationGenericName: "omeprazole",
        medicationBrandName: "Prilosec",
        medicationClassification: "Proton Pump Inhibitor",
        dosageForm: "capsule",
        dosageUnit: "40mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-007",
        medicationGenericName: "albuterol",
        medicationBrandName: "Ventolin",
        medicationClassification: "Beta-2 Agonist Bronchodilator",
        dosageForm: "aerosol",
        dosageUnit: "90mcg",
        routeOfAdministration: "inhalation"
    },
    {
        medicationId: "MED-008",
        medicationGenericName: "sertraline",
        medicationBrandName: "Zoloft",
        medicationClassification: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        dosageForm: "tablet",
        dosageUnit: "50mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-009",
        medicationGenericName: "gabapentin",
        medicationBrandName: "Neurontin",
        medicationClassification: "Anticonvulsant/Neuropathic Pain Agent",
        dosageForm: "capsule",
        dosageUnit: "300mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-010",
        medicationGenericName: "losartan",
        medicationBrandName: "Cozaar",
        medicationClassification: "Angiotensin II Receptor Blocker (ARB)",
        dosageForm: "tablet",
        dosageUnit: "50mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-011",
        medicationGenericName: "montelukast",
        medicationBrandName: "Singulair",
        medicationClassification: "Leukotriene Receptor Antagonist",
        dosageForm: "tablet",
        dosageUnit: "10mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-012",
        medicationGenericName: "insulin glargine",
        medicationBrandName: "Lantus",
        medicationClassification: "Long-Acting Insulin",
        dosageForm: "solution",
        dosageUnit: "100units/mL",
        routeOfAdministration: "subcutaneous"
    },
    {
        medicationId: "MED-013",
        medicationGenericName: "amoxicillin",
        medicationBrandName: "Amoxil",
        medicationClassification: "Penicillin Antibiotic",
        dosageForm: "capsule",
        dosageUnit: "500mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-014",
        medicationGenericName: "hydrochlorothiazide",
        medicationBrandName: "Microzide",
        medicationClassification: "Thiazide Diuretic",
        dosageForm: "tablet",
        dosageUnit: "25mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-015",
        medicationGenericName: "warfarin",
        medicationBrandName: "Coumadin",
        medicationClassification: "Anticoagulant",
        dosageForm: "tablet",
        dosageUnit: "5mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-016",
        medicationGenericName: "atorvastatin",
        medicationBrandName: "Lipitor",
        medicationClassification: "HMG-CoA Reductase Inhibitor (Statin)",
        dosageForm: "tablet",
        dosageUnit: "20mg",
        routeOfAdministration: "oral"
    },
    {
        medicationId: "MED-017",
        medicationGenericName: "lisinopril",
        medicationBrandName: "Prinivil",
        medicationClassification: "ACE Inhibitor",
        dosageForm: "tablet",
        dosageUnit: "20mg",
        routeOfAdministration: "oral"
    },
];

export const MedicationProfileEntries: MedicationProfile[] = [
    {
        patient: {
            patientId: "PT-2025-001",
            patientName: "Robert Martinez",
            ageSex: "67/M",
            currentPhysician: "Dr. Sarah Chen, MD",
            currentWard: "Cardiology",
            currentRoom: "C-302",
            chiefComplaint: "Chest pain and shortness of breath",
            diagnosis: "Acute Coronary Syndrome, Hypertension",
            allergies: "Penicillin",
            lastAdministeredMedication: "lisinopril (Prinivil)",
            lastTimeAdministered: "0815",
            dosageGiven: "10mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-001-001",
                    medicationDetails: {
                        medicationId: "MED-003",
                        medicationGenericName: "lisinopril",
                        medicationBrandName: "Prinivil",
                        medicationClassification: "ACE Inhibitor",
                        dosageForm: "tablet",
                        dosageUnit: "10mg"
                    },
                    orderedDosage: "10mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0800"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Sarah Chen, MD",
                    specialInstructions: "Take in the morning. Monitor blood pressure.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-001-002",
                    medicationDetails: {
                        medicationId: "MED-001",
                        medicationGenericName: "atorvastatin",
                        medicationBrandName: "Lipitor",
                        medicationClassification: "HMG-CoA Reductase Inhibitor (Statin)",
                        dosageForm: "tablet",
                        dosageUnit: "40mg"
                    },
                    orderedDosage: "40mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["2000"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Sarah Chen, MD",
                    specialInstructions: "Take at bedtime with full glass of water.",
                    status: "ACTIVE"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-003",
                    medicationGenericName: "lisinopril",
                    medicationBrandName: "Prinivil",
                    medicationClassification: "ACE Inhibitor",
                    dosageAdministered: "10mg",
                    timeAdministered: "0815",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Maria Santos",
                    isAdministered: true,
                    nurseNotes: "Patient tolerated well. BP 138/82 pre-administration."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-002",
            patientName: "Jennifer Thompson",
            ageSex: "52/F",
            currentPhysician: "Dr. Michael Rodriguez, MD",
            currentWard: "Endocrinology",
            currentRoom: "E-115",
            chiefComplaint: "Uncontrolled blood sugar levels",
            diagnosis: "Type 2 Diabetes Mellitus, Hypothyroidism",
            allergies: "None",
            lastAdministeredMedication: "metformin (Glucophage)",
            lastTimeAdministered: "0805",
            dosageGiven: "1000mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-002-001",
                    medicationDetails: {
                        medicationId: "MED-002",
                        medicationGenericName: "metformin",
                        medicationBrandName: "Glucophage",
                        medicationClassification: "Biguanide Antidiabetic",
                        dosageForm: "tablet",
                        dosageUnit: "1000mg"
                    },
                    orderedDosage: "1000mg",
                    orderedFrequency: "Twice daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0800, 2000"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Michael Rodriguez, MD",
                    specialInstructions: "Take with meals to reduce GI upset. Monitor blood glucose.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-002-002",
                    medicationDetails: {
                        medicationId: "MED-005",
                        medicationGenericName: "levothyroxine",
                        medicationBrandName: "Synthroid",
                        medicationClassification: "Thyroid Hormone",
                        dosageForm: "tablet",
                        dosageUnit: "75mcg"
                    },
                    orderedDosage: "75mcg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0600"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Michael Rodriguez, MD",
                    specialInstructions: "Take on empty stomach 30 minutes before breakfast.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-002-003",
                    medicationDetails: {
                        medicationId: "MED-012",
                        medicationGenericName: "insulin glargine",
                        medicationBrandName: "Lantus",
                        medicationClassification: "Long-Acting Insulin",
                        dosageForm: "solution",
                        dosageUnit: "100units/mL"
                    },
                    orderedDosage: "20 units",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "subcutaneous",
                    timeAdminSchedule: ["2200"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Michael Rodriguez, MD",
                    specialInstructions: "Administer in abdomen. Rotate injection sites.",
                    status: "ACTIVE"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-005",
                    medicationGenericName: "levothyroxine",
                    medicationBrandName: "Synthroid",
                    medicationClassification: "Thyroid Hormone",
                    dosageAdministered: "75mcg",
                    timeAdministered: "0610",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN James Wilson",
                    isAdministered: true,
                    nurseNotes: "Administered as ordered. Patient reminded to wait 30 min before eating."
                },
                {
                    medicationId: "MED-002",
                    medicationGenericName: "metformin",
                    medicationBrandName: "Glucophage",
                    medicationClassification: "Biguanide Antidiabetic",
                    dosageAdministered: "1000mg",
                    timeAdministered: "0805",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN James Wilson",
                    isAdministered: true,
                    nurseNotes: "Given with breakfast tray. Blood glucose 165 mg/dL pre-meal."
                },
                {
                    medicationId: "MED-012",
                    medicationGenericName: "insulin glargine",
                    medicationBrandName: "Lantus",
                    medicationClassification: "Long-Acting Insulin",
                    dosageAdministered: "20 units",
                    timeAdministered: "2200",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN James Wilson",
                    isAdministered: true,
                    nurseNotes: "Patient tolerated well. BP 138/82 pre-administration."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-003",
            patientName: "David Kim",
            ageSex: "45/M",
            currentPhysician: "Dr. Lisa Patel, MD",
            currentWard: "Pulmonology",
            currentRoom: "P-208",
            chiefComplaint: "Severe asthma exacerbation",
            diagnosis: "Acute Asthma Exacerbation, Allergic Rhinitis",
            allergies: "Pollens",
            lastAdministeredMedication: "albuterol (Ventolin)",
            lastTimeAdministered: "1045",
            dosageGiven: "2 puffs (180mcg)",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-003-001",
                    medicationDetails: {
                        medicationId: "MED-007",
                        medicationGenericName: "albuterol",
                        medicationBrandName: "Ventolin",
                        medicationClassification: "Beta-2 Agonist Bronchodilator",
                        dosageForm: "aerosol",
                        dosageUnit: "90mcg"
                    },
                    orderedDosage: "2 puffs (180mcg)",
                    orderedFrequency: "Every 4 hours as needed",
                    routeOfAdministration: "inhalation",
                    timeAdminSchedule: ["PRN"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Lisa Patel, MD",
                    specialInstructions: "Shake well before use. Rinse mouth after administration.",
                    status: "ACTIVE"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-007",
                    medicationGenericName: "albuterol",
                    medicationBrandName: "Ventolin",
                    medicationClassification: "Beta-2 Agonist Bronchodilator",
                    dosageAdministered: "2 puffs (180mcg)",
                    timeAdministered: "0630",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Patricia Lee",
                    isAdministered: true,
                    nurseNotes: "Patient experiencing wheezing. O2 sat 91% pre-admin, 96% post-admin. Good technique observed."
                },
                {
                    medicationId: "MED-007",
                    medicationGenericName: "albuterol",
                    medicationBrandName: "Ventolin",
                    medicationClassification: "Beta-2 Agonist Bronchodilator",
                    dosageAdministered: "2 puffs (180mcg)",
                    timeAdministered: "1045",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Patricia Lee",
                    isAdministered: true,
                    nurseNotes: "Patient requested PRN dose. Breathing improved. O2 sat maintained at 97%."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-004",
            patientName: "Emily Anderson",
            ageSex: "34/F",
            currentPhysician: "Dr. Kevin Nguyen, MD",
            currentWard: "Psychiatry",
            currentRoom: "PS-402",
            chiefComplaint: "Major depressive episode",
            diagnosis: "Major Depressive Disorder, Generalized Anxiety Disorder",
            allergies: "None",
            lastAdministeredMedication: "sertraline (Zoloft)",
            lastTimeAdministered: "0920",
            dosageGiven: "50mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-004-001",
                    medicationDetails: {
                        medicationId: "MED-008",
                        medicationGenericName: "sertraline",
                        medicationBrandName: "Zoloft",
                        medicationClassification: "Selective Serotonin Reuptake Inhibitor (SSRI)",
                        dosageForm: "tablet",
                        dosageUnit: "50mg"
                    },
                    orderedDosage: "50mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0900"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Kevin Nguyen, MD",
                    specialInstructions: "Take with food. Monitor for mood changes and suicidal ideation.",
                    status: "ACTIVE"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-008",
                    medicationGenericName: "sertraline",
                    medicationBrandName: "Zoloft",
                    medicationClassification: "Selective Serotonin Reuptake Inhibitor (SSRI)",
                    dosageAdministered: "50mg",
                    timeAdministered: "0920",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Thomas Anderson",
                    isAdministered: true,
                    nurseNotes: "Medication administered with breakfast. Patient cooperative. Mood stable, no suicidal ideation reported."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-005",
            patientName: "William Chen",
            ageSex: "71/M",
            currentPhysician: "Dr. Amanda Foster, MD",
            currentWard: "Neurology",
            currentRoom: "N-301",
            chiefComplaint: "Chronic neuropathic pain",
            diagnosis: "Diabetic Peripheral Neuropathy, Atrial Fibrillation",
            allergies: "None",
            lastAdministeredMedication: "gabapentin (Neurontin)",
            lastTimeAdministered: "0810",
            dosageGiven: "300mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-005-001",
                    medicationDetails: {
                        medicationId: "MED-009",
                        medicationGenericName: "gabapentin",
                        medicationBrandName: "Neurontin",
                        medicationClassification: "Anticonvulsant/Neuropathic Pain Agent",
                        dosageForm: "capsule",
                        dosageUnit: "300mg"
                    },
                    orderedDosage: "300mg",
                    orderedFrequency: "Three times daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0800, 1400, 2000"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Amanda Foster, MD",
                    specialInstructions: "Titrate gradually. Monitor for dizziness and sedation.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-005-002",
                    medicationDetails: {
                        medicationId: "MED-015",
                        medicationGenericName: "warfarin",
                        medicationBrandName: "Coumadin",
                        medicationClassification: "Anticoagulant",
                        dosageForm: "tablet",
                        dosageUnit: "5mg"
                    },
                    orderedDosage: "5mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["1700"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Amanda Foster, MD",
                    specialInstructions: "Monitor INR closely. Target INR 2.0-3.0. Avoid vitamin K-rich foods.",
                    status: "ON HOLD"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-009",
                    medicationGenericName: "gabapentin",
                    medicationBrandName: "Neurontin",
                    medicationClassification: "Anticonvulsant/Neuropathic Pain Agent",
                    dosageAdministered: "300mg",
                    timeAdministered: "0810",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Catherine Moore",
                    isAdministered: true,
                    nurseNotes: "Morning dose given. Patient reports pain level 6/10. No dizziness noted."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-006",
            patientName: "Maria Garcia",
            ageSex: "58/F",
            currentPhysician: "Dr. Robert Taylor, MD",
            currentWard: "Cardiology",
            currentRoom: "C-418",
            chiefComplaint: "Hypertensive crisis",
            diagnosis: "Hypertensive Emergency, Congestive Heart Failure",
            allergies: "None",
            lastAdministeredMedication: "hydrochlorothiazide (Microzide)",
            lastTimeAdministered: "0905",
            dosageGiven: "25mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-006-001",
                    medicationDetails: {
                        medicationId: "MED-010",
                        medicationGenericName: "losartan",
                        medicationBrandName: "Cozaar",
                        medicationClassification: "Angiotensin II Receptor Blocker (ARB)",
                        dosageForm: "tablet",
                        dosageUnit: "50mg"
                    },
                    orderedDosage: "50mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0900"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Robert Taylor, MD",
                    specialInstructions: "Monitor BP closely. Hold if SBP < 100 mmHg.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-006-002",
                    medicationDetails: {
                        medicationId: "MED-014",
                        medicationGenericName: "hydrochlorothiazide",
                        medicationBrandName: "Microzide",
                        medicationClassification: "Thiazide Diuretic",
                        dosageForm: "tablet",
                        dosageUnit: "25mg"
                    },
                    orderedDosage: "25mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0900"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Robert Taylor, MD",
                    specialInstructions: "Monitor fluid balance and electrolytes. Take in morning to avoid nocturia.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-006-003",
                    medicationDetails: {
                        medicationId: "MED-004",
                        medicationGenericName: "amlodipine",
                        medicationBrandName: "Norvasc",
                        medicationClassification: "Calcium Channel Blocker",
                        dosageForm: "tablet",
                        dosageUnit: "10mg"
                    },
                    orderedDosage: "10mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["2100"],
                    startDate: new Date("2025-10-15"),
                    stopDate: new Date("2025-10-30"),
                    physician: "Dr. Robert Taylor, MD",
                    specialInstructions: "Monitor for peripheral edema and dizziness.",
                    status: "COMPLETED"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-010",
                    medicationGenericName: "losartan",
                    medicationBrandName: "Cozaar",
                    medicationClassification: "Angiotensin II Receptor Blocker (ARB)",
                    dosageAdministered: "50mg",
                    timeAdministered: "0905",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Jennifer Brown",
                    isAdministered: true,
                    nurseNotes: "BP 152/94 prior to administration. Patient tolerated well."
                },
                {
                    medicationId: "MED-014",
                    medicationGenericName: "hydrochlorothiazide",
                    medicationBrandName: "Microzide",
                    medicationClassification: "Thiazide Diuretic",
                    dosageAdministered: "25mg",
                    timeAdministered: "0905",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Jennifer Brown",
                    isAdministered: true,
                    nurseNotes: "Given with losartan. I&O charted. Patient voiding adequately."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-007",
            patientName: "Michael O'Brien",
            ageSex: "28/M",
            currentPhysician: "Dr. Susan Martinez, MD",
            currentWard: "Infectious Disease",
            currentRoom: "ID-205",
            chiefComplaint: "Bacterial pneumonia",
            diagnosis: "Community-Acquired Pneumonia",
            allergies: "None",
            lastAdministeredMedication: "amoxicillin (Amoxil)",
            lastTimeAdministered: "1405",
            dosageGiven: "500mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-007-001",
                    medicationDetails: {
                        medicationId: "MED-013",
                        medicationGenericName: "amoxicillin",
                        medicationBrandName: "Amoxil",
                        medicationClassification: "Penicillin Antibiotic",
                        dosageForm: "capsule",
                        dosageUnit: "500mg"
                    },
                    orderedDosage: "500mg",
                    orderedFrequency: "Three times daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0800, 1400, 2000"],
                    startDate: new Date("2025-11-15"),
                    stopDate: new Date("2025-11-30"),
                    physician: "Dr. Susan Martinez, MD",
                    specialInstructions: "Complete full 7-day course. Monitor for allergic reaction.",
                    status: "ACTIVE"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-013",
                    medicationGenericName: "amoxicillin",
                    medicationBrandName: "Amoxil",
                    medicationClassification: "Penicillin Antibiotic",
                    dosageAdministered: "500mg",
                    timeAdministered: "0800",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Daniel Park",
                    isAdministered: true,
                    nurseNotes: "Day 3 of antibiotic therapy. No signs of allergic reaction. Patient reports improved breathing."
                },
                {
                    medicationId: "MED-013",
                    medicationGenericName: "amoxicillin",
                    medicationBrandName: "Amoxil",
                    medicationClassification: "Penicillin Antibiotic",
                    dosageAdministered: "500mg",
                    timeAdministered: "1405",
                    dateAdministered: new Date("2025-11-24"),
                    administeringNurse: "RN Sarah Mitchell",
                    isAdministered: true,
                    nurseNotes: "Afternoon dose administered. Patient afebrile, temp 98.4°F. Lungs clear to auscultation."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-008",
            patientName: "Susan Richards",
            ageSex: "41/F",
            currentPhysician: "Dr. James Cooper, MD",
            currentWard: "Pulmonology",
            currentRoom: "P-312",
            chiefComplaint: "Chronic asthma management",
            diagnosis: "Moderate Persistent Asthma, Seasonal Allergies",
            allergies: "Latex, Dust, Pollens",
            lastAdministeredMedication: "montelukast (Singulair)",
            lastTimeAdministered: "2010",
            dosageGiven: "10mg",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-008-001",
                    medicationDetails: {
                        medicationId: "MED-011",
                        medicationGenericName: "montelukast",
                        medicationBrandName: "Singulair",
                        medicationClassification: "Leukotriene Receptor Antagonist",
                        dosageForm: "tablet",
                        dosageUnit: "10mg"
                    },
                    orderedDosage: "10mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["2000"],
                    startDate: new Date("2025-11-24"),
                    stopDate: new Date("2025-12-24"),
                    physician: "Dr. James Cooper, MD",
                    specialInstructions: "Take in the evening. Monitor for mood changes.",
                    status: "ACTIVE"
                },
                {
                    medicationOrderId: "MO-2025-008-002",
                    medicationDetails: {
                        medicationId: "MED-007",
                        medicationGenericName: "albuterol",
                        medicationBrandName: "Ventolin",
                        medicationClassification: "Beta-2 Agonist Bronchodilator",
                        dosageForm: "aerosol",
                        dosageUnit: "90mcg"
                    },
                    orderedDosage: "2 puffs (180mcg)",
                    orderedFrequency: "Every 4-6 hours as needed",
                    routeOfAdministration: "inhalation",
                    timeAdminSchedule: ["PRN"],
                    startDate: new Date("2025-11-24"),
                    stopDate: new Date("2025-12-24"),
                    physician: "Dr. James Cooper, MD",
                    specialInstructions: "Use as rescue inhaler for acute symptoms.",
                    status: "ACTIVE"
                }
            ],
            administeredMedicationRecords: [
                {
                    medicationId: "MED-011",
                    medicationGenericName: "montelukast",
                    medicationBrandName: "Singulair",
                    medicationClassification: "Leukotriene Receptor Antagonist",
                    dosageAdministered: "10mg",
                    timeAdministered: "2010",
                    dateAdministered: new Date("2025-11-23"),
                    administeringNurse: "RN Emily Watson",
                    isAdministered: true,
                    nurseNotes: "Evening dose given as ordered. Patient reports good symptom control today."
                }
            ]
        }
    },
    {
        patient: {
            patientId: "PT-2025-009",
            patientName: "Thomas Jackson",
            ageSex: "63/M",
            currentPhysician: "Dr. Rachel Kim, MD",
            currentWard: "Gastroenterology",
            currentRoom: "G-104",
            chiefComplaint: "Severe GERD symptoms",
            diagnosis: "Gastroesophageal Reflux Disease (GERD), Peptic Ulcer Disease",
            allergies: "None",
            lastAdministeredMedication: "N/A",
            lastTimeAdministered: "N/A",
            dosageGiven: "N/A",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-009-001",
                    medicationDetails: {
                        medicationId: "MED-006",
                        medicationGenericName: "omeprazole",
                        medicationBrandName: "Prilosec",
                        medicationClassification: "Proton Pump Inhibitor",
                        dosageForm: "capsule",
                        dosageUnit: "40mg"
                    },
                    orderedDosage: "40mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0700"],
                    startDate: new Date("2025-11-26"),
                    stopDate: new Date("2025-12-15"),
                    physician: "Dr. Rachel Kim, MD",
                    specialInstructions: "Take 30 minutes before breakfast. Do not crush or chew capsule.",
                    status: "PENDING"
                }
            ],
            administeredMedicationRecords: []
        }
    },
    {
        patient: {
            patientId: "PT-2025-010",
            patientName: "Angela Rodriguez",
            ageSex: "49/F",
            currentPhysician: "Dr. David Wright, MD",
            currentWard: "Cardiology",
            currentRoom: "C-527",
            chiefComplaint: "Elevated cholesterol and blood pressure",
            diagnosis: "Hyperlipidemia, Stage 2 Hypertension, Obesity",
            allergies: "Nuts, Shellfish",
            lastAdministeredMedication: "N/A",
            lastTimeAdministered: "N/A",
            dosageGiven: "N/A",
            medicationOrders: [
                {
                    medicationOrderId: "MO-2025-010-001",
                    medicationDetails: {
                        medicationId: "MED-016",
                        medicationGenericName: "atorvastatin",
                        medicationBrandName: "Lipitor",
                        medicationClassification: "HMG-CoA Reductase Inhibitor (Statin)",
                        dosageForm: "tablet",
                        dosageUnit: "20mg"
                    },
                    orderedDosage: "20mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["2100"],
                    startDate: new Date("2025-11-26"),
                    stopDate: new Date("2025-12-15"),
                    physician: "Dr. David Wright, MD",
                    specialInstructions: "Take at bedtime. Monitor liver function. Avoid grapefruit juice.",
                    status: "PENDING"
                },
                {
                    medicationOrderId: "MO-2025-010-002",
                    medicationDetails: {
                        medicationId: "MED-017",
                        medicationGenericName: "lisinopril",
                        medicationBrandName: "Prinivil",
                        medicationClassification: "ACE Inhibitor",
                        dosageForm: "tablet",
                        dosageUnit: "20mg"
                    },
                    orderedDosage: "20mg",
                    orderedFrequency: "Once daily",
                    routeOfAdministration: "oral",
                    timeAdminSchedule: ["0800"],
                    startDate: new Date("2025-11-26"),
                    stopDate: new Date("2025-12-15"),
                    physician: "Dr. David Wright, MD",
                    specialInstructions: "Monitor BP and potassium levels. Take consistently at same time daily.",
                    status: "PENDING"
                }
            ],
            administeredMedicationRecords: []
        }
    }
];