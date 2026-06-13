import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  FileCheck2,
  HelpCircle,
  Image,
  Leaf,
  LoaderCircle,
  MapPinned,
  Sprout,
  TreePine,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { StatCard } from '../../components/cards/StatCard'
import { DashboardShell } from '../../components/layout/DashboardShell'
import { ChangeMap } from '../../components/map/ChangeMap'
import { LayerControls } from '../../components/map/LayerControls'
import { loadDashboardData } from '../../lib/data/analysis'
import type {
  DashboardData,
  LayerId,
  LayerVisibility,
} from '../../types/analysis'

const initialVisibility: LayerVisibility = {
  'vegetation-loss': true,
  'vegetation-gain': true,
  'potential-urban-expansion': true,
}

function formatArea(value: number) {
  return `${value.toFixed(3)} km²`
}

function formatStatus(status: string) {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [visibility, setVisibility] =
    useState<LayerVisibility>(initialVisibility)

  useEffect(() => {
    let cancelled = false

    loadDashboardData()
      .then((result) => {
        if (!cancelled) {
          setData(result)
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load the static analysis files.',
          )
        }
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const toggleLayer = useCallback((id: LayerId) => {
    setVisibility((current) => ({ ...current, [id]: !current[id] }))
  }, [])

  const retryLoad = useCallback(() => {
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  if (error) {
    return (
      <div className="state-wrap">
        <section className="state-card" role="alert">
          <AlertTriangle size={28} />
          <h1>Analysis data could not be loaded</h1>
          <p>{error}</p>
          <button onClick={retryLoad} type="button">
            Retry
          </button>
        </section>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="state-wrap">
        <section className="state-card" aria-live="polite">
          <LoaderCircle className="spin" size={28} />
          <h1>Loading analysis data</h1>
          <p>Reading the Phenikaa static JSON and GeoJSON outputs.</p>
        </section>
      </div>
    )
  }

  const { summary, layers } = data

  return (
    <DashboardShell>
      {/* ── Intro ────────────────────────────────────────── */}
      <section className="dashboard-intro">
        <div>
          <h1>{summary.aoiName}</h1>
          <p className="dashboard-intro__description">
            {summary.aoiDescription}. Same-season Sentinel-2 composites with
            NDVI and NDBI change detection. Inspect candidate change polygons
            exported from the analysis pipeline.
          </p>
        </div>
        <div className="dashboard-intro__badges">
          <span className="badge badge--source">{summary.dataset}</span>
          <span className="badge badge--status">
            <CircleDot size={12} />
            Candidate · Not Validated
          </span>
        </div>
      </section>

      {/* ── Statistics ───────────────────────────────────── */}
      <div>
        <div className="section-label">
          <span className="section-label__eyebrow">Analysis Statistics</span>
          <span className="section-label__line" />
        </div>
        <section className="stats-grid" aria-label="Analysis statistics">
          <StatCard
            color="#596b62"
            detail={`${summary.beforeRange[0]} to ${summary.beforeRange[1]}`}
            icon={Image}
            label="Before image count"
            value={String(summary.imageCounts.before)}
          />
          <StatCard
            color="#596b62"
            detail={`${summary.afterRange[0]} to ${summary.afterRange[1]}`}
            icon={Image}
            label="After image count"
            value={String(summary.imageCounts.after)}
          />
          <StatCard
            color="#dc3c3c"
            detail="Strong negative NDVI change"
            icon={TreePine}
            label="Vegetation loss"
            value={formatArea(summary.stats.vegetationLossKm2)}
          />
          <StatCard
            color="#2878d0"
            detail="Strong positive NDVI change"
            icon={Sprout}
            label="Vegetation gain"
            value={formatArea(summary.stats.vegetationGainKm2)}
          />
          <StatCard
            color="#e89b0e"
            detail="NDVI loss + NDBI gain"
            icon={MapPinned}
            label="Potential urban expansion"
            value={formatArea(summary.combinedChange.areaKm2)}
          />
          <StatCard
            color="#8a6a21"
            detail="Requires manual validation"
            icon={CircleDot}
            label="Candidate status"
            value={formatStatus(summary.combinedChange.status)}
          />
        </section>
      </div>

      {/* ── Map + Layers ─────────────────────────────────── */}
      <div>
        <div className="section-label">
          <span className="section-label__eyebrow">Change Detection Map</span>
          <span className="section-label__line" />
        </div>
        <section className="dashboard-content">
          <section className="panel">
            <header className="panel__header">
              <div>
                <h2>Candidate Change Map</h2>
                <p>
                  {summary.center.latitude.toFixed(6)},{' '}
                  {summary.center.longitude.toFixed(6)}
                </p>
              </div>
            </header>
            <ChangeMap
              layers={layers}
              summary={summary}
              visibility={visibility}
            />
          </section>
          <LayerControls
            layers={layers}
            onToggle={toggleLayer}
            visibility={visibility}
          />
        </section>
      </div>

      {/* ── Methodology + Validation ─────────────────────── */}
      <div>
        <div className="section-label">
          <span className="section-label__eyebrow">
            Methodology &amp; Validation
          </span>
          <span className="section-label__line" />
        </div>
        <section className="summary-grid">
          <article className="info-card">
            <div className="info-card__title">
              <Leaf size={18} />
              <h2>Methodology Summary</h2>
            </div>
            <p>
              Cloud-masked, same-season Sentinel-2 median composites are
              compared to identify statistically unusual NDVI change. A combined
              NDVI loss + NDBI gain rule highlights potential urban expansion
              candidates.
            </p>
            <ul>
              <li>
                <CheckCircle2 size={14} />
                <span>
                  Comparison: <code>{summary.method.comparison}</code>
                </span>
              </li>
              <li>
                <CheckCircle2 size={14} />
                <span>
                  Threshold: <code>{summary.method.threshold}</code>
                </span>
              </li>
              <li>
                <CheckCircle2 size={14} />
                <span>
                  Candidate rule: <code>{summary.combinedChange.rule}</code>
                </span>
              </li>
            </ul>
            <div className="caveat-callout">
              NDVI change does not prove land-use change. Differences may
              reflect crop cycles, rainfall, soil moisture, or residual cloud
              contamination. The combined candidate rule reduces false positives
              but does not confirm urbanization.
            </div>
          </article>

          <article className="info-card">
            <div className="info-card__title">
              <FileCheck2 size={18} />
              <h2>Validation Summary</h2>
            </div>
            <p>
              Three candidate areas received preliminary qualitative review in
              QGIS. Google Earth historical imagery was used only as optional
              visual context, not authoritative ground truth.
            </p>

            <table className="validation-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="v-id">V01</td>
                  <td>
                    <span className="chip chip--unclear">
                      <HelpCircle size={11} />
                      Unclear
                    </span>
                  </td>
                  <td>
                    <span className="chip chip--medium">Medium</span>
                  </td>
                </tr>
                <tr>
                  <td className="v-id">V02</td>
                  <td>
                    <span className="chip chip--confirmed">
                      <CheckCircle2 size={11} />
                      Confirmed
                    </span>
                  </td>
                  <td>
                    <span className="chip chip--high">High</span>
                  </td>
                </tr>
                <tr>
                  <td className="v-id">V03</td>
                  <td>
                    <span className="chip chip--confirmed">
                      <CheckCircle2 size={11} />
                      Confirmed
                    </span>
                  </td>
                  <td>
                    <span className="chip chip--medium">Medium</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="caveat-callout">
              This is a preliminary qualitative review, not a statistical
              accuracy assessment. Google Earth imagery was used only as a
              qualitative visual reference.
            </div>
          </article>
        </section>
      </div>
    </DashboardShell>
  )
}
