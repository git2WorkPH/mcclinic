import type { PrescriptionContent } from '../../modules/prescription/domain/prescription.js';
import type { CertificateContent } from '../../modules/medical-certificate/domain/certificate.js';
export type DocumentKind = 'PRESCRIPTION' | 'CERTIFICATE';
export type DocumentContent = PrescriptionContent | CertificateContent;
export interface ClinicalDocument { id: string; kind: DocumentKind; patientId: string; consultationId: string | null; authorId: string; state: string; version: number; content: DocumentContent; createdAt: string }
export interface DocumentRevision { id: string; documentId: string; version: number; state: string; content: DocumentContent; patientSnapshot: { id: string; name: string; birthDate: string }; issuerSnapshot: { id: string; name: string }; templateVersion: string; authorId: string; reason: string; previousVersion: number | null; recordedAt: string }
