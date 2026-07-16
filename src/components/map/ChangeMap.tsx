import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl, {
  type GeoJSONSourceSpecification,
  type Map as MapLibreMap,
  type StyleSpecification,
} from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import type {
  AnalysisLayer,
  AnalysisSummary,
  LayerVisibility,
} from '../../types/analysis'

interface ChangeMapProps {
  summary: AnalysisSummary
  layers: AnalysisLayer[]
  visibility: LayerVisibility
}

const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    openstreetmap: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'openstreetmap',
      type: 'raster',
      source: 'openstreetmap',
    },
  ],
}

function fillLayerId(id: string) {
  return `${id}-fill`
}

function lineLayerId(id: string) {
  return `${id}-line`
}

export function ChangeMap({ summary, layers, visibility }: ChangeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [summary.center.longitude, summary.center.latitude],
      zoom: 13.8,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: 'Static Sentinel-2 analysis',
      }),
      'bottom-left',
    )

    map.on('load', () => {
      layers.forEach((layer) => {
        map.addSource(layer.id, {
          type: 'geojson',
          data: layer.data as GeoJSONSourceSpecification['data'],
        })
        map.addLayer({
          id: fillLayerId(layer.id),
          type: 'fill',
          source: layer.id,
          layout: {
            visibility: 'visible',
          },
          paint: {
            'fill-color': layer.color,
            'fill-opacity': layer.id === 'potential-urban-expansion' ? 0.36 : 0.28,
          },
        })
        map.addLayer({
          id: lineLayerId(layer.id),
          type: 'line',
          source: layer.id,
          layout: {
            visibility: 'visible',
          },
          paint: {
            'line-color': layer.color,
            'line-width': layer.id === 'potential-urban-expansion' ? 1.8 : 1.25,
          },
        })
      })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [layers, summary.center.latitude, summary.center.longitude])

  useEffect(() => {
    const map = mapRef.current

    if (!map) {
      return
    }

    const updateVisibility = () => {
      layers.forEach((layer) => {
        const layerVisibility = visibility[layer.id] ? 'visible' : 'none'
        for (const mapLayerId of [fillLayerId(layer.id), lineLayerId(layer.id)]) {
          if (map.getLayer(mapLayerId)) {
            map.setLayoutProperty(mapLayerId, 'visibility', layerVisibility)
          }
        }
      })
    }

    if (map.loaded()) {
      updateVisibility()
      return
    }

    map.once('load', updateVisibility)
  }, [layers, visibility])

  return (
    <div className="map-container">
      <div
        ref={containerRef}
        aria-label="Phenikaa change detection map"
        role="region"
      />
      <div className="map-note">
        Basemap: OpenStreetMap. Candidate polygons are derived from Sentinel-2
        analysis.
      </div>
    </div>
  )
}
