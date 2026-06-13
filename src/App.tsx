import './App.css'
import { Route, Routes } from 'react-router-dom'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { ReportPage } from './features/report/ReportPage'

function App() {
  return (
    <Routes>
      <Route element={<DashboardPage />} path="/" />
      <Route element={<ReportPage />} path="/report" />
    </Routes>
  )
}

export default App
