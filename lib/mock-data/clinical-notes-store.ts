type MockStaff = {
  id: string
  firstName: string
  lastName: string
  jobTitle: string
}

type MockClinicalNoteComment = {
  id: string
  comment: string
  createdAt: string
  createdByStaff: MockStaff
}

export type MockClinicalNote = {
  id: string
  encounterId: string
  authorId: string
  cosignerId: string | null
  noteType: string
  title: string
  content: string
  status: string
  isSensitive: boolean
  createdAt: string
  signedAt: string | null
  author: MockStaff
  cosigner: MockStaff | null
  comments: MockClinicalNoteComment[]
}

const nurseAuthor: MockStaff = {
  id: 'staff_nurse_1',
  firstName: 'Jamie',
  lastName: 'Cruz',
  jobTitle: 'RN',
}

const clinicianCosigner: MockStaff = {
  id: 'staff_doctor_1',
  firstName: 'Miguel',
  lastName: 'Santos',
  jobTitle: 'MD',
}

let mockClinicalNotes: MockClinicalNote[] = [
  {
    id: 'cn-1',
    encounterId: 'e1',
    authorId: nurseAuthor.id,
    cosignerId: clinicianCosigner.id,
    noteType: 'NURSING_NOTE',
    title: 'Shift Assessment and Medication Follow-up',
    content:
      'Patient alert and oriented x4. Pain improved to 3/10 after PRN acetaminophen. Tolerating oral intake and ambulating with standby assist.',
    status: 'PENDING_COSIGN',
    isSensitive: false,
    createdAt: '2026-04-09T09:15:00.000Z',
    signedAt: null,
    author: nurseAuthor,
    cosigner: clinicianCosigner,
    comments: [],
  },
  {
    id: 'cn-2',
    encounterId: 'e1',
    authorId: nurseAuthor.id,
    cosignerId: clinicianCosigner.id,
    noteType: 'TRIAGE_NOTE',
    title: 'Intake Vital Signs and Symptom Review',
    content:
      'Initial triage completed. Patient reports dizziness this morning but denies chest pain or shortness of breath. Fall precautions initiated.',
    status: 'NEEDS_CORRECTION',
    isSensitive: false,
    createdAt: '2026-04-09T07:40:00.000Z',
    signedAt: null,
    author: nurseAuthor,
    cosigner: clinicianCosigner,
    comments: [
      {
        id: 'cn-2-comment-1',
        comment: 'Please clarify whether orthostatic vitals were completed and document the patient response.',
        createdAt: '2026-04-09T08:05:00.000Z',
        createdByStaff: clinicianCosigner,
      },
    ],
  },
  {
    id: 'cn-3',
    encounterId: 'e1',
    authorId: nurseAuthor.id,
    cosignerId: clinicianCosigner.id,
    noteType: 'PROGRESS_NOTE',
    title: 'Wound Care Follow-up',
    content:
      'Dressing changed per order. Incision remains clean, dry, and intact with no drainage. Patient educated on signs of infection and verbalized understanding.',
    status: 'SIGNED',
    isSensitive: false,
    createdAt: '2026-04-08T13:10:00.000Z',
    signedAt: '2026-04-08T13:45:00.000Z',
    author: nurseAuthor,
    cosigner: clinicianCosigner,
    comments: [],
  },
]

export function getNotes(encounterId?: string): MockClinicalNote[] {
  const notes = encounterId
    ? mockClinicalNotes.filter((note) => note.encounterId === encounterId)
    : mockClinicalNotes

  return [...notes].sort((left, right) => {
    const leftTime = new Date(left.createdAt).getTime()
    const rightTime = new Date(right.createdAt).getTime()
    return rightTime - leftTime
  })
}

export function addNote(
  data: Omit<MockClinicalNote, 'id' | 'createdAt'>
): MockClinicalNote {
  const note: MockClinicalNote = {
    ...data,
    createdAt: new Date().toISOString(),
    id: crypto.randomUUID(),
  }

  mockClinicalNotes = [note, ...mockClinicalNotes]
  return note
}

export function updateNote(
  id: string,
  updates: Partial<MockClinicalNote>
): MockClinicalNote | null {
  let updatedNote: MockClinicalNote | null = null

  mockClinicalNotes = mockClinicalNotes.map((note) => {
    if (note.id !== id) {
      return note
    }

    updatedNote = { ...note, ...updates }
    return updatedNote
  })

  return updatedNote
}
