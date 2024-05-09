import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Public Routes
import Main from './public_pages/Main_page'
// SysAdmin Routes
import SysDashboard from './users_pages/sysAdmin_pages/SysDashboard';
import SysNotifications from './users_pages/sysAdmin_pages/SysNotifications';
import SysAddConsultant from './users_pages/sysAdmin_pages/SysAddConsultant';
import SysAllConsultants from './users_pages/sysAdmin_pages/SysAllConsultants';
import SysAddOrganism from './users_pages/sysAdmin_pages/SysAddOrganism';
import SysAllOrganismes from './users_pages/sysAdmin_pages/SysAllOrganismes';
export default function App() {
  return (
    <Router initialRouteName="/">
      <Routes>
      <Route path="/" element={<Main />} /> 
      <Route path="/SysDashboard" element={<SysDashboard />} />
      <Route path="/SysNotifications" element={<SysNotifications />} />
      {/* <Route path="/SysAddConsultant" element={<SysAddConsultant />} /> */}
      <Route path="/SysAllConsultants" element={<SysAllConsultants />} />
      {/* <Route path="/SysAddOrganism" element={<SysAddOrganism />} /> */}
      <Route path="/SysAllOrganismes" element={<SysAllOrganismes />} />
      </Routes>
    </Router>
  )
}
