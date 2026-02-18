/**
 * FRD 7.1, 7.2, 7.3 – Competition master data (COP-aligned).
 * These are the fixed age categories and event types for WYC 2026.
 */

import type { AgeCategory, EventType, EligibilityRule } from './types';

export const CUTOFF_DATE = '2026-01-01';

export const AGE_CATEGORIES: AgeCategory[] = [
  { id: 'SUBJ', code: 'SUBJ', label: 'Sub Junior', minAge: 10, maxAge: 14, enabled: true },
  { id: 'JUN', code: 'JUN', label: 'Junior', minAge: 14, maxAge: 18, enabled: true },
  { id: 'SEN', code: 'SEN', label: 'Senior', minAge: 18, maxAge: 28, enabled: true },
  { id: 'SENA', code: 'SENA', label: 'Senior A', minAge: 28, maxAge: 35, enabled: true },
  { id: 'SENB', code: 'SENB', label: 'Senior B', minAge: 35, maxAge: 45, enabled: true },
  { id: 'SENC', code: 'SENC', label: 'Senior C', minAge: 45, maxAge: 55, enabled: true },
];

export const EVENT_TYPES: EventType[] = [
  { id: 'IND-01', code: 'IND-01', name: 'Traditional Yogasana', family: 'Individual', enabled: true },
  { id: 'IND-02', code: 'IND-02', name: 'Forward Bend Individual', family: 'Individual', enabled: true },
  { id: 'IND-03', code: 'IND-03', name: 'Back Bend Individual', family: 'Individual', enabled: true },
  { id: 'IND-04', code: 'IND-04', name: 'Leg Balance Individual', family: 'Individual', enabled: true },
  { id: 'IND-05', code: 'IND-05', name: 'Twisting Body Individual', family: 'Individual', enabled: true },
  { id: 'IND-06', code: 'IND-06', name: 'Hand Balance Individual', family: 'Individual', enabled: true },
  { id: 'IND-07', code: 'IND-07', name: 'Supine Individual', family: 'Individual', enabled: true },
  { id: 'IND-08', code: 'IND-08', name: 'Kalatmak Ekal Yogasana (Artistic Single)', family: 'Individual', enabled: true },
  { id: 'PAIR-01', code: 'PAIR-01', name: 'Kalatmak Yugal Yogasana (Artistic Pair)', family: 'Pair', enabled: true },
  { id: 'PAIR-02', code: 'PAIR-02', name: 'Talatmak Yugal Yogasana (Rhythmic Pair)', family: 'Pair', enabled: true },
  { id: 'GRP-01', code: 'GRP-01', name: 'Kalatmak Samuha Yogasana (Artistic Group)', family: 'Group/Team', enabled: true },
  { id: 'GRP-02', code: 'GRP-02', name: 'Traditional Yogasana Group', family: 'Group/Team', enabled: true },
];

// FRD 7.3 – Kalatmak/Talatmak/Samuha allowed up to Senior; not Senior A/B/C. Traditional Group up to Senior A.
const ARTISTIC_EVENT_IDS = ['IND-08', 'PAIR-01', 'PAIR-02', 'GRP-01'];
const TRADITIONAL_GROUP_ID = 'GRP-02';
const SENIOR_AND_BELOW = ['SUBJ', 'JUN', 'SEN'];
const UP_TO_SENIOR_A = ['SUBJ', 'JUN', 'SEN', 'SENA'];

export function buildDefaultEligibility(): EligibilityRule[] {
  const rules: EligibilityRule[] = [];
  for (const et of EVENT_TYPES) {
    for (const ac of AGE_CATEGORIES) {
      let allowed = true;
      if (ARTISTIC_EVENT_IDS.includes(et.id)) {
        allowed = SENIOR_AND_BELOW.includes(ac.id);
      } else if (et.id === TRADITIONAL_GROUP_ID) {
        allowed = UP_TO_SENIOR_A.includes(ac.id);
      }
      rules.push({ eventTypeId: et.id, ageCategoryId: ac.id, allowed });
    }
  }
  return rules;
}

export function isEventEligibleForAge(eventTypeId: string, ageCategoryId: string, rules: EligibilityRule[]): boolean {
  const r = rules.find((x) => x.eventTypeId === eventTypeId && x.ageCategoryId === ageCategoryId);
  return r?.allowed ?? false;
}
