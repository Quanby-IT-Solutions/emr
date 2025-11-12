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
        lastTimeOfTriage: string | null;
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
      lastDateOfTriage: new Date(),
      lastTimeOfTriage: "10:30 AM",
      companion: {
        name: "Jane Doe",
        contact: 9876543222,
        relation: "Wife",
      },
      arrivalDetails: {
        date: new Date ("2025-11-12"),
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
      lastDateOfTriage: new Date(),
      lastTimeOfTriage: "11:15 AM",
      companion: {
        name: "Luis Gonzalez",
        contact: 9123456781,
        relation: "Brother",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
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
          dateOfTriage: new Date("2025-11-12"),
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
      lastDateOfTriage: new Date(),
      lastTimeOfTriage: "09:00 AM",
      companion: {
        name: "Ngozi Adeyemi",
        contact: 9012345679,
        relation: "Wife",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
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
          dateOfTriage: new Date("2025-11-12"),
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
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "11:00 AM",
      companion: {
        name: "Fatima Bello",
        contact: 9234567891,
        relation: "Mother",
      },
      arrivalDetails: {
        date: new Date("2025-11-9"),
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
          dateOfTriage: new Date("2025-11-12"),
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
      lastDateOfTriage: new Date("2025-11-12"),
      lastTimeOfTriage: "07:30 AM",
      companion: {
        name: "Karen Smith",
        contact: 9345678902,
        relation: "Daughter",
      },
      arrivalDetails: {
        date: new Date("2025-11-12"),
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
          dateOfTriage: new Date("2025-11-12"),
          timeOfTriage: "07:55",
        },
      ],
    },
  },
];
