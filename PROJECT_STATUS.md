# Project Status

**Last updated:** 2026-06-13

## Current Phase

Phase 1 - Initial NDVI analysis pipeline and methodology documentation.

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
- Documented the initial workflow, current results, and limitations in
  `docs/geo/WORKFLOW.md` and `docs/geo/INDICES.md`.

## Current Results

- Before images: 5
- After images: 10
- NDVI difference mean: -0.029051315005948708
- NDVI difference standard deviation: 0.1504748968728374
- Vegetation loss area: 0.5842980238744406 km2
- Vegetation gain area: 0.35884955265580726 km2

## Known Gaps

- Results have not yet been validated.
- Change-zone GeoJSON has not yet been exported.
- Re-running the notebook requires an authenticated Earth Engine environment
  with the configured Google Cloud project and the `ee` and `geemap` packages.

## Next Step

Run the notebook in the authenticated Earth Engine environment, compare the
regenerated JSON statistics with the committed output, then begin visual
validation against historical reference imagery.
