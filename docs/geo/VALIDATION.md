# Qualitative Validation

## Purpose

This document provides a template for qualitative visual review of vegetation
loss, vegetation gain, and potential urban expansion candidates in the
Phenikaa Hospital / Phu Dien - Xuan Phuong pilot AOI.

No validation evidence or final accuracy is claimed yet.

## Reference Use

Google Earth historical imagery may be used only as a qualitative visual
reference. Google Earth imagery can be a mosaic assembled from different
acquisition dates, so the displayed date may not represent every visible
location equally.

The model outputs to review are:

- `public/sample-analysis/geojson/vegetation-loss.geojson`
- `public/sample-analysis/geojson/vegetation-gain.geojson`
- `public/sample-analysis/geojson/potential-urban-expansion.geojson`

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

## Review Procedure

1. Open a candidate polygon and record its location or description.
2. Compare imagery near the before and after analysis periods when available.
3. Record what is visually observable without assuming the cause.
4. Assign one status and one confidence label.
5. Record imagery-date uncertainty, mosaicking, clouds, shadows, or mixed
   pixels in the notes.

## Limitations

- Current validation is qualitative only, not a full statistical accuracy
  assessment.
- Google Earth imagery can be temporally inconsistent within one view.
- NDVI loss does not prove land-use change.
- NDBI gain can represent bare soil, roofs, shadows, or other non-urban
  surfaces.
- Potential urban expansion is a candidate layer that requires manual review.
- A later accuracy assessment should use a documented sample design, manually
  labeled reference points, and confusion-matrix metrics.
