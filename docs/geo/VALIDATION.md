# Qualitative Validation

## Purpose

This document provides a template for qualitative visual review of vegetation
loss, vegetation gain, and potential urban expansion candidates in the
Phenikaa Hospital / Phu Dien - Xuan Phuong pilot AOI.

No validation evidence or final accuracy is claimed yet.

## Reproducible Comparison Layers

The primary reproducible visual comparison layers are generated from the same
cloud-masked, same-season Sentinel-2 median composites used by the analysis:

- `public/sample-analysis/rasters/sentinel2-before-rgb.tif`
- `public/sample-analysis/rasters/sentinel2-after-rgb.tif`
- `public/sample-analysis/rasters/ndvi-difference.tif`
- `public/sample-analysis/rasters/ndbi-difference.tif`

The model outputs to review are:

- `public/sample-analysis/geojson/vegetation-loss.geojson`
- `public/sample-analysis/geojson/vegetation-gain.geojson`
- `public/sample-analysis/geojson/potential-urban-expansion.geojson`

The RGB rasters use Sentinel-2 bands `B4`, `B3`, and `B2` and preserve scaled
surface-reflectance values. The difference rasters preserve the continuous
NDVI and NDBI differences. All four are GeoTIFFs in EPSG:4326 at approximately
10 m pixel spacing.

Google Earth historical imagery may be used only as an optional qualitative
visual reference for higher-resolution context. Google Earth imagery can be a
mosaic assembled from different acquisition dates, so the displayed date may
not represent every visible location equally.

## Review Labels

Status:

- `Confirmed`: visual reference supports the model result.
- `Unclear`: imagery timing, quality, seasonality, or visible evidence is
  insufficient.
- `Rejected`: visual reference does not support the model result.

Confidence:

- `High`: clear and consistent visual evidence.
- `Medium`: plausible evidence with some ambiguity.
- `Low`: weak, incomplete, or conflicting evidence.

## Validation Table Template

| ID | Location / description | Model result | Visual reference | Confidence | Status | Notes |
| -- | ---------------------- | ------------ | ---------------- | ---------- | ------ | ----- |
| PLACEHOLDER-01 | Placeholder only - replace after review | Potential urban expansion | Not reviewed | Low | Unclear | No validation evidence recorded |

## Recommended QGIS Validation Workflow

1. Load the three candidate GeoJSON layers into QGIS and inspect each candidate
   polygon.
2. Load the before and after Sentinel-2 RGB composites and compare them using
   the same RGB band assignment and display stretch.
3. Inspect the NDVI and NDBI difference rasters for supporting spectral-change
   context.
4. Optionally check Google Earth historical imagery for higher-resolution
   context, without treating it as a temporally consistent reference dataset.
5. Label each candidate `Confirmed`, `Unclear`, or `Rejected` and assign
   `High`, `Medium`, or `Low` confidence.
6. Record observable evidence and uncertainty without inventing the cause of
   change.

Recommended QGIS styling:

- RGB composites: multiband color, red=`B4`, green=`B3`, blue=`B2`, using the
  same cumulative-count or min/max stretch for both layers.
- NDVI difference: diverging red-white-green or red-white-blue ramp centered
  on zero.
- NDBI difference: diverging blue-white-magenta ramp centered on zero.
- Keep zero as a valid value in the NDVI and NDBI difference layers because it
  represents little or no index change.

## Limitations

- Current validation is qualitative only, not a full statistical accuracy
  assessment.
- Sentinel-2 composites are reproducible comparison layers, but median
  composites combine observations from multiple dates and are not single-date
  scenes.
- Google Earth imagery can be temporally inconsistent within one view.
- NDVI loss does not prove land-use change.
- NDBI gain can represent bare soil, roofs, shadows, or other non-urban
  surfaces.
- Potential urban expansion is a candidate layer that requires manual review.
- A later accuracy assessment should use a documented sample design, manually
  labeled reference points, and confusion-matrix metrics.
