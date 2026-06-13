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
