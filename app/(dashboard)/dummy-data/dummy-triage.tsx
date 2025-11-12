export interface TriageAssessment {
    patient: {
        id: string;
        name: string;
        ageSex: string;
        phoneNumber: number;
        address: string;
        triageType: "EMERGENCY" | "OPD" | "WALK_IN" | "REFERRAL" | "SCHEDULED" | "OTHER";
        currentTriageCategory: "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD";
        lastDateOfTriage: Date | null;
        lastTimeOfTriage: string;
        companion: {
            name: string;
            contact: number | null;
            relation: string;
        };
        arrivalDetails: {
            date: Date;
            time: string;
            modeOfTransport: string;
            referredBy: string;
        };
        medicalHistory: {
            allergies: string[];
            currentMedications: string[];
            pastIllnesses: string[];
            surgeries: string[];
            pregnancy: boolean;
            substanceUse: {
                tobacco: boolean;
                alcohol: boolean;
                drugs: boolean;
                others: boolean;
                othersDetails: string;
            };
            immunizations: string[];
            immunizationsDate: Date | null;
            familyHistory: string[];
            safeAtHome: boolean;
            previouslyAdmitted: boolean;
            dateOfLastAdmission: Date | null;
        },
        triageDetails: {
            chiefComplaint: string;
            vitalSigns: {
                bloodPressure: string;
                heartRate: number;
                respiratoryRate: number;
                temperature: number; // in Celsius
                oxygenSaturation: number;
                weight: number; // in kilograms
                height: number; // in centimeters
            };
            painAssessment: {
                scale: number;
                location: string;
                duration: string;
                characteristics: string;
                aggravatingFactors: string;
                relievingFactors: string;
            };
            glasgowComaScale: {
                eyeOpening: number;
                verbalResponse: number;
                motorResponse: number;
                totalScore: number;
            };
            airwayStatus: {
                assessment: string;
                airwayNotes: string;
                interventions: string;
            };
            breathingStatus: {
                assessment: string;
                breathingNotes: string;
                interventions: string;
            };
            circulationStatus: {
                assessment: string;
                circulationNotes: string;
                interventions: string;
            };
            triageCategory:  "EMERGENT" | "URGENT" | "NON_URGENT" | "DEAD";
            triageNotes: string;
            triageOfficer: {
                nurseId: string;
                firstName: string;
                lastName: string;
            }
            dateOfTriage: Date;
            timeOfTriage: string;
        }[];
    }
}

export const TriageEntry: TriageAssessment[] = [
  {
    patient: {
      id: "PT-001",
      name: "John Doe",
      ageSex: "35 / M",
      phoneNumber: 9876543210,
      address: "123 Maple Street, Springfield",
      triageType: "EMERGENCY",
      currentTriageCategory: "EMERGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "10:30",
      companion: {
        name: "Jane Doe",
        contact: 9876543222,
        relation: "Wife",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "08:45",
        modeOfTransport: "Ambulance",
        referredBy: "Local Clinic",
      },
      medicalHistory: {
        allergies: ["Penicillin"],
        currentMedications: ["Lisinopril"],
        pastIllnesses: ["Hypertension"],
        surgeries: ["Appendectomy (2010)"],
        pregnancy: false,
        substanceUse: {
          tobacco: true,
          alcohol: true,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Tetanus", "Influenza"],
        immunizationsDate: new Date("2024-06-15"),
        familyHistory: ["Diabetes", "Heart Disease"],
        safeAtHome: true,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2023-12-20"),
      },
      triageDetails: [
        {
          chiefComplaint: "Severe chest pain and shortness of breath",
          vitalSigns: {
            bloodPressure: "180/110",
            heartRate: 120,
            respiratoryRate: 28,
            temperature: 37.2,
            oxygenSaturation: 88,
            weight: 82,
            height: 178,
          },
          painAssessment: {
            scale: 9,
            location: "Chest",
            duration: "30 minutes",
            characteristics: "Sharp, radiating to left arm",
            aggravatingFactors: "Physical activity",
            relievingFactors: "Rest",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "No obstruction",
            interventions: "Oxygen via mask",
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Rapid breathing, accessory muscle use",
            interventions: "Oxygen support, continuous monitoring",
          },
          circulationStatus: {
            assessment: "Compromised",
            circulationNotes: "High BP, tachycardia",
            interventions: "IV fluids, cardiac monitoring",
          },
          triageCategory: "EMERGENT",
          triageNotes: "Suspected myocardial infarction",
          triageOfficer: {
            nurseId: "N-1001",
            firstName: "Alice",
            lastName: "Smith",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "08:50",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-002",
      name: "Maria Gonzalez",
      ageSex: "28 / F",
      phoneNumber: 9123456780,
      address: "45 Oak Avenue, Rivertown",
      triageType: "OPD",
      currentTriageCategory: "NON_URGENT",
      lastDateOfTriage: new Date("2025-11-10"),
      lastTimeOfTriage: "11:15",
      companion: {
        name: "Luis Gonzalez",
        contact: 9123456781,
        relation: "Brother",
      },
      arrivalDetails: {
        date: new Date("2025-11-10"),
        time: "10:30",
        modeOfTransport: "Private Car",
        referredBy: "Self",
      },
      medicalHistory: {
        allergies: ["None"],
        currentMedications: ["Metformin"],
        pastIllnesses: ["Type 2 Diabetes"],
        surgeries: [],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: true,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["MMR", "Hepatitis B"],
        immunizationsDate: new Date("2023-05-10"),
        familyHistory: ["Hypertension"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "Persistent headache and mild dizziness",
          vitalSigns: {
            bloodPressure: "125/80",
            heartRate: 78,
            respiratoryRate: 18,
            temperature: 36.8,
            oxygenSaturation: 98,
            weight: 65,
            height: 165,
          },
          painAssessment: {
            scale: 4,
            location: "Forehead",
            duration: "2 days",
            characteristics: "Throbbing",
            aggravatingFactors: "Bright lights",
            relievingFactors: "Rest, hydration",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular breathing pattern",
            interventions: "None",
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Normal capillary refill",
            interventions: "None",
          },
          triageCategory: "NON_URGENT",
          triageNotes: "Possible tension headache",
          triageOfficer: {
            nurseId: "N-1002",
            firstName: "Brian",
            lastName: "Lee",
          },
          dateOfTriage: new Date("2025-11-10"),
          timeOfTriage: "10:35",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-003",
      name: "Samuel Adeyemi",
      ageSex: "52 / M",
      phoneNumber: 9012345678,
      address: "78 Elm Street, Lagos",
      triageType: "REFERRAL",
      currentTriageCategory: "URGENT",
      lastDateOfTriage: new Date("2025-11-08"),
      lastTimeOfTriage: "09:00",
      companion: {
        name: "Ngozi Adeyemi",
        contact: 9012345679,
        relation: "Wife",
      },
      arrivalDetails: {
        date: new Date("2025-11-08"),
        time: "09:15",
        modeOfTransport: "Taxi",
        referredBy: "Local Health Center",
      },
      medicalHistory: {
        allergies: ["Sulfa drugs"],
        currentMedications: ["Amlodipine", "Atorvastatin"],
        pastIllnesses: ["Hypertension", "Hyperlipidemia"],
        surgeries: ["Hernia repair (2005)"],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: true,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Influenza", "Pneumococcal"],
        immunizationsDate: new Date("2022-09-12"),
        familyHistory: ["Heart disease", "Stroke"],
        safeAtHome: true,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2022-11-10"),
      },
      triageDetails: [
        {
          chiefComplaint: "Shortness of breath and leg swelling",
          vitalSigns: {
            bloodPressure: "160/95",
            heartRate: 98,
            respiratoryRate: 22,
            temperature: 36.9,
            oxygenSaturation: 91,
            weight: 90,
            height: 175,
          },
          painAssessment: {
            scale: 3,
            location: "Legs",
            duration: "1 week",
            characteristics: "Aching",
            aggravatingFactors: "Walking",
            relievingFactors: "Elevation",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "Oxygen via nasal cannula",
          },
          breathingStatus: {
            assessment: "Mild distress",
            breathingNotes: "Slight tachypnea",
            interventions: "Monitor and oxygen therapy",
          },
          circulationStatus: {
            assessment: "Compromised",
            circulationNotes: "Peripheral edema noted",
            interventions: "IV diuretics, monitoring",
          },
          triageCategory: "URGENT",
          triageNotes: "Suspected congestive heart failure",
          triageOfficer: {
            nurseId: "N-1003",
            firstName: "Chloe",
            lastName: "Brown",
          },
          dateOfTriage: new Date("2025-11-08"),
          timeOfTriage: "09:20",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-004",
      name: "Aisha Bello",
      ageSex: "22 / F",
      phoneNumber: 9234567890,
      address: "12 Sunrise Boulevard, Abuja",
      triageType: "WALK_IN",
      currentTriageCategory: "NON_URGENT",
      lastDateOfTriage: new Date("2025-11-09"),
      lastTimeOfTriage: "11:00",
      companion: {
        name: "Fatima Bello",
        contact: 9234567891,
        relation: "Mother",
      },
      arrivalDetails: {
        date: new Date("2025-11-09"),
        time: "11:05",
        modeOfTransport: "Walk-in",
        referredBy: "Self",
      },
      medicalHistory: {
        allergies: ["Peanuts"],
        currentMedications: ["None"],
        pastIllnesses: ["Malaria"],
        surgeries: [],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Tetanus", "Hepatitis B"],
        immunizationsDate: new Date("2023-01-15"),
        familyHistory: ["Asthma"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "Fever and mild cough",
          vitalSigns: {
            bloodPressure: "115/70",
            heartRate: 82,
            respiratoryRate: 20,
            temperature: 38.2,
            oxygenSaturation: 97,
            weight: 58,
            height: 162,
          },
          painAssessment: {
            scale: 2,
            location: "Head",
            duration: "1 day",
            characteristics: "Dull",
            aggravatingFactors: "None",
            relievingFactors: "Paracetamol",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Slightly labored",
            breathingNotes: "Mild cough",
            interventions: "Monitor, hydration",
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Normal pulse",
            interventions: "None",
          },
          triageCategory: "NON_URGENT",
          triageNotes: "Likely viral infection",
          triageOfficer: {
            nurseId: "N-1004",
            firstName: "David",
            lastName: "Nguyen",
          },
          dateOfTriage: new Date("2025-11-09"),
          timeOfTriage: "11:10",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-005",
      name: "Michael Smith",
      ageSex: "68 / M",
      phoneNumber: 9345678901,
      address: "89 Pine Lane, Newtown",
      triageType: "SCHEDULED",
      currentTriageCategory: "NON_URGENT",
      lastDateOfTriage: new Date("2025-11-07"),
      lastTimeOfTriage: "07:30",
      companion: {
        name: "Karen Smith",
        contact: 9345678902,
        relation: "Daughter",
      },
      arrivalDetails: {
        date: new Date("2025-11-07"),
        time: "07:50",
        modeOfTransport: "Ambulance",
        referredBy: "Cardiology Clinic",
      },
      medicalHistory: {
        allergies: ["Latex"],
        currentMedications: ["Warfarin", "Metoprolol"],
        pastIllnesses: ["Atrial Fibrillation", "Hypertension"],
        surgeries: ["CABG (2018)"],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: true,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Influenza", "Pneumococcal"],
        immunizationsDate: new Date("2024-10-20"),
        familyHistory: ["Heart Disease"],
        safeAtHome: true,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2024-11-15"),
      },
      triageDetails: [
        {
          chiefComplaint: "Scheduled cardiac check-up",
          vitalSigns: {
            bloodPressure: "140/85",
            heartRate: 75,
            respiratoryRate: 18,
            temperature: 36.7,
            oxygenSaturation: 95,
            weight: 78,
            height: 170,
          },
          painAssessment: {
            scale: 0,
            location: "",
            duration: "",
            characteristics: "",
            aggravatingFactors: "",
            relievingFactors: "",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular breathing pattern",
            interventions: "None",
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Normal pulse, no edema",
            interventions: "Routine monitoring",
          },
          triageCategory: "NON_URGENT",
          triageNotes: "Routine follow-up",
          triageOfficer: {
            nurseId: "N-1005",
            firstName: "Emma",
            lastName: "Wilson",
          },
          dateOfTriage: new Date("2025-11-07"),
          timeOfTriage: "07:55",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-006",
      name: "Jennifer Chen",
      ageSex: "41 / F",
      phoneNumber: 9456789012,
      address: "234 Willow Drive, Metro City",
      triageType: "EMERGENCY",
      currentTriageCategory: "URGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "13:45",
      companion: {
        name: "David Chen",
        contact: 9456789013,
        relation: "Husband",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "13:20",
        modeOfTransport: "Ambulance",
        referredBy: "Emergency Services",
      },
      medicalHistory: {
        allergies: ["Iodine", "Shellfish"],
        currentMedications: ["Levothyroxine", "Vitamin D"],
        pastIllnesses: ["Hypothyroidism", "Migraines"],
        surgeries: ["C-section (2015)", "Thyroidectomy (2018)"],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Influenza", "Tdap"],
        immunizationsDate: new Date("2024-09-05"),
        familyHistory: ["Thyroid disease", "Breast cancer"],
        safeAtHome: true,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2023-03-22"),
      },
      triageDetails: [
        {
          chiefComplaint: "Severe abdominal pain with vomiting",
          vitalSigns: {
            bloodPressure: "145/92",
            heartRate: 108,
            respiratoryRate: 24,
            temperature: 38.5,
            oxygenSaturation: 94,
            weight: 68,
            height: 167,
          },
          painAssessment: {
            scale: 8,
            location: "Right lower quadrant",
            duration: "6 hours",
            characteristics: "Sharp, constant",
            aggravatingFactors: "Movement, pressure",
            relievingFactors: "None",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Slightly labored",
            breathingNotes: "Shallow breathing due to pain",
            interventions: "Monitor respiratory rate",
          },
          circulationStatus: {
            assessment: "Mild compromise",
            circulationNotes: "Tachycardia, BP elevated",
            interventions: "IV access, fluids",
          },
          triageCategory: "URGENT",
          triageNotes: "Suspected appendicitis, surgical consult needed",
          triageOfficer: {
            nurseId: "N-1006",
            firstName: "Grace",
            lastName: "Martinez",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "13:25",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-007",
      name: "Robert Thompson",
      ageSex: "45 / M",
      phoneNumber: 9567890123,
      address: "567 Cedar Court, Lakeview",
      triageType: "WALK_IN",
      currentTriageCategory: "EMERGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "14:30",
      companion: {
        name: "Sarah Thompson",
        contact: 9567890124,
        relation: "Wife",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "14:15",
        modeOfTransport: "Private Car",
        referredBy: "Self",
      },
      medicalHistory: {
        allergies: ["None"],
        currentMedications: ["None"],
        pastIllnesses: ["None"],
        surgeries: [],
        pregnancy: false,
        substanceUse: {
          tobacco: true,
          alcohol: true,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Tetanus"],
        immunizationsDate: new Date("2020-07-10"),
        familyHistory: ["None significant"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "Severe laceration to right forearm from power saw",
          vitalSigns: {
            bloodPressure: "135/88",
            heartRate: 115,
            respiratoryRate: 22,
            temperature: 36.9,
            oxygenSaturation: 96,
            weight: 95,
            height: 183,
          },
          painAssessment: {
            scale: 9,
            location: "Right forearm",
            duration: "20 minutes",
            characteristics: "Sharp, throbbing",
            aggravatingFactors: "Movement",
            relievingFactors: "Pressure",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular pattern, mild tachypnea from pain",
            interventions: "None",
          },
          circulationStatus: {
            assessment: "Active bleeding",
            circulationNotes: "Deep laceration with active arterial bleeding",
            interventions: "Direct pressure, IV access, fluid resuscitation",
          },
          triageCategory: "EMERGENT",
          triageNotes: "Deep laceration with arterial bleeding, possible tendon damage",
          triageOfficer: {
            nurseId: "N-1001",
            firstName: "Alice",
            lastName: "Smith",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "14:18",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-008",
      name: "Priya Patel",
      ageSex: "33 / F",
      phoneNumber: 9678901234,
      address: "890 Rose Garden, Hillside",
      triageType: "EMERGENCY",
      currentTriageCategory: "EMERGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "15:10",
      companion: {
        name: "Raj Patel",
        contact: 9678901235,
        relation: "Husband",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "15:00",
        modeOfTransport: "Ambulance",
        referredBy: "Emergency Services",
      },
      medicalHistory: {
        allergies: ["Codeine"],
        currentMedications: ["Prenatal vitamins"],
        pastIllnesses: ["Gestational diabetes (previous pregnancy)"],
        surgeries: [],
        pregnancy: true,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Tdap", "Influenza"],
        immunizationsDate: new Date("2024-08-12"),
        familyHistory: ["Diabetes", "Preeclampsia"],
        safeAtHome: true,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2022-01-15"),
      },
      triageDetails: [
        {
          chiefComplaint: "Severe headache, visual disturbances, and upper abdominal pain at 36 weeks gestation",
          vitalSigns: {
            bloodPressure: "165/105",
            heartRate: 105,
            respiratoryRate: 20,
            temperature: 37.1,
            oxygenSaturation: 97,
            weight: 78,
            height: 160,
          },
          painAssessment: {
            scale: 8,
            location: "Head and upper abdomen",
            duration: "2 hours",
            characteristics: "Throbbing headache, sharp abdominal pain",
            aggravatingFactors: "Light, movement",
            relievingFactors: "None",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular breathing pattern",
            interventions: "Continuous monitoring",
          },
          circulationStatus: {
            assessment: "Severely compromised",
            circulationNotes: "Hypertensive, tachycardic, pedal edema 3+",
            interventions: "IV access, antihypertensives, fetal monitoring",
          },
          triageCategory: "EMERGENT",
          triageNotes: "Suspected severe preeclampsia, OB consult urgently needed",
          triageOfficer: {
            nurseId: "N-1007",
            firstName: "Hannah",
            lastName: "Johnson",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "15:03",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-009",
      name: "Carlos Rodriguez",
      ageSex: "19 / M",
      phoneNumber: 9789012345,
      address: "123 University Avenue, College Town",
      triageType: "WALK_IN",
      currentTriageCategory: "URGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "16:20",
      companion: {
        name: "Marcus Brown",
        contact: 9789012346,
        relation: "Friend",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "16:05",
        modeOfTransport: "Private Car",
        referredBy: "Self",
      },
      medicalHistory: {
        allergies: ["None"],
        currentMedications: ["None"],
        pastIllnesses: ["Asthma (childhood)"],
        surgeries: [],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: true,
          drugs: false,
          others: true,
          othersDetails: "Vaping",
        },
        immunizations: ["MMR", "Meningococcal", "HPV"],
        immunizationsDate: new Date("2023-09-01"),
        familyHistory: ["Asthma"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "Severe wheezing and difficulty breathing after basketball game",
          vitalSigns: {
            bloodPressure: "128/78",
            heartRate: 125,
            respiratoryRate: 32,
            temperature: 37.3,
            oxygenSaturation: 89,
            weight: 72,
            height: 180,
          },
          painAssessment: {
            scale: 5,
            location: "Chest",
            duration: "45 minutes",
            characteristics: "Tightness",
            aggravatingFactors: "Deep breathing, talking",
            relievingFactors: "Sitting upright",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Partially compromised",
            airwayNotes: "Audible wheezing",
            interventions: "Nebulizer treatment initiated",
          },
          breathingStatus: {
            assessment: "Severely labored",
            breathingNotes: "Using accessory muscles, intercostal retractions",
            interventions: "Oxygen via mask, nebulizer, steroids",
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Tachycardia secondary to respiratory distress",
            interventions: "IV access for medications",
          },
          triageCategory: "URGENT",
          triageNotes: "Acute asthma exacerbation, needs immediate bronchodilators",
          triageOfficer: {
            nurseId: "N-1008",
            firstName: "Isaac",
            lastName: "Anderson",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "16:10",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-010",
      name: "Margaret O'Brien",
      ageSex: "76 / F",
      phoneNumber: 9890123456,
      address: "456 Sunset Hills, Retirement Village",
      triageType: "REFERRAL",
      currentTriageCategory: "NON_URGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "12:45",
      companion: {
        name: "Patricia O'Brien",
        contact: 9890123457,
        relation: "Daughter",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "12:30",
        modeOfTransport: "Wheelchair Van",
        referredBy: "Nursing Home",
      },
      medicalHistory: {
        allergies: ["Aspirin"],
        currentMedications: ["Donepezil", "Memantine", "Amlodipine", "Furosemide"],
        pastIllnesses: ["Alzheimer's Disease", "Hypertension", "Osteoporosis"],
        surgeries: ["Hip replacement (2019)", "Cataract surgery (2021)"],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Influenza", "Pneumococcal", "Shingles"],
        immunizationsDate: new Date("2024-10-01"),
        familyHistory: ["Dementia", "Hypertension"],
        safeAtHome: false,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2024-06-18"),
      },
      triageDetails: [
        {
          chiefComplaint: "Fall with minor bruising, confusion assessment",
          vitalSigns: {
            bloodPressure: "138/82",
            heartRate: 72,
            respiratoryRate: 16,
            temperature: 36.5,
            oxygenSaturation: 96,
            weight: 59,
            height: 158,
          },
          painAssessment: {
            scale: 3,
            location: "Left hip",
            duration: "2 hours",
            characteristics: "Aching",
            aggravatingFactors: "Weight bearing",
            relievingFactors: "Rest",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 4,
            motorResponse: 6,
            totalScore: 14,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular breathing pattern",
            interventions: "None",
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Normal pulse, no acute concerns",
            interventions: "None",
          },
          triageCategory: "NON_URGENT",
          triageNotes: "Minor fall, baseline confusion per caregiver, X-ray to rule out fracture",
          triageOfficer: {
            nurseId: "N-1009",
            firstName: "Julia",
            lastName: "Davis",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "12:35",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-011",
      name: "Ahmed Hassan",
      ageSex: "58 / M",
      phoneNumber: 9901234567,
      address: "789 Market Street, Downtown",
      triageType: "EMERGENCY",
      currentTriageCategory: "EMERGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "17:40",
      companion: {
        name: "Layla Hassan",
        contact: 9901234568,
        relation: "Wife",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "17:25",
        modeOfTransport: "Ambulance",
        referredBy: "Emergency Services",
      },
      medicalHistory: {
        allergies: ["None"],
        currentMedications: ["Metformin", "Glipizide", "Lisinopril"],
        pastIllnesses: ["Type 2 Diabetes", "Hypertension", "Hyperlipidemia"],
        surgeries: ["None"],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Influenza"],
        immunizationsDate: new Date("2024-11-01"),
        familyHistory: ["Diabetes", "Stroke"],
        safeAtHome: true,
        previouslyAdmitted: true,
        dateOfLastAdmission: new Date("2023-08-05"),
      },
      triageDetails: [
        {
          chiefComplaint: "Sudden onset right-sided weakness and slurred speech",
          vitalSigns: {
            bloodPressure: "195/115",
            heartRate: 88,
            respiratoryRate: 18,
            temperature: 37.0,
            oxygenSaturation: 97,
            weight: 98,
            height: 172,
          },
          painAssessment: {
            scale: 2,
            location: "Head",
            duration: "30 minutes",
            characteristics: "Dull pressure",
            aggravatingFactors: "None",
            relievingFactors: "None",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 4,
            motorResponse: 5,
            totalScore: 13,
          },
          airwayStatus: {
            assessment: "Patent",
            airwayNotes: "No obstruction, drooling noted",
            interventions: "Suction available",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular breathing pattern",
            interventions: "Oxygen via nasal cannula",
          },
          circulationStatus: {
            assessment: "Severely compromised",
            circulationNotes: "Severe hypertension, right-sided weakness",
            interventions: "IV access, stroke protocol activated",
          },
          triageCategory: "EMERGENT",
          triageNotes: "Code stroke - suspected CVA, neurology consult STAT, CT ordered",
          triageOfficer: {
            nurseId: "N-1002",
            firstName: "Brian",
            lastName: "Lee",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "17:28",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-012",
      name: "Emily Rodriguez",
      ageSex: "7 / F",
      phoneNumber: 9012345789,
      address: "321 Playground Avenue, Suburbia",
      triageType: "WALK_IN",
      currentTriageCategory: "URGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "18:25",
      companion: {
        name: "Maria Rodriguez",
        contact: 9012345790,
        relation: "Mother",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "18:10",
        modeOfTransport: "Private Car",
        referredBy: "Self",
      },
      medicalHistory: {
        allergies: ["None"],
        currentMedications: ["None"],
        pastIllnesses: ["Chickenpox (2023)"],
        surgeries: [],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["DTaP", "MMR", "Varicella", "IPV"],
        immunizationsDate: new Date("2024-05-12"),
        familyHistory: ["Asthma (maternal side)"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "High fever, severe sore throat, drooling, difficulty swallowing",
          vitalSigns: {
            bloodPressure: "95/60",
            heartRate: 145,
            respiratoryRate: 28,
            temperature: 39.8,
            oxygenSaturation: 94,
            weight: 23,
            height: 122,
          },
          painAssessment: {
            scale: 8,
            location: "Throat",
            duration: "8 hours",
            characteristics: "Severe, sharp",
            aggravatingFactors: "Swallowing, talking",
            relievingFactors: "None",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Partially compromised",
            airwayNotes: "Sitting upright, drooling, muffled voice",
            interventions: "Keep calm, oxygen available, airway equipment ready",
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Tachypnea, stridor noted",
            interventions: "Humidified oxygen, position of comfort, avoid agitation",
          },
          circulationStatus: {
            assessment: "Compensated",
            circulationNotes: "Tachycardia, fever",
            interventions: "IV access attempted gently, fluids",
          },
          triageCategory: "URGENT",
          triageNotes: "Suspected epiglottitis, ENT consult needed urgently, avoid throat examination",
          triageOfficer: {
            nurseId: "N-1010",
            firstName: "Kevin",
            lastName: "Park",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "18:15",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-013",
      name: "Thomas Murphy",
      ageSex: "63 / M",
      phoneNumber: 9123456890,
      address: "654 Harbor View, Coastal Town",
      triageType: "REFERRAL",
      currentTriageCategory: "NON_URGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "10:15",
      companion: {
        name: "None",
        contact: null,
        relation: "None",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "10:00",
        modeOfTransport: "Private Car",
        referredBy: "Primary Care Physician",
      },
      medicalHistory: {
        allergies: ["Contrast dye"],
        currentMedications: ["Omeprazole", "Simvastatin"],
        pastIllnesses: ["GERD", "Hyperlipidemia"],
        surgeries: ["Gallbladder removal (2015)"],
        pregnancy: false,
        substanceUse: {
          tobacco: true,
          alcohol: true,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["Influenza", "Hepatitis B"],
        immunizationsDate: new Date("2024-09-20"),
        familyHistory: ["Colon cancer"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "Scheduled colonoscopy for screening",
          vitalSigns: {
            bloodPressure: "132/84",
            heartRate: 68,
            respiratoryRate: 16,
            temperature: 36.8,
            oxygenSaturation: 98,
            weight: 88,
            height: 177,
          },
          painAssessment: {
            scale: 0,
            location: "",
            duration: "",
            characteristics: "",
            aggravatingFactors: "",
            relievingFactors: "",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Clear",
            airwayNotes: "No obstruction",
            interventions: "None",
          },
          breathingStatus: {
            assessment: "Normal",
            breathingNotes: "Regular breathing pattern",
            interventions: "None",
          },
          circulationStatus: {
            assessment: "Stable",
            circulationNotes: "Normal vital signs",
            interventions: "None",
          },
          triageCategory: "NON_URGENT",
          triageNotes: "Routine screening colonoscopy, NPO verified",
          triageOfficer: {
            nurseId: "N-1011",
            firstName: "Laura",
            lastName: "White",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "10:05",
        },
      ],
    },
  },
  {
    patient: {
      id: "PT-014",
      name: "Fatima Osman",
      ageSex: "29 / F",
      phoneNumber: 9234567901,
      address: "987 Highland Road, Mountain View",
      triageType: "EMERGENCY",
      currentTriageCategory: "URGENT",
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "19:50",
      companion: {
        name: "Hassan Osman",
        contact: 9234567902,
        relation: "Husband",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
        time: "19:30",
        modeOfTransport: "Private Car",
        referredBy: "Self",
      },
      medicalHistory: {
        allergies: ["Morphine"],
        currentMedications: ["None"],
        pastIllnesses: ["None"],
        surgeries: [],
        pregnancy: false,
        substanceUse: {
          tobacco: false,
          alcohol: false,
          drugs: false,
          others: false,
          othersDetails: "",
        },
        immunizations: ["MMR", "Hepatitis B", "Tdap"],
        immunizationsDate: new Date("2023-02-14"),
        familyHistory: ["Hypertension"],
        safeAtHome: true,
        previouslyAdmitted: false,
        dateOfLastAdmission: null,
      },
      triageDetails: [
        {
          chiefComplaint: "Severe allergic reaction after eating at restaurant",
          vitalSigns: {
            bloodPressure: "105/68",
            heartRate: 118,
            respiratoryRate: 26,
            temperature: 37.1,
            oxygenSaturation: 92,
            weight: 63,
            height: 165,
          },
          painAssessment: {
            scale: 6,
            location: "Throat and chest",
            duration: "15 minutes",
            characteristics: "Tightness, difficulty breathing",
            aggravatingFactors: "Swallowing",
            relievingFactors: "None",
          },
          glasgowComaScale: {
            eyeOpening: 4,
            verbalResponse: 5,
            motorResponse: 6,
            totalScore: 15,
          },
          airwayStatus: {
            assessment: "Compromised",
            airwayNotes: "Throat swelling, hoarse voice, lip angioedema",
            interventions: "Epinephrine administered, airway monitoring",
          },
          breathingStatus: {
            assessment: "Labored",
            breathingNotes: "Wheezing, use of accessory muscles",
            interventions: "Oxygen via mask, nebulizer, steroids given",
          },
          circulationStatus: {
            assessment: "Mild compromise",
            circulationNotes: "Tachycardia, BP stable but lower than normal",
            interventions: "IV access, fluids, antihistamines",
          },
          triageCategory: "URGENT",
          triageNotes: "Anaphylaxis reaction, epinephrine given, needs observation",
          triageOfficer: {
            nurseId: "N-1012",
            firstName: "Michael",
            lastName: "Thompson",
          },
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "19:33",
        },
      ],
    },
  },

];
