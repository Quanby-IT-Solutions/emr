# EMR Flow

---

## Phase 1: Patient Entry & Encounter Creation

This is the start of any patient-facing process. The goal is to create an active `encounters` record.

### Scenario A: Scheduled Visit (Outpatient)

1. **Scheduling:** A Scheduler books an `appointments` record.
   - `[READ]` patients, `[READ]` staff, `[READ]` schedule_templates
   - `[WRITE]` appointments

2. **Arrival:** A Registrar finds the appointment.
   - `[READ]` appointments

3. **Check-in (START):** The Registrar checks the patient in.
   - `[WRITE]` encounters (Type: `OUTPATIENT`, Status: `ACTIVE`)
   - `[WRITE]` appointments (Updates status to `'Arrived'` and links `encounter_id`)

   ➡️ **Go to Phase 2b.**

### Scenario B: Unscheduled Visit (ER / Walk-in)

1. **Arrival:** The patient presents to the ER.

2. **Registration (START):** A Registrar creates an encounter.
   - `[READ]` patients (to search)
   - `[WRITE]` patients (if new)
   - `[WRITE]` encounters (Type: `EMERGENCY`, Status: `ACTIVE`)

   ➡️ **Go to Phase 2a.**

---

## Phase 2: Clinical Workflow

This is the main cycle of care.

### Phase 2a: Triage (ER Entry Point)

1. **Initial Assessment:** A Triage Nurse performs a rapid assessment.
   - `[READ]` encounters (to link documentation)

2. **Documentation:** The nurse writes a `TRIAGE_NOTE` and records initial vitals.
   - `[WRITE]` clinical_notes
   - `[WRITE]` flowsheet_observations (Multiple rows created from one form submission)

3. **Sort & Transfer:** The patient is moved to an ER bed.
   - `[WRITE]` encounters (Updates `current_location_id`)
   - `[WRITE]` locations (Updates bed status to `'Occupied'`)

### Phase 2b: Clinical Cycle (ER Treatment / Outpatient Visit)

1. **History & Allergy Review:** The Clinician and Nurse review the patient's record.
   - `[READ]` patient_history, `[READ]` allergies
   - `[WRITE]` patient_history (to add new conditions)
   - `[WRITE]` allergies (to add new allergies)

2. **Assessment & Documentation:** They perform a full assessment.
   - `[WRITE]` clinical_notes (e.g., H&P, Progress Note)
   - `[WRITE]` flowsheet_observations (Ongoing vitals)
   - `[WRITE]` care_plans & `[WRITE]` care_plan_tasks

3. **Ordering (CPOE):** The Clinician places orders.
   - `[WRITE]` orders (Status: `PLACED`)

4. **Order Fulfillment (Sub-Flows):**

   #### Sub-Flow: Medication Order

   1. **Pharmacist Queue:**
      - `[READ]` orders (where `order_type='MEDICATION'` and `status='PLACED'`)

   2. **Verification:** Pharmacist reviews the order against the patient's profile.
      - `[READ]` allergies, `[READ]` patient_history, `[READ]` formulary_items

   3. **Approve/Reject:** Pharmacist approves or rejects the order.
      - `[WRITE]` order_verifications
      - `[WRITE]` orders (Updates status to `'VERIFIED'` or `'CANCELLED'`)

   4. **Nurse MAR:** Nurse views the updated MAR.
      - `[READ]` orders (where `status='VERIFIED'`)

   5. **Administration:** Nurse administers the medication.
      - `[WRITE]` medication_administrations

   #### Sub-Flow: Lab/Radiology Order

   1. **Department Queue:** Lab Tech or Radiology Staff views their work queue.
      - `[READ]` orders (where `order_type='LAB'` or `'IMAGING'` and `status='PLACED'`)

   2. **Acknowledge:** The department acknowledges the order.
      - `[WRITE]` orders (Updates status to `'IN_PROGRESS'`)

   3. **Result Entry:** After the test, the result/report is entered (often via an interface).
      - `[WRITE]` lab_results
      - `[WRITE]` imaging_reports

   4. **Complete:** The order is marked as complete.
      - `[WRITE]` orders (Updates status to `'COMPLETED'`)

5. **Review & Re-assess:** The Clinician reviews new data.
   - `[READ]` lab_results, `[READ]` imaging_reports, `[READ]` flowsheet_observations

6. **Loop:** This cycle repeats.

### Phase 2c: The Admission Decision Point 🤔

After assessment, the Clinician makes a decision.

- **Decision 1:** Patient can go home. ➡️ **Go to Phase 3.**
- **Decision 2:** Patient requires hospitalization. ➡️ **Go to Phase 2d.**

### Phase 2d: Inpatient Admission & Transfer ➡️ 🛌

1. **Place Admission Order:** The Clinician places an admission order.
   - `[WRITE]` orders (Creates order with `order_type: ADMIT_INPATIENT`)

2. **Bed Assignment:** An Admitting Nurse or Registrar finds a bed.
   - `[READ]` locations (to find an `'AVAILABLE'` bed)

3. **Update Encounter:** The system is updated to reflect admission.
   - `[WRITE]` encounters (Updates type to `'INPATIENT'`, sets `admission_date_time`, updates `attending_provider_id`)

4. **Physical Transfer:** The patient is moved.
   - `[WRITE]` encounters (Updates `current_location_id`)
   - `[WRITE]` locations (Updates old bed to `'Cleaning'`, new bed to `'Occupied'`)

### Phase 2e: Inpatient Care Cycle 🏨

This is the daily loop for admitted patients.

1. **Ongoing Care:** Clinicians conduct daily rounds, and Nurses provide care.
   - `[WRITE]` clinical_notes (Daily Progress Notes)
   - `[WRITE]` medication_administrations (Scheduled meds)
   - `[WRITE]` flowsheet_observations (Scheduled vitals/I&O)
   - `[READ/WRITE]` care_plans (Updated as needed)
   - `[WRITE]` orders (For any new tests or treatments)

2. **Loop:** This daily cycle continues until the patient is medically cleared.

3. **Discharge Decision:** When ready ➡️ **Go to Phase 3.**

---

## Phase 3: Encounter Conclusion

This is the end of the patient's visit (from any path: ER, Outpatient, or Inpatient).

1. **Clinical Discharge:**
   - `[WRITE]` orders: The Clinician places the final "Discharge" order.
   - `[WRITE]` clinical_notes: The Clinician writes the `DISCHARGE_SUMMARY`.

2. **Administrative Discharge (END of Visit):**
   - `[WRITE]` encounters: Updates status to `"Discharged"`, sets `end_date_time`, and `discharge_disposition`.
   - `[WRITE]` locations: Updates the bed status to `"Available"` or `"Cleaning"`.

---

## Phase 4: Back-Office & Finalization

This is the system finish, triggered by the discharge.

### Path A: Health Information Management (HIM)

1. **Queue:** HIM Coder finds the chart.
   - `[READ]` encounters (where `status = 'DISCHARGED'`)

2. **Review:** Coder reviews all notes.
   - `[READ]` clinical_notes

3. **Deficiency Loop (if needed):**
   - `[WRITE]` chart_deficiencies (Flagging a missing signature)
   - `[READ]` chart_deficiencies (Clinician sees this in their inbox)
   - `[WRITE]` clinical_notes (Clinician signs the note)
   - `[WRITE]` chart_deficiencies (System or Coder marks as `'Resolved'`)

4. **Coding:** Coder assigns final diagnoses.
   - `[WRITE]` encounter_coding

5. **HIM Complete:**
   - `[WRITE]` encounters (Flags `is_coded = true`)

### Path B: Billing (RCM)

1. **Queue & Invoice Creation:** Biller finds the chart and compiles charges.
   - `[READ]` encounters, `[READ]` orders, `[READ]` charge_master_items
   - `[WRITE]` invoices & `[WRITE]` invoice_line_items

2. **Finalize & Payment:** After the chart is coded, the Biller sends the invoices and records payments.
   - `[READ]` encounters (to check `is_coded = true`)
   - `[WRITE]` invoices (Updates status to `'Issued'`)
   - `[WRITE]` payments (as they are received)

### Final Actions (Concurrent)

- **Patient Portal:** Finalized data becomes visible to the patient.
  - `[READ]` portal_release_policies (System checks rules)
  - `[READ]` lab_results, `[READ]` clinical_notes, etc. (Patient views data)

- **Auditing:** `[WRITE]` audit_logs (This happens on every read/write action throughout all phases).

---

## Phase 5: Concurrent & Exception Flows

These are critical flows that don't fit into the linear A-B-C path.

### Scenario: Appointment Cancellation

**Action:** Patient calls Scheduler, or Patient logs into portal.

**System:**
- `[WRITE]` appointments (Updates status to `'CANCELLED'`)
- `[WRITE]` audit_logs

### Scenario: Appointment No-Show

**Action:** Registrar marks the patient as a no-show after the appointment time passes.

**System:**
- `[WRITE]` appointments (Updates status to `'NO_SHOW'`)
- `[WRITE]` audit_logs

### Scenario: Break-Glass Access

**Action:** A Clinician needs emergency access to a chart that is not their patient's.

**System:**
- `[WRITE]` audit_logs (Action: `BREAK_GLASS`, `reason_for_access` is recorded)
- `[READ]` patients, `[READ]` clinical_notes, etc. (Access is granted)
- An alert is typically sent to an Auditor.

### Scenario: Patient Portal Bill Pay

1. **Action:** Patient logs into the portal.
   - `[READ]` users (to authenticate)

2. **View Bill:** Patient views their outstanding bills.
   - `[READ]` invoices (where `patient_id` matches and `status = 'ISSUED'`)

3. **Pay Bill:** Patient submits payment.
   - `[WRITE]` payments (A new payment record is created after gateway success)
   - `[WRITE]` invoices (Updates `amount_paid_in_cents` and `status`)
   - `[WRITE]` audit_logs
