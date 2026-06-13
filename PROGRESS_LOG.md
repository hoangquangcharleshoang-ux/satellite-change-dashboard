## Session — Initial NDVI Pipeline

Completed:

- Created AOI around Phenikaa University Hospital / Phu Dien - Xuan Phuong area.
- Verified Earth Engine authentication.
- Loaded Sentinel-2 SR Harmonized imagery.
- Used same-season comparison:
  - Before: 2018-10-01 to 2019-04-30
  - After: 2024-10-01 to 2025-04-30
- Image counts:
  - Before: 5
  - After: 10
- Computed NDVI before/after and NDVI difference.
- Computed threshold using mean ± 1.5 standard deviation:
  - NDVI Diff Mean: -0.029051315005948708
  - NDVI Diff StdDev: 0.1504748968728374
  - Vegetation loss threshold: -0.2547636603152048
  - Vegetation gain threshold: 0.1966610303033074
- Computed area statistics:
  - Vegetation loss: 0.5842980238744406 km²
  - Vegetation gain: 0.35884955265580726 km²
- Exported dashboard sample JSON:
  - public/sample-analysis/phenikaa-area-ndvi-change.json

Next:

- Review generated JSON.
- Add methodology notes to docs/geo/WORKFLOW.md and docs/geo/INDICES.md.
- Export GeoJSON change zones if feasible.
- Build the dashboard to read this JSON.

## Session - 2026-06-13 - Initial NDVI Methodology Documentation

Completed:

- Documented the Phenikaa Hospital / Phu Dien - Xuan Phuong pilot AOI.
- Documented Sentinel-2 SR Harmonized inputs, same-season date ranges, image
  counts, SCL cloud masking, and median composites.
- Documented NDVI, NDVI difference, mean +/- 1.5 standard deviation
  classification, area statistics, and current JSON results.
- Added limitations covering validation status, NDVI interpretation,
  cloud/composite limitations, and pilot-AOI scope.
- Updated `PROJECT_STATUS.md` with the current phase, results, gaps, and next
  step.

Verification:

- Documentation-only change; no build required.

Next:

- Validate detected change areas against historical reference imagery and
  document the validation evidence.

## Session - 2026-06-13 - Reproducible NDVI Notebook

Completed:

- Rebuilt `notebooks/01_sentinel2_ndvi_change_phenikaa_area.ipynb` as a
  logically runnable top-to-bottom workflow.
- Added NDVI before/after calculation, NDVI difference statistics, mean +/-
  1.5 standard deviation thresholds, vegetation loss/gain masks, and area
  totals in km2.
- Added local JSON export using the existing
  `public/sample-analysis/phenikaa-area-ndvi-change.json` schema.
- Cleared all saved notebook execution counts and outputs.
- Updated `PROJECT_STATUS.md` to record that JSON regeneration is covered.

Verification:

- Notebook JSON structure and Python cell syntax checked locally.
- Earth Engine computations were not executed during this session.
- No frontend files changed; no npm build required.

Next:

- Run the notebook in the authenticated Earth Engine environment and compare
  the regenerated statistics with the committed JSON before validation.

## Session - 2026-06-13 - NDBI and Urban Expansion Candidates

Completed:

- Extended the reproducible notebook with NDBI before/after images, NDBI
  difference statistics, and mean +/- 1.5 standard deviation thresholds.
- Added the exploratory potential urban expansion rule combining strong NDVI
  loss with strong NDBI gain.
- Executed the notebook successfully against Earth Engine.
- Regenerated the backward-compatible dashboard JSON with real NDBI and
  combined-candidate statistics.
- Exported vegetation loss, vegetation gain, and potential urban expansion
  candidate GeoJSON files.
- Updated index, workflow, validation, status, and decision documentation.

Current combined result:

- Potential urban expansion candidate area: 332183.80386514054 m2
  (`0.3321838038651405 km2`)
- Status: `candidate_not_validated`

Verification:

- Earth Engine notebook execution completed successfully.
- No frontend files changed; no npm build required.

Next:

- Perform qualitative manual review of exported candidate polygons and record
  evidence, confidence, and Confirmed / Unclear / Rejected status.

## Session - 2026-06-13 - Reproducible Validation Rasters

Completed:

- Extended the notebook with local GeoTIFF export for before and after
  Sentinel-2 RGB median composites.
- Exported continuous NDVI and NDBI difference GeoTIFFs.
- Used the existing AOI, date ranges, cloud mask, and median composites.
- Preserved full negative-to-positive difference ranges, including valid
  zero-change pixels.
- Executed the notebook successfully and verified raster metadata.
- Updated the workflow and qualitative validation documentation.

Created:

- `public/sample-analysis/rasters/sentinel2-before-rgb.tif`
- `public/sample-analysis/rasters/sentinel2-after-rgb.tif`
- `public/sample-analysis/rasters/ndvi-difference.tif`
- `public/sample-analysis/rasters/ndbi-difference.tif`

Verification:

- All four GeoTIFFs are EPSG:4326 at approximately 10 m pixel spacing.
- No frontend files changed; no npm build required.

Next:

- Load the candidate polygons and four validation rasters into QGIS, compare
  before/after evidence, and record qualitative labels and confidence.

## Session - 2026-06-13 - Initial Qualitative Validation Samples

Completed:

- Reviewed three candidate areas using QGIS candidate polygons and Google
  Earth historical imagery.
- Added initial qualitative validation records:
  - V01: Ngõ 139 Đường Phú Diễn area - Unclear / Medium
  - V02: Phenikaa Hospital / Kiều Mai gate area - Confirmed / High
  - V03: Phố Phúc Minh / THCS Phú Diễn area - Confirmed / Medium
- Saved and referenced the QGIS validation project:
  `qgis/phenikaa-validation.qgz`.

Validation note:

- Google Earth imagery was used only as a qualitative visual reference, not as
  authoritative ground truth.
- Validation remains preliminary and is not a full statistical accuracy
  assessment.

Next:

- Begin the dashboard MVP or continue with more qualitative validation samples.

## Session - 2026-06-13 - Dashboard MVP Technical Foundation

Completed:

- Replaced the default Vite page with a functional React + TypeScript
  dashboard.
- Added typed static-data loading for the existing analysis JSON and three
  GeoJSON candidate layers.
- Added a MapLibre vector map centered on the Phenikaa AOI.
- Added red vegetation-loss, blue vegetation-gain, and orange potential urban
  expansion layers with toggles and a legend.
- Added six stat cards, loading/error states, and methodology and validation
  summary sections.
- Organized code under `src/components`, `src/features/dashboard`, `src/lib`,
  and `src/types`.
- Updated ESLint ignores so frontend lint does not scan `.venv` dependencies.

Verification:

- `npm run build` passed.
- `npm run lint` passed.
- `git diff --check` passed.
- Browser verification confirmed real stats, visible polygon layers, working
  toggles, and no console errors.
- No notebook, JSON, GeoJSON, raster, QGIS project, credential, or environment
  files were changed.

Known limitation:

- Vite reports a large initial JavaScript chunk warning; code splitting is
  deferred until the dashboard surface grows.

Next:

- Antigravity UI polish: improve visual hierarchy, spacing, responsive
  behavior, and map-control presentation while preserving the current data
  contracts and functionality.

## Session - 2026-06-13 - Dashboard MVP UI/UX Polish

Completed:

- Redesigned the dashboard header with a dark gradient background, satellite
  icon glow, and two status badges ("Static Data · No Live EE" and "Pilot
  Analysis").
- Expanded the CSS design system with semantic color tokens for loss, gain,
  urban candidates, confirmed/unclear status, and dark header palette.
- Added CSS transition tokens and hover effects on stat cards (lift + shadow).
- Introduced section labels with eyebrow text and horizontal divider lines
  for statistics, map, and methodology/validation sections.
- Added a "Candidate · Not Validated" status badge in the dashboard intro.
- Replaced the methodology list with icon-aligned items and a dedicated
  caveat callout with border-left accent explaining NDVI limitations.
- Added a validation summary table showing V01 (Unclear/Medium), V02
  (Confirmed/High), and V03 (Confirmed/Medium) with colored status and
  confidence chips.
- Added a validation caveat callout stating this is preliminary qualitative
  review, not statistical accuracy assessment.
- Improved layer controls with active-state class toggling, polygon count
  badges, and stronger caveat language.
- Improved map container height and note overlay with backdrop blur.
- Improved responsive breakpoints for laptop, desktop, and narrower screens.
- Added Google Fonts (Inter) via index.html preconnect and link tag.
- Updated index.html with proper SEO title, meta description.
- Replaced the default Vite README with a real project description.
- Updated PROJECT_STATUS.md with UI polish completion.

Files changed:

- `index.html`
- `src/index.css`
- `src/App.css`
- `src/components/layout/DashboardShell.tsx`
- `src/components/map/LayerControls.tsx`
- `src/features/dashboard/DashboardPage.tsx`
- `README.md`
- `PROJECT_STATUS.md`
- `PROGRESS_LOG.md`

Preserved:

- All JSON, GeoJSON, raster, notebook, and QGIS files unchanged.
- All TypeScript types and data loading logic unchanged.
- MapLibre map initialization, sources, layers, and toggles unchanged.
- No live Earth Engine connection.
- Uncertainty language preserved throughout.

Verification:

- `npm run build` passed.
- `npm run lint` passed.
- `git diff --check` passed.

Next:

- Add a basemap tile layer to the MapLibre map.
- Add a before/after NDVI bar chart using Recharts.
- Add a report preview page.
- Consider code-splitting to resolve the Vite large-chunk warning.
