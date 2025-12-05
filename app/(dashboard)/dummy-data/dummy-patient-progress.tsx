export interface ProgressNotesRecord {
    id: string
    patientId: string
    progressNotes: {
        focus: string
        data: string
        action: string
        response: string
        dateRecorded: Date
        timeRecorded: string
        nurseId: string
    }[]
}