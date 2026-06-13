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
- The committed notebook currently contains the AOI, filtering, cloud masking,
  and composite setup; the downstream NDVI statistics and export steps should
  be captured in the notebook for full reproducibility.

## Next Step

Complete initial visual validation against historical reference imagery and
record the evidence and validation notes.
