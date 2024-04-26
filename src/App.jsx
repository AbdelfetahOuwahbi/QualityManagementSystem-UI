import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './public_pages/Main_page'

export default function App() {
  return (
    <Router initialRouteName="/">
      <Routes>
      <Route path="/" element={<Main />} /> 
      </Routes>
    </Router>
  )
}
