export interface PatientRecord {
    id: string
    firstName: string
    middleName: string
    lastName: string
    gender: "MALE" | "FEMALE"
    age: number
    contactNumber: string
    dateRegistered: string
    status: "ACTIVE" | "INACTIVE" | "PENDING"
}

export const dummyRegistrations: PatientRecord[] = [
    {
        id: "PAT-2024-0001",
        firstName: "Juan",
        middleName: "Santos",
        lastName: "Dela Cruz",
        gender: "MALE",
        age: 45,
        contactNumber: "+63 917 123 4567",
        dateRegistered: "2024-10-15",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0002",
        firstName: "Maria",
        middleName: "Garcia",
        lastName: "Reyes",
        gender: "FEMALE",
        age: 32,
        contactNumber: "+63 918 234 5678",
        dateRegistered: "2024-10-16",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0003",
        firstName: "Pedro",
        middleName: "Martinez",
        lastName: "Santos",
        gender: "MALE",
        age: 58,
        contactNumber: "+63 919 345 6789",
        dateRegistered: "2024-10-17",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0004",
        firstName: "Ana",
        middleName: "Cruz",
        lastName: "Gonzales",
        gender: "FEMALE",
        age: 27,
        contactNumber: "+63 920 456 7890",
        dateRegistered: "2024-10-18",
        status: "PENDING"
    },
    {
        id: "PAT-2024-0005",
        firstName: "Jose",
        middleName: "Ramos",
        lastName: "Mendoza",
        gender: "MALE",
        age: 41,
        contactNumber: "+63 921 567 8901",
        dateRegistered: "2024-10-19",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0006",
        firstName: "Luz",
        middleName: "Torres",
        lastName: "Aquino",
        gender: "FEMALE",
        age: 65,
        contactNumber: "+63 922 678 9012",
        dateRegistered: "2024-10-20",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0007",
        firstName: "Carlos",
        middleName: "Bautista",
        lastName: "Rivera",
        gender: "MALE",
        age: 29,
        contactNumber: "+63 923 789 0123",
        dateRegistered: "2024-10-21",
        status: "INACTIVE"
    },
    {
        id: "PAT-2024-0008",
        firstName: "Rosa",
        middleName: "Flores",
        lastName: "Fernandez",
        gender: "FEMALE",
        age: 52,
        contactNumber: "+63 924 890 1234",
        dateRegistered: "2024-10-22",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0009",
        firstName: "Miguel",
        middleName: "Castro",
        lastName: "Lopez",
        gender: "MALE",
        age: 38,
        contactNumber: "+63 925 901 2345",
        dateRegistered: "2024-10-23",
        status: "PENDING"
    },
    {
        id: "PAT-2024-0010",
        firstName: "Elena",
        middleName: "Diaz",
        lastName: "Morales",
        gender: "FEMALE",
        age: 44,
        contactNumber: "+63 926 012 3456",
        dateRegistered: "2024-10-24",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0011",
        firstName: "Ramon",
        middleName: "Villanueva",
        lastName: "Pascual",
        gender: "MALE",
        age: 71,
        contactNumber: "+63 927 123 4567",
        dateRegistered: "2024-10-25",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0012",
        firstName: "Carmen",
        middleName: "Salazar",
        lastName: "Santiago",
        gender: "FEMALE",
        age: 35,
        contactNumber: "+63 928 234 5678",
        dateRegistered: "2024-10-26",
        status: "ACTIVE"
    },
    {
        id: "PAT-2024-0013",
        firstName: "Ricardo",
        middleName: "Navarro",
        lastName: "Magno",
        gender: "MALE",
        age: 49,
        contactNumber: "+63 929 345 6789",
        dateRegistered: "2024-10-27",
        status: "INACTIVE"
    },
    {
        id: "PAT-2024-0014",
        firstName: "Sofia",
        middleName: "Valdez",
        lastName: "Aguilar",
        gender: "FEMALE",
        age: 23,
        contactNumber: "+63 930 456 7890",
        dateRegistered: "2024-10-28",
        status: "PENDING"
    },
    {
        id: "PAT-2024-0015",
        firstName: "Fernando",
        middleName: "Ortiz",
        lastName: "Castillo",
        gender: "MALE",
        age: 56,
        contactNumber: "+63 931 567 8901",
        dateRegistered: "2024-10-28",
        status: "ACTIVE"
    }
]