// Patient model
export interface Patient {
  id: string
  firstName: string
  middleName: string
  lastName: string
  mobileNumber: string
  birthday: string
  age: number
}

// Mock Patients Data
export const mockPatients: Patient[] = [
  { 
    id: "P001", 
    firstName: "John", 
    middleName: "Alexander", 
    lastName: "Smith", 
    mobileNumber: "09171234567", 
    birthday: "1985-03-12", 
    age: 40 
  },
  { 
    id: "P002", 
    firstName: "Maria", 
    middleName: "Elena", 
    lastName: "Garcia", 
    mobileNumber: "09281234568", 
    birthday: "1992-07-25", 
    age: 33 
  },
  { 
    id: "P003", 
    firstName: "David", 
    middleName: "Lee", 
    lastName: "Anderson", 
    mobileNumber: "09391234569", 
    birthday: "1978-11-02", 
    age: 47 
  },
  { 
    id: "P004", 
    firstName: "Sophia", 
    middleName: "Grace", 
    lastName: "Nguyen", 
    mobileNumber: "09451234570", 
    birthday: "1998-01-30", 
    age: 27 
  },
  { 
    id: "P005", 
    firstName: "Michael", 
    middleName: "James", 
    lastName: "Brown", 
    mobileNumber: "09561234571", 
    birthday: "1990-09-18", 
    age: 35 
  },
  { 
    id: "P006", 
    firstName: "Emily", 
    middleName: "Elizabeth", 
    lastName: "Wong", 
    mobileNumber: "09671234572", 
    birthday: "1983-05-10", 
    age: 42 
  },
  { 
    id: "P007", 
    firstName: "Daniel", 
    middleName: "Robert", 
    lastName: "Kim", 
    mobileNumber: "09781234573", 
    birthday: "1988-12-05", 
    age: 37 
  },
  { 
    id: "P008", 
    firstName: "Olivia", 
    middleName: "Sophia", 
    lastName: "Chen", 
    mobileNumber: "09891234574", 
    birthday: "1995-06-15", 
    age: 30 
  },
]