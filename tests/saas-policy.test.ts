import {describe,it,expect} from 'vitest';
import {ageAtIssue,validateTemplate,defaultTemplate,populate} from '../apps/api/src/modules/templates/application/template';
import {effectiveState} from '../apps/api/src/modules/subscription/application/policy';
describe('development SaaS policy',()=>{
 it('calculates age against issue date, including birthday boundaries',()=>{expect(ageAtIssue('2000-09-12','2026-09-11')).toBe(25);expect(ageAtIssue('2000-09-12','2026-09-12')).toBe(26);expect(ageAtIssue('2000-09-12','2025-01-01')).toBe(24);});
 it('rejects executable, malformed or unknown template input and missing referenced values',()=>{for(const body of ['<script>alert(1)</script>','{{secret}}','{{patient.fullName}'])expect(()=>validateTemplate({...defaultTemplate,body})).toThrow();expect(()=>populate('{{patient.address}}',{})).toThrow('Missing template value');expect(populate('{{patient.fullName}}',{'patient.fullName':'<img src=x>'})).toBe('&lt;img src=x&gt;');});
 it('uses explicit trial/grace deadlines without granting clinical permission',()=>{expect(effectiveState({state:'TRIAL',until:new Date('2026-01-01')},new Date('2026-01-01'))).toBe('RESTRICTED');expect(effectiveState({state:'PAST_DUE',until:new Date('2026-01-02')},new Date('2026-01-01'))).toBe('PAST_DUE');expect(effectiveState({state:'ACTIVE',until:null})).toBe('ACTIVE');});
});
