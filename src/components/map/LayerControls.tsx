import type {
  AnalysisLayer,
  LayerId,
  LayerVisibility,
} from '../../types/analysis'

interface LayerControlsProps {
  layers: AnalysisLayer[]
  visibility: LayerVisibility
  onToggle: (id: LayerId) => void
}

export function LayerControls({
  layers,
  visibility,
  onToggle,
}: LayerControlsProps) {
  return (
    <aside className="panel layer-panel" aria-label="Map layer controls">
      <h2>Map Layers</h2>
      <p className="layer-panel__help">
        Toggle candidate change polygons on the map.
      </p>
      <div className="layer-list">
        {layers.map((layer) => (
          <label
            className={`layer-toggle${visibility[layer.id] ? ' layer-toggle--active' : ''}`}
            key={layer.id}
          >
            <input
              checked={visibility[layer.id]}
              onChange={() => onToggle(layer.id)}
              type="checkbox"
            />
            <span className="layer-toggle__text">
              <strong>{layer.label}</strong>
              <span>{layer.description}</span>
              <span className="layer-toggle__count">
                {layer.data.features.length} polygons
              </span>
            </span>
            <span
              className="legend-swatch"
              style={{ '--layer-color': layer.color } as React.CSSProperties}
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
      <p className="layer-panel__caveat">
        Orange polygons are <strong>candidates</strong>, not confirmed land-use
        change. All layers require manual validation.
      </p>
    </aside>
  )
}
