import type {
  AnalysisLayer,
  AnalysisSummary,
  ChangeFeatureCollection,
  DashboardData,
  LayerId,
} from '../../types/analysis'

const analysisBaseUrl = `${import.meta.env.BASE_URL}sample-analysis`

const layerMetadata: Record<
  LayerId,
  Pick<AnalysisLayer, 'label' | 'description' | 'color'>
> = {
  'vegetation-loss': {
    label: 'Vegetation loss',
    description: 'Strong negative NDVI change',
    color: '#dc3c3c',
  },
  'vegetation-gain': {
    label: 'Vegetation gain',
    description: 'Strong positive NDVI change',
    color: '#2878d0',
  },
  'potential-urban-expansion': {
    label: 'Potential urban expansion',
    description: 'NDVI loss and NDBI gain candidate',
    color: '#f0a51a',
  },
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${analysisBaseUrl}/${path}`)

  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status})`)
  }

  return (await response.json()) as T
}

async function loadLayer(id: LayerId): Promise<AnalysisLayer> {
  const data = await fetchJson<ChangeFeatureCollection>(`geojson/${id}.geojson`)

  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    throw new Error(`${id}.geojson is not a valid feature collection`)
  }

  return {
    id,
    ...layerMetadata[id],
    data,
  }
}

export async function loadDashboardData(): Promise<DashboardData> {
  const [summary, ...layers] = await Promise.all([
    fetchJson<AnalysisSummary>('phenikaa-area-ndvi-change.json'),
    loadLayer('vegetation-loss'),
    loadLayer('vegetation-gain'),
    loadLayer('potential-urban-expansion'),
  ])

  return { summary, layers }
}
