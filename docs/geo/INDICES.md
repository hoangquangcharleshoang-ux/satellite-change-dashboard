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

## NDBI

The Normalized Difference Built-up Index (NDBI) is added as a second
exploratory signal:

```text
NDBI = (SWIR - NIR) / (SWIR + NIR)
```

For Sentinel-2:

- SWIR is band `B11`, with a native spatial resolution of 20 m.
- NIR is band `B8`, with a native spatial resolution of 10 m.

NDBI is calculated for the same median before and after composites:

```text
NDBI_difference = NDBI_after - NDBI_before
```

A strong positive NDBI difference can indicate an increase in built-up-like
spectral response, but NDBI alone does not prove new construction. Bare soil,
dry surfaces, roofs, shadows, and mixed pixels can produce similar signals.

The current NDBI thresholds use the same AOI-relative rule:

```text
built-up gain threshold = mean(NDBI_difference) + 1.5 * stdDev
built-up decrease threshold = mean(NDBI_difference) - 1.5 * stdDev
```

## Potential Urban Expansion Candidate

NDVI loss alone does not prove urbanization because vegetation can decline for
many temporary or non-urban reasons. Combining strong NDVI loss with strong
NDBI gain is a stronger candidate signal because it requires both reduced
vegetation greenness and increased built-up-like spectral response:

```text
potential urban expansion =
    NDVI_difference < NDVI loss threshold
    AND
    NDBI_difference > NDBI gain threshold
```

This remains a candidate layer, not confirmed land-use change.

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
| Vegetation loss area | 0.5842980238744534 km2 |
| Vegetation gain area | 0.35884955265581303 km2 |
| NDBI difference mean | -0.023043401383381405 |
| NDBI difference standard deviation | 0.10776774628079479 |
| NDBI built-up gain threshold | 0.1386082180378108 |
| NDBI built-up decrease threshold | -0.1846950208045736 |
| Potential urban expansion candidate area | 0.3321838038651405 km2 |

## Limitations

- These results have not yet been validated against historical imagery,
  field observations, or manually labeled validation points.
- NDVI change alone does not prove land-use change. Differences can also result
  from vegetation condition, crop cycles, rainfall, soil moisture, shadows, or
  residual cloud contamination.
- Bare soil can be confused with built-up surfaces in NDBI.
- Shadows and different roof materials can affect NDBI.
- Sentinel-2 mixed pixels and the combination of 10 m `B8` with 20 m `B11`
  can blur small or narrow features.
- The cloud mask and median composites reduce cloud effects but cannot
  guarantee cloud-free, shadow-free, or directly comparable observations.
- Google Earth historical imagery is a qualitative visual reference only.
- Potential urban expansion candidates still require visual and manual
  validation.
- The AOI is a small pilot area around Phenikaa Hospital / Phu Dien - Xuan
  Phuong. The threshold and results should not be generalized to Hanoi or other
  study areas without recalculation and validation.
