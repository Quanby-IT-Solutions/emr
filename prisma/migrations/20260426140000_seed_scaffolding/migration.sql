-- seed_scaffolding: immutable system data for QHealth Hospital demo
--
-- Password hash below is bcryptjs.hash('demo123', 10) with bcryptjs@3.x ($2b$ prefix).
-- Regenerate: node -e "const b=require('bcryptjs');b.hash('demo123',10).then(h=>console.log(h))"
-- Or:         pnpm tsx scripts/hash.ts demo123

-- ============================================================
-- 1. Facility
-- ============================================================

INSERT INTO facilities (id, name, address, "contactPhone", "isActive") VALUES
  ('fac_qhealth', 'QHealth Hospital', '123 Medical Center Drive, Quezon City', '+63-2-8555-1234', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Departments
-- ============================================================

INSERT INTO departments (id, "facilityId", name, type) VALUES
  ('dept_er',       'fac_qhealth', 'Emergency Room',               'CLINICAL'),
  ('dept_icu',      'fac_qhealth', 'Intensive Care Unit',          'CLINICAL'),
  ('dept_medsurg',  'fac_qhealth', 'Medical-Surgical',             'CLINICAL'),
  ('dept_pharmacy', 'fac_qhealth', 'Pharmacy',                     'CLINICAL'),
  ('dept_lab',      'fac_qhealth', 'Laboratory',                   'CLINICAL'),
  ('dept_records',  'fac_qhealth', 'Health Information Management', 'ADMINISTRATIVE'),
  ('dept_billing',  'fac_qhealth', 'Billing & Finance',            'ADMINISTRATIVE'),
  ('dept_admin',    'fac_qhealth', 'Administration',               'ADMINISTRATIVE'),
  ('dept_peds',     'fac_qhealth', 'Pediatrics',                   'CLINICAL'),
  ('dept_obgyn',    'fac_qhealth', 'Obstetrics & Gynecology',      'CLINICAL')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Locations (beds) -- 50 total, all AVAILABLE
-- Acceptance criteria: >= 30 beds with bed_number NOT NULL and status = 'AVAILABLE'
-- ============================================================

INSERT INTO locations (id, "departmentId", unit, "roomNumber", "bedNumber", status) VALUES
  -- ER: 10 beds
  ('loc_er_01', 'dept_er', 'ER', 'ER-01', 'A', 'AVAILABLE'),
  ('loc_er_02', 'dept_er', 'ER', 'ER-01', 'B', 'AVAILABLE'),
  ('loc_er_03', 'dept_er', 'ER', 'ER-02', 'A', 'AVAILABLE'),
  ('loc_er_04', 'dept_er', 'ER', 'ER-02', 'B', 'AVAILABLE'),
  ('loc_er_05', 'dept_er', 'ER', 'ER-03', 'A', 'AVAILABLE'),
  ('loc_er_06', 'dept_er', 'ER', 'ER-03', 'B', 'AVAILABLE'),
  ('loc_er_07', 'dept_er', 'ER', 'ER-04', 'A', 'AVAILABLE'),
  ('loc_er_08', 'dept_er', 'ER', 'ER-04', 'B', 'AVAILABLE'),
  ('loc_er_09', 'dept_er', 'ER', 'ER-05', 'A', 'AVAILABLE'),
  ('loc_er_10', 'dept_er', 'ER', 'ER-05', 'B', 'AVAILABLE'),
  -- ICU: 8 beds
  ('loc_icu_01', 'dept_icu', 'ICU', 'ICU-01', '1', 'AVAILABLE'),
  ('loc_icu_02', 'dept_icu', 'ICU', 'ICU-02', '1', 'AVAILABLE'),
  ('loc_icu_03', 'dept_icu', 'ICU', 'ICU-03', '1', 'AVAILABLE'),
  ('loc_icu_04', 'dept_icu', 'ICU', 'ICU-04', '1', 'AVAILABLE'),
  ('loc_icu_05', 'dept_icu', 'ICU', 'ICU-05', '1', 'AVAILABLE'),
  ('loc_icu_06', 'dept_icu', 'ICU', 'ICU-06', '1', 'AVAILABLE'),
  ('loc_icu_07', 'dept_icu', 'ICU', 'ICU-07', '1', 'AVAILABLE'),
  ('loc_icu_08', 'dept_icu', 'ICU', 'ICU-08', '1', 'AVAILABLE'),
  -- Med-Surg: 15 beds
  ('loc_ms_01', 'dept_medsurg', 'Med-Surg', '3A-01', 'A', 'AVAILABLE'),
  ('loc_ms_02', 'dept_medsurg', 'Med-Surg', '3A-01', 'B', 'AVAILABLE'),
  ('loc_ms_03', 'dept_medsurg', 'Med-Surg', '3A-02', 'A', 'AVAILABLE'),
  ('loc_ms_04', 'dept_medsurg', 'Med-Surg', '3A-02', 'B', 'AVAILABLE'),
  ('loc_ms_05', 'dept_medsurg', 'Med-Surg', '3A-03', 'A', 'AVAILABLE'),
  ('loc_ms_06', 'dept_medsurg', 'Med-Surg', '3A-03', 'B', 'AVAILABLE'),
  ('loc_ms_07', 'dept_medsurg', 'Med-Surg', '3A-04', 'A', 'AVAILABLE'),
  ('loc_ms_08', 'dept_medsurg', 'Med-Surg', '3A-04', 'B', 'AVAILABLE'),
  ('loc_ms_09', 'dept_medsurg', 'Med-Surg', '3A-05', 'A', 'AVAILABLE'),
  ('loc_ms_10', 'dept_medsurg', 'Med-Surg', '3A-05', 'B', 'AVAILABLE'),
  ('loc_ms_11', 'dept_medsurg', 'Med-Surg', '3A-06', 'A', 'AVAILABLE'),
  ('loc_ms_12', 'dept_medsurg', 'Med-Surg', '3A-06', 'B', 'AVAILABLE'),
  ('loc_ms_13', 'dept_medsurg', 'Med-Surg', '3A-07', 'A', 'AVAILABLE'),
  ('loc_ms_14', 'dept_medsurg', 'Med-Surg', '3A-07', 'B', 'AVAILABLE'),
  ('loc_ms_15', 'dept_medsurg', 'Med-Surg', '3A-08', 'A', 'AVAILABLE'),
  -- Pediatrics: 8 beds
  ('loc_ped_01', 'dept_peds', 'Peds', '4B-01', 'A', 'AVAILABLE'),
  ('loc_ped_02', 'dept_peds', 'Peds', '4B-01', 'B', 'AVAILABLE'),
  ('loc_ped_03', 'dept_peds', 'Peds', '4B-02', 'A', 'AVAILABLE'),
  ('loc_ped_04', 'dept_peds', 'Peds', '4B-02', 'B', 'AVAILABLE'),
  ('loc_ped_05', 'dept_peds', 'Peds', '4B-03', 'A', 'AVAILABLE'),
  ('loc_ped_06', 'dept_peds', 'Peds', '4B-03', 'B', 'AVAILABLE'),
  ('loc_ped_07', 'dept_peds', 'Peds', '4B-04', 'A', 'AVAILABLE'),
  ('loc_ped_08', 'dept_peds', 'Peds', '4B-04', 'B', 'AVAILABLE'),
  -- OB-GYN: 9 beds
  ('loc_ob_01', 'dept_obgyn', 'OB-GYN', '5C-01', 'A', 'AVAILABLE'),
  ('loc_ob_02', 'dept_obgyn', 'OB-GYN', '5C-01', 'B', 'AVAILABLE'),
  ('loc_ob_03', 'dept_obgyn', 'OB-GYN', '5C-02', 'A', 'AVAILABLE'),
  ('loc_ob_04', 'dept_obgyn', 'OB-GYN', '5C-02', 'B', 'AVAILABLE'),
  ('loc_ob_05', 'dept_obgyn', 'OB-GYN', '5C-03', 'A', 'AVAILABLE'),
  ('loc_ob_06', 'dept_obgyn', 'OB-GYN', '5C-03', 'B', 'AVAILABLE'),
  ('loc_ob_07', 'dept_obgyn', 'OB-GYN', '5C-04', 'A', 'AVAILABLE'),
  ('loc_ob_08', 'dept_obgyn', 'OB-GYN', '5C-04', 'B', 'AVAILABLE'),
  ('loc_ob_09', 'dept_obgyn', 'OB-GYN', '5C-05', 'A', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. Users -- 20 rows
-- Quick-Access invariant usernames: admin, scheduler, registrar, nurse,
--   clinician, pharmacist, labtech, himcoder, biller, patient, auditor
-- Supporting staff: nurse2-6, doctor2-5
-- passwordHash = bcryptjs.hash('demo123', 10)
-- ============================================================

INSERT INTO users (id, username, email, "passwordHash", role, "isActive", "updatedAt") VALUES
  -- 11 main personas
  ('user_admin',      'admin',      'admin@qhealth.demo',      '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'SYSTEM_ADMIN', true, NOW()),
  ('user_scheduler',  'scheduler',  'scheduler@qhealth.demo',  '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'SCHEDULER',    true, NOW()),
  ('user_registrar',  'registrar',  'registrar@qhealth.demo',  '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'REGISTRAR',    true, NOW()),
  ('user_nurse',      'nurse',      'nurse@qhealth.demo',      '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'NURSE',        true, NOW()),
  ('user_clinician',  'clinician',  'clinician@qhealth.demo',  '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'CLINICIAN',    true, NOW()),
  ('user_pharmacist', 'pharmacist', 'pharmacist@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'PHARMACIST',   true, NOW()),
  ('user_labtech',    'labtech',    'labtech@qhealth.demo',    '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'LAB_TECH',     true, NOW()),
  ('user_himcoder',   'himcoder',   'himcoder@qhealth.demo',   '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'HIM_CODER',    true, NOW()),
  ('user_biller',     'biller',     'biller@qhealth.demo',     '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'BILLER',       true, NOW()),
  ('user_patient',    'patient',    'patient@qhealth.demo',    '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'PATIENT',      true, NOW()),
  ('user_auditor',    'auditor',    'auditor@qhealth.demo',    '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'AUDITOR',      true, NOW()),
  -- 5 supporting nurses
  ('user_nurse2', 'nurse2', 'nurse2@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'NURSE', true, NOW()),
  ('user_nurse3', 'nurse3', 'nurse3@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'NURSE', true, NOW()),
  ('user_nurse4', 'nurse4', 'nurse4@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'NURSE', true, NOW()),
  ('user_nurse5', 'nurse5', 'nurse5@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'NURSE', true, NOW()),
  ('user_nurse6', 'nurse6', 'nurse6@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'NURSE', true, NOW()),
  -- 4 supporting doctors
  ('user_doctor2', 'doctor2', 'doctor2@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'CLINICIAN', true, NOW()),
  ('user_doctor3', 'doctor3', 'doctor3@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'CLINICIAN', true, NOW()),
  ('user_doctor4', 'doctor4', 'doctor4@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'CLINICIAN', true, NOW()),
  ('user_doctor5', 'doctor5', 'doctor5@qhealth.demo', '$2b$10$96QIIcUSszwUm2taAeyMle/Ow7EyDORnTgqf7p8yPm6Ixtm07z3.u', 'CLINICIAN', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. Staff -- 19 rows (all users except patient)
-- scheduler -> Ana Santos (not Maria Santos, per Analysis sec.8)
-- ============================================================

INSERT INTO staff (id, "userId", "firstName", "lastName", "jobTitle", "primaryDepartmentId") VALUES
  -- Main personas
  ('stf_admin',      'user_admin',      'James',   'Reyes',     'System Administrator',   'dept_admin'),
  ('stf_scheduler',  'user_scheduler',  'Ana',     'Santos',    'Scheduler',              'dept_admin'),
  ('stf_registrar',  'user_registrar',  'Lucia',   'Cruz',      'Registrar',              'dept_admin'),
  ('stf_nurse',      'user_nurse',      'Rosa',    'Dela Cruz', 'Registered Nurse',       'dept_medsurg'),
  ('stf_clinician',  'user_clinician',  'Miguel',  'Reyes',     'Attending Physician',    'dept_medsurg'),
  ('stf_pharmacist', 'user_pharmacist', 'Carlos',  'Mendez',    'Clinical Pharmacist',    'dept_pharmacy'),
  ('stf_labtech',    'user_labtech',    'Sofia',   'Torres',    'Laboratory Technician',  'dept_lab'),
  ('stf_himcoder',   'user_himcoder',   'Elena',   'Marquez',   'HIM Coder',              'dept_records'),
  ('stf_biller',     'user_biller',     'Pedro',   'Garcia',    'Medical Biller',         'dept_billing'),
  ('stf_auditor',    'user_auditor',    'Isabel',  'Lopez',     'Privacy Officer',        'dept_admin'),
  -- Supporting nurses
  ('stf_nurse2', 'user_nurse2', 'Grace',  'Tan',    'Registered Nurse',    'dept_er'),
  ('stf_nurse3', 'user_nurse3', 'Lisa',   'Wong',   'Registered Nurse',    'dept_icu'),
  ('stf_nurse4', 'user_nurse4', 'Maria',  'Flores', 'Registered Nurse',    'dept_medsurg'),
  ('stf_nurse5', 'user_nurse5', 'Anna',   'Kim',    'Registered Nurse',    'dept_peds'),
  ('stf_nurse6', 'user_nurse6', 'Jenny',  'Lee',    'Registered Nurse',    'dept_obgyn'),
  -- Supporting doctors
  ('stf_doctor2', 'user_doctor2', 'David',  'Nguyen',  'Attending Physician', 'dept_er'),
  ('stf_doctor3', 'user_doctor3', 'Robert', 'Chen',    'Intensivist',         'dept_icu'),
  ('stf_doctor4', 'user_doctor4', 'Sarah',  'Patel',   'Pediatrician',        'dept_peds'),
  ('stf_doctor5', 'user_doctor5', 'Amanda', 'Rivera',  'OB-GYN Specialist',   'dept_obgyn')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. FormularyItems -- 30 rows
-- notes contain canned clinicalChecks used by pharmacist verification view
-- ============================================================

INSERT INTO formulary_items (id, "genericName", "brandName", "rxnormCode", "isRestricted", notes) VALUES
  ('fmlr_01', 'Metoprolol Succinate',   'Toprol-XL',         '866514', false, 'Beta-blocker. Check HR <60 bpm before admin. Avoid abrupt discontinuation. Bradycardia risk with diltiazem/verapamil.'),
  ('fmlr_02', 'Lisinopril',             'Zestril',           '314076', false, 'ACE inhibitor. Monitor K+; avoid with K-sparing diuretics and ARBs. Cough common SE. Contraindicated in pregnancy.'),
  ('fmlr_03', 'Atorvastatin',           'Lipitor',           '617311', false, 'Statin. Avoid grapefruit juice. Check LFTs if myopathy symptoms. Interaction with clarithromycin (increase statin levels).'),
  ('fmlr_04', 'Metformin HCl',          'Glucophage',        '860975', false, 'Hold 48h before/after contrast procedures. Caution in renal impairment (CrCl <45). GI SE common with initiation.'),
  ('fmlr_05', 'Aspirin',                'Bayer Aspirin',     '1191',   false, 'Antiplatelet. Concurrent NSAIDs reduce cardioprotective effect and increase GI bleed risk.'),
  ('fmlr_06', 'Warfarin Sodium',        'Coumadin',          '11289',  true,  'RESTRICTED: Narrow TI. Check INR before each dose. Fluoroquinolones significantly enhance anticoagulation. Avoid with NSAIDs.'),
  ('fmlr_07', 'Amoxicillin',            'Amoxil',            '723',    false, 'Penicillin antibiotic. Verify penicillin allergy before dispensing. May reduce oral contraceptive efficacy.'),
  ('fmlr_08', 'Ciprofloxacin',          'Cipro',             '41493',  false, 'Fluoroquinolone. Significantly enhances warfarin anticoagulation -- monitor INR closely. QT prolongation risk.'),
  ('fmlr_09', 'Omeprazole',             'Prilosec',          '7646',   false, 'PPI. Reduces clopidogrel efficacy via CYP2C19 inhibition -- avoid concurrent use. Use pantoprazole if PPI needed.'),
  ('fmlr_10', 'Furosemide',             'Lasix',             '4603',   false, 'Loop diuretic. Monitor K+, Na+, Cr. Ototoxic at high doses. Potentiates aminoglycoside nephrotoxicity.'),
  ('fmlr_11', 'Amlodipine Besylate',    'Norvasc',           '17767',  false, 'Calcium channel blocker. Can cause dependent edema. Avoid grapefruit juice. Additive hypotension with other antihypertensives.'),
  ('fmlr_12', 'Losartan Potassium',     'Cozaar',            '203160', false, 'ARB. Avoid combination with ACE inhibitors. Monitor K+ with K-sparing diuretics. Contraindicated in pregnancy.'),
  ('fmlr_13', 'Clopidogrel',            'Plavix',            '174742', false, 'Antiplatelet. Avoid omeprazole/esomeprazole (CYP2C19 inhibition reduces efficacy). Use pantoprazole if GI protection needed.'),
  ('fmlr_14', 'Simvastatin',            'Zocor',             '36567',  false, 'Statin. Dose cap 10mg with amiodarone; 20mg with diltiazem. Avoid grapefruit. Monitor for myopathy (CK elevation).'),
  ('fmlr_15', 'Albuterol Sulfate',      'Ventolin HFA',      '435',    false, 'Short-acting beta2 agonist. Tachycardia risk. Use cautiously with other sympathomimetics. Monitor K+ (hypokalemia at high doses).'),
  ('fmlr_16', 'Prednisone',             'Deltasone',         '8638',   false, 'Corticosteroid. Masks infection signs. Monitor blood glucose. Adrenal suppression with prolonged use -- taper to discontinue.'),
  ('fmlr_17', 'Morphine Sulfate',       'MS Contin',         '7052',   true,  'RESTRICTED: Opioid. Respiratory depression risk. Verify pain score and allergy. Avoid with MAOIs. Naloxone reversal available.'),
  ('fmlr_18', 'Oxycodone HCl',          'OxyContin',         '7804',   true,  'RESTRICTED: Opioid. High abuse potential. CNS/respiratory depression. Avoid with benzodiazepines (overdose deaths).'),
  ('fmlr_19', 'Tramadol HCl',           'Ultram',            '10689',  false, 'Opioid analgesic. Seizure risk at high doses. Serotonin syndrome with SSRIs/SNRIs. Lower abuse potential than opioids.'),
  ('fmlr_20', 'Insulin Glargine',       'Lantus',            '274783', true,  'RESTRICTED: Long-acting insulin. Do NOT mix with other insulins in same syringe. Monitor glucose. Inject once daily at same time.'),
  ('fmlr_21', 'Insulin Lispro',         'Humalog',           '86009',  true,  'RESTRICTED: Rapid-acting insulin. Administer within 15 min of meals. Monitor glucose pre- and post-meal. Hypoglycemia risk.'),
  ('fmlr_22', 'Heparin Sodium',         'Heparin',           '5224',   true,  'RESTRICTED: High-alert medication. Weight-based dosing required. Monitor aPTT per protocol. HIT risk -- watch platelets.'),
  ('fmlr_23', 'Enoxaparin Sodium',      'Lovenox',           '67108',  false, 'LMWH. Renal dose adjustment required (CrCl <30). Monitor anti-Xa levels in renally impaired or obese patients.'),
  ('fmlr_24', 'Ceftriaxone',            'Rocephin',          '2193',   false, 'Third-gen cephalosporin. Avoid mixing with calcium-containing IV solutions (precipitation). Cross-reactivity with penicillin allergy.'),
  ('fmlr_25', 'Vancomycin HCl',         'Vancocin',          '11124',  true,  'RESTRICTED: Glycopeptide antibiotic. Monitor trough AUC/MIC. Red-man syndrome with rapid infusion -- infuse over >=60 min.'),
  ('fmlr_26', 'Acetaminophen',          'Tylenol',           '161',    false, 'Analgesic/antipyretic. Hepatotoxic at high doses. Max 4g/day; 2g/day in hepatic impairment or elderly. Check all combo products.'),
  ('fmlr_27', 'Ibuprofen',              'Advil',             '5640',   false, 'NSAID. GI/renal/CV risks. Avoid in renal impairment. Limit concurrent aspirin use (reduced cardioprotection).'),
  ('fmlr_28', 'Ondansetron HCl',        'Zofran',            '312087', false, 'Antiemetic. QT prolongation risk -- avoid concurrent QT-prolonging agents. Monitor ECG in cardiac patients.'),
  ('fmlr_29', 'Potassium Chloride',     'K-Dur',             '8591',   false, 'Electrolyte replacement. NEVER administer undiluted IV -- must dilute for IV infusion. Monitor ECG and serum K+.'),
  ('fmlr_30', 'Magnesium Sulfate',      'Epsom Salt IV',     '6585',   true,  'RESTRICTED: Electrolyte/tocolytic/anticonvulsant. Monitor Mg levels and deep tendon reflexes. Calcium gluconate is reversal agent.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. ChargeMasterItems -- 40 rows (CPT-style codes)
-- ============================================================

INSERT INTO charge_master_items (id, "itemCode", description, "priceInCents", "departmentId", "isActive") VALUES
  -- Emergency (dept_er)
  ('cmi_99283',  '99283',  'Emergency dept visit, moderate complexity',           25000,  'dept_er',      true),
  ('cmi_99285',  '99285',  'Emergency dept visit, high complexity',               55000,  'dept_er',      true),
  ('cmi_99291',  '99291',  'Critical care, first 30-74 minutes',                  45000,  'dept_er',      true),
  ('cmi_99292',  '99292',  'Critical care, each additional 30 minutes',           22500,  'dept_er',      true),
  -- Inpatient visits (dept_medsurg)
  ('cmi_99221',  '99221',  'Hospital admission, low complexity',                  23000,  'dept_medsurg', true),
  ('cmi_99222',  '99222',  'Hospital admission, moderate complexity',             30000,  'dept_medsurg', true),
  ('cmi_99223',  '99223',  'Hospital admission, high complexity',                 38000,  'dept_medsurg', true),
  ('cmi_99231',  '99231',  'Hospital subsequent care, low complexity',            12000,  'dept_medsurg', true),
  ('cmi_99232',  '99232',  'Hospital subsequent care, moderate complexity',       16500,  'dept_medsurg', true),
  ('cmi_99233',  '99233',  'Hospital subsequent care, high complexity',           19000,  'dept_medsurg', true),
  ('cmi_99238',  '99238',  'Hospital discharge day management, <30 min',          14500,  'dept_medsurg', true),
  ('cmi_99239',  '99239',  'Hospital discharge day management, >30 min',          21000,  'dept_medsurg', true),
  -- Room & board
  ('cmi_ms_day', 'RM-MED',  'Med-Surg room and board, per day',                  180000, 'dept_medsurg', true),
  ('cmi_icu_day','RM-ICU',  'ICU room and board, per day',                        320000, 'dept_icu',     true),
  -- Laboratory (dept_lab)
  ('cmi_85025',  '85025',  'CBC with automated differential',                     6500,   'dept_lab',     true),
  ('cmi_80048',  '80048',  'Basic metabolic panel (BMP)',                         7500,   'dept_lab',     true),
  ('cmi_80053',  '80053',  'Comprehensive metabolic panel (CMP)',                 9500,   'dept_lab',     true),
  ('cmi_80061',  '80061',  'Lipid panel',                                         8500,   'dept_lab',     true),
  ('cmi_83036',  '83036',  'Hemoglobin A1c (HbA1c)',                              6500,   'dept_lab',     true),
  ('cmi_84484',  '84484',  'Troponin I',                                          12000,  'dept_lab',     true),
  ('cmi_83880',  '83880',  'B-type natriuretic peptide (BNP)',                    13000,  'dept_lab',     true),
  ('cmi_85610',  '85610',  'Prothrombin time (PT/INR)',                           5500,   'dept_lab',     true),
  ('cmi_85730',  '85730',  'Partial thromboplastin time (aPTT)',                  5500,   'dept_lab',     true),
  ('cmi_87040',  '87040',  'Blood culture, aerobic bottle',                       8500,   'dept_lab',     true),
  ('cmi_81003',  '81003',  'Urinalysis, automated without microscopy',            3500,   'dept_lab',     true),
  ('cmi_87088',  '87088',  'Urine culture, with colony count',                    7500,   'dept_lab',     true),
  -- Radiology/Imaging (no dedicated dept -- departmentId null)
  ('cmi_71046',  '71046',  'Chest X-ray, PA and lateral',                         18000,  null,           true),
  ('cmi_70450',  '70450',  'CT head without contrast',                            65000,  null,           true),
  ('cmi_71250',  '71250',  'CT thorax without contrast',                          70000,  null,           true),
  ('cmi_74178',  '74178',  'CT abdomen and pelvis with contrast',                 90000,  null,           true),
  ('cmi_70553',  '70553',  'MRI brain with and without contrast',                150000,  null,           true),
  ('cmi_93306',  '93306',  'Echocardiography, transthoracic comprehensive',       85000,  null,           true),
  ('cmi_93000',  '93000',  'Electrocardiogram, 12-lead with interpretation',       9500,  null,           true),
  -- Procedures
  ('cmi_36000',  '36000',  'Peripheral IV line placement',                         8500,  'dept_er',      true),
  ('cmi_96365',  '96365',  'IV infusion, initial up to 1 hour',                  12000,  'dept_er',      true),
  ('cmi_96366',  '96366',  'IV infusion, each additional hour',                   4500,  'dept_er',      true),
  ('cmi_96372',  '96372',  'Therapeutic IM injection',                             5500,  'dept_er',      true),
  ('cmi_51702',  '51702',  'Urinary catheter insertion, simple',                   9500,  'dept_medsurg', true),
  ('cmi_43752',  '43752',  'Nasogastric tube placement',                          15000,  'dept_medsurg', true),
  -- Pharmacy (dept_pharmacy)
  ('cmi_pharm',  'PHARM-ADMIN', 'Medication administration fee',                  2500,  'dept_pharmacy', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. PortalReleasePolicies -- 3 rows (one per PortalDataType)
-- ============================================================

INSERT INTO portal_release_policies (id, "dataType", "releaseDelayHours", "isEnabled", notes) VALUES
  ('prp_lab',  'LAB_RESULT',     24, true, 'Lab results released 24 hours after sign-off per hospital policy.'),
  ('prp_img',  'IMAGING_REPORT', 48, true, 'Imaging reports released 48 hours after radiologist signature.'),
  ('prp_note', 'CLINICAL_NOTE',  72, true, 'Clinical notes released 72 hours after signing; sensitive mental health records require manual approval.')
ON CONFLICT (id) DO NOTHING;
