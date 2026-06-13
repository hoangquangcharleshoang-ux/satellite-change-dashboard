# Initial NDVI + NDBI Change Detection Workflow

## Purpose and AOI

This initial pipeline detects unusually large NDVI changes and combines strong
NDVI loss with strong NDBI gain to identify potential urban expansion
candidates in a small peri-urban pilot area around Phenikaa University
Hospital and the Phu Dien - Xuan Phuong area of Hanoi.

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

- Vegetation loss area: `0.5842980238744534 km2`
- Vegetation gain area: `0.35884955265581303 km2`

These figures describe statistically unusual NDVI changes within the pilot
AOI. They are not yet confirmed land-use-change areas.

### 8. Calculate NDBI Difference

NDBI is calculated from Sentinel-2 bands `B11` and `B8`:

```text
NDBI = (B11 - B8) / (B11 + B8)
NDBI_difference = NDBI_after - NDBI_before
```

The NDBI difference mean and standard deviation are calculated across the AOI.
The built-up gain threshold is `mean + 1.5 * stdDev`; the decrease threshold is
`mean - 1.5 * stdDev`.

Current NDBI results:

- Difference mean: `-0.023043401383381405`
- Difference standard deviation: `0.10776774628079479`
- Built-up gain threshold: `0.1386082180378108`
- Built-up decrease threshold: `-0.1846950208045736`

### 9. Create Potential Urban Expansion Candidates

NDVI loss alone does not prove urbanization. The pipeline therefore creates a
stronger exploratory candidate signal:

```text
potential_urban_expansion =
    NDVI_Diff < NDVI loss threshold
    AND
    NDBI_Diff > NDBI gain threshold
```

Current candidate area:

- `332183.80386514054 m2`
- `0.3321838038651405 km2`

This mask identifies candidate locations only. It is not confirmed or
validated urban expansion.

### 10. Export Dashboard Outputs

The notebook writes the backward-compatible dashboard JSON and vectorizes the
three change masks into local GeoJSON files:

```text
public/sample-analysis/phenikaa-area-ndvi-change.json
public/sample-analysis/geojson/vegetation-loss.geojson
public/sample-analysis/geojson/vegetation-gain.geojson
public/sample-analysis/geojson/potential-urban-expansion.geojson
```

The AOI is small enough for local Earth Engine `getInfo()` vector export.
GeoJSON features include change type, polygon area, and
`candidate_not_validated` status.

### 11. Export Reproducible Validation Rasters

The notebook exports visual comparison layers from the same Sentinel-2 median
composites and index differences used by the analysis:

```text
public/sample-analysis/rasters/sentinel2-before-rgb.tif
public/sample-analysis/rasters/sentinel2-after-rgb.tif
public/sample-analysis/rasters/ndvi-difference.tif
public/sample-analysis/rasters/ndbi-difference.tif
```

The before and after RGB GeoTIFFs contain scaled surface-reflectance bands
`B4`, `B3`, and `B2`. The difference GeoTIFFs contain continuous single-band
NDVI and NDBI difference values. Exports use EPSG:4326 and approximately 10 m
pixel spacing.

The notebook uses `geemap` for Earth Engine download and `rasterio` to clear
the incorrect zero nodata tag so zero remains a valid difference value.

These rasters make the validation comparison reproducible and suitable for
QGIS. Google Earth historical imagery remains optional qualitative context,
not the sole comparison source.

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
- NDBI difference mean, standard deviation, and thresholds
- combined candidate rule, area, status, and caveat
- local GeoJSON candidate layers
- before/after RGB and NDVI/NDBI difference GeoTIFFs for validation

## Limitations

- The detected loss and gain areas have not yet been validated against
  historical imagery, field observations, or labeled validation samples.
- NDVI alone does not prove land-use change. It measures vegetation greenness,
  and changes can reflect crop cycles, rainfall, vegetation health, soil
  moisture, shadows, or other temporary conditions.
- NDVI loss plus NDBI gain is a stronger candidate signal than NDVI loss alone,
  but it still does not prove urbanization.
- Bare soil can be confused with built-up surfaces, while shadows and roof
  materials can affect NDBI.
- Sentinel-2 `B8` is 10 m and `B11` is 20 m. Resampling and mixed pixels can
  blur small features and boundaries.
- The scene-level cloud filter, SCL mask, and median composite reduce cloud and
  shadow effects but can leave residual artifacts or create composites from
  observations acquired under different conditions.
- The before and after collections contain different image counts (`5` and
  `10`), which may affect composite comparability.
- This AOI is a pilot area. Its statistical threshold is specific to the
  Phenikaa Hospital / Phu Dien - Xuan Phuong analysis and should be recalculated
  and validated for any other AOI.
- Google Earth historical imagery is a qualitative visual reference only and
  can be a mosaic of imagery acquired on different dates.
- All candidate change layers require visual and manual validation.
- GeoJSON polygon-area sums can differ slightly from raster pixel-area totals
  because vectorization approximates raster boundaries.
- RGB outputs are median composites assembled from multiple valid observations,
  not single-date images.
