/* WYC 2026 TMS - State Management */
import { create } from 'zustand';
import type {
  AgeCategory,
  Discipline,
  Delegation,
  Athlete,
  Team,
  MedalEvent,
  Entry,
  Session,
  PerformanceSlot,
  Result,
  Ranking,
  Protest,
  User,
  ComponentScore,
  Deduction,
} from '../types';

const CUTOFF_DATE = '2026-01-01';
const SCORING_COMPONENTS = ['Posture', 'Breathing', 'Technique', 'Presentation', 'Difficulty'];

// Age calculation helper
export function calcAge(dob: string, cutoff: string = CUTOFF_DATE): number {
  const [cY, cM, cD] = cutoff.split('-').map(Number);
  const [bY, bM, bD] = dob.split('-').map(Number);
  let age = cY - bY;
  if (bM > cM || (bM === cM && bD > cD)) age--;
  return age;
}

// Initial data
const ageCategories: AgeCategory[] = [
  { id: 'subjr', label: 'Sub Jr', minAge: 10, maxAge: 14 },
  { id: 'jra', label: 'Jr A', minAge: 15, maxAge: 17 },
  { id: 'jrb', label: 'Jr B', minAge: 18, maxAge: 24 },
  { id: 'sra', label: 'Sr A', minAge: 25, maxAge: 34 },
  { id: 'srb', label: 'Sr B', minAge: 35, maxAge: 44 },
  { id: 'src', label: 'Sr C', minAge: 45, maxAge: 55 },
];

const disciplines: Discipline[] = [
  { id: 'trad-ind', name: 'Traditional (Ind)', type: 'Individual', style: 'Traditional', components: SCORING_COMPONENTS },
  { id: 'art-ind', name: 'Artistic (Ind)', type: 'Individual', style: 'Artistic', components: SCORING_COMPONENTS },
  { id: 'rhythm-ind', name: 'Rhythmic (Ind)', type: 'Individual', style: 'Rhythmic', components: SCORING_COMPONENTS },
  { id: 'free-ind', name: 'Free Flow (Ind)', type: 'Individual', style: 'Free Flow', components: SCORING_COMPONENTS },
  { id: 'trad-pair', name: 'Traditional (Pair)', type: 'Pair', style: 'Traditional', components: SCORING_COMPONENTS },
  { id: 'art-pair', name: 'Artistic (Pair)', type: 'Pair', style: 'Artistic', components: SCORING_COMPONENTS },
  { id: 'rhythm-pair', name: 'Rhythmic (Pair)', type: 'Pair', style: 'Rhythmic', components: SCORING_COMPONENTS },
  { id: 'free-pair', name: 'Free Flow (Pair)', type: 'Pair', style: 'Free Flow', components: SCORING_COMPONENTS },
  { id: 'trad-group', name: 'Traditional (Group)', type: 'Group', style: 'Traditional', components: SCORING_COMPONENTS },
  { id: 'art-group', name: 'Artistic (Group)', type: 'Group', style: 'Artistic', components: SCORING_COMPONENTS },
  { id: 'rhythm-group', name: 'Rhythmic (Group)', type: 'Group', style: 'Rhythmic', components: SCORING_COMPONENTS },
  { id: 'free-group', name: 'Free Flow (Group)', type: 'Group', style: 'Free Flow', components: SCORING_COMPONENTS },
];

const delegations: Delegation[] = [
  { id: 'IND', code: 'IND', name: 'India', headOfDelegation: 'R. Sharma', type: 'Country', athleteCount: 48, entryCount: 142, status: 'Active' },
  { id: 'JPN', code: 'JPN', name: 'Japan', headOfDelegation: 'T. Yamamoto', type: 'Country', athleteCount: 36, entryCount: 108, status: 'Active' },
  { id: 'USA', code: 'USA', name: 'United States', headOfDelegation: 'J. Williams', type: 'Country', athleteCount: 32, entryCount: 96, status: 'Active' },
  { id: 'CHN', code: 'CHN', name: 'China', headOfDelegation: 'L. Wei', type: 'Country', athleteCount: 28, entryCount: 84, status: 'Active' },
  { id: 'BRA', code: 'BRA', name: 'Brazil', headOfDelegation: 'M. Santos', type: 'Country', athleteCount: 24, entryCount: 72, status: 'Pending' },
  { id: 'GBR', code: 'GBR', name: 'United Kingdom', headOfDelegation: 'S. Thompson', type: 'Country', athleteCount: 22, entryCount: 66, status: 'Active' },
  { id: 'KOR', code: 'KOR', name: 'South Korea', headOfDelegation: 'S. Kim', type: 'Country', athleteCount: 20, entryCount: 60, status: 'Active' },
  { id: 'GER', code: 'GER', name: 'Germany', headOfDelegation: 'D. Müller', type: 'Country', athleteCount: 18, entryCount: 54, status: 'Active' },
];

const athletes: Athlete[] = [
  { id: 'ATH-IND-042', regId: 'R-0142', fullName: 'Priya Sharma', delegationId: 'IND', gender: 'F', dob: '2008-03-15', age: 17, ageCategoryId: 'subjr', disciplines: ['Traditional', 'Rhythmic'], entryCount: 3, status: 'Confirmed' },
  { id: 'ATH-IND-043', regId: 'R-0143', fullName: 'R. Verma', delegationId: 'IND', gender: 'M', dob: '2001-07-22', age: 24, ageCategoryId: 'subjr', disciplines: ['Traditional'], entryCount: 2, status: 'Confirmed' },
  { id: 'ATH-IND-044', regId: 'R-0144', fullName: 'A. Gupta', delegationId: 'IND', gender: 'F', dob: '2009-05-10', age: 16, ageCategoryId: 'jra', disciplines: ['Artistic Pair'], entryCount: 1, status: 'Confirmed' },
  { id: 'ATH-IND-045', regId: 'R-0145', fullName: 'K. Singh', delegationId: 'IND', gender: 'M', dob: '1995-11-20', age: 30, ageCategoryId: 'sra', disciplines: ['Free Flow'], entryCount: 2, status: 'Pending Doc' },
  { id: 'ATH-IND-046', regId: 'R-0146', fullName: 'M. Joshi', delegationId: 'IND', gender: 'F', dob: '2006-02-14', age: 19, ageCategoryId: 'jrb', disciplines: ['Rhythmic'], entryCount: 1, status: 'Withdrawn' },
  { id: 'ATH-IND-047', regId: 'R-0147', fullName: 'S. Reddy', delegationId: 'IND', gender: 'M', dob: '2007-08-30', age: 18, ageCategoryId: 'subjr', disciplines: ['Traditional', 'Group'], entryCount: 3, status: 'Confirmed' },
  { id: 'ATH-IND-048', regId: 'R-0148', fullName: 'D. Nair', delegationId: 'IND', gender: 'F', dob: '2008-12-05', age: 17, ageCategoryId: 'jra', disciplines: ['Artistic Pair'], entryCount: 1, status: 'Confirmed' },
  { id: 'ATH-JPN-201', regId: 'R-0201', fullName: 'T. Nakamura', delegationId: 'JPN', gender: 'M', dob: '2010-01-15', age: 15, ageCategoryId: 'subjr', disciplines: ['Traditional'], entryCount: 2, status: 'Confirmed' },
  { id: 'ATH-JPN-202', regId: 'R-0202', fullName: 'Y. Tanaka', delegationId: 'JPN', gender: 'F', dob: '1999-01-10', age: 27, ageCategoryId: 'sra', disciplines: ['Rhythmic'], entryCount: 2, status: 'Confirmed' },
  { id: 'ATH-USA-301', regId: 'R-0301', fullName: 'Tom Harris', delegationId: 'USA', gender: 'M', dob: '2006-06-20', age: 19, ageCategoryId: 'jrb', disciplines: ['Traditional'], entryCount: 2, status: 'Confirmed' },
  { id: 'ATH-CHN-401', regId: 'R-0401', fullName: 'L. Chen', delegationId: 'CHN', gender: 'M', dob: '2009-04-12', age: 16, ageCategoryId: 'subjr', disciplines: ['Traditional'], entryCount: 2, status: 'Confirmed' },
  { id: 'ATH-BRA-501', regId: 'R-0501', fullName: 'M. Silva', delegationId: 'BRA', gender: 'M', dob: '2007-09-08', age: 18, ageCategoryId: 'subjr', disciplines: ['Traditional'], entryCount: 1, status: 'Confirmed' },
  { id: 'ATH-KOR-601', regId: 'R-0601', fullName: 'A. Kim', delegationId: 'KOR', gender: 'M', dob: '2008-11-25', age: 17, ageCategoryId: 'subjr', disciplines: ['Traditional'], entryCount: 2, status: 'Confirmed' },
  { id: 'ATH-GER-701', regId: 'R-0701', fullName: 'D. Müller', delegationId: 'GER', gender: 'M', dob: '2010-02-18', age: 15, ageCategoryId: 'subjr', disciplines: ['Traditional'], entryCount: 2, status: 'Confirmed' },
];

const teams: Team[] = [
  { id: 'TEAM-IND-1', name: 'Team India B', delegationId: 'IND', type: 'Group', memberIds: ['ATH-IND-044', 'ATH-IND-048', 'ATH-IND-046'], disciplineId: 'rhythm-group', coach: 'S. Patel' },
  { id: 'TEAM-IND-2', name: 'Gupta + Nair', delegationId: 'IND', type: 'Pair', memberIds: ['ATH-IND-044', 'ATH-IND-048'], disciplineId: 'art-pair' },
];

const medalEvents: MedalEvent[] = [
  { id: 'trad-ind-subjr-M', code: 'ITM-SJM-01', name: 'Ind. Traditional Sub-Jr Male', disciplineId: 'trad-ind', ageCategoryId: 'subjr', gender: 'M', type: 'Individual' },
  { id: 'trad-ind-subjr-F', code: 'ITM-SJF-01', name: 'Ind. Traditional Sub-Jr Female', disciplineId: 'trad-ind', ageCategoryId: 'subjr', gender: 'F', type: 'Individual' },
  { id: 'rhythm-ind-jrb-F', code: 'IRM-JBF-01', name: 'Ind. Rhythmic Jr-B Female', disciplineId: 'rhythm-ind', ageCategoryId: 'jrb', gender: 'F', type: 'Individual' },
  { id: 'art-pair-jra-F', code: 'PTF-JAF-01', name: 'Pair Artistic Jr-A Female', disciplineId: 'art-pair', ageCategoryId: 'jra', gender: 'F', type: 'Pair' },
  { id: 'free-ind-sra-M', code: 'IFM-SAM-01', name: 'Ind. Free Flow Sr-A Male', disciplineId: 'free-ind', ageCategoryId: 'sra', gender: 'M', type: 'Individual' },
  { id: 'rhythm-ind-sra-F', code: 'IRM-SAF-01', name: 'Ind. Rhythmic Sr-A Female', disciplineId: 'rhythm-ind', ageCategoryId: 'sra', gender: 'F', type: 'Individual' },
  { id: 'rhythm-group-jrb-F', code: 'GTM-JBF-01', name: 'Group Rhythmic Jr-B Female', disciplineId: 'rhythm-group', ageCategoryId: 'jrb', gender: 'F', type: 'Group' },
];

const entries: Entry[] = [
  { id: 'ENT-0421', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-IND-042', delegationId: 'IND', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-0422', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-IND-043', delegationId: 'IND', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-0423', eventId: 'art-pair-jra-F', teamId: 'TEAM-IND-2', delegationId: 'IND', type: 'Pair', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-0424', eventId: 'rhythm-ind-sra-F', athleteId: 'ATH-IND-042', delegationId: 'IND', type: 'Individual', status: 'Draft', createdAt: '2026-05-02' },
  { id: 'ENT-0425', eventId: 'free-ind-sra-M', athleteId: 'ATH-IND-045', delegationId: 'IND', type: 'Individual', status: 'Draft', createdAt: '2026-05-02' },
  { id: 'ENT-0438', eventId: 'rhythm-group-jrb-F', teamId: 'TEAM-IND-1', delegationId: 'IND', type: 'Group', status: 'Withdrawn', createdAt: '2026-05-01' },
  { id: 'ENT-JPN-001', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-JPN-201', delegationId: 'JPN', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-USA-001', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-USA-301', delegationId: 'USA', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-CHN-001', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-CHN-401', delegationId: 'CHN', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-BRA-001', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-BRA-501', delegationId: 'BRA', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-KOR-001', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-KOR-601', delegationId: 'KOR', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
  { id: 'ENT-GER-001', eventId: 'trad-ind-subjr-M', athleteId: 'ATH-GER-701', delegationId: 'GER', type: 'Individual', status: 'Confirmed', createdAt: '2026-05-01' },
];

const createStartList = (eventId: string): PerformanceSlot[] => {
  const eventEntries = entries.filter(e => e.eventId === eventId && e.status !== 'Withdrawn');
  const slots: PerformanceSlot[] = eventEntries.map((e, i) => ({
    id: `slot-${e.id}-${i}`,
    order: i + 1,
    athleteId: e.athleteId,
    teamId: e.teamId,
    checkInStatus: i < 3 ? (i === 2 ? 'Performing' : 'Checked-in') : (i === 5 ? 'No-show' : 'Pending'),
    scores: i < 6 ? SCORING_COMPONENTS.map((c) => ({ component: c, value: 7.5 + Math.random() * 2, judgeId: 'J1' })) : undefined,
    deductions: i < 6 ? [{ reason: 'Time violation', value: -0.2, code: 'T1' }] : undefined,
    finalScore: i < 6 ? 38 + Math.random() * 5 : undefined,
  }));
  return slots.sort((a, b) => a.order - b.order);
};

const sessions: Session[] = [
  { id: 's1', dayId: 'd1', eventId: 'trad-ind-subjr-M', matId: 'Mat 1', startTime: '09:00', endTime: '10:30', startList: [], status: 'LIVE' },
  { id: 's2', dayId: 'd1', eventId: 'rhythm-ind-jrb-F', matId: 'Mat 2', startTime: '09:00', endTime: '10:30', startList: [], status: 'LIVE' },
  { id: 's3', dayId: 'd1', eventId: 'trad-ind-subjr-F', matId: 'Mat 1', startTime: '10:45', endTime: '12:15', startList: [], status: 'Upcoming' },
  { id: 's4', dayId: 'd1', eventId: 'art-pair-jra-F', matId: 'Mat 2', startTime: '14:00', endTime: '15:30', startList: [], status: 'Upcoming' },
  { id: 's5', dayId: 'd1', eventId: 'free-ind-sra-M', matId: 'Mat 1', startTime: '15:45', endTime: '17:00', startList: [], status: 'Scheduled' },
  { id: 's6', dayId: 'd1', eventId: 'rhythm-ind-sra-F', matId: 'Mat 2', startTime: '15:45', endTime: '17:00', startList: [], status: 'Scheduled' },
];

const results: Result[] = [
  {
    id: 'r1',
    eventId: 'trad-ind-subjr-M',
    version: 2,
    publishedAt: '2026-06-15T10:22:00Z',
    status: 'Provisional',
    rankings: [
      { rank: 1, athleteId: 'ATH-IND-042', delegationId: 'IND', totalScore: 42.1, medal: 'Gold' },
      { rank: 2, athleteId: 'ATH-JPN-201', delegationId: 'JPN', totalScore: 41.2, medal: 'Silver' },
      { rank: 3, athleteId: 'ATH-IND-043', delegationId: 'IND', totalScore: 39.8, medal: 'Bronze' },
      { rank: 4, athleteId: 'ATH-CHN-401', delegationId: 'CHN', totalScore: 39.2 },
      { rank: 5, athleteId: 'ATH-KOR-601', delegationId: 'KOR', totalScore: 38.7 },
      { rank: 6, athleteId: 'ATH-BRA-501', delegationId: 'BRA', totalScore: 37.3 },
    ],
  },
  {
    id: 'r2',
    eventId: 'art-pair-jra-F',
    version: 1,
    publishedAt: '2026-06-15T14:30:00Z',
    status: 'Official',
    rankings: [
      { rank: 1, teamId: 'TEAM-JPN-1', delegationId: 'JPN', totalScore: 42.5, medal: 'Gold' },
      { rank: 2, teamId: 'TEAM-IND-2', delegationId: 'IND', totalScore: 41.0, medal: 'Silver' },
      { rank: 3, teamId: 'TEAM-CHN-1', delegationId: 'CHN', totalScore: 39.5, medal: 'Bronze' },
    ],
  },
];

const protests: Protest[] = [
  { id: 'P-001', eventId: 'trad-ind-subjr-M', filedBy: 'IND', filedAt: '2026-06-15T09:15:00Z', subject: 'Score dispute · J3 assessment', status: 'Pending', evidence: ['video_clip_09_15.mp4', 'scorecard_scan.pdf'] },
  { id: 'P-002', eventId: 'art-pair-jra-F', filedBy: 'JPN', filedAt: '2026-06-15T10:30:00Z', subject: 'Timing error · Start signal', status: 'Upheld', evidence: [] },
  { id: 'P-003', eventId: 'rhythm-ind-sra-F', filedBy: 'USA', filedAt: '2026-06-15T11:45:00Z', subject: 'Deduction disagreement', status: 'Dismissed', evidence: [] },
];

const medalTable = [
  { delegationId: 'IND', gold: 8, silver: 5, bronze: 7, total: 20 },
  { delegationId: 'JPN', gold: 6, silver: 7, bronze: 4, total: 17 },
  { delegationId: 'CHN', gold: 5, silver: 4, bronze: 6, total: 15 },
  { delegationId: 'KOR', gold: 3, silver: 3, bronze: 5, total: 11 },
  { delegationId: 'BRA', gold: 2, silver: 4, bronze: 3, total: 9 },
  { delegationId: 'USA', gold: 2, silver: 2, bronze: 3, total: 7 },
  { delegationId: 'GBR', gold: 1, silver: 2, bronze: 2, total: 5 },
  { delegationId: 'GER', gold: 1, silver: 1, bronze: 1, total: 3 },
];

const users: User[] = [
  { id: 'U-001', name: 'Admin User', email: 'admin@wyc2026.org', role: 'Super Admin' },
  { id: 'U-010', name: 'J. Singh', email: 'jsingh@wyc.org', role: 'Chief Judge', assignedEvents: ['trad-ind-subjr-M', 'art-pair-jra-F'] },
  { id: 'U-011', name: 'A. Kumar', email: 'akumar@wyc.org', role: 'Judge', assignedEvents: ['trad-ind-subjr-M'] },
  { id: 'U-030', name: 'S. Patel', email: 'spatel@ind.org', role: 'Delegation Mgr', delegationId: 'IND' },
];

// Initialize session start lists
sessions.forEach(s => {
  s.startList = createStartList(s.eventId);
});

interface TMSState {
  // Data
  ageCategories: AgeCategory[];
  disciplines: Discipline[];
  delegations: Delegation[];
  athletes: Athlete[];
  teams: Team[];
  medalEvents: MedalEvent[];
  entries: Entry[];
  sessions: Session[];
  results: Result[];
  protests: Protest[];
  medalTable: { delegationId: string; gold: number; silver: number; bronze: number; total: number }[];
  users: User[];

  // UI state
  currentUser: User | null;
  offlineMode: boolean;
  pendingSync: { id: string; event: string; athlete: string; score: number; status: string }[];
  judgeRequestedEvents: string[];

  // Actions
  setCurrentUser: (user: User | null) => void;
  addAthlete: (athlete: Omit<Athlete, 'id' | 'regId' | 'age' | 'ageCategoryId' | 'entryCount'> & { regId?: string }) => void;
  addEntry: (entry: { eventId: string; athleteId?: string; teamId?: string; delegationId: string; type: 'Individual' | 'Pair' | 'Group' }) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  requestJudgeEvent: (eventId: string) => void;
  addProtest: (protest: { eventId: string; subject: string; evidence?: string[] }) => void;
  updateProtestStatus: (protestId: string, status: 'Upheld' | 'Dismissed' | 'Partial') => void;
  addDelegation: (d: Omit<Delegation, 'athleteCount' | 'entryCount'>) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateScore: (slotId: string, sessionId: string, components: ComponentScore[], deductions: Deduction[]) => void;
  submitScore: (slotId: string, sessionId: string) => void;
  checkIn: (slotId: string, sessionId: string, status: 'Checked-in' | 'No-show') => void;
  toggleOffline: () => void;
  confirmEntry: (entryId: string) => void;
  withdrawEntry: (entryId: string) => void;
  getAthleteById: (id: string) => Athlete | undefined;
  getDelegationById: (id: string) => Delegation | undefined;
  getEventById: (id: string) => MedalEvent | undefined;
  getResultByEvent: (eventId: string) => Result | undefined;
  getSessionsByDay: (dayId: string) => Session[];
  getIndiaAthletes: () => Athlete[];
  getIndiaEntries: () => Entry[];
  getIndiaResults: () => { result: Result; ranking: Ranking }[];
}

export const useTMSStore = create<TMSState>((set, get) => ({
  ageCategories,
  disciplines,
  delegations,
  athletes,
  teams,
  medalEvents,
  entries,
  sessions,
  results,
  protests,
  medalTable,
  users,
  currentUser: null,
  offlineMode: false,
  pendingSync: [
    { id: '1', event: 'Ind. Traditional Sub-Jr Male', athlete: 'Priya Sharma', score: 40.8, status: 'Draft' },
    { id: '2', event: 'Ind. Traditional Sub-Jr Male', athlete: 'R. Verma', score: 38.5, status: 'Submitted' },
  ],
  judgeRequestedEvents: [],

  setCurrentUser: (user) => set({ currentUser: user }),

  addAthlete: (data) => {
    const state = get();
    const age = calcAge(data.dob);
    const ac = ageCategories.find((c) => age >= c.minAge && age <= c.maxAge);
    const regId = data.regId || `R-${String(state.athletes.length + 1000).padStart(4, '0')}`;
    const id = `ATH-${data.delegationId}-${String(state.athletes.filter((a) => a.delegationId === data.delegationId).length + 50).padStart(3, '0')}`;
    set((s) => ({
      athletes: [...s.athletes, {
        fullName: data.fullName,
        delegationId: data.delegationId,
        gender: data.gender,
        dob: data.dob,
        id,
        regId,
        age,
        ageCategoryId: ac?.id || 'subjr',
        entryCount: 0,
        status: 'Pending Doc',
        disciplines: data.disciplines || ['Traditional'],
      }],
    }));
  },

  addEntry: (data) => {
    const state = get();
    const id = `ENT-${String(state.entries.length + 1000).padStart(4, '0')}`;
    set((s) => ({
      entries: [...s.entries, {
        ...data,
        id,
        status: 'Draft' as const,
        createdAt: new Date().toISOString().slice(0, 10),
      }],
    }));
  },

  addTeam: (data) => {
    const state = get();
    const id = `TEAM-${data.delegationId}-${state.teams.filter((t) => t.delegationId === data.delegationId).length + 1}`;
    set((s) => ({ teams: [...s.teams, { ...data, id }] }));
  },

  requestJudgeEvent: (eventId) => {
    set((s) => ({
      judgeRequestedEvents: s.judgeRequestedEvents.includes(eventId)
        ? s.judgeRequestedEvents
        : [...s.judgeRequestedEvents, eventId],
    }));
  },

  addProtest: (data) => {
    const state = get();
    const id = `P-${String(state.protests.length + 1).padStart(3, '0')}`;
    set((s) => ({
      protests: [...s.protests, {
        ...data,
        id,
        filedBy: 'IND',
        filedAt: new Date().toISOString(),
        status: 'Pending' as const,
        evidence: data.evidence || [],
      }],
    }));
  },

  updateProtestStatus: (protestId, status) => {
    set((s) => ({
      protests: s.protests.map((p) =>
        p.id === protestId ? { ...p, status } : p
      ),
    }));
  },

  addDelegation: (data) => {
    set((s) => ({
      delegations: [...s.delegations, {
        ...data,
        athleteCount: 0,
        entryCount: 0,
      }],
    }));
  },

  addUser: (data) => {
    const state = get();
    const id = `U-${String(state.users.length + 100).padStart(3, '0')}`;
    set((s) => ({ users: [...s.users, { ...data, id }] }));
  },

  updateScore: (slotId, sessionId, components, deductions) => {
    const compTotal = components.reduce((s, c) => s + c.value, 0);
    const dedTotal = deductions.reduce((s, d) => s + d.value, 0);
    const finalScore = compTotal + dedTotal;

    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              startList: s.startList.map((sl) =>
                sl.id === slotId
                  ? { ...sl, scores: components, deductions, finalScore }
                  : sl
              ),
            }
          : s
      ),
    }));
  },

  submitScore: (slotId, sessionId) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              startList: s.startList.map((sl) =>
                sl.id === slotId ? { ...sl, checkInStatus: 'Completed' as const } : sl
              ),
            }
          : s
      ),
    }));
  },

  checkIn: (slotId, sessionId, status) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              startList: s.startList.map((sl) =>
                sl.id === slotId ? { ...sl, checkInStatus: status } : sl
              ),
            }
          : s
      ),
    }));
  },

  toggleOffline: () => set((s) => ({ offlineMode: !s.offlineMode })),

  confirmEntry: (entryId) => {
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === entryId ? { ...e, status: 'Confirmed' as const } : e
      ),
    }));
  },

  withdrawEntry: (entryId) => {
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === entryId ? { ...e, status: 'Withdrawn' as const } : e
      ),
    }));
  },

  getAthleteById: (id) => get().athletes.find((a) => a.id === id),
  getDelegationById: (id) => get().delegations.find((d) => d.id === id),
  getEventById: (id) => get().medalEvents.find((e) => e.id === id) || get().medalEvents.find((e) => e.code === id),
  getResultByEvent: (eventId) => get().results.find((r) => r.eventId === eventId),
  getSessionsByDay: (dayId) => get().sessions.filter((s) => s.dayId === dayId),

  getIndiaAthletes: () => get().athletes.filter((a) => a.delegationId === 'IND'),
  getIndiaEntries: () => get().entries.filter((e) => e.delegationId === 'IND'),
  getIndiaResults: () => {
    const state = get();
    return state.results.flatMap((r) =>
      r.rankings
        .filter((rk) => rk.delegationId === 'IND')
        .map((ranking) => ({ result: r, ranking }))
    );
  },
}));
