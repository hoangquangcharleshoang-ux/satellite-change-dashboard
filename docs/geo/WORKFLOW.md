# Initial NDVI Change Detection Workflow

## Purpose and AOI

This initial pipeline detects unusually large NDVI decreases and increases in a
small peri-urban pilot area around Phenikaa University Hospital and the Phu
Dien - Xuan Phuong area of Hanoi.

- AOI center: `105.749433, 21.039419`
- AOI bounding polygon: approximately `105.7350-105.7639 E` and
  `21.0259-21.0529 N`
- Analysis output:
  `public/sample-analysis/phenikaa-area-ndvi-change.json`
- Implementation notebook:
  `notebooks/01_sentinel2_ndvi_change_phenikaa_area.ipynb`

The AOI is intended to establish and test an end-to-end workflow before the
method is expanded or generalized.

## Dataset and Comparison Periods

The pipeline uses Google Earth Engine's Sentinel-2 Surface Reflectance
Harmonized collection:

```text
COPERNICUS/S2_SR_HARMONIZED
```

The configured same-season periods are:

| Period | Date range | Images after collection filters |
| --- | --- | ---: |
| Before | `2018-10-01` to `2019-04-30` | 5 |
| After | `2024-10-01` to `2025-04-30` | 10 |

Both periods use the October-to-April seasonal window. This reduces false
change caused by comparing different seasonal stages, although differences in
weather and vegetation condition can still remain.

## Processing Steps

### 1. Filter Sentinel-2 Imagery

For each period, the Sentinel-2 collection is:

1. Filtered to images intersecting the AOI.
2. Filtered to the configured date range.
3. Filtered to scenes with `CLOUDY_PIXEL_PERCENTAGE < 40`.

### 2. Mask Clouds and Cloud Shadows

The notebook applies a pixel-level mask using the Sentinel-2 Scene
Classification Layer (`SCL`). It keeps these classes:

- `4`: vegetation
- `5`: bare soil / non-vegetated
- `6`: water
- `7`: unclassified
- `11`: snow / ice

Other SCL classes, including cloud and cloud-shadow classes, are masked. The
surface reflectance bands are then divided by `10000` to convert the stored
integer values to reflectance-scale values.

### 3. Create Median Composites

The remaining images in each period are reduced to a median composite and
clipped to the AOI. A median composite reduces the influence of isolated
clouds, shadows, haze, and other outlier pixel values while retaining one
representative image for each comparison period.

### 4. Calculate NDVI

NDVI is calculated from Sentinel-2 bands `B8` and `B4`:

```text
NDVI = (B8 - B4) / (B8 + B4)
```

The result is one NDVI image for the before composite and one for the after
composite.

### 5. Calculate NDVI Difference

```text
NDVI_difference = NDVI_after - NDVI_before
```

Negative values indicate lower NDVI in the after period; positive values
indicate higher NDVI.

### 6. Classify Unusual Change

The mean and standard deviation of NDVI difference are calculated across the
AOI. The initial threshold is:

```text
vegetation loss: NDVI_difference < mean - 1.5 * stdDev
vegetation gain: NDVI_difference > mean + 1.5 * stdDev
stable:          otherwise
```

Current values:

- NDVI difference mean: `-0.029051315005948708`
- NDVI difference standard deviation: `0.1504748968728374`
- Vegetation loss threshold: `-0.2547636603152048`
- Vegetation gain threshold: `0.1966610303033074`

### 7. Calculate Area Statistics

Area statistics are obtained by summing the area of pixels classified by the
loss and gain masks, then reporting the totals in square kilometres.

Current pilot results:

- Vegetation loss area: `0.5842980238744406 km2`
- Vegetation gain area: `0.35884955265580726 km2`

These figures describe statistically unusual NDVI changes within the pilot
AOI. They are not yet confirmed land-use-change areas.

## Current Output

The current JSON output records:

- AOI name, description, and center
- Sentinel-2 dataset and NDVI index
- before and after date ranges
- same-season, median-composite, and threshold methods
- before and after image counts
- NDVI difference mean and standard deviation
- vegetation loss and gain thresholds
- vegetation loss and gain areas

## Limitations

- The detected loss and gain areas have not yet been validated against
  historical imagery, field observations, or labeled validation samples.
- NDVI alone does not prove land-use change. It measures vegetation greenness,
  and changes can reflect crop cycles, rainfall, vegetation health, soil
  moisture, shadows, or other temporary conditions.
- The scene-level cloud filter, SCL mask, and median composite reduce cloud and
  shadow effects but can leave residual artifacts or create composites from
  observations acquired under different conditions.
- The before and after collections contain different image counts (`5` and
  `10`), which may affect composite comparability.
- This AOI is a pilot area. Its statistical threshold is specific to the
  Phenikaa Hospital / Phu Dien - Xuan Phuong analysis and should be recalculated
  and validated for any other AOI.
