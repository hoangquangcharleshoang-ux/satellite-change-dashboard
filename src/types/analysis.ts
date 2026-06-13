export type LayerId =
  | 'vegetation-loss'
  | 'vegetation-gain'
  | 'potential-urban-expansion'

export interface AnalysisSummary {
  aoiName: string
  aoiDescription: string
  center: {
    longitude: number
    latitude: number
  }
  dataset: string
  index: string
  beforeRange: [string, string]
  afterRange: [string, string]
  method: {
    comparison: string
    seasonWindow: string
    composite: string
    threshold: string
    lossRule: string
    gainRule: string
    combinedRule: string
    combinedRuleCaveat: string
  }
  imageCounts: {
    before: number
    after: number
  }
  stats: {
    differenceMean: number
    differenceStdDev: number
    vegetationLossThreshold: number
    vegetationGainThreshold: number
    vegetationLossKm2: number
    vegetationGainKm2: number
  }
  ndbiStats: {
    differenceMean: number
    differenceStdDev: number
    builtUpGainThreshold: number
    builtUpDecreaseThreshold: number
  }
  combinedChange: {
    name: string
    rule: string
    areaM2: number
    areaKm2: number
    status: string
    caveat: string
  }
}

export interface ChangeFeatureProperties {
  area_km2: number
  area_m2: number
  change_type: string
  class: number
  count: number
  status: string
}

export interface ChangeFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    id?: string
    geometry: {
      type: string
      coordinates: unknown
    }
    properties: ChangeFeatureProperties
  }>
}

export interface AnalysisLayer {
  id: LayerId
  label: string
  description: string
  color: string
  data: ChangeFeatureCollection
}

export interface DashboardData {
  summary: AnalysisSummary
  layers: AnalysisLayer[]
}

export type LayerVisibility = Record<LayerId, boolean>
