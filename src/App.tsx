import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import './tms/styles/tms.css';
import RoleSelector from './tms/components/RoleSelector';
import PublicLayout from './tms/layouts/PublicLayout';
import DelegationLayout from './tms/layouts/DelegationLayout';
import JudgeLayout from './tms/layouts/JudgeLayout';
import TMSAdminLayout from './tms/layouts/AdminLayout';
import PublicHome from './tms/pages/public/PublicHome';
import PublicSchedule from './tms/pages/public/Schedule';
import PublicLiveResults from './tms/pages/public/LiveResults';
import PublicMedalTable from './tms/pages/public/MedalTable';
import PublicEventDetail from './tms/pages/public/EventDetail';
import DelegationAthletes from './tms/pages/delegation/MyAthletes';
import DelegationEntries from './tms/pages/delegation/MyEntries';
import DelegationSchedule from './tms/pages/delegation/Schedule';
import DelegationResults from './tms/pages/delegation/Results';
import DelegationProtests from './tms/pages/delegation/Protests';
import JudgeMyEvents from './tms/pages/judge/MyEvents';
import JudgeScoring from './tms/pages/judge/ActiveScoring';
import JudgeOfflineStatus from './tms/pages/judge/OfflineStatus';
import TMSAdminDashboard from './tms/pages/admin/Dashboard';
import AdminMasterSetup from './tms/pages/admin/MasterSetup';
import AdminDelegations from './tms/pages/admin/Delegations';
import AdminDelegationDetail from './tms/pages/admin/DelegationDetail';
import AdminAthletes from './tms/pages/admin/Athletes';
import AdminEntries from './tms/pages/admin/Entries';
import AdminSchedule from './tms/pages/admin/Schedule';
import AdminLiveOps from './tms/pages/admin/LiveOps';
import AdminScoring from './tms/pages/admin/Scoring';
import AdminResults from './tms/pages/admin/Results';
import AdminMedals from './tms/pages/admin/Medals';
import AdminProtests from './tms/pages/admin/Protests';
import AdminReports from './tms/pages/admin/Reports';
import AdminUsers from './tms/pages/admin/Users';
import VerificationQueue from './admin/pages/VerificationQueue';
import SyncMonitoring from './admin/pages/SyncMonitoring';
import GlobalSearch from './admin/pages/GlobalSearch';
import RegistrationLogin from './registration/pages/Login';
import RegistrationLayout from './registration/RegistrationLayout';
import RegistrationDashboard from './registration/pages/Dashboard';
import DelegationPage from './registration/pages/Delegation';
import ParticipantsPage from './registration/pages/Participants';
import EventEntriesPage from './registration/pages/EventEntries';
import SubmitPage from './registration/pages/Submit';
import SuperAdminLayout from './superadmin/SuperAdminLayout';
import SuperAdminDashboard from './superadmin/pages/SuperAdminDashboard';
import SystemConfigPage from './superadmin/pages/SystemConfig';
import MastersPage from './superadmin/pages/Masters';
import SuperAdminUsers from './superadmin/pages/Users';
import AuditLogsPage from './superadmin/pages/AuditLogs';
import AccreditationLayout from './accreditation/AccreditationLayout';
import AccreditationQueue from './accreditation/pages/Queue';
import PrintIssuePage from './accreditation/pages/PrintIssue';
import ScanPage from './accreditation/pages/Scan';
import AccreditationReports from './accreditation/pages/Reports';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/tms" replace />} />
        {/* Registration (public) */}
        <Route path="/registration" element={<ErrorBoundary><div className="tms-app" style={{ minHeight: '100vh', background: 'var(--tms-canvas)' }}><RoleSelector /><Outlet /></div></ErrorBoundary>}>
          <Route path="login" element={<RegistrationLogin />} />
          <Route element={<RegistrationLayout />}>
            <Route index element={<RegistrationDashboard />} />
            <Route path="delegation" element={<DelegationPage />} />
            <Route path="participants" element={<ParticipantsPage />} />
            <Route path="entries" element={<EventEntriesPage />} />
            <Route path="submit" element={<SubmitPage />} />
          </Route>
        </Route>
        {/* Super Admin (separate, connected) */}
        <Route path="/super-admin" element={<ErrorBoundary><div className="tms-app" style={{ minHeight: '100vh', background: 'var(--tms-canvas)' }}><RoleSelector /><Outlet /></div></ErrorBoundary>}>
          <Route element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="config" element={<SystemConfigPage />} />
            <Route path="masters" element={<MastersPage />} />
            <Route path="users" element={<SuperAdminUsers />} />
            <Route path="audit" element={<AuditLogsPage />} />
          </Route>
        </Route>
        {/* Accreditation */}
        <Route path="/accreditation" element={<ErrorBoundary><div className="tms-app" style={{ minHeight: '100vh', background: 'var(--tms-canvas)' }}><RoleSelector /><Outlet /></div></ErrorBoundary>}>
          <Route element={<AccreditationLayout />}>
            <Route index element={<AccreditationQueue />} />
            <Route path="print" element={<PrintIssuePage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="reports" element={<AccreditationReports />} />
          </Route>
        </Route>
        <Route path="/tms" element={
          <ErrorBoundary>
            <div className="tms-app" style={{ minHeight: '100vh', background: 'var(--tms-canvas)' }}>
              <RoleSelector />
              <Outlet />
            </div>
          </ErrorBoundary>
        }>
          <Route element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="schedule" element={<PublicSchedule />} />
            <Route path="results" element={<PublicLiveResults />} />
            <Route path="medals" element={<PublicMedalTable />} />
            <Route path="event/:eventId" element={<PublicEventDetail />} />
          </Route>
          <Route path="delegation" element={<DelegationLayout />}>
            <Route index element={<Navigate to="/tms/delegation/athletes" replace />} />
            <Route path="athletes" element={<DelegationAthletes />} />
            <Route path="entries" element={<DelegationEntries />} />
            <Route path="schedule" element={<DelegationSchedule />} />
            <Route path="results" element={<DelegationResults />} />
            <Route path="protests" element={<DelegationProtests />} />
          </Route>
          <Route path="judge" element={<JudgeLayout />}>
            <Route index element={<JudgeMyEvents />} />
            <Route path="events" element={<JudgeMyEvents />} />
            <Route path="scoring/:sessionId" element={<JudgeScoring />} />
            <Route path="offline" element={<JudgeOfflineStatus />} />
          </Route>
          <Route path="admin" element={<TMSAdminLayout />}>
            <Route index element={<TMSAdminDashboard />} />
            <Route path="setup" element={<AdminMasterSetup />} />
            <Route path="delegations" element={<AdminDelegations />} />
            <Route path="delegations/:delegationId" element={<AdminDelegationDetail />} />
            <Route path="athletes" element={<AdminAthletes />} />
            <Route path="entries" element={<AdminEntries />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="live" element={<AdminLiveOps />} />
            <Route path="scoring" element={<AdminScoring />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="medals" element={<AdminMedals />} />
            <Route path="protests" element={<AdminProtests />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="verification" element={<VerificationQueue />} />
            <Route path="sync" element={<SyncMonitoring />} />
            <Route path="search" element={<GlobalSearch />} />
          </Route>
          <Route path="*" element={<Navigate to="/tms" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
