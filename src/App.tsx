import './App.css'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LazyLoadBoundary } from './components/layout/LazyLoadBoundary'
import { DashboardPage } from './features/dashboard/DashboardPage'

const ReportPage = lazy(() =>
  import('./features/report/ReportPage').then((module) => ({
    default: module.ReportPage,
  })),
)

function PageLoadingFallback() {
  return (
    <div className="state-wrap">
      <section className="state-card" aria-busy="true" aria-live="polite">
        <h1>Loading page</h1>
        <p>Preparing the requested dashboard view.</p>
      </section>
    </div>
  )
}

function App() {
  return (
    <LazyLoadBoundary>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<ReportPage />} path="/report" />
        </Routes>
      </Suspense>
    </LazyLoadBoundary>
  )
}

export default App
