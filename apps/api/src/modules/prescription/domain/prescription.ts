export interface MedicationItem { medication: string; strength: string; dose: string; route: string; frequency: string; duration: string; quantity: string; repeats: number }
export interface PrescriptionContent { items: MedicationItem[]; directions: string }
