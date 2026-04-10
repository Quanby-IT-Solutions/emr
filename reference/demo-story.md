# QHealth EMR — Demo Presentation Guide (Story Format)

> **How to present this system to executives.** Walk through a single patient's journey. Each step maps to a real page you can click and show.

---

## The Story: "Maria Santos' Hospital Visit"

---

## ACT 1 — Before the Visit (Scheduling)

**Narrator says:** *"Let me show you how a patient's journey begins — even before they step foot in the hospital."*

### Scene 1: The Scheduler Prepares the Clinic

**🎯 Go to:** `/scheduler/schedule` — Schedule Management

> *"This is our Scheduler, Ana. It's Monday morning and she's managing the clinic schedule for the week. She can see all providers, filter by department, and manage appointment slots."*

**What to show:**
- The weekly calendar view with color-coded appointments
- Click "New Appointment" → show the booking dialog
- Explain: providers, departments, and time slots are all managed here

**🎯 Then go to:** `/scheduler` — Scheduler Dashboard

> *"From her dashboard, Ana sees today's appointment count, upcoming alerts, and any pending requests that need attention."*

**Transition:** *"Now let's say a patient — Maria Santos — has an appointment scheduled for today. She arrives at the hospital. Here's what happens next."*

---

## ACT 2 — Arrival & Registration (Registrar)

**Narrator says:** *"Maria arrives at the admissions counter. The Registrar needs to find her record, verify her info, and check her in."*

### Scene 2: Patient Registration

**🎯 Go to:** `/registrar/registration` — Patient Registration

> *"This is the Registrar's Patient Registration page. They can search existing patients by name or ID, filter by gender or status, and sort the records. If Maria is a new patient, they click 'New Registration'."*

**What to show:**
- The searchable, filterable, sortable patient table
- Click **"New Registration"** → the full registration form
- Walk through the sections: PGH Details, Personal Info, Contact, Address, Occupation, Emergency Contact, Insurance
- Point out: this is a comprehensive, production-ready form

**💡 Pro tip:** Fill out a few fields in the form to show the UX, then close it. Mention that data persists in the system.

### Scene 3: Appointment Check-In

**🎯 Go to:** `/registrar/appointments` — Patient Check-In

> *"Maria had an appointment. The Registrar finds her on the list and checks her in. This creates her encounter in the system — the digital record that follows her through every department."*

**What to show:**
- The appointment list with status badges
- The **"Check-In"** action → creates the encounter
- Point out the **Triage Mode** toggle — for walk-in or ER patients
- Show the schedule view on the right

**Transition:** *"Maria is now checked in. But let's say she came through the ER instead — here's what that looks like."*

### Scene 4: Triage (ER Entry)

**🎯 Go to:** `/nurse/triage` — Triage Assessment

> *"If Maria came through the ER, the Triage Nurse does a rapid assessment. This is our full triage workflow — vitals, GCS scoring, ABC assessment, and ER mode."*

**What to show:**
- Click **"New Triage Assessment"** → the triage wizard
- Walk through the form: chief complaint, vitals, GCS, ABC
- Show how it categorizes: EMERGENT, URGENT, NON-URGENT
- Mention: the ER mode toggle changes the workflow for emergency cases

**Transition:** *"Maria's triage is complete. She's been assessed and is now waiting for the clinician. Let's switch to the nurse's perspective."*

---

## ACT 3 — Clinical Care (Nurse)

**Narrator says:** *"Maria is now in the care of the nursing team. Let me show you what the nurse sees and does."*

### Scene 5: The Nurse's Dashboard

**🎯 Go to:** `/nurse` — Nurse Dashboard (Ward 3B)

> *"This is Nurse Joy's dashboard. She can see all her assigned patients at a glance — who needs medication, who's due for vitals, and any critical alerts."*

**What to show:**
- Patient summary cards with status indicators
- Pending medications count
- Vitals due alerts
- Isolation precautions banner
- Quick action buttons

### Scene 6: Recording Vital Signs

**🎯 Go to:** `/nurse/vitals` — Vital Signs Monitoring

> *"Nurse Joy takes Maria's vital signs. The system automatically flags abnormal values — no need to manually calculate or remember thresholds."*

**What to show:**
- The vitals entry form (BP, HR, RR, Temp, SpO2, Pain, GCS)
- Explain: abnormal values are auto-flagged
- Show the historical vitals log

### Scene 7: Medication Administration

**🎯 Go to:** `/nurse/medications` — Medication Administration (MAR)

> *"Maria has been prescribed medication. Nurse Joy sees everything due for her shift — what's pending, what's been given, and what's been held."*

**What to show:**
- The stepper view: Pending → Administered
- Click **"Administer"** → the medication wizard
- Explain: the system enforces the "five rights" of medication safety
- Point out: PRN documentation and held/refused doses

### Scene 8: Clinical Documentation

**🎯 Go to:** `/nurse/clinical-docs` — Clinical Documentation

> *"Throughout her shift, Nurse Joy documents her assessments and observations. She uses pre-built templates to work efficiently."*

**What to show:**
- The note creation interface
- Available templates: Progress Note, Assessment, I&O, Incident, Endorsement
- Explain: notes can be signed off and cosigned by supervisors

### Scene 9: Specialized Care Units (Bonus)

**🎯 Go to:** `/nurse/specialized-care` — Specialized Care Units

> *"For patients in specialized units — PACU, ICU, or Oncology — the system provides dedicated workflows with scoring tools and checklists."*

**What to show:**
- **PACU tab:** Aldrete scoring for post-anesthesia recovery
- **ICU tab:** Flowsheet with intake/output tracking
- **Oncology tab:** Chemotherapy administration checklist

**Transition:** *"Maria's condition requires a doctor's assessment. Let's switch to the Clinician's view."*

---

## ACT 4 — The Doctor's Assessment (Clinician)

**Narrator says:** *"Dr. Carlos reviews Maria's chart, places orders, and documents his findings. Let me show you his workflow."*

### Scene 10: The Clinician's Dashboard

**🎯 Go to:** `/clinician` — Clinician Dashboard

> *"Dr. Carlos starts his day here. He sees his KPIs, today's schedule, active inpatients, and critical alerts that need his immediate attention."*

**What to show:**
- KPI cards (patients seen, pending notes, critical alerts)
- Active inpatients list
- Critical alerts with **acknowledge** buttons
- Quick actions

### Scene 11: Patient Chart Review

**🎯 Go to:** `/clinician/patients` → click a patient → `/clinician/chart`

> *"Dr. Carlos opens Maria's chart. Everything is in one place — demographics, allergies, problems, notes, orders, and results."*

**What to show:**
- The patient header with demographics and allergy alerts
- Tabbed chart: Overview, Notes, Orders, Results, etc.
- Point out: the shared `PatientChartTabs` component used across nurse and clinician views

### Scene 12: Placing Orders (CPOE)

**🎯 Go to:** `/clinician/orders` — Computerized Physician Order Entry

> *"After assessing Maria, Dr. Carlos places orders — medications, lab tests, imaging — all through CPOE. The system checks for allergies and drug interactions."*

**What to show:**
- The order tabs: All, Medications, Lab, Imaging, Admit/Discharge
- Click **"Place Order"** → the order dialog
- Show order sets for common conditions
- Explain: allergy checks and dose range validation happen automatically

### Scene 13: Clinical Documentation

**🎯 Go to:** `/clinician/documentation` — Clinical Documentation

> *"Dr. Carlos documents his findings using structured templates. He can sign notes, route them for cosignature, or create addenda."*

**What to show:**
- Available templates: SOAP, H&P, Consult, Discharge Summary, Telephone Encounter
- The sign/cosign workflow
- Addenda creation for signed notes
- Note status tracking (Draft, Signed, Pending Cosign)

### Scene 14: Notifications (The Clinician's Inbox)

**🎯 Go to:** `/clinician/notifications` — Notifications

> *"This is Dr. Carlos's inbox. He gets notifications for critical lab results, order updates, chart deficiencies, cosignature requests, and system alerts."*

**What to show:**
- The 5 notification types with color-coded badges
- Filter and mark-as-read functionality
- Click through to the relevant chart or order

### Scene 15: Break-Glass Access (Emergency Override)

**🎯 Go to:** `/clinician/break-glass` — Break-Glass Access

> *"In an emergency, a clinician may need access to a patient chart that isn't theirs. This is the Break-Glass feature — it grants immediate access but logs everything for audit."*

**What to show:**
- Patient search
- The reason/justification field (required)
- The access log showing all break-glass events
- Explain: this triggers a special audit alert

### Scene 16: Referrals

**🎯 Go to:** `/clinician/referrals` — Referral Management

> *"Maria needs to see a specialist. Dr. Carlos creates a referral and tracks its status through the entire lifecycle."*

**What to show:**
- Create a new referral
- Status tracking: Pending → Accepted → Completed / Declined
- Timeline view of all referrals
- Detail sheet with notes

**Transition:** *"Dr. Carlos orders lab tests and medications. Let's follow those orders to the departments that fulfill them."*

---

## ACT 5 — Order Fulfillment (Pharmacy & Lab)

**Narrator says:** *"Orders placed by the doctor don't just sit there — they route to the right department automatically."*

### Scene 17: The Pharmacist Verifies Orders

**🎯 Go to:** `/pharmacist/verification` — Medication Verification

> *"Dr. Carlos's medication orders land here. The pharmacist reviews each one for clinical appropriateness — checking allergies, drug interactions, and dosing — before approving."*

**What to show:**
- The verification queue (pending orders)
- Click an order → review details
- **Approve** or **Reject** with notes
- Explain: only verified medications appear on the nurse's MAR

**🎯 Then go to:** `/pharmacist` — Pharmacist Dashboard

> *"The pharmacist's dashboard shows pending verifications, inventory alerts, and quick links to all pharmacy workflows."*

**🎯 Then go to:** `/pharmacist/inventory` — Inventory Management

> *"Drug inventory is tracked here — stock levels, expirations, and automatic low-stock alerts."*

### Scene 18: The Lab Processes Orders

**🎯 Go to:** `/lab-tech/processing` — Lab Processing

> *"Lab orders appear here. The lab tech enters results, flags critical values, and completes the order — which then appears in the clinician's chart."*

**What to show:**
- The lab order queue
- Enter results form
- Flagging critical values (triggers clinician notification)
- Completed orders history

**🎯 Then go to:** `/lab-tech` — Lab Technician Dashboard

> *"The lab dashboard shows pending, in-progress, and completed orders, plus a STAT count for urgent cases."*

**Transition:** *"Maria's treatment is complete. She's ready for discharge. Let's see how the system handles that."*

---

## ACT 6 — Discharge & Back-Office

**Narrator says:** *"Discharge isn't just one button — it's a coordinated process across multiple departments."*

### Scene 19: Nursing Discharge Checklist

**🎯 Go to:** `/nurse/discharge` — Discharge Management

> *"The nursing team completes an 8-step discharge checklist — final vitals, medication reconciliation, patient education, and more."*

**What to show:**
- The 8-step checklist with progress indicator
- Final vitals section
- Completion enforcement

### Scene 20: Nurse Shift Endorsement

**🎯 Go to:** `/nurse/reports` — Reports & Shift Endorsement

> *"At shift change, the outgoing nurse creates an endorsement report — summarizing each patient's status, pending tasks, and any incidents."*

**What to show:**
- Patient summaries in the endorsement report
- Incident report filing
- CSV export capability

### Scene 21: HIM Coding (Post-Discharge)

**🎯 Go to:** `/him-coder` — HIM Coding Dashboard

> *"After discharge, the HIM Coder reviews the chart for completeness and assigns ICD-10 codes."*

**What to show:**
- Recent coding activity and encounters by status
- Quick actions

**🎯 Then go to:** `/him-coder/coding` — ICD-10 Coding

> *"The coder searches for ICD-10 codes, assigns them to the encounter, and submits for billing."*

**What to show:**
- ICD-10 search tool
- Assigning codes to encounters
- Submit workflow

**🎯 Then go to:** `/him-coder/discrepancies` — Discrepancies

> *"If there are missing signatures or incomplete documentation, the coder flags them here — sending the chart back to the clinician."*

### Scene 22: Billing

**🎯 Go to:** `/biller` — Biller Dashboard

> *"Once the chart is coded, the biller compiles all charges and creates the invoice."*

**What to show:**
- Billing KPIs: total revenue, collection rate, outstanding
- Recent invoices

**🎯 Then go to:** `/biller/invoices` — Invoices

> *"The biller generates a consolidated invoice for Maria's visit — all charges from registration, labs, medications, and procedures."*

**What to show:**
- Invoice list with sorting and filtering
- Click an invoice → detail sheet
- Payment recording

**Transition:** *"Maria's visit is now complete in the system. But let's not forget the people who keep everything running."*

---

## ACT 7 — System Administration

**Narrator says:** *"Behind every great system is an admin keeping it running. Let me show you the administrative side."*

### Scene 23: System Admin Dashboard

**🎯 Go to:** `/admin` — System Administration Dashboard

> *"The System Admin monitors system health, active users, security alerts, and IT requests — all from one dashboard."*

**What to show:**
- System health indicators
- Active users count
- Security alerts
- Maintenance calendar

### Scene 24: User Management

**🎯 Go to:** `/admin/users` — User Management

> *"The admin manages all users — adding new staff, assigning roles, and activating/deactivating accounts."*

**What to show:**
- Full user CRUD: add, edit, delete
- Role assignment dropdown
- Search and filter
- Active/inactive toggle

### Scene 25: System Configuration

**🎯 Go to:** `/admin/system-config` — System Configuration

> *"This is where the admin configures the entire system — hospital details, module toggles, PhilHealth settings, notifications, backup/restore, and security policies."*

**What to show:**
- All 6 tabs
- Emphasize: settings persist to localStorage
- Module toggles that enable/disable features system-wide

### Scene 26: IT Service Requests

**🎯 Go to:** `/admin/it-requests` — IT Service Request Management

> *"Staff can submit IT support requests. The admin manages tickets — assigning technicians, updating status, and tracking resolutions."*

**What to show:**
- Ticket queue with filter/search
- Request detail dialog
- Status workflow: Received → In Progress → Resolved → Closed

### Scene 27: Audit Logs

**🎯 Go to:** `/admin/audit-logs` — Audit Logs

> *"Every action in the system is logged. This is the complete audit trail — searchable and filterable."*

**What to show:**
- The `AuditLogExplorer` component
- Filtering by user, action, date range
- Detail view of individual log entries

**🎯 Also show:** `/auditor/logs` — Auditor View

> *"The Auditor has the same view from a compliance perspective — read-all access with full audit trail visibility."*

---

## ACT 8 — The Patient's Perspective

**Narrator says:** *"Finally, let me show you what Maria sees when she logs into her patient portal."*

### Scene 28: Patient Portal

**🎯 Go to:** `/patient` — Patient Portal Dashboard

> *"This is Maria's view of her own health data — upcoming visits, recent results, current medications, and billing summary. Everything is read-only for security."*

**What to show:**
- Upcoming appointments
- Recent lab results
- Current medications
- Billing summary

**🎯 Then go to:** `/patient/results` — Lab & Imaging Results

> *"Maria can see her lab results and imaging reports — released by the hospital according to their policies."*

**🎯 Then go to:** `/patient/history` — Visit History

> *"And here's her complete visit history — every encounter, every department she visited."*

**🎯 Then go to:** `/patient/profile` — My Profile

> *"Maria's demographic profile — MRN, contact info, insurance on file. This is what she sees when she clicks her avatar."*

---

## CLOSING — The Full Picture

**Narrator says:**

> *"What you just saw is a complete patient journey — from scheduling to discharge — with every department connected, every action logged, and every piece of data flowing to the right person at the right time.*
>
> *QHealth EMR supports **11 specialized roles** — each with their own dedicated workspace — but they all work on **one unified system**.*
>
> *From the Scheduler booking appointments, to the Registrar creating the encounter, the Nurse recording vitals, the Doctor placing orders, the Pharmacist verifying medications, the Lab processing tests, the HIM Coder assigning diagnoses, the Biller generating invoices, and the Admin keeping everything running — it all happens in one place.*
>
> *And the Patient? They have secure, read-only access to their own health information through the Patient Portal.*
>
> *This is QHealth EMR. A complete, enterprise-grade Electronic Medical Records system."*

---

## Quick Reference: Demo Routes by Role

| Role | Login Username | Key Pages to Show |
|------|---------------|-------------------|
| System Admin | `admin` | `/admin`, `/admin/users`, `/admin/system-config`, `/admin/it-requests` |
| Scheduler | `scheduler` | `/scheduler/schedule`, `/scheduler` |
| Registrar | `registrar` | `/registrar/registration`, `/registrar/appointments`, `/registrar/beds` |
| Nurse | `nurse` | `/nurse`, `/nurse/triage`, `/nurse/vitals`, `/nurse/medications`, `/nurse/discharge` |
| Clinician | `clinician` | `/clinician`, `/clinician/orders`, `/clinician/documentation`, `/clinician/notifications` |
| Pharmacist | `pharmacist` | `/pharmacist/verification`, `/pharmacist/inventory` |
| Lab Tech | `labtech` | `/lab-tech/processing` |
| HIM Coder | `himcoder` | `/him-coder/coding`, `/him-coder/discrepancies` |
| Biller | `biller` | `/biller/invoices` |
| Patient | `patient` | `/patient`, `/patient/results`, `/patient/history` |
| Auditor | `auditor` | `/auditor/logs` |

---

## Demo Tips

1. **Don't show everything.** Pick 3-4 acts that match your audience's interests.
2. **Start with the login page.** The split-panel design sets the tone immediately.
3. **Show role switching.** Use the avatar dropdown to switch roles mid-demo — it's impressive.
4. **Use real names.** Say "Maria Santos" not "the patient." Make it feel real.
5. **Show the notification flow.** Place an order as clinician → switch to pharmacist → show it appears in the verification queue.
6. **End with the patient portal.** It's a strong closer — "and this is what the patient sees."
7. **Have the login page open in a separate tab.** Quick access buttons let you switch roles without explaining credentials.
