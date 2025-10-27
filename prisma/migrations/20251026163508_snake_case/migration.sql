/*
  Warnings:

  - You are about to drop the `Allergy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarePlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CarePlanTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChargeMasterItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChartDeficiency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClinicalNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Encounter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EncounterCoding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlowsheetObservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormularyItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImagingReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvoiceLineItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LabResult` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationAdministration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Patient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientInsurance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientTransfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalReleasePolicy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Allergy" DROP CONSTRAINT "Allergy_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_providerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CarePlan" DROP CONSTRAINT "CarePlan_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CarePlan" DROP CONSTRAINT "CarePlan_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CarePlanTask" DROP CONSTRAINT "CarePlanTask_carePlanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChargeMasterItem" DROP CONSTRAINT "ChargeMasterItem_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChartDeficiency" DROP CONSTRAINT "ChartDeficiency_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChartDeficiency" DROP CONSTRAINT "ChartDeficiency_responsibleStaffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClinicalNote" DROP CONSTRAINT "ClinicalNote_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClinicalNote" DROP CONSTRAINT "ClinicalNote_cosignerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClinicalNote" DROP CONSTRAINT "ClinicalNote_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Department" DROP CONSTRAINT "Department_facilityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Encounter" DROP CONSTRAINT "Encounter_attendingProviderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Encounter" DROP CONSTRAINT "Encounter_currentLocationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Encounter" DROP CONSTRAINT "Encounter_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EncounterCoding" DROP CONSTRAINT "EncounterCoding_coderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EncounterCoding" DROP CONSTRAINT "EncounterCoding_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlowsheetObservation" DROP CONSTRAINT "FlowsheetObservation_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."FlowsheetObservation" DROP CONSTRAINT "FlowsheetObservation_recorderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ImagingReport" DROP CONSTRAINT "ImagingReport_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Invoice" DROP CONSTRAINT "Invoice_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvoiceLineItem" DROP CONSTRAINT "InvoiceLineItem_chargeMasterItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."InvoiceLineItem" DROP CONSTRAINT "InvoiceLineItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LabResult" DROP CONSTRAINT "LabResult_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Location" DROP CONSTRAINT "Location_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_nurseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_staffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_witnessId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_placerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderVerification" DROP CONSTRAINT "OrderVerification_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderVerification" DROP CONSTRAINT "OrderVerification_pharmacistId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Patient" DROP CONSTRAINT "Patient_portalUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientHistory" DROP CONSTRAINT "PatientHistory_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientInsurance" DROP CONSTRAINT "PatientInsurance_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientTransfer" DROP CONSTRAINT "PatientTransfer_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientTransfer" DROP CONSTRAINT "PatientTransfer_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientTransfer" DROP CONSTRAINT "PatientTransfer_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientTransfer" DROP CONSTRAINT "PatientTransfer_transportStaffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PortalRequest" DROP CONSTRAINT "PortalRequest_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ScheduleTemplate" DROP CONSTRAINT "ScheduleTemplate_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ScheduleTemplate" DROP CONSTRAINT "ScheduleTemplate_providerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Staff" DROP CONSTRAINT "Staff_primaryDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Staff" DROP CONSTRAINT "Staff_userId_fkey";

-- DropTable
DROP TABLE "public"."Allergy";

-- DropTable
DROP TABLE "public"."Appointment";

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."CarePlan";

-- DropTable
DROP TABLE "public"."CarePlanTask";

-- DropTable
DROP TABLE "public"."ChargeMasterItem";

-- DropTable
DROP TABLE "public"."ChartDeficiency";

-- DropTable
DROP TABLE "public"."ClinicalNote";

-- DropTable
DROP TABLE "public"."Department";

-- DropTable
DROP TABLE "public"."Encounter";

-- DropTable
DROP TABLE "public"."EncounterCoding";

-- DropTable
DROP TABLE "public"."Facility";

-- DropTable
DROP TABLE "public"."FlowsheetObservation";

-- DropTable
DROP TABLE "public"."FormularyItem";

-- DropTable
DROP TABLE "public"."ImagingReport";

-- DropTable
DROP TABLE "public"."Invoice";

-- DropTable
DROP TABLE "public"."InvoiceLineItem";

-- DropTable
DROP TABLE "public"."LabResult";

-- DropTable
DROP TABLE "public"."Location";

-- DropTable
DROP TABLE "public"."MedicationAdministration";

-- DropTable
DROP TABLE "public"."Order";

-- DropTable
DROP TABLE "public"."OrderVerification";

-- DropTable
DROP TABLE "public"."Patient";

-- DropTable
DROP TABLE "public"."PatientHistory";

-- DropTable
DROP TABLE "public"."PatientInsurance";

-- DropTable
DROP TABLE "public"."PatientTransfer";

-- DropTable
DROP TABLE "public"."Payment";

-- DropTable
DROP TABLE "public"."PortalReleasePolicy";

-- DropTable
DROP TABLE "public"."PortalRequest";

-- DropTable
DROP TABLE "public"."ScheduleTemplate";

-- DropTable
DROP TABLE "public"."Staff";

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "contactPhone" TEXT,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT,
    "name" TEXT NOT NULL,
    "type" "DepartmentType",

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT,
    "unit" TEXT NOT NULL,
    "roomNumber" TEXT,
    "bedNumber" TEXT,
    "status" "LocationStatus",

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jobTitle" TEXT,
    "primaryDepartmentId" TEXT,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "mrn" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "contactPhone" TEXT,
    "email" TEXT,
    "address" JSONB,
    "portalUserId" TEXT,
    "isVipOrConfidential" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_insurance" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "groupNumber" TEXT,
    "priority" "PatientInsurancePriority" NOT NULL,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "patient_insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encounters" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "EncounterType" NOT NULL,
    "status" "EncounterStatus" NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "admissionDateTime" TIMESTAMP(3),
    "endDateTime" TIMESTAMP(3),
    "currentLocationId" TEXT,
    "attendingProviderId" TEXT,
    "dischargeDisposition" TEXT,
    "codingStatus" "CodingStatus",

    CONSTRAINT "encounters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_transfer" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "fromLocationId" TEXT,
    "toLocationId" TEXT NOT NULL,
    "transferDateTime" TIMESTAMP(3) NOT NULL,
    "transportStaffId" TEXT,

    CONSTRAINT "patient_transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinical_notes" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "noteType" "ClinicalNoteType" NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "status" "ClinicalNoteStatus" NOT NULL,
    "isSensitive" BOOLEAN NOT NULL,
    "signedAt" TIMESTAMP(3),
    "cosignerId" TEXT,

    CONSTRAINT "clinical_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "placerId" TEXT NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "details" JSONB,
    "status" "OrderStatus" NOT NULL,
    "priority" "OrderPriority" NOT NULL,
    "clinicalIndication" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_administrations" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,
    "administrationTime" TIMESTAMP(3) NOT NULL,
    "status" "MedAdminStatus" NOT NULL,
    "reasonForOmission" TEXT,
    "witnessId" TEXT,

    CONSTRAINT "medication_administrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_history" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "HistoryType" NOT NULL,
    "icd10Code" TEXT,
    "entry" TEXT NOT NULL,
    "status" "HistoryStatus" NOT NULL,
    "onsetDate" TIMESTAMP(3),

    CONSTRAINT "patient_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergies" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "substance" TEXT NOT NULL,
    "reaction" TEXT,
    "severity" "AllergySeverity",
    "status" "AllergyStatus" NOT NULL,

    CONSTRAINT "allergies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plans" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "nursingDiagnosis" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "care_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "care_plan_tasks" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" TEXT,
    "isCompleted" BOOLEAN NOT NULL,

    CONSTRAINT "care_plan_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flowsheet_observations" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "recorderId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "observationType" "ObservationType" NOT NULL,
    "value" TEXT NOT NULL,
    "unit" "ObservationUnit",

    CONSTRAINT "flowsheet_observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lab_results" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "loincCode" TEXT,
    "analyteName" TEXT,
    "value" TEXT,
    "unit" TEXT,
    "referenceRange" TEXT,
    "flag" TEXT,
    "status" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3),

    CONSTRAINT "lab_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imaging_reports" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "accessionNumber" TEXT,
    "reportText" TEXT,
    "status" TEXT NOT NULL,
    "viewerUrl" TEXT,

    CONSTRAINT "imaging_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_verifications" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "pharmacistId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,
    "status" "OrderVerificationStatus",
    "notes" TEXT,

    CONSTRAINT "order_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulary_items" (
    "id" TEXT NOT NULL,
    "genericName" TEXT NOT NULL,
    "brandName" TEXT,
    "rxnormCode" TEXT,
    "isRestricted" BOOLEAN NOT NULL,
    "notes" TEXT,

    CONSTRAINT "formulary_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_templates" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "name" TEXT,
    "timeSlots" JSONB,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),

    CONSTRAINT "schedule_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL,
    "appointmentType" TEXT,
    "encounterId" TEXT,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charge_master_items" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "description" TEXT,
    "priceInCents" INTEGER NOT NULL,
    "departmentId" TEXT,
    "isActive" BOOLEAN NOT NULL,

    CONSTRAINT "charge_master_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "encounterId" TEXT,
    "status" "InvoiceStatus" NOT NULL,
    "totalAmountInCents" INTEGER NOT NULL,
    "amountPaidInCents" INTEGER NOT NULL,
    "issueDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_line_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "chargeMasterItemId" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPriceInCents" INTEGER NOT NULL,
    "totalPriceInCents" INTEGER NOT NULL,

    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_deficiencies" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "description" TEXT,
    "responsibleStaffId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "chart_deficiencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encounter_coding" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT NOT NULL,
    "coderId" TEXT NOT NULL,
    "icd10Code" TEXT NOT NULL,
    "isPrincipalDiagnosis" BOOLEAN NOT NULL,

    CONSTRAINT "encounter_coding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_release_policies" (
    "id" TEXT NOT NULL,
    "dataType" "PortalDataType" NOT NULL,
    "releaseDelayHours" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL,
    "notes" TEXT,

    CONSTRAINT "portal_release_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portal_requests" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "requestType" "PortalDataType" NOT NULL,
    "status" "PortalRequestStatus" NOT NULL,
    "requestedDataId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "portal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "actionType" "AuditActionType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "reasonForAccess" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "staff_userId_key" ON "staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "patients_mrn_key" ON "patients"("mrn");

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_primaryDepartmentId_fkey" FOREIGN KEY ("primaryDepartmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_portalUserId_fkey" FOREIGN KEY ("portalUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_insurance" ADD CONSTRAINT "patient_insurance_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_currentLocationId_fkey" FOREIGN KEY ("currentLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounters" ADD CONSTRAINT "encounters_attendingProviderId_fkey" FOREIGN KEY ("attendingProviderId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_transfer" ADD CONSTRAINT "patient_transfer_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_transfer" ADD CONSTRAINT "patient_transfer_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_transfer" ADD CONSTRAINT "patient_transfer_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_transfer" ADD CONSTRAINT "patient_transfer_transportStaffId_fkey" FOREIGN KEY ("transportStaffId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_cosignerId_fkey" FOREIGN KEY ("cosignerId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_placerId_fkey" FOREIGN KEY ("placerId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_administrations" ADD CONSTRAINT "medication_administrations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_administrations" ADD CONSTRAINT "medication_administrations_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medication_administrations" ADD CONSTRAINT "medication_administrations_witnessId_fkey" FOREIGN KEY ("witnessId") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_history" ADD CONSTRAINT "patient_history_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plans" ADD CONSTRAINT "care_plans_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "care_plan_tasks" ADD CONSTRAINT "care_plan_tasks_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "care_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flowsheet_observations" ADD CONSTRAINT "flowsheet_observations_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flowsheet_observations" ADD CONSTRAINT "flowsheet_observations_recorderId_fkey" FOREIGN KEY ("recorderId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lab_results" ADD CONSTRAINT "lab_results_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imaging_reports" ADD CONSTRAINT "imaging_reports_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_verifications" ADD CONSTRAINT "order_verifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_verifications" ADD CONSTRAINT "order_verifications_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_templates" ADD CONSTRAINT "schedule_templates_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_templates" ADD CONSTRAINT "schedule_templates_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charge_master_items" ADD CONSTRAINT "charge_master_items_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_line_items" ADD CONSTRAINT "invoice_line_items_chargeMasterItemId_fkey" FOREIGN KEY ("chargeMasterItemId") REFERENCES "charge_master_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_deficiencies" ADD CONSTRAINT "chart_deficiencies_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chart_deficiencies" ADD CONSTRAINT "chart_deficiencies_responsibleStaffId_fkey" FOREIGN KEY ("responsibleStaffId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounter_coding" ADD CONSTRAINT "encounter_coding_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "encounters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encounter_coding" ADD CONSTRAINT "encounter_coding_coderId_fkey" FOREIGN KEY ("coderId") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portal_requests" ADD CONSTRAINT "portal_requests_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
