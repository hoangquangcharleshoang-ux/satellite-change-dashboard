# Validation Notes

## Purpose

This document records visual validation notes for the initial NDVI change detection result around the Phenikaa Hospital / Phu Dien - Xuan Phuong pilot AOI.

## Reference Sources

- Google Earth / Google Maps historical imagery
- Sentinel-2 NDVI change result from:
  - `public/sample-analysis/phenikaa-area-ndvi-change.json`
  - `notebooks/01_sentinel2_ndvi_change_phenikaa_area.ipynb`

## Current NDVI Result Summary

- Before period: 2018-10-01 to 2019-04-30
- After period: 2024-10-01 to 2025-04-30
- Vegetation loss area: 0.5842980238744406 km²
- Vegetation gain area: 0.35884955265580726 km²

## Visual Validation Table

| ID  | Location / description | NDVI result | Visual check                   | Notes |
| --- | ---------------------- | ----------- | ------------------------------ | ----- |
| V01 |                        | Loss        | Confirmed / Unclear / Rejected |       |
| V02 |                        | Loss        | Confirmed / Unclear / Rejected |       |
| V03 |                        | Gain        | Confirmed / Unclear / Rejected |       |
| V04 |                        | Gain        | Confirmed / Unclear / Rejected |       |

## Interpretation Rules

- Confirmed: NDVI change matches visible land surface change in historical imagery.
- Unclear: imagery is ambiguous, seasonal, cloudy, or not enough evidence.
- Rejected: NDVI result does not match visible reference imagery.

## Limitations

- This is visual validation only, not full statistical accuracy assessment.
- NDVI change can be affected by crop cycles, rainfall, vegetation health, shadows, and residual cloud effects.
- More rigorous validation should use manually labeled sample points and an accuracy assessment table.
