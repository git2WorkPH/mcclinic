import { AppError } from '../../../application/context.js';
import type { PrescriptionContent } from '../domain/prescription.js';
export function validatePrescription(content: PrescriptionContent) {
  if(!content.directions.trim() || content.items.length<1 || content.items.length>30) throw new AppError('VALIDATION','Directions and 1–30 medication items are required.');
  for(const item of content.items) {
    if([item.medication,item.strength,item.dose,item.route,item.frequency,item.duration,item.quantity].some(v=>!v.trim()) || !Number.isInteger(item.repeats) || item.repeats<0 || item.repeats>12) throw new AppError('VALIDATION','Complete all medication fields; repeats must be 0–12.');
  }
}
