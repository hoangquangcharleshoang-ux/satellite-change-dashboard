# Project Status

**Last updated:** 2026-07-16

## Current Phase

Phase 2 - Dashboard MVP with polished UI/UX.

## Completed

- Defined a pilot AOI around Phenikaa University Hospital / Phu Dien - Xuan
  Phuong, Hanoi.
- Created the initial Sentinel-2 SR Harmonized notebook.
- Configured same-season before and after periods.
- Applied an SCL-based cloud mask and median composites.
- Calculated NDVI difference and mean +/- 1.5 standard deviation thresholds.
- Exported current pilot statistics to
  `public/sample-analysis/phenikaa-area-ndvi-change.json`.
- Made the committed notebook logically runnable from AOI definition through
  NDVI statistics, vegetation loss/gain area calculation, and JSON export.
- Extended the notebook with NDBI difference statistics and a potential urban
  expansion candidate rule combining strong NDVI loss with strong NDBI gain.
- Exported dashboard-ready vegetation loss, vegetation gain, and potential
  urban expansion GeoJSON candidate layers.
- Added a qualitative validation protocol without claiming accuracy.
- Exported reproducible Sentinel-2 before/after RGB composites and NDVI/NDBI
  difference GeoTIFFs for QGIS validation.
- Added the first three qualitative validation samples: two Confirmed
  candidates and one Unclear candidate.
- Saved the QGIS validation project at `qgis/phenikaa-validation.qgz`.
- Replaced the default Vite page with a React + TypeScript dashboard that reads
  the committed static JSON and GeoJSON analysis outputs.
- Added a MapLibre vector map with vegetation loss, vegetation gain, and
  potential urban expansion layers, toggles, and legend.
- Added a keyless OpenStreetMap raster basemap beneath the candidate polygons
  to provide road, neighborhood, and place context.
- Added analysis stat cards, loading/error states, and methodology and
  validation summaries.
- Added a reusable Recharts area comparison chart for vegetation loss,
  vegetation gain, and potential urban expansion candidate area.
- Added React Router navigation with dashboard and portfolio-friendly report
  preview routes.
- Added a static-data-driven preliminary report preview covering study inputs,
  results, combined candidate rule, validation summary, and limitations.
- Documented the initial workflow, current results, and limitations in
  `docs/geo/WORKFLOW.md` and `docs/geo/INDICES.md`.
- Polished the dashboard UI/UX to portfolio quality: dark gradient header,
  expanded design system with semantic color tokens, improved stat cards with
  hover effects, section labels with eyebrow text, validation summary table
  with status and confidence chips, methodology caveat callouts, status badges,
  better responsive breakpoints, and Google Fonts (Inter).
- Replaced the default Vite README with a real project description.
- Polished the README into a recruiter- and GIS-reviewer-oriented portfolio
  document with real dashboard, report, and QGIS screenshots.
- Deployed the dashboard and report preview to Vercel:
  `https://satellite-change-dashboard.vercel.app`.
- Added a Vercel SPA rewrite so direct access to and refreshes of `/report`
  fall back to `index.html` before React Router resolves the client route.
- Corrected the README to reflect that the repository is public for portfolio
  and educational review, with no open-source license selected yet.

## Current Results

- Before images: 5
- After images: 10
- NDVI difference mean: -0.029051315005948708
- NDVI difference standard deviation: 0.1504748968728374
- Vegetation loss area: 0.5842980238744534 km2
- Vegetation gain area: 0.35884955265581303 km2
- NDBI difference mean: -0.023043401383381405
- NDBI difference standard deviation: 0.10776774628079479
- Potential urban expansion candidate area: 0.3321838038651405 km2

## Known Gaps

- Validation is preliminary and is not a full statistical accuracy assessment.
- Only three qualitative candidate samples have been reviewed so far.
- Re-running the notebook requires an authenticated Earth Engine environment
  with the configured Google Cloud project and the `ee`, `geemap`, and
  `rasterio` packages.
- GeoJSON polygons are unvalidated candidate outputs and can contain small,
  fragmented polygons.
- Vectorized polygon-area sums differ slightly from raster pixel-area totals.
- Visual RGB layers are multi-date median composites, not single-date scenes.
- The OpenStreetMap basemap requires an internet connection and is contextual
  reference only; GeoTIFF display remains deferred.
- The production bundle currently reports a large-chunk warning because
  MapLibre and the dashboard load in one initial bundle.
- Post-push live verification of the new `/report` fallback is pending until
  this routing configuration is deployed by Vercel.

## Next Step

Expand validation beyond V01-V03 and create a documented statistical accuracy
assessment. Consider route-level code-splitting to reduce the production
bundle size.
