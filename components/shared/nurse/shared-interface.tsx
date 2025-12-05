export interface PatientRecord {
    patientId: string;
    patientName: string;
    ageSex: string;
    currentPhysician: string;
    currentWard: string;
    currentRoom: string;
    chiefComplaint: string;
    diagnosis: string;
    allergies: string;
    vitals: VitalsRecord[]
}

export interface NurseRecord {
    nurseId: string;
    nurseName: string;
    ageSex: string;
    // liscenseNumber: string;
    // liscenseExpiryDate: Date;
    nursePosition: string;
    nurseSpecialty: string;
    nurseDepartment: string;
    currentAssignment: string;
    signature: string;
}

export interface VitalsRecord {
    id: string
    patientId: string
    temperature: number
    pulseRate: number
    respirationRate: number
    systolicBP: number
    diastolicBP: number
    oxygenSaturation: number
    painLevel: number
    notes: string
    dateTaken: Date
    timeTaken: string
    nurseId: string
}