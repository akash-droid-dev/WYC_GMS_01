# WYC 2026 · Complete Platform (FRD)

**World Yogasana Championship 2026** · Tournament Management System, Registration, Accreditation, and Unified Admin — cloud-connected so **admin changes reflect across all modules**.

**Live site:** https://akash-droid-dev.github.io/WYC_GMS_01/

## Modules (FRD-aligned)

| Module | Path | Description |
|--------|------|-------------|
| **Registration** | `/registration` | Public registration: login (OTP), delegation, participants, event entries, document rules, submit → Application ID; verification queue in Admin. |
| **TMS** | `/tms` | Tournament Management: public schedule/results/medals, delegation workspace, judge scoring, admin setup, entries, schedule, live ops, medals, protests, reports. |
| **Unified Admin** | `/tms/admin` | Single back-office: Global Search, Verification Queue, Sync Monitoring, Master Setup, Delegations, Athletes, Entries, Schedule, Live Ops, Scoring, Results, Medals, Protests, Reports, Users. Links to Super Admin and Accreditation. |
| **Super Admin** | `/super-admin` | System-wide config (separate, connected): dashboard, system config, global masters (age categories, event types, eligibility matrix), users & RBAC, audit logs. |
| **Accreditation** | `/accreditation` | Badge lifecycle: queue (keyed by WYC ID), Ready → Print → Issue, reissue/revoke, scan validation, reports. |

## Cloud store (single source of truth)

- **Zustand store** with `persist` to `localStorage`: masters, delegations, participants, event entries, WYC IDs, accreditation records, audit logs, sync logs.
- **Super Admin** and **OC Admin** edit the same store; Registration, TMS, and Accreditation read from it, so **changes in admin reflect everywhere** (e.g. eligibility matrix, system config, users).
- **WYC ID** is generated only on approval in Verification Queue; same ID is used in TMS and Accreditation (FRD ID-001, ID-002).
- **Sync**: On approval, records are pushed to TMS and Accreditation (sync logs in Admin → Sync Monitoring).

## Key FRD coverage

- **Registration**: REG-001 (OTP login), REG-002/003 (delegation, national/international), REG-010 (age category from DOB, cut-off 1 Jan), REG-011/012 (fixed age/events, eligibility matrix), REG-020–022 (individual/pair/group entries), REG-040 (acknowledgement, no ID exposure), VER-001 (approve/reject/correction), ID-001/002 (single WYC ID, primary key), INT-001 (push to TMS & Accreditation).
- **TMS**: Existing flows + integration with cloud masters; admin has Verification Queue and Sync Monitoring.
- **Accreditation**: FR-ACC-001 (keyed by WYC ID), FR-ACC-002/003 (intake, no credential without WYC ID), statuses, Ready/Print/Issue, reissue/revoke, scan validation, audit.
- **Unified Admin**: ADM-001–004 (single panel, masters, sync monitoring, audit logs), Global Search (WYC ID, Application ID, name, email).
- **Super Admin**: System config, masters (eligibility editable; age/events read-only), users & roles, audit logs.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/WYC_GMS_01/ (or root if no base path).

- **Registration**: `/registration` → Login (any email + any 4+ digit OTP) → Dashboard, Delegation, Participants, Event Entries, Submit.
- **Verification**: `/tms/admin/verification` — approve/reject/request correction; approve generates WYC ID and syncs to TMS & Accreditation.
- **Super Admin**: `/super-admin` — config, masters, users, audit.
- **Accreditation**: `/accreditation` — queue, Print/Issue, Scan.
- Use **View as** (top-right) to switch modules and TMS roles.

## Build

```bash
npm run build
npm run preview
```

## Publish to GitHub Pages (WYC_GMS_01)

1. Push this repo to [WYC_GMS_01](https://github.com/akash-droid-dev/WYC_GMS_01).
2. In repo **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The workflow `.github/workflows/deploy-pages.yml` runs on push to `main` and deploys to https://akash-droid-dev.github.io/WYC_GMS_01/.

## Tech stack

- React 19, TypeScript, React Router v7, Zustand (with persist)
- Vite
- Single cloud store; optional Supabase can replace/store the same data later.
