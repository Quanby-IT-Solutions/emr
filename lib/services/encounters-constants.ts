export const DISCHARGE_STEPS = [
  'Discharge Summary',
  'Medications Explained',
  'Home Instructions',
  'Follow-up Booked',
  'PhilHealth Clearance',
  'Pharmacy Clearance',
  'Final Vitals',
  'Wheeled Out',
] as const

export type DischargeStep = typeof DISCHARGE_STEPS[number]
