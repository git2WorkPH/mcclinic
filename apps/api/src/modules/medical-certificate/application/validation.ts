import { AppError, validDate } from '../../../application/context.js';
import type { CertificateContent } from '../domain/certificate.js';
export function validateCertificate(content: CertificateContent) {
  if(!content.title.trim() || !content.statement.trim() || !validDate(content.startsOn) || !validDate(content.endsOn) || content.endsOn<content.startsOn) throw new AppError('VALIDATION','Enter certificate text and a valid start/end date range.');
}
