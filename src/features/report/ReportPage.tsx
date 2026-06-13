import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Database,
  FileText,
  HelpCircle,
  LoaderCircle,
  MapPinned,
  TriangleAlert,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { DashboardShell } from '../../components/layout/DashboardShell'
import { loadAnalysisSummary } from '../../lib/data/analysis'
import type { AnalysisSummary } from '../../types/analysis'

const validationRecords = [
  { confidence: 'Medium', id: 'V01', status: 'Unclear' },
  { confidence: 'High', id: 'V02', status: 'Confirmed' },
  { confidence: 'Medium', id: 'V03', status: 'Confirmed' },
]

function formatArea(value: number) {
  return `${value.toFixed(3)} km\u00B2`
}

function formatStatistic(value: number) {
  return value.toFixed(6)
}

export function ReportPage() {
  const [summary, setSummary] = useState<AnalysisSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    loadAnalysisSummary()
      .then((result) => {
        if (!cancelled) {
          setSummary(result)
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load the static analysis summary.',
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="state-wrap">
        <section className="state-card" role="alert">
          <AlertTriangle size={28} />
          <h1>Report data could not be loaded</h1>
          <p>{error}</p>
        </section>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="state-wrap">
        <section className="state-card" aria-live="polite">
          <LoaderCircle className="spin" size={28} />
          <h1>Loading report preview</h1>
          <p>Reading the static Phenikaa analysis summary.</p>
        </section>
      </div>
    )
  }

  return (
    <DashboardShell>
      <article className="report-page">
        <header className="report-hero">
          <div>
            <span className="report-badge">
              <FileText size={13} />
              Preliminary report
            </span>
            <h1>Satellite Change Detection Report</h1>
            <p>
              A portfolio preview of the NDVI and NDBI change analysis for{' '}
              {summary.aoiName}.
            </p>
          </div>
          <div className="report-hero__meta">
            <span>AOI center</span>
            <strong>
              {summary.center.latitude.toFixed(6)},{' '}
              {summary.center.longitude.toFixed(6)}
            </strong>
          </div>
        </header>

        <section className="report-section">
          <div className="report-section__heading">
            <MapPinned size={18} />
            <div>
              <span>01</span>
              <h2>Study Area and Data</h2>
            </div>
          </div>
          <div className="report-facts">
            <div>
              <span>Area of interest</span>
              <strong>{summary.aoiName}</strong>
              <small>{summary.aoiDescription}</small>
            </div>
            <div>
              <span>Dataset</span>
              <strong>{summary.dataset}</strong>
              <small>{summary.method.composite}</small>
            </div>
            <div>
              <span>Before period</span>
              <strong>
                {summary.beforeRange[0]} to {summary.beforeRange[1]}
              </strong>
              <small>{summary.imageCounts.before} images</small>
            </div>
            <div>
              <span>After period</span>
              <strong>
                {summary.afterRange[0]} to {summary.afterRange[1]}
              </strong>
              <small>{summary.imageCounts.after} images</small>
            </div>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section__heading">
            <Database size={18} />
            <div>
              <span>02</span>
              <h2>Analysis Results</h2>
            </div>
          </div>
          <div className="report-metrics">
            <div>
              <span>NDVI difference mean</span>
              <strong>{formatStatistic(summary.stats.differenceMean)}</strong>
            </div>
            <div>
              <span>NDVI difference std dev</span>
              <strong>
                {formatStatistic(summary.stats.differenceStdDev)}
              </strong>
            </div>
            <div className="report-metric--loss">
              <span>Vegetation loss</span>
              <strong>{formatArea(summary.stats.vegetationLossKm2)}</strong>
            </div>
            <div className="report-metric--gain">
              <span>Vegetation gain</span>
              <strong>{formatArea(summary.stats.vegetationGainKm2)}</strong>
            </div>
            <div className="report-metric--urban">
              <span>Potential urban expansion</span>
              <strong>{formatArea(summary.combinedChange.areaKm2)}</strong>
            </div>
          </div>
          <div className="report-rule">
            <span>Combined candidate rule</span>
            <code>{summary.combinedChange.rule}</code>
          </div>
          <div className="caveat-callout">
            The potential urban expansion layer is a candidate signal, not
            confirmed land-use change.
          </div>
        </section>

        <section className="report-section">
          <div className="report-section__heading">
            <CheckCircle2 size={18} />
            <div>
              <span>03</span>
              <h2>Qualitative Validation</h2>
            </div>
          </div>
          <p className="report-section__intro">
            Three candidate locations received preliminary visual review in
            QGIS using reproducible Sentinel-2 layers and optional Google Earth
            historical imagery context.
          </p>
          <div className="report-validation">
            {validationRecords.map((record) => (
              <div key={record.id}>
                <strong>{record.id}</strong>
                <span
                  className={`chip ${
                    record.status === 'Confirmed'
                      ? 'chip--confirmed'
                      : 'chip--unclear'
                  }`}
                >
                  {record.status === 'Confirmed' ? (
                    <CheckCircle2 size={11} />
                  ) : (
                    <HelpCircle size={11} />
                  )}
                  {record.status}
                </span>
                <span
                  className={`chip ${
                    record.confidence === 'High'
                      ? 'chip--high'
                      : 'chip--medium'
                  }`}
                >
                  {record.confidence}
                </span>
              </div>
            ))}
          </div>
          <div className="caveat-callout">
            Google Earth is a qualitative visual reference only. Validation is
            preliminary and is not a full statistical accuracy assessment.
          </div>
        </section>

        <section className="report-section">
          <div className="report-section__heading">
            <TriangleAlert size={18} />
            <div>
              <span>04</span>
              <h2>Limitations</h2>
            </div>
          </div>
          <ul className="report-limitations">
            <li>
              <CircleDot size={14} />
              Candidate areas are not confirmed land-use change.
            </li>
            <li>
              <CircleDot size={14} />
              Google Earth is used only as a qualitative visual reference.
            </li>
            <li>
              <CircleDot size={14} />
              Validation is preliminary, not a full statistical accuracy
              assessment.
            </li>
            <li>
              <CircleDot size={14} />
              Sentinel-2 mixed pixels and seasonal effects can affect
              interpretation.
            </li>
          </ul>
        </section>
      </article>
    </DashboardShell>
  )
}
