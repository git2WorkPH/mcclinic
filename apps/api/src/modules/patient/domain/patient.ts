export interface PatientInput { givenName: string; familyName: string; birthDate: string; phone: string; email: string; address: string }
export interface Patient extends PatientInput { id: string; version: number; createdAt: string }
export interface Page<T> { items: T[]; total: number; offset: number }
