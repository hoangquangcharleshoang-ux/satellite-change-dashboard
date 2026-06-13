import { Satellite } from 'lucide-react'
import type { PropsWithChildren } from 'react'

export function DashboardShell({ children }: PropsWithChildren) {
  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div className="dashboard-header__inner">
          <div className="dashboard-brand">
            <div className="dashboard-brand__icon">
              <Satellite size={21} />
            </div>
            <div>
              <strong>Satellite Change Dashboard</strong>
              <span>Phenikaa pilot analysis</span>
            </div>
          </div>
          <div className="dashboard-header__meta">
            Static Sentinel-2 analysis
            <br />
            No live Earth Engine connection
          </div>
        </div>
      </header>
      <main className="dashboard-main">{children}</main>
    </div>
  )
}
