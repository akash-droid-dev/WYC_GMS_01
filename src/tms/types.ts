/* WYC 2026 TMS - Type Definitions */

export type Gender = 'M' | 'F';
export type EntryStatus = 'Draft' | 'Confirmed' | 'Locked' | 'Withdrawn' | 'DQ';
export type SessionStatus = 'Pending' | 'Checked-in' | 'No-show' | 'Completed' | 'Performing';
export type ResultStatus = 'Provisional' | 'Official' | 'Under Protest' | 'Revised';
export type ProtestStatus = 'Pending' | 'Upheld' | 'Dismissed' | 'Partial';
export type UserRole = 'Super Admin' | 'Comp Admin' | 'Tech Admin' | 'Chief Judge' | 'Judge' | 'Scoring Op' | 'Delegation Mgr' | 'Public';

export interface AgeCategory {
  id: string;
  label: string;
  minAge: number;
  maxAge: number;
}

export interface Discipline {
  id: string;
  name: string;
  type: 'Individual' | 'Pair' | 'Group';
  style: 'Traditional' | 'Artistic' | 'Rhythmic' | 'Free Flow';
  components: string[];
}

export interface EligibilityMatrix {
  [disciplineId: string]: { [ageCatId: string]: boolean };
}

export interface Delegation {
  id: string;
  code: string;
  name: string;
  headOfDelegation: string;
  type: 'Country' | 'State';
  athleteCount: number;
  entryCount: number;
  status: string;
}

export interface Athlete {
  id: string;
  regId: string;
  fullName: string;
  delegationId: string;
  gender: Gender;
  dob: string;
  age: number;
  ageCategoryId: string;
  disciplines: string[];
  entryCount: number;
  status: string;
}

export interface Team {
  id: string;
  name: string;
  delegationId: string;
  type: 'Pair' | 'Group';
  memberIds: string[];
  disciplineId: string;
  coach?: string;
}

export interface MedalEvent {
  id: string;
  code: string;
  name: string;
  disciplineId: string;
  ageCategoryId: string;
  gender: Gender;
  type: 'Individual' | 'Pair' | 'Group';
}

export interface Entry {
  id: string;
  eventId: string;
  athleteId?: string;
  teamId?: string;
  delegationId: string;
  type: 'Individual' | 'Pair' | 'Group';
  status: EntryStatus;
  createdAt: string;
}

export interface CompetitionDay {
  id: string;
  date: string;
  label: string;
}

export interface Session {
  id: string;
  dayId: string;
  eventId: string;
  matId: string;
  startTime: string;
  endTime: string;
  startList: PerformanceSlot[];
  status: string;
}

export interface PerformanceSlot {
  id: string;
  order: number;
  athleteId?: string;
  teamId?: string;
  checkInStatus: SessionStatus;
  scores?: ComponentScore[];
  deductions?: Deduction[];
  finalScore?: number;
}

export interface ComponentScore {
  component: string;
  value: number;
  judgeId?: string;
}

export interface Deduction {
  reason: string;
  value: number;
  code: string;
}

export interface Result {
  id: string;
  eventId: string;
  version: number;
  publishedAt: string;
  status: ResultStatus;
  rankings: Ranking[];
}

export interface Ranking {
  rank: number;
  athleteId?: string;
  teamId?: string;
  delegationId: string;
  totalScore: number;
  medal?: 'Gold' | 'Silver' | 'Bronze';
  tieBreakReason?: string;
}

export interface MedalTally {
  delegationId: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export interface Protest {
  id: string;
  eventId: string;
  filedBy: string;
  filedAt: string;
  subject: string;
  status: ProtestStatus;
  evidence: string[];
  decision?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  delegationId?: string;
  assignedEvents?: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  entity: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
}
