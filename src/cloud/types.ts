/**
 * WYC 2026 – Shared cloud types (FRD-aligned).
 * Single source of truth for Registration, TMS, Accreditation, Super Admin.
 */

export type Gender = 'M' | 'F';
export type DelegationType = 'National' | 'International';

// ----- Application / Registration statuses (FRD 6.2) -----
export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Verification'
  | 'Correction Required'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn';

// ----- Accreditation statuses (FRD 11.4) -----
export type AccreditationStatus =
  | 'Pending'
  | 'Needs Correction'
  | 'Ready'
  | 'Printed'
  | 'Issued'
  | 'Active'
  | 'Inactive'
  | 'Revoked';

// ----- Participant role -----
export type ParticipantRole = 'Athlete' | 'Coach' | 'Judge' | 'Technical Official';

// ----- Age categories (FRD 7.1) -----
export interface AgeCategory {
  id: string;
  code: string;
  label: string;
  minAge: number;
  maxAge: number;
  enabled: boolean;
}

// ----- Event types (FRD 7.2, 10.3.2) -----
export interface EventType {
  id: string;
  code: string;
  name: string;
  family: 'Individual' | 'Pair' | 'Group/Team';
  enabled: boolean;
}

// ----- Eligibility: event type allowed per age category (FRD 7.3) -----
export interface EligibilityRule {
  eventTypeId: string;
  ageCategoryId: string;
  allowed: boolean;
}

// ----- Countries / States (masters) -----
export interface Country {
  id: string;
  code: string;
  name: string;
  iso: string;
}
export interface State {
  id: string;
  code: string;
  name: string;
  countryId?: string;
}

// ----- Delegation (Registration) -----
export interface Delegation {
  id: string;
  delegationType: DelegationType;
  countryId?: string;
  stateId?: string;
  federationAssociation: string;
  teamManagerName: string;
  teamManagerEmail: string;
  teamManagerPhone?: string;
  applicationId?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// ----- Participant (single person in a delegation) -----
export interface Participant {
  id: string;
  delegationId: string;
  role: ParticipantRole;
  fullName: string;
  gender: Gender;
  dob: string;
  nationality: string;
  photoUrl?: string;
  govtIdType?: string;
  govtIdNumberEncrypted?: string;
  govtIdUploadUrl?: string;
  email: string;
  phone?: string;
  whatsApp?: string;
  addressProofUrl?: string;
  ageProofUrl?: string;
  medicalFitnessUrl?: string;
  riskUndertakingUrl?: string;
  worldYogasanaIdUrl?: string;
  paymentProofUrl?: string;
  applicationStatus: ApplicationStatus;
  applicationId?: string;
  wycId?: string;
  ageCategoryId?: string;
  createdAt: string;
  updatedAt: string;
  lockedAfterApproval?: boolean;
}

// ----- Event entry (individual / pair / group) -----
export interface EventEntry {
  id: string;
  participantId?: string;
  teamId?: string;
  delegationId: string;
  eventTypeId: string;
  ageCategoryId: string;
  gender: Gender;
  type: 'Individual' | 'Pair' | 'Group';
  memberParticipantIds?: string[];
  status: 'Draft' | 'Confirmed' | 'Withdrawn' | 'DQ';
  asanaCodes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// ----- Team (pair or group) -----
export interface Team {
  id: string;
  delegationId: string;
  name: string;
  type: 'Pair' | 'Group';
  eventTypeId: string;
  memberParticipantIds: string[];
  status: 'Draft' | 'Confirmed' | 'Withdrawn';
  createdAt: string;
  updatedAt: string;
}

// ----- WYC ID issuance (one per approved participant) -----
export interface WycIdRecord {
  id: string;
  participantId: string;
  wycId: string;
  issuedAt: string;
  issuedBy: string;
}

// ----- Verification decision -----
export interface VerificationDecision {
  id: string;
  participantId: string;
  applicationId: string;
  decision: 'Approved' | 'Rejected' | 'Correction Required';
  reason?: string;
  correctionFields?: string[];
  decidedBy: string;
  decidedAt: string;
}

// ----- Accreditation record (keyed by WYC ID) -----
export interface AccreditationRecord {
  id: string;
  wycId: string;
  participantId: string;
  role: ParticipantRole;
  fullName: string;
  gender?: Gender;
  dob?: string;
  nationality: string;
  countryId?: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  delegationName?: string;
  status: AccreditationStatus;
  readyCheckResult?: 'Pass' | 'Fail';
  readyCheckReason?: string;
  credentialType?: string;
  credentialVersion: number;
  accessZones?: string[];
  validityStart?: string;
  validityEnd?: string;
  lastActionBy?: string;
  lastActionAt?: string;
  printedAt?: string;
  issuedAt?: string;
  issuedBy?: string;
  qrToken?: string;
  createdAt: string;
  updatedAt: string;
}

// ----- Badge template -----
export interface BadgeTemplate {
  id: string;
  name: string;
  role: ParticipantRole;
  accessZones: string[];
  enabled: boolean;
}

// ----- Scan log -----
export interface ScanLog {
  id: string;
  wycId: string;
  credentialVersion: number;
  result: 'Allowed' | 'Denied';
  reasonCode?: string;
  checkpointId?: string;
  deviceId?: string;
  scannedAt: string;
}

// ----- Audit log (COM-002) -----
export interface AuditLogEntry {
  id: string;
  module: 'Registration' | 'TMS' | 'Accreditation' | 'SuperAdmin';
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userEmail: string;
  timestamp: string;
  before?: unknown;
  after?: unknown;
  reason?: string;
}

// ----- Sync log (Registration → TMS, Registration → Accreditation) -----
export interface SyncLog {
  id: string;
  source: 'Registration';
  target: 'TMS' | 'Accreditation';
  participantId?: string;
  wycId?: string;
  status: 'Success' | 'Failed';
  error?: string;
  syncedAt: string;
  retryCount: number;
}

// ----- System config (Super Admin) -----
export interface SystemConfig {
  editionName: string;
  championshipYear: number;
  registrationOpen: boolean;
  registrationDeadline: string;
  maxEventsPerAthlete: number;
  maxIndividualEvents: number;
  medicalCertificateExpiryDays: number;
  asanaSubmissionDeadlineHours: number;
  otpValidityMinutes: number;
  otpMaxRetries: number;
  lockoutAfterFailedOtps: number;
}

// ----- User & RBAC -----
export type AdminRole =
  | 'Super Admin'
  | 'OC Admin'
  | 'OC Verifier'
  | 'TMS Operator'
  | 'Competition Director'
  | 'Accreditation Admin'
  | 'Accreditation Operator'
  | 'Helpdesk Viewer';

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  delegationId?: string;
  permissions: string[];
  mfaEnabled?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ----- TMS (extend existing) -----
export interface TournamentEdition {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timezone: string;
  venueIds: string[];
  enabled: boolean;
}

export interface Venue {
  id: string;
  name: string;
  fieldsOfPlay: { id: string; name: string; capacity?: number }[];
}
