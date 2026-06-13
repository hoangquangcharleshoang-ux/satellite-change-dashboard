import { Satellite } from 'lucide-react'
import type { PropsWithChildren } from 'react'

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-header__inner">
          <div className="dashboard-brand">
            <div className="dashboard-brand__icon">
              <Satellite size={20} />
            </div>
            <div>
              <strong>Satellite Change Detection</strong>
              <span>Phenikaa pilot · Sentinel-2 SR</span>
            </div>
          </div>
          <div className="dashboard-header__meta">
            <span className="header-badge header-badge--static">
              Static Data · No Live EE
            </span>
            <span className="header-badge header-badge--pilot">
              Pilot Analysis
            </span>
          </div>
        </div>
      </header>
      <main className="dashboard-main">{children}</main>
    </div>
  )
}
