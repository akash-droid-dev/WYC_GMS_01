/**
 * Cloud store – single source of truth for all modules.
 * Persisted to localStorage so "admin changes reflect" across tabs and after refresh.
 * Can be replaced by Supabase real-time later.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AgeCategory,
  EventType,
  EligibilityRule,
  Country,
  State,
  Delegation,
  Participant,
  EventEntry,
  Team,
  WycIdRecord,
  VerificationDecision,
  AccreditationRecord,
  BadgeTemplate,
  ScanLog,
  AuditLogEntry,
  SyncLog,
  SystemConfig,
  AppUser,
  TournamentEdition,
  Venue,
} from './types';
import {
  AGE_CATEGORIES,
  EVENT_TYPES,
  buildDefaultEligibility,
  CUTOFF_DATE,
} from './constants';

export function calcAge(dob: string, cutoff: string = CUTOFF_DATE): number {
  const [cY, cM, cD] = cutoff.split('-').map(Number);
  const [bY, bM, bD] = dob.split('-').map(Number);
  let age = cY - bY;
  if (bM > cM || (bM === cM && bD > cD)) age--;
  return age;
}

export function deriveAgeCategoryId(dob: string, ageCategories: AgeCategory[]): string {
  const age = calcAge(dob);
  const ac = ageCategories.find((c) => age >= c.minAge && age <= c.maxAge);
  return ac?.id ?? 'SEN';
}

interface CloudState {
  // Masters (editable by Super Admin / OC Admin; changes reflect everywhere)
  ageCategories: AgeCategory[];
  eventTypes: EventType[];
  eligibilityRules: EligibilityRule[];
  countries: Country[];
  states: State[];
  systemConfig: SystemConfig;
  badgeTemplates: BadgeTemplate[];
  venues: Venue[];
  tournamentEditions: TournamentEdition[];

  // Registration
  delegations: Delegation[];
  participants: Participant[];
  eventEntries: EventEntry[];
  teams: Team[];
  wycIdRecords: WycIdRecord[];
  verificationDecisions: VerificationDecision[];

  // Accreditation
  accreditationRecords: AccreditationRecord[];
  scanLogs: ScanLog[];

  // Admin
  users: AppUser[];
  auditLogs: AuditLogEntry[];
  syncLogs: SyncLog[];

  // Actions – Masters
  setAgeCategories: (v: AgeCategory[]) => void;
  setEventTypes: (v: EventType[]) => void;
  setEligibilityRules: (v: EligibilityRule[]) => void;
  setSystemConfig: (v: Partial<SystemConfig>) => void;
  setBadgeTemplates: (v: BadgeTemplate[]) => void;

  // Actions – Registration
  addDelegation: (d: Omit<Delegation, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateDelegation: (id: string, d: Partial<Delegation>) => void;
  addParticipant: (p: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateParticipant: (id: string, p: Partial<Participant>) => void;
  addEventEntry: (e: Omit<EventEntry, 'id' | 'createdAt' | 'updatedAt'>) => string;
  addTeam: (t: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => string;
  approveParticipant: (participantId: string, decidedBy: string) => string | null;
  rejectParticipant: (participantId: string, reason: string, decidedBy: string) => void;
  requestCorrection: (participantId: string, fields: string[], reason: string, decidedBy: string) => void;

  // Actions – Accreditation
  upsertAccreditationFromParticipant: (participant: Participant) => void;
  updateAccreditationStatus: (wycId: string, status: AccreditationRecord['status'], by: string) => void;
  markPrinted: (wycId: string, by: string) => void;
  markIssued: (wycId: string, by: string) => void;
  reissueCredential: (wycId: string, by: string) => void;
  revokeCredential: (wycId: string, reason: string, by: string) => void;
  addScanLog: (log: Omit<ScanLog, 'id' | 'scannedAt'>) => void;

  // Actions – Audit & Sync
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  addSyncLog: (entry: Omit<SyncLog, 'id' | 'syncedAt'>) => void;

  // Actions – Users
  setUsers: (u: AppUser[]) => void;
  addUser: (u: Omit<AppUser, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateUser: (id: string, u: Partial<AppUser>) => void;

  // Getters
  getParticipantByWycId: (wycId: string) => Participant | undefined;
  getAccreditationByWycId: (wycId: string) => AccreditationRecord | undefined;
  getDelegationById: (id: string) => Delegation | undefined;
  getParticipantById: (id: string) => Participant | undefined;
  getEligibilityRules: () => EligibilityRule[];
}

const now = () => new Date().toISOString();
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const defaultSystemConfig: SystemConfig = {
  editionName: 'World Yogasana Championship 2026',
  championshipYear: 2026,
  registrationOpen: true,
  registrationDeadline: '2026-05-31',
  maxEventsPerAthlete: 3,
  maxIndividualEvents: 2,
  medicalCertificateExpiryDays: 30,
  asanaSubmissionDeadlineHours: 72,
  otpValidityMinutes: 10,
  otpMaxRetries: 3,
  lockoutAfterFailedOtps: 5,
};

const defaultCountries: Country[] = [
  { id: 'IN', code: 'IND', name: 'India', iso: 'IN' },
  { id: 'JP', code: 'JPN', name: 'Japan', iso: 'JP' },
  { id: 'US', code: 'USA', name: 'United States', iso: 'US' },
  { id: 'CN', code: 'CHN', name: 'China', iso: 'CN' },
  { id: 'GB', code: 'GBR', name: 'United Kingdom', iso: 'GB' },
  { id: 'DE', code: 'GER', name: 'Germany', iso: 'DE' },
  { id: 'KR', code: 'KOR', name: 'South Korea', iso: 'KR' },
  { id: 'BR', code: 'BRA', name: 'Brazil', iso: 'BR' },
];

const defaultBadgeTemplates: BadgeTemplate[] = [
  { id: 'bt-athlete', name: 'Athlete', role: 'Athlete', accessZones: ['FOP', 'Warm-up', 'Stand'], enabled: true },
  { id: 'bt-coach', name: 'Coach', role: 'Coach', accessZones: ['FOP', 'Warm-up', 'Backstage'], enabled: true },
  { id: 'bt-judge', name: 'Judge', role: 'Judge', accessZones: ['FOP', 'Judges', 'Backstage'], enabled: true },
];

export const useCloudStore = create<CloudState>()(
  persist(
    (set, get) => ({
      ageCategories: AGE_CATEGORIES,
      eventTypes: EVENT_TYPES,
      eligibilityRules: buildDefaultEligibility(),
      countries: defaultCountries,
      states: [],
      systemConfig: defaultSystemConfig,
      badgeTemplates: defaultBadgeTemplates,
      venues: [],
      tournamentEditions: [],
      delegations: [],
      participants: [],
      eventEntries: [],
      teams: [],
      wycIdRecords: [],
      verificationDecisions: [],
      accreditationRecords: [],
      scanLogs: [],
      users: [
        {
          id: 'sa-1',
          email: 'superadmin@wyc2026.org',
          displayName: 'Super Admin',
          role: 'Super Admin',
          permissions: ['*'],
          createdAt: now(),
          updatedAt: now(),
        },
      ],
      auditLogs: [],
      syncLogs: [],

      setAgeCategories: (v) => set({ ageCategories: v }),
      setEventTypes: (v) => set({ eventTypes: v }),
      setEligibilityRules: (v) => set({ eligibilityRules: v }),
      setSystemConfig: (v) => set((s) => ({ systemConfig: { ...s.systemConfig, ...v } })),
      setBadgeTemplates: (v) => set({ badgeTemplates: v }),

      addDelegation: (d) => {
        const delegationId = id();
        const delegation: Delegation = {
          ...d,
          id: delegationId,
          status: d.status ?? 'Draft',
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ delegations: [...s.delegations, delegation] }));
        get().addAuditLog({
          module: 'Registration',
          action: 'CREATE_DELEGATION',
          entityType: 'Delegation',
          entityId: delegationId,
          userId: 'system',
          userEmail: 'system@wyc',
          after: delegation,
        });
        return delegationId;
      },
      updateDelegation: (delegationId, d) => {
        set((s) => ({
          delegations: s.delegations.map((x) =>
            x.id === delegationId ? { ...x, ...d, updatedAt: now() } : x
          ),
        }));
      },
      addParticipant: (p) => {
        const participantId = id();
        const ageCategories = get().ageCategories;
        const ageCategoryId = p.dob ? deriveAgeCategoryId(p.dob, ageCategories) : undefined;
        const participant: Participant = {
          ...p,
          id: participantId,
          applicationStatus: p.applicationStatus ?? 'Draft',
          ageCategoryId,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ participants: [...s.participants, participant] }));
        return participantId;
      },
      updateParticipant: (participantId, p) => {
        set((s) => ({
          participants: s.participants.map((x) =>
            x.id === participantId ? { ...x, ...p, updatedAt: now() } : x
          ),
        }));
      },
      addEventEntry: (e) => {
        const entryId = id();
        const entry: EventEntry = {
          ...e,
          id: entryId,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ eventEntries: [...s.eventEntries, entry] }));
        return entryId;
      },
      addTeam: (t) => {
        const teamId = id();
        const team: Team = {
          ...t,
          id: teamId,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ teams: [...s.teams, team] }));
        return teamId;
      },
      approveParticipant: (participantId, decidedBy) => {
        const state = get();
        const participant = state.participants.find((p) => p.id === participantId);
        if (!participant || participant.applicationStatus !== 'Pending Verification') return null;
        const wycId = `WYC26-${String(state.wycIdRecords.length + 1).padStart(5, '0')}`;
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId
              ? {
                  ...p,
                  applicationStatus: 'Approved' as const,
                  wycId,
                  lockedAfterApproval: true,
                  updatedAt: now(),
                }
              : p
          ),
          wycIdRecords: [
            ...s.wycIdRecords,
            {
              id: id(),
              participantId,
              wycId,
              issuedAt: now(),
              issuedBy: decidedBy,
            },
          ],
          verificationDecisions: [
            ...s.verificationDecisions,
            {
              id: id(),
              participantId,
              applicationId: participant.applicationId ?? '',
              decision: 'Approved',
              decidedBy,
              decidedAt: now(),
            },
          ],
        }));
        get().upsertAccreditationFromParticipant({
          ...participant,
          applicationStatus: 'Approved',
          wycId,
          lockedAfterApproval: true,
          updatedAt: now(),
        });
        get().addSyncLog({
          source: 'Registration',
          target: 'TMS',
          participantId,
          wycId,
          status: 'Success',
          retryCount: 0,
        });
        get().addSyncLog({
          source: 'Registration',
          target: 'Accreditation',
          participantId,
          wycId,
          status: 'Success',
          retryCount: 0,
        });
        get().addAuditLog({
          module: 'Registration',
          action: 'APPROVE_PARTICIPANT',
          entityType: 'Participant',
          entityId: participantId,
          userId: decidedBy,
          userEmail: decidedBy,
          after: { wycId, status: 'Approved' },
        });
        return wycId;
      },
      rejectParticipant: (participantId, reason, decidedBy) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId
              ? { ...p, applicationStatus: 'Rejected' as const, updatedAt: now() }
              : p
          ),
          verificationDecisions: [
            ...s.verificationDecisions,
            {
              id: id(),
              participantId,
              applicationId: '',
              decision: 'Rejected',
              reason,
              decidedBy,
              decidedAt: now(),
            },
          ],
        }));
        get().addAuditLog({
          module: 'Registration',
          action: 'REJECT_PARTICIPANT',
          entityType: 'Participant',
          entityId: participantId,
          userId: decidedBy,
          userEmail: decidedBy,
          reason,
        });
      },
      requestCorrection: (participantId, correctionFields, reason, decidedBy) => {
        set((s) => ({
          participants: s.participants.map((p) =>
            p.id === participantId
              ? { ...p, applicationStatus: 'Correction Required' as const, updatedAt: now() }
              : p
          ),
          verificationDecisions: [
            ...s.verificationDecisions,
            {
              id: id(),
              participantId,
              applicationId: '',
              decision: 'Correction Required',
              reason,
              correctionFields,
              decidedBy,
              decidedAt: now(),
            },
          ],
        }));
      },
      upsertAccreditationFromParticipant: (participant) => {
        if (!participant.wycId) return;
        const state = get();
        const existing = state.accreditationRecords.find((a) => a.wycId === participant.wycId);
        const record: AccreditationRecord = existing
          ? { ...existing, fullName: participant.fullName, email: participant.email, phone: participant.phone, photoUrl: participant.photoUrl, nationality: participant.nationality, updatedAt: now() }
          : {
              id: id(),
              wycId: participant.wycId,
              participantId: participant.id,
              role: participant.role,
              fullName: participant.fullName,
              gender: participant.gender,
              dob: participant.dob,
              nationality: participant.nationality,
              email: participant.email,
              phone: participant.phone,
              photoUrl: participant.photoUrl,
              status: 'Pending',
              credentialVersion: 1,
              createdAt: now(),
              updatedAt: now(),
            };
        set((s) => ({
          accreditationRecords: existing
            ? s.accreditationRecords.map((a) => (a.wycId === participant.wycId ? record : a))
            : [...s.accreditationRecords, record],
        }));
      },
      updateAccreditationStatus: (wycId, status, by) => {
        set((s) => ({
          accreditationRecords: s.accreditationRecords.map((a) =>
            a.wycId === wycId
              ? { ...a, status, lastActionBy: by, lastActionAt: now(), updatedAt: now() }
              : a
          ),
        }));
        get().addAuditLog({
          module: 'Accreditation',
          action: 'UPDATE_STATUS',
          entityType: 'AccreditationRecord',
          entityId: wycId,
          userId: by,
          userEmail: by,
          after: { status },
        });
      },
      markPrinted: (wycId, by) => {
        set((s) => ({
          accreditationRecords: s.accreditationRecords.map((a) =>
            a.wycId === wycId
              ? { ...a, status: 'Printed' as const, printedAt: now(), lastActionBy: by, lastActionAt: now(), updatedAt: now() }
              : a
          ),
        }));
      },
      markIssued: (wycId, by) => {
        set((s) => ({
          accreditationRecords: s.accreditationRecords.map((a) =>
            a.wycId === wycId
              ? { ...a, status: 'Issued' as const, issuedAt: now(), issuedBy: by, lastActionBy: by, lastActionAt: now(), updatedAt: now() }
              : a
          ),
        }));
      },
      reissueCredential: (wycId, by) => {
        set((s) => ({
          accreditationRecords: s.accreditationRecords.map((a) =>
            a.wycId === wycId
              ? { ...a, credentialVersion: a.credentialVersion + 1, status: 'Pending' as const, lastActionBy: by, lastActionAt: now(), updatedAt: now() }
              : a
          ),
        }));
        get().addAuditLog({
          module: 'Accreditation',
          action: 'REISSUE_CREDENTIAL',
          entityType: 'AccreditationRecord',
          entityId: wycId,
          userId: by,
          userEmail: by,
        });
      },
      revokeCredential: (wycId, reason, by) => {
        set((s) => ({
          accreditationRecords: s.accreditationRecords.map((a) =>
            a.wycId === wycId
              ? { ...a, status: 'Revoked' as const, lastActionBy: by, lastActionAt: now(), updatedAt: now() }
              : a
          ),
        }));
        get().addAuditLog({
          module: 'Accreditation',
          action: 'REVOKE_CREDENTIAL',
          entityType: 'AccreditationRecord',
          entityId: wycId,
          userId: by,
          userEmail: by,
          reason,
        });
      },
      addScanLog: (log) => {
        set((s) => ({
          scanLogs: [
            ...s.scanLogs,
            { ...log, id: id(), scannedAt: now() },
          ],
        }));
      },
      addAuditLog: (entry) => {
        set((s) => ({
          auditLogs: [
            ...s.auditLogs.slice(-999),
            { ...entry, id: id(), timestamp: now() },
          ],
        }));
      },
      addSyncLog: (entry) => {
        set((s) => ({
          syncLogs: [
            ...s.syncLogs.slice(-499),
            { ...entry, id: id(), syncedAt: now() },
          ],
        }));
      },
      setUsers: (u) => set({ users: u }),
      addUser: (u) => {
        const userId = id();
        const user: AppUser = {
          ...u,
          id: userId,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ users: [...s.users, user] }));
        return userId;
      },
      updateUser: (userId, u) => {
        set((s) => ({
          users: s.users.map((x) => (x.id === userId ? { ...x, ...u, updatedAt: now() } : x)),
        }));
      },
      getParticipantByWycId: (wycId) => get().participants.find((p) => p.wycId === wycId),
      getAccreditationByWycId: (wycId) => get().accreditationRecords.find((a) => a.wycId === wycId),
      getDelegationById: (id) => get().delegations.find((d) => d.id === id),
      getParticipantById: (id) => get().participants.find((p) => p.id === id),
      getEligibilityRules: () => get().eligibilityRules,
    }),
    {
      name: 'wyc2026-cloud-store',
      partialize: (s) => ({
        ageCategories: s.ageCategories,
        eventTypes: s.eventTypes,
        eligibilityRules: s.eligibilityRules,
        countries: s.countries,
        states: s.states,
        systemConfig: s.systemConfig,
        badgeTemplates: s.badgeTemplates,
        venues: s.venues,
        tournamentEditions: s.tournamentEditions,
        delegations: s.delegations,
        participants: s.participants,
        eventEntries: s.eventEntries,
        teams: s.teams,
        wycIdRecords: s.wycIdRecords,
        verificationDecisions: s.verificationDecisions,
        accreditationRecords: s.accreditationRecords,
        scanLogs: s.scanLogs,
        users: s.users,
        auditLogs: s.auditLogs,
        syncLogs: s.syncLogs,
      }),
    }
  )
);
