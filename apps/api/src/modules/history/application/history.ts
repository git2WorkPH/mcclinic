import { authorize, type Actor } from '../../../application/context.js';
export interface HistoryEntry { id: string; type: string; occurredAt: string; recordedAt: string; summary: string; version: number; sourceId: string }
export interface HistorySources { entries(actor: Actor,patientId: string): Promise<HistoryEntry[]> }
export function historyUseCases(sources: HistorySources) {
  return { async list(actor: Actor | null,patientId: string,offset: number,limit: number) {
    const a=authorize(actor,'clinical');const all=await sources.entries(a,patientId);
    all.sort((x,y)=>y.occurredAt.localeCompare(x.occurredAt)||x.id.localeCompare(y.id));
    return {items:all.slice(offset,offset+limit),total:all.length,offset};
  }};
}
