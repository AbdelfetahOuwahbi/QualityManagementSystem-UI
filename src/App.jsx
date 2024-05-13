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
        {/* Clients Routes */}
      </Routes>
    </Router>
  )
}
