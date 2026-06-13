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
