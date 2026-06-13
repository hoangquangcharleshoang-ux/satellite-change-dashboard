# Remote Sensing Indices

## Initial Index: NDVI

The first change-detection pipeline uses the Normalized Difference Vegetation
Index (NDVI) to measure relative vegetation greenness in the Phenikaa Hospital
/ Phu Dien - Xuan Phuong pilot area.

```text
NDVI = (NIR - Red) / (NIR + Red)
```

For Sentinel-2 Surface Reflectance Harmonized imagery:

- NIR is band `B8`.
- Red is band `B4`.
- NDVI normally ranges from `-1` to `1`.
- Higher values generally indicate greener or denser vegetation.
- Low or negative values commonly represent water, bare surfaces, or built-up
  surfaces.

NDVI is calculated separately from the median before and after composites:

```text
NDVI_before = NDVI(median before composite)
NDVI_after  = NDVI(median after composite)
```

## NDVI Difference

The pipeline measures change as:

```text
NDVI_difference = NDVI_after - NDVI_before
```

Interpretation:

- A negative difference indicates a decrease in vegetation greenness.
- A positive difference indicates an increase in vegetation greenness.
- A difference near zero indicates relatively stable NDVI.

The comparison uses the same October-to-April seasonal window in both periods:

- Before: `2018-10-01` to `2019-04-30`
- After: `2024-10-01` to `2025-04-30`

Comparing the same part of the seasonal cycle reduces apparent change caused
only by seasonal vegetation growth, rainfall, or crop cycles. It does not
remove all phenological or weather-related effects.

## Change Threshold

The initial pipeline uses an AOI-relative statistical threshold instead of a
fixed NDVI difference threshold:

```text
loss threshold = mean(NDVI_difference) - 1.5 * stdDev(NDVI_difference)
gain threshold = mean(NDVI_difference) + 1.5 * stdDev(NDVI_difference)
```

Pixels are classified as:

```text
vegetation loss: NDVI_difference < loss threshold
vegetation gain: NDVI_difference > gain threshold
stable:          between the two thresholds
```

The `1.5 * stdDev` rule identifies unusually large negative and positive
differences relative to this AOI. It is an exploratory threshold and is not a
validated classification rule.

## Current Pilot Results

Source: `public/sample-analysis/phenikaa-area-ndvi-change.json`

| Metric | Current result |
| --- | ---: |
| Before image count | 5 |
| After image count | 10 |
| NDVI difference mean | -0.029051315005948708 |
| NDVI difference standard deviation | 0.1504748968728374 |
| Vegetation loss threshold | -0.2547636603152048 |
| Vegetation gain threshold | 0.1966610303033074 |
| Vegetation loss area | 0.5842980238744406 km2 |
| Vegetation gain area | 0.35884955265580726 km2 |

## Limitations

- These results have not yet been validated against historical imagery,
  field observations, or manually labeled validation points.
- NDVI change alone does not prove land-use change. Differences can also result
  from vegetation condition, crop cycles, rainfall, soil moisture, shadows, or
  residual cloud contamination.
- The cloud mask and median composites reduce cloud effects but cannot
  guarantee cloud-free, shadow-free, or directly comparable observations.
- The AOI is a small pilot area around Phenikaa Hospital / Phu Dien - Xuan
  Phuong. The threshold and results should not be generalized to Hanoi or other
  study areas without recalculation and validation.
