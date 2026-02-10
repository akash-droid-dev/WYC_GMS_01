/* WYC 2026 TMS - Main Application */
import { Routes, Route, Navigate } from 'react-router-dom';
import '../tms/styles/tms.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DelegationLayout from './layouts/DelegationLayout';
import JudgeLayout from './layouts/JudgeLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import PublicSchedule from './pages/public/Schedule';
import PublicLiveResults from './pages/public/LiveResults';
import PublicMedalTable from './pages/public/MedalTable';
import PublicEventDetail from './pages/public/EventDetail';
import PublicHome from './pages/public/PublicHome';

// Delegation Pages
import DelegationAthletes from './pages/delegation/MyAthletes';
import DelegationEntries from './pages/delegation/MyEntries';
import DelegationSchedule from './pages/delegation/Schedule';
import DelegationResults from './pages/delegation/Results';
import DelegationProtests from './pages/delegation/Protests';

// Judge Pages
import JudgeMyEvents from './pages/judge/MyEvents';
import JudgeScoring from './pages/judge/ActiveScoring';
import JudgeOfflineStatus from './pages/judge/OfflineStatus';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminMasterSetup from './pages/admin/MasterSetup';
import AdminDelegations from './pages/admin/Delegations';
import AdminDelegationDetail from './pages/admin/DelegationDetail';
import AdminAthletes from './pages/admin/Athletes';
import AdminEntries from './pages/admin/Entries';
import AdminSchedule from './pages/admin/Schedule';
import AdminLiveOps from './pages/admin/LiveOps';
import AdminScoring from './pages/admin/Scoring';
import AdminResults from './pages/admin/Results';
import AdminMedals from './pages/admin/Medals';
import AdminProtests from './pages/admin/Protests';
import AdminReports from './pages/admin/Reports';
import AdminUsers from './pages/admin/Users';

// Role selector for demo
import RoleSelector from './components/RoleSelector';

export default function TMSApp() {
  return (
    <div className="tms-app">
      <RoleSelector />
      <Routes>
        {/* Public routes */}
        <Route path="/tms" element={<PublicLayout />}>
          <Route index element={<PublicHome />} />
          <Route path="schedule" element={<PublicSchedule />} />
          <Route path="results" element={<PublicLiveResults />} />
          <Route path="medals" element={<PublicMedalTable />} />
          <Route path="event/:eventId" element={<PublicEventDetail />} />
        </Route>

        {/* Delegation Manager routes */}
        <Route path="/tms/delegation" element={<DelegationLayout />}>
          <Route index element={<Navigate to="athletes" replace />} />
          <Route path="athletes" element={<DelegationAthletes />} />
          <Route path="entries" element={<DelegationEntries />} />
          <Route path="schedule" element={<DelegationSchedule />} />
          <Route path="results" element={<DelegationResults />} />
          <Route path="protests" element={<DelegationProtests />} />
        </Route>

        {/* Judge routes */}
        <Route path="/tms/judge" element={<JudgeLayout />}>
          <Route index element={<JudgeMyEvents />} />
          <Route path="events" element={<JudgeMyEvents />} />
          <Route path="scoring/:sessionId" element={<JudgeScoring />} />
          <Route path="offline" element={<JudgeOfflineStatus />} />
        </Route>

        {/* Admin routes */}
        <Route path="/tms/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
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
        </Route>

        <Route path="*" element={<Navigate to="/tms" replace />} />
      </Routes>
    </div>
  );
}
