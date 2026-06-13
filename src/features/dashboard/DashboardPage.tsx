import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  CircleDot,
  FileCheck2,
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
          <AlertTriangle size={26} />
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
          <LoaderCircle className="spin" size={26} />
          <h1>Loading static analysis</h1>
          <p>Reading the Phenikaa JSON and GeoJSON outputs.</p>
        </section>
      </div>
    )
  }

  const { summary, layers } = data

  return (
    <DashboardShell>
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">Dashboard MVP</p>
          <h1>{summary.aoiName}</h1>
          <p className="dashboard-intro__description">
            {summary.aoiDescription}. Compare same-season Sentinel-2 composites
            and inspect candidate change polygons from static exported files.
          </p>
        </div>
        <span className="data-source-badge">{summary.dataset}</span>
      </section>

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
          color="#f0a51a"
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

      <section className="dashboard-content">
        <section className="panel">
          <header className="panel__header">
            <div>
              <h2>Change candidate map</h2>
              <p>
                Centered at {summary.center.latitude.toFixed(6)},{' '}
                {summary.center.longitude.toFixed(6)}
              </p>
            </div>
          </header>
          <ChangeMap layers={layers} summary={summary} visibility={visibility} />
        </section>
        <LayerControls
          layers={layers}
          onToggle={toggleLayer}
          visibility={visibility}
        />
      </section>

      <section className="summary-grid">
        <article className="info-card">
          <div className="info-card__title">
            <Leaf size={18} />
            <h2>Methodology summary</h2>
          </div>
          <p>
            The analysis compares cloud-masked, same-season Sentinel-2 median
            composites. NDVI identifies strong vegetation change; NDBI adds a
            built-up-like spectral signal.
          </p>
          <ul>
            <li>
              Comparison: <code>{summary.method.comparison}</code>
            </li>
            <li>
              Threshold: <code>{summary.method.threshold}</code>
            </li>
            <li>
              Candidate rule: <code>{summary.combinedChange.rule}</code>
            </li>
          </ul>
        </article>
        <article className="info-card">
          <div className="info-card__title">
            <FileCheck2 size={18} />
            <h2>Validation summary</h2>
          </div>
          <p>
            Three candidate areas have received preliminary qualitative review
            in QGIS. Google Earth historical imagery was used only as optional
            visual context, not authoritative ground truth.
          </p>
          <ul>
            <li>
              <CheckCircle2 size={13} /> 2 Confirmed candidates
            </li>
            <li>
              <CalendarRange size={13} /> 1 Unclear candidate
            </li>
            <li>No statistical accuracy assessment yet</li>
          </ul>
        </article>
      </section>
    </DashboardShell>
  )
}
