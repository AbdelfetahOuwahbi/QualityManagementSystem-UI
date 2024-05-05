import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Public Routes
import Main from './public_pages/Main_page'
// SysAdmin Routes
import SysMainPage from './users_pages/sysAdmin_pages/SysMainPage';
export default function App() {
  return (
    <Router initialRouteName="/">
      <Routes>
      <Route path="/" element={<Main />} /> 
      <Route path="/SysAdmin" element={<SysMainPage />} />
      </Routes>
    </Router>
  )
}
