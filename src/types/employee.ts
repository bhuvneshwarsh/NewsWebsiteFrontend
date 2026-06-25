// ── Add these to your existing src/types/index.ts ────────────────────────────

export interface EmployeeCard {
  id:          number;
  employeeId:  string;
  fullName:    string;
  designation: string;
  imageUrl:    string | null;
}

export interface EmployeeDetail extends EmployeeCard {
  email:     string | null;
  validUpto: string | null;   // "YYYY-MM-DD"
}

export interface EmployeeAdmin extends EmployeeDetail {
  mobile:       string | null;
  address:      string | null;
  dateOfBirth:  string | null;
  govtIdType:   string | null;
  govtIdNumber: string | null;
  isActive:     boolean;
  displayOrder: number;
  createdAt:    string;
}

export interface CreateEmployeePayload {
  fullName:     string;
  designation:  string;
  email?:       string;
  mobile?:      string;
  address?:     string;
  dateOfBirth?: string;
  validUpto?:   string;
  govtIdType?:  string;
  govtIdNumber?:string;
  imageUrl?:    string;
  displayOrder?: number;
}
