import { z } from 'zod'

const MedicationOrderDetails = z.object({
  orderType: z.literal('MEDICATION'),
  medicationName: z.string().min(1, 'Medication name is required'),
  dose: z.string().min(1, 'Dose is required'),
  route: z.string().min(1, 'Route is required'),
  frequency: z.string().min(1, 'Frequency is required'),
})

const LabOrderDetails = z.object({
  orderType: z.literal('LAB'),
  testName: z.string().min(1, 'Test name is required'),
  specimen: z.string().optional(),
})

const ImagingOrderDetails = z.object({
  orderType: z.literal('IMAGING'),
  study: z.string().min(1, 'Study is required'),
  bodyPart: z.string().optional(),
  contrast: z.string().optional(),
})

const ProcedureOrderDetails = z.object({
  orderType: z.literal('PROCEDURE'),
  procedureName: z.string().min(1, 'Procedure name is required'),
  instructions: z.string().optional(),
})

const NursingOrderDetails = z.object({
  orderType: z.literal('NURSING'),
  instruction: z.string().min(1, 'Instruction is required'),
})

const AdmitInpatientOrderDetails = z.object({
  orderType: z.literal('ADMIT_INPATIENT'),
  unit: z.string().min(1, 'Unit is required'),
  reason: z.string().optional(),
})

const ReferralOrderDetails = z.object({
  orderType: z.literal('REFERRAL'),
  specialty: z.string().min(1, 'Specialty is required'),
  reason: z.string().optional(),
})

const DischargeOrderDetails = z.object({
  orderType: z.literal('DISCHARGE'),
  instructions: z.string().optional(),
})

export const OrderDetailsSchema = z.discriminatedUnion('orderType', [
  MedicationOrderDetails,
  LabOrderDetails,
  ImagingOrderDetails,
  ProcedureOrderDetails,
  NursingOrderDetails,
  AdmitInpatientOrderDetails,
  ReferralOrderDetails,
  DischargeOrderDetails,
])

export type OrderDetails = z.infer<typeof OrderDetailsSchema>
