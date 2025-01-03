import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Public Routes
import Main from './public_pages/Main_page'
//Common Routes
import Profile from './users_pages/Profile'
// SysAdmin Routes
import SysDashboard from './users_pages/sysAdmin_pages/SysDashboard';
import SysNotifications from './users_pages/sysAdmin_pages/SysNotifications';
import SysAllConsultants from './users_pages/sysAdmin_pages/SysAllConsultants';
import SysAllOrganismes from './users_pages/sysAdmin_pages/SysAllOrganismes';
import SysAllEntreprises from './users_pages/sysAdmin_pages/SysAllEntreprises.jsx';
import SysAllNorms from "./users_pages/sysAdmin_pages/SysAllNorms.jsx";
// Clients routes
import ClientDashboard from './users_pages/client_pages/ClientDashboard';
import ClientNotifications from './users_pages/client_pages/ClientNotifications';
// Consultants routes
import AllEntreprises from './users_pages/client_pages/consultant_pages/AllEntreprises';
import AllUsers from './users_pages/client_pages/consultant_pages/AllUsers.jsx';
import AllDiagnosises from './users_pages/client_pages/consultant_pages/AllDiagnosises';
import ActionsPlans from './users_pages/client_pages/ActionsPlans.jsx';
import ActionPlanDetails from './users_pages/client_pages/ActionPlanDetails.jsx';

export default function App() {
  return (
    <Router initialRouteName="/">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Main />} />
        {/* Common Routes */}
        <Route path="/Profile" element={<Profile />} />
        {/* Sys Admin Routes */}
        <Route path="/SysDashboard" element={<SysDashboard />} />
        <Route path="/SysNotifications" element={<SysNotifications />} />
        <Route path="/SysAllConsultants" element={<SysAllConsultants />} />
        <Route path="/SysAllOrganismes" element={<SysAllOrganismes />} />
        <Route path="/SysAllEntreprises" element={<SysAllEntreprises />} />
        <Route path="/SysAllNorms" element={<SysAllNorms />} />
        {/* Clients Routes */}
        <Route path="/ClientDashboard" element={<ClientDashboard />} />
        <Route path="/ClientNotifications" element={<ClientNotifications />} />
        <Route path="/ActionsPlans" element={<ActionsPlans />} />
        <Route path="/ActionPlanDetails" element={<ActionPlanDetails />} />
        {/* Consultants Routes */}
        <Route path="/AllEntreprises" element={<AllEntreprises />} />
        <Route path="/AllUsers" element={<AllUsers />} />
        <Route path="/AllDiagnosises" element={<AllDiagnosises />} />
      </Routes>
    </Router>
  )
}
