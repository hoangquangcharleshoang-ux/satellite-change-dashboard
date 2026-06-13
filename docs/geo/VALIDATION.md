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

## Initial Validation Records

| ID | Location / description | Model result | Visual reference | Confidence | Status | Notes |
| -- | ---------------------- | ------------ | ---------------- | ---------- | ------ | ----- |
| V01 | Khu đất xanh/đất trống gần Ngõ 139 Đường Phú Diễn, phía bắc khu Phenikaa | Potential urban expansion | Ảnh 2018/2019 cho thấy khu vực chủ yếu là mảng xanh, đất trống và một số bề mặt sáng màu nhỏ; ảnh 2025 vẫn còn nhiều mảng xanh nhưng xuất hiện thêm các vùng đất sáng/bề mặt bị xáo trộn, có dấu hiệu san lấp hoặc thay đổi bề mặt. | Medium | Unclear | Kết quả phù hợp một phần với tín hiệu NDVI giảm và NDBI tăng, nhưng chưa đủ bằng chứng để xác nhận là đô thị hóa hoàn chỉnh. Có thể là đất trống, san lấp, công trường, thay đổi mùa vụ hoặc biến động bề mặt tạm thời. |
| V02 | Khu Bệnh viện Đại học Phenikaa / cổng Kiều Mai | Potential urban expansion | Ảnh 2019 cho thấy khu vực chủ yếu là đất trống, mảng xanh hoặc bề mặt chưa xây dựng; ảnh 2025 cho thấy cụm công trình bệnh viện, đường nội bộ, bề mặt bê tông và khu xây dựng xuất hiện rõ. | High | Confirmed | Kết quả phù hợp rõ với quy tắc NDVI giảm mạnh kết hợp NDBI tăng mạnh. Đây là ví dụ tốt cho nhóm potential urban expansion, dù Google Earth chỉ được dùng làm nguồn kiểm chứng trực quan định tính. |
| V03 | Khu Phố Phúc Minh / Trường THCS Phú Diễn - Phú Diễn A | Potential urban expansion | Ảnh 2019 cho thấy khu vực còn nhiều thửa đất xanh, vườn/ruộng nhỏ và khoảng trống giữa các cụm dân cư; ảnh 2025 cho thấy mật độ công trình, mái nhà, đường và bề mặt xây dựng tăng rõ ở nhiều vị trí. | Medium | Confirmed | Kết quả phù hợp với tín hiệu NDVI giảm kết hợp NDBI tăng, nhưng khu vực có cấu trúc dân cư xen kẽ đất trống/vườn nên có thể chịu ảnh hưởng của mixed pixels và thay đổi mùa vụ. |

These first three records are qualitative observations, not authoritative
ground truth or a statistical accuracy result. Google Earth historical imagery
was used only as a qualitative visual reference alongside the QGIS candidate
polygons and reproducible Sentinel-2 comparison layers.

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
