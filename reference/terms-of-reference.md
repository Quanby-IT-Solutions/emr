# Terms of Reference

## Electronic Medical Record (EMR)

---

## Section 1: Roles and Functions

- **System Admin:** Manages configuration, users, roles, and feature flags. Has no clinical write access.
- **Registrar:** Creates and updates patient records and encounters, processes transfers, and manages administrative discharge.
- **Clinician:** Authors and signs clinical notes, places orders (CPOE), views results, and manages patient problem and allergy lists.
- **Nurse:** Records vitals and flowsheets, manages care plans, and administers medications and treatments (MAR/TAR).
- **Pharmacist:** Verifies medication orders for clinical appropriateness and manages formulary notes.
- **Lab Technologist:** (Optional) Performs manual result entry and validation if the primary LIS is unavailable.
- **Radiology Staff:** Attaches imaging reports and links to PACS, marking critical results for attention.
- **Scheduler:** Manages clinic templates, appointment slots, bookings, and patient check-ins.
- **Biller:** Manages charges, creates invoices, records payments, and issues receipts.
- **HIM Coder:** Manages chart deficiencies, assigns ICD-10 codes, and prepares data for export.
- **Patient / Proxy:** Has secure, read-only access to released portions of their medical record.
- **Auditor/Privacy Officer:** Has read-all access and can view detailed audit logs of system activity.
- **Break-Glass Clinician:** Can gain emergency, broad read-access to a patient chart with a justified reason, triggering a special audit.

---

## Section 2: Core EMR Modules

### ADT (Admission, Discharge, Transfer)

**Purpose:** To centrally manage a patient's identity and visit lifecycle by creating and updating encounters, tracking bed and room occupation, coordinating transfers, and completing discharges.

**Users:** Registrars, Nurses, Clinicians, Administrators.

**Core Data:** Patient Profile (MRN), Encounter, Location/Bed, Disposition.

**Key Workflows:** Register/find patient, create encounter (OPD/ER/IPD), transfer patient, discharge patient.

**Validations/Rules:** Unique MRN, no overlapping inpatient encounters, discharge requires clinical clearance.

**Key Integrations:** Scheduling (check-in creates encounter), Billing (encounter events trigger billing), Clinical Modules (all data tied to an encounter), HIM (discharge triggers deficiency analysis).

**Key Performance Indicators (KPIs):** Average patient registration time, bed turnover rate, patient identification errors, LWBS (Left Without Being Seen) rate for ER.

#### User Stories

**Standard User Stories**

- As a Registrar, I want to quickly search for an existing patient by multiple identifiers so that I can avoid creating duplicate records.
- As a Ward Nurse, I want to view a real-time bed-map of my unit so that I can see which beds are occupied, available, or pending cleaning.
- As a Ward Nurse, I want to electronically process a patient transfer so that the system location is updated instantly.
- As a Clinician, I want to complete the discharge order and specify the disposition so that the care team knows the patient's final status.

**Rare/Complex Scenario User Stories**

- As an ER Registrar, I want to register an unidentified trauma patient as 'John Doe' with temporary identifiers so that care and ordering can begin immediately while awaiting identification.
- As a NICU Nurse, I want to register newborn twins (e.g., 'Babyboy A Smith') with clear temporary names linked to the mother's record so that they can be distinguished before they are officially named.
- As a Registrar, I want the ability to reverse a recent discharge and change the patient's status to 'Expired in Facility' if a patient passes away moments after being discharged but before leaving the hospital, so the record is legally accurate.
- As a Nursing Supervisor, during a facility emergency like a fire, I want to perform a 'bulk transfer' of all patients from one unit to another so that I can update dozens of patient locations in one action.
- As a Registrar, I want to place a 'Confidential' or 'VIP' flag on a patient's record so that their name is masked on general hospital lists and access is strictly audited.

---

### Clinical Documentation

**Purpose:** To allow clinicians and nurses to author, sign, and revise clinical notes using structured templates, maintaining a full version history and a legally reliable record.

**Users:** Clinicians, Nurses, HIM Staff, Patients.

**Core Data:** Note (Type, Content, Author, Signature), Templates.

**Key Workflows:** Select template, write note, link context (problems, orders), sign note, create amendments.

**Validations/Rules:** Required sections must be completed, signing locks content, cosignature required for trainees.

**Key Integrations:** Problems & Allergies (pulling data into notes), CPOE (linking orders to notes), LIS/RIS (embedding results), Patient Portal (releasing signed notes).

**Key Performance Indicators (KPIs):** Note signature delinquency rate, template usage analytics, time spent on documentation.

#### User Stories

**Standard User Stories**

- As a Clinician, I want to choose from a list of pre-defined note templates (e.g., H&P, SOAP Progress Note) so that I can document efficiently.
- As a Clinician, I want to sign my note with my password, which legally locks it, so that the integrity of the medical record is maintained.
- As a Resident (Trainee), I want to route my completed note to my supervising physician for the required cosignature.
- As a Clinician, I want to create an addendum to a signed note if I need to add or clarify information.

**Rare/Complex Scenario User Stories**

- As a Clinician, during a planned EMR downtime, I want to use a specific downtime form to input critical notes that will be scanned and attached later, so that continuity of care is maintained.
- As a Clinician, if I try to open a note that another user is actively editing, I want to be notified and given a read-only copy, so that we avoid conflicting edits.
- As a Psychiatrist, I want to flag my consultation note as 'Sensitive' so that it is hidden from general view and requires specific privileges to access.
- As an HIM Manager, when receiving a court order, I need the ability to seal or expunge a specific note from a patient's record to comply with legal mandates.
- As a Clinician, I want to document a 'telephone encounter' with a patient, which captures the key advice given, so that there is a record of care provided outside of a physical visit.

---

### CPOE (Computerized Physician Order Entry)

**Purpose:** To provide a safe, standardized way for clinicians to place orders for medications, labs, imaging, and other tasks, tracking status from placement through completion.

**Users:** Clinicians, Nurses, Pharmacists, Ancillary Departments.

**Core Data:** Order (Type, Priority, Status), Order Sets.

**Key Workflows:** Select order/order set, complete parameters, submit request, monitor status.

**Validations/Rules:** Allergy blocking, dose range checks, required indication for certain orders.

**Key Integrations:** Clinical Documentation (placing orders from notes), Problems & Allergies (for CDS checks), Pharmacy Verify (queueing meds for verification), LIS/RIS (sending orders), Billing (generating charges).

**Key Performance Indicators (KPIs):** Percentage of orders entered via CPOE, alert fatigue rate (overridden alerts), order turnaround time (TAT).

#### User Stories

**Standard User Stories**

- As a Clinician, I want to be alerted if I try to order a medication to which the patient has a documented allergy.
- As a Clinician, I want to use pre-built Order Sets for common conditions to place multiple related orders with one click.
- As a Clinician, I want to see dose recommendations based on the patient's weight and kidney function.
- As a Nurse, I want to view a list of all active, pending, and completed orders for my patient.

**Rare/Complex Scenario User Stories**

- As an Intensivist, during a 'Code Blue', I want a nurse to be able to document my verbal order for Epinephrine in real-time, which I can sign off on immediately after the event, so the record is accurate without delaying care.
- As an ER Physician, I want to activate a 'Massive Transfusion Protocol' order set, which notifies the blood bank immediately and creates standing orders for blood products.
- As an Oncologist, I want to place a chemotherapy order that triggers a mandatory 'hard stop' requiring me to confirm the patient's BSA and link to a signed consent form.
- As a Clinician, I want to place an order for a non-formulary medication and be required to fill out a justification form that is automatically routed for approval.
- As a Clinician, I want to place a "tapering dose" order for a steroid in a single, structured order so that the complex schedule is clear and easy for nursing to follow.

---

### Nursing Module & MAR/TAR

**Purpose:** To support end-to-end bedside care by recording assessments, managing care plans, scheduling and documenting treatments, and maintaining an accurate Medication/Treatment Administration Record.

**Users:** Nurses, Clinicians, Pharmacists.

**Core Data:** Care Plan, Medication Administration entries, Intake/Output, Risk Scales.

**Key Workflows:** Complete assessment, update care plan, administer medications/treatments, document PRN reasons/response, shift handoff.

**Validations/Rules:** "Five rights" of medication safety, required reason for late/omitted doses, double-verification for high-alert meds.

**Key Integrations:** CPOE (verified orders appear on MAR), Pharmacy Verify (status visible on MAR), Vitals & Flowsheets (data informs assessments), Clinical Documentation (activities summarized in notes).

**Key Performance Indicators (KPIs):** Medication administration error rate, barcode scanning compliance rate, timeliness of administrations.

#### User Stories

**Standard User Stories**

- As a Nurse, I want to see a clear, timeline-based view of the MAR showing all medications due for my patient during my shift.
- As a Nurse, I want to scan the patient's wristband and the medication's barcode so that the system confirms the "five rights" before I administer.
- As a Nurse, I want to document that a dose was "held" or "refused by patient" and be prompted to enter a reason.
- As a Nurse, I want to record the patient's response to a PRN (as-needed) pain medication to assess its effectiveness.

**Rare/Complex Scenario User Stories**

- As a Nurse, when my barcode scanner fails, I want a clear override workflow that requires a second nurse to witness and co-sign the administration on the screen.
- As a Nurse, I need to document the administration of a "partial dose" (e.g., patient vomited) with a note explaining the circumstances.
- As a Critical Care Nurse, I need to document a continuous IV drip titration on a minute-by-minute flowsheet linked to the MAR to precisely record dose changes.
- As a Nurse, when a patient brings in their own medications, I want a process to have pharmacy identify them and document their administration on the MAR as "Patient's Own Meds."
- As a Nurse, when a medication dose is interrupted (e.g., IV infusion paused for radiology), I want to be able to pause and restart the administration clock on the MAR.

---

### Problems & Allergies

**Purpose:** To maintain a longitudinal list of a patient's health problems, diagnoses, allergies, and adverse reactions to inform decisions across all visits.

**Users:** Clinicians, Nurses, Pharmacists.

**Core Data:** Problem (Term, Code, Status), Allergy (Substance, Reaction, Severity).

**Key Workflows:** Add/update problems, record/verify allergies, ensure safety banners reflect critical warnings.

**Validations/Rules:** No duplicate active problems, severe allergies trigger system-wide warnings.

**Key Integrations:** CPOE (triggers allergy/problem-based alerts), Clinical Documentation (problem list is pulled into notes), HIM (problems inform ICD-10 coding), Patient Portal (patients view their lists).

**Key Performance Indicators (KPIs):** Percentage of patients with a verified allergy list, consistency of problem list documentation.

#### User Stories

**Standard User Stories**

- As a Clinician, I want to add a new problem to the patient's list using a standardized terminology search (e.g., ICD-10).
- As a Clinician, I want to mark a problem as "resolved" when it is no longer active.
- As a Nurse, I want to record a new allergy reported by the patient, including the substance, reaction, and severity.
- As any user, I want to see a prominent, color-coded banner at the top of the chart for severe allergies.

**Rare/Complex Scenario User Stories**

- As an Allergist, after a drug challenge, I want to "de-label" a penicillin allergy, moving it to a "historical/refuted" section with a note, so the patient can safely receive it in the future.
- As a Pharmacist, I want to document an allergy to a non-active ingredient (e.g., 'red dye') and have the system alert on any medication containing it.
- As a Clinician, I want to mark a problem as "Family History" so it appears for risk assessment but is distinct from the patient's own problems.
- As a Clinician, when a patient disputes a diagnosis, I want to mark it as "Entered in Error" (with an audit trail) rather than deleting it.

---

### Vitals & Flowsheets

**Purpose:** To provide a structured, time-based record of observations (temperature, BP, etc.) and calculate early-warning scores to identify patient deterioration.

**Users:** Nurses, Clinicians, Quality Teams.

**Core Data:** Observation (Code, Value, Unit, Time), Scores (e.g., NEWS).

**Key Workflows:** Record vitals, validate ranges, calculate scores, trigger alerts.

**Validations/Rules:** Valid/consistent units (UCUM), confirmation for out-of-range values, scoring rules match protocol.

**Key Integrations:** Device Integration (pulling from monitors), Nursing Module (part of assessment), Clinical Documentation (embedding vitals), CDS (triggering alerts like sepsis warnings).

**Key Performance Indicators (KPIs):** Timeliness of vital sign documentation, % of vitals from integrated devices, false-positive rate for EWS alerts.

#### User Stories

**Standard User Stories**

- As a Nurse, I want to enter a full set of vital signs on a single screen for a specific time.
- As a Nurse, I want the system to flag an out-of-range value and ask me to confirm it to prevent data entry errors.
- As a Clinician, I want to view a graphical trend of a patient's blood pressure over the last 48 hours.
- As the System, I want to automatically calculate a NEWS (National Early Warning Score) every time new vitals are entered.

**Rare/Complex Scenario User Stories**

- As a Nurse, when a patient has multiple monitoring devices (e.g., arterial line and cuff), I want to document both readings and specify the source for each.
- As a Nurse, for a patient with a high fever on a cooling blanket, I want a flowsheet to document both the patient's core temperature and the device's temperature setting side-by-side.
- As a Clinician, when a flowsheet value seems erroneous, I want to view the audit log showing who entered it, when, and if it was modified.
- As a Nurse, I need to document a non-numeric value, such as "Unable to obtain" for a BP reading on an agitated patient, and be prompted for a reason.

---

### LIS (Laboratory Results—Results-Only)

**Purpose:** To bring finalized laboratory data into the patient chart, allowing clinicians to quickly see structured values and any critical flags.

**Users:** Clinicians, Nurses, Lab Staff.

**Core Data:** Structured Observations (Analyte, Value, Range, Flag), Diagnostic Report.

**Key Workflows:** Ingest results, map to patient, post data, highlight criticals, notify team for acknowledgment.

**Validations/Rules:** Reliable patient matching, required acknowledgment for critical values, standardized codes (LOINC, UCUM).

**Key Integrations:** External LIS (primary data source), CPOE (results linked to orders), Clinical Documentation (results referenced in notes), Patient Portal (results released to patients).

**Key Performance Indicators (KPIs):** TAT from lab collection to result in chart, rate of critical value acknowledgment.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As a Clinician, I want to see lab results in a flowsheet view, with abnormal values highlighted in red.
- As a Clinician, I want to receive an inbox notification for any new critical lab result for my patients.
- As a Clinician, I must be able to electronically acknowledge that I have seen a critical result for the audit trail.
- As a Clinician, when a lab result is corrected, I want the original result to be struck through (but visible) and the new result displayed prominently with a reason for the change.
- As a Clinician, I want the system to highlight a "delta check" warning when a patient's lab value changes unexpectedly, alerting me to a possible lab error or clinical change.

---

### RIS/PACS Link (Imaging Reports & Viewer)

**Purpose:** To attach radiology and imaging reports to the patient chart and provide a secure link to an external PACS viewer for image review.

**Users:** Radiology Staff, Clinicians, Quality Teams.

**Core Data:** Imaging Report (Narrative, Flag, Accession #), Viewer URL.

**Key Workflows:** Attach/publish report, link to encounter, flag criticals, trigger notification for acknowledgment.

**Validations/Rules:** Critical findings require acknowledgment, secure handling of viewer links.

**Key Integrations:** External RIS/PACS (source of reports/images), CPOE (reports linked to orders), Clinical Documentation (reports viewable in chart), Patient Portal (reports released to patients).

**Key Performance Indicators (KPIs):** Report TAT (exam to final report), rate of critical finding acknowledgment.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As a Clinician, I want to view the finalized radiology report directly within the EMR chart.
- As a Clinician, I want to click a "View Images" button that securely launches the external PACS viewer without a separate login.
- As a Clinician, I want an inbox notification for any imaging report with a critical finding.
- As a Radiologist, I want to create a preliminary report for a critical finding that is immediately visible to the ER, which I can later finalize into a full report.
- As a Lab Manager, when a specimen is received for a "John Doe" patient, I want to enter results against their temporary ID and have the system automatically link those results to the correct record once the patient is identified.

---

### Pharmacy Verify (Basic)

**Purpose:** To add a clinical safety check to medication orders, reviewing for appropriateness, interactions, and dosing before making them available for administration.

**Users:** Pharmacists, Clinicians, Nurses.

**Core Data:** Verification Record (Status, Pharmacist, Time, Notes), Formulary Items.

**Key Workflows:** Work through queue, check dosing/interactions, approve or return order, ensure dual verification for high-alert meds.

**Validations/Rules:** Double-checks for high-risk meds, adherence to renal/pediatric dosing limits, justification for non-formulary requests.

**Key Integrations:** CPOE (receives orders for verification), Nursing/MAR (only verified meds appear on MAR), Allergies & Problems (provides context for checks).

**Key Performance Indicators (KPIs):** Verification TAT, number of clinical interventions, non-formulary usage rate.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As a Pharmacist, I want to see a prioritized queue of unverified medication orders so I can work on STAT orders first.
- As a Pharmacist, I want to "verify" an order to approve it, or "reject" it back to the provider with a required note explaining the reason.
- As a Pharmacist, I want to perform a "prospective verification" for a planned surgery patient, reviewing and approving their post-op orders a day before they are activated.
- As a Pharmacist, when verifying a high-risk medication like insulin, the system must require a second, independent pharmacist to also review and electronically co-sign the verification.
- As a Pharmacist, when a patient's kidney function declines, I want the system to alert me to all active renally-dosed medications, prompting me to re-evaluate them.

---

### Scheduling (Outpatient)

**Purpose:** To enable clinics to define templates, generate bookable time slots, and manage patient appointments with reminders and on-arrival check-ins.

**Users:** Schedulers, Clinicians, Patients, Registrars.

**Core Data:** Schedule, Slots, Appointments.

**Key Workflows:** Set up templates, book/reschedule appointments, send reminders, check-in patient.

**Validations/Rules:** No double-booking, respect buffer times, apply no-show policies.

**Key Integrations:** ADT (check-in creates outpatient encounter), Patient Portal (patients view/request appointments), Billing (status can trigger billing).

**Key Performance Indicators (KPIs):** Clinic utilization rate, appointment no-show rate, patient wait times.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As a Scheduler, I want to create a recurring schedule template for a provider to generate available slots for the next 6 months.
- As a Registrar, when a patient arrives, I want to find their appointment and click "Check-In," which automatically creates their encounter.
- As a Scheduler, I want to book a single "multi-resource" appointment that reserves a time with the oncologist, the infusion chair, and the nurse simultaneously.
- As a Scheduler, I want to add a patient to a "wait list" for a fully booked clinic, so if there is a cancellation, the system can alert me to offer them the open slot.

---

### Billing (Starter RCM)

**Purpose:** To provide a minimal financial backbone by capturing charges, creating invoices, recording payments, and producing receipts for reconciliation.

**Users:** Billers, Finance Staff, Clinicians, Patients.

**Core Data:** Charge Items, Invoices, Payments.

**Key Workflows:** Add charges, compile invoice, accept payments, generate receipt, reconcile.

**Validations/Rules:** Price lists are scoped, posted payments cannot be hard-deleted (must be voided/reversed), optional tax handling.

**Key Integrations:** ADT (encounter is the container for charges), CPOE (orders can auto-generate charges), Patient Portal (patients can view/pay bills).

**Key Performance Indicators (KPIs):** Days in accounts receivable, charge capture rate, payment collection rate.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As a Biller, I want the system to automatically suggest charges based on orders placed and procedures documented during an encounter.
- As a Biller, I want to generate a consolidated invoice for a patient's visit that lists all charges.
- As a Biller, I want to record a payment received from a patient and apply it to their invoice.
- As a Biller, when a patient declares bankruptcy, I want to place their account into a special financial class that halts all automated billing reminders and flags the account for review.
- As a Biller, I need to process a payment from a charity organization on behalf of a patient and apply it to their outstanding invoices.

---

### HIM (Lite)

**Purpose:** To ensure charts are complete and minimally coded by tracking missing elements like unsigned notes and allowing coders to assign basic ICD-10 diagnoses.

**Users:** HIM Coders, Clinicians, Administrators.

**Core Data:** Deficiency, Encounter Codes (ICD-10).

**Key Workflows:** Flag deficiencies on discharge, assign codes, export coding file.

**Validations/Rules:** Every coded encounter requires a principal diagnosis, coding changes restricted after financial period close.

**Key Integrations:** ADT (discharge triggers deficiency analysis), Clinical Documentation (source for deficiency tracking), Problems & Allergies (guides the coder).

**Key Performance Indicators (KPIs):** Discharged Not Final Coded (DNFC) rate, chart delinquency rate, coding accuracy.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As the System, upon patient discharge, I want to automatically analyze the chart and create a deficiency for any missing signature.
- As an HIM Coder, I want to see a work queue of all discharged encounters that need coding.
- As an HIM Coder, I want to assign a Principal Diagnosis and Secondary Diagnoses using an ICD-10 search tool.
- As a Clinician, I want to see a list of my charts with deficiencies in my inbox so I can easily complete them.
- As an HIM Coder, when I see conflicting diagnoses, I want to flag the chart and route it back to the attending physician with a "query" requesting clarification.

---

### Patient Portal (Read-Only)

**Purpose:** To give individuals secure, read-only access to view their health information, including demographics, visit summaries, results, medications, and appointments.

**Users:** Patients, Authorized Proxies, Privacy Officers.

**Core Data:** Release Policies, patient-facing views of clinical data.

**Key Workflows:** Verify identity, link account, view released items.

**Validations/Rules:** Release delays are honored (e.g., labs after 72h), proxy access rules enforced, sensitive notes may be excluded.

**Key Integrations:** All Clinical Modules (surfaces data), Scheduling (displays appointments), Billing (displays statements), ADT (uses demographics for identity verification).

**Key Performance Indicators (KPIs):** Patient portal adoption rate, feature usage analytics, patient satisfaction scores.

#### User Stories

**Standard & Rare/Complex Scenario User Stories**

- As a Patient, I want to securely register for a portal account and link it to my medical record.
- As a Patient, I want to view and download my lab results after they have been released by the hospital's policy.
- As a Patient, I want to see a list of my current medications and allergies.
- As a Parent (Proxy), I want to be able to securely switch between my own portal account and my child's account.
- As a Patient (a teenager), I want a "confidential" portal account where I can view information related to sensitive services that is not visible to my parents who have proxy access.
- As a Patient Portal Admin, upon notification of a patient's death, I need to deactivate their portal access to prevent unauthorized logins.

---

## Section 3: Definition of Terms (Glossary)

| Term | Definition |
|------|-----------|
| **ADT** | Admission, Discharge, Transfer. The workflow managing visits and bed moves. |
| **ALOS / LWBS** | Average Length of Stay / Left Without Being Seen (ER). |
| **Allergy/Adverse Reaction** | Recorded sensitivity and reaction history. |
| **Audit Trail** | Immutable record of who changed/viewed what and when. |
| **Break-Glass** | Emergency override access with extra auditing. |
| **CDS** | Clinical Decision Support (rules/alerts, e.g., allergy or dose checks). |
| **Charge / Invoice / Receipt** | Financial items (what to bill / statement / proof of payment). |
| **CPOE** | Computerized Physician Order Entry. Electronic ordering. |
| **Deficiency** | A missing chart requirement (e.g., unsigned note). |
| **Diagnostic Report** | A finalized result report (lab summary, imaging read). |
| **Encounter** | A single visit/episode of care (OPD/ER/IPD). |
| **Flowsheet** | Tabular timeline for vitals/observations. |
| **Formulary** | The hospital's internal list of allowed medications. |
| **HIM** | Health Information Management (chart completion & coding). |
| **ICD-10** | International Classification of Diseases, 10th Revision. Diagnosis coding standard. |
| **KPI** | Key Performance Indicator. |
| **LIS / RIS** | Laboratory Information System / Radiology Information System. |
| **LOINC** | Logical Observation Identifiers Names and Codes. Lab test code set. |
| **MAR / TAR** | Medication Administration Record / Treatment Administration Record. |
| **MPI** | Master Patient Index (identity & duplicates handling). |
| **OPD / ER / IPD** | Outpatient Department / Emergency Room / In-Patient Department. |
| **PACS / DICOM** | Picture Archiving and Communication System / Imaging file standard. |
| **Problem List** | Longitudinal list of patient conditions/diagnoses. |
| **RBAC** | Role-Based Access Control. |
| **Release Policy** | Rules for when data becomes visible to patients. |
| **Result Flag (Critical/Abnormal)** | Highlight for urgent results. |
| **RxNorm** | Standardized nomenclature for clinical drugs. |
| **TAT** | Turnaround Time (e.g., order-to-result). |
| **UCUM** | Unified Code for Units of Measure (e.g., mg, mmol/L). |
| **Verification (Pharmacy)** | Pharmacist clinical review/approval of a medication order. |
