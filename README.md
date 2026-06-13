# Satellite Change Detection Dashboard

A portfolio-quality remote sensing dashboard for detecting and visualizing vegetation change and potential urban expansion in peri-urban Hanoi using Sentinel-2 Surface Reflectance imagery.

## Overview

This project implements a complete NDVI/NDBI change detection pipeline from Google Earth Engine through to a web-based interactive dashboard. The pilot analysis covers the Phenikaa University Hospital / Phu Dien – Xuan Phuong area.

### Key Features

- **NDVI change detection** — same-season comparison of Sentinel-2 composites (2018–2019 vs 2024–2025)
- **NDBI urban expansion candidates** — combined NDVI loss + NDBI gain rule
- **Interactive map** — MapLibre GL JS with toggleable vegetation loss, gain, and urban expansion candidate layers
- **Analysis statistics** — real exported values from the Earth Engine pipeline
- **Validation summary** — preliminary qualitative review of candidate areas
- **Uncertainty-aware** — candidate layers are clearly labelled as unvalidated

### Current Status

**Phase 2 — Dashboard MVP** (pilot analysis)

- Validation is preliminary and qualitative
- Potential urban expansion is a candidate layer, not confirmed land-use change
- Google Earth historical imagery was used only as qualitative visual reference
- Static data only — no live Earth Engine connection

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Map | MapLibre GL JS |
| Styling | Vanilla CSS with design tokens |
| Remote sensing | Google Earth Engine (Sentinel-2 SR Harmonized) |
| GIS validation | QGIS LTR |

## Quick Start

```bash
npm install
npm run dev
```

The dashboard reads static JSON and GeoJSON files from `public/sample-analysis/`.

Routes:

- `/` - interactive dashboard, map, statistics, and area comparison chart
- `/report` - preliminary portfolio report preview

## Project Structure

```
├── public/sample-analysis/      # Static analysis outputs (JSON, GeoJSON, rasters)
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── cards/               # StatCard
│   │   ├── layout/              # DashboardShell
│   │   └── map/                 # ChangeMap, LayerControls
│   ├── features/dashboard/      # DashboardPage
│   ├── lib/data/                # Static data loading
│   └── types/                   # TypeScript interfaces
├── notebooks/                   # Earth Engine analysis notebooks
├── docs/geo/                    # Methodology, indices, validation docs
├── qgis/                       # QGIS validation project
└── scripts/                    # GIS processing scripts
```

## Data Sources

- **Sentinel-2 Surface Reflectance Harmonized** (`COPERNICUS/S2_SR_HARMONIZED`)
- Same-season comparison: October–April
- Cloud-masked median composites
- Threshold: mean ± 1.5 standard deviation of NDVI/NDBI difference

## Documentation

- [Workflow](docs/geo/WORKFLOW.md) — processing steps and current results
- [Indices](docs/geo/INDICES.md) — NDVI, NDBI formulas and interpretation
- [Validation](docs/geo/VALIDATION.md) — qualitative validation protocol and records
- [Project Plan](PROJECT_PLAN.md) — full project plan and roadmap
- [Project Status](PROJECT_STATUS.md) — current state snapshot
- [Progress Log](PROGRESS_LOG.md) — session log and handoff notes

## Limitations

- Detected change areas have not been validated with a full statistical accuracy assessment.
- NDVI change alone does not prove land-use change.
- Combined NDVI loss + NDBI gain is a stronger candidate signal but does not confirm urbanization.
- The AOI is a small pilot area; thresholds should be recalculated for other areas.
- Vectorized polygon-area sums differ slightly from raster pixel-area totals.
- The OpenStreetMap basemap requires an internet connection; GeoTIFF display is deferred.

## License

Private repository — not yet published.
