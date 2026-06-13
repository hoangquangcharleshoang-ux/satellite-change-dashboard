# Satellite Change Detection Dashboard — Project Plan v3

> **Status:** Updated after Claude review  
> **Project name:** Satellite Change Detection Dashboard  
> **Primary goal:** Learn remote sensing/GIS deeply and build a job-ready portfolio project.  
> **Secondary goal:** Maintain a repo-local memory system so Codex, Antigravity, Claude, ChatGPT, or Gemini can continue work without losing context.

---

## 0. Final Decisions

### Confirmed decisions

- Project name: **Satellite Change Detection Dashboard**
- First index: **NDVI**
- First location: **Hà Nội, but not the whole city**
- First AOI type: **small peri-urban Hanoi area with visible land-use change**
- Candidate AOIs:
  - Hoài Đức
  - Gia Lâm
  - Thanh Trì
- Map library: **MapLibre GL JS**
- Initial repo visibility: **Private**
- Later repo visibility: **Public when demo is stable**
- First development priority: **real geospatial pipeline first, UI second**
- Graphify: **removed**
- CodeGraph / Understand-Anything: **not used initially**
- QGIS: **QGIS LTR**
- Google Earth Engine: **noncommercial/student use**

---

## 1. Project Motivation

This project is built for a student in satellite remote sensing / GIS who wants to:

1. Learn remote sensing and GIS workflows deeply.
2. Build a serious portfolio project.
3. Prepare for real job requirements in GIS, surveying, mapping, and geospatial data processing.
4. Practice QGIS, Google Earth Engine, Python geospatial processing, and WebGIS.
5. Learn how to work with AI coding agents while keeping project context stable across sessions.

The target job profile includes:

- Processing and standardizing field survey data.
- Building GIS data layers.
- Spatial analysis.
- Topology checking.
- Integrating UAV, LiDAR, and remote sensing data.
- QGIS proficiency.
- GPS data processing.
- Conflation.
- Spatial indexing.
- Programming automation.

Therefore, this project is not just a “pretty dashboard”.  
It must become a **remote sensing + GIS data quality + spatial analysis portfolio project**.

---

## 2. Core Strategy

The project has three tracks:

### Track A — Remote Sensing Analysis

Focus:

- Sentinel-2 Surface Reflectance.
- NDVI change detection.
- Same-season comparison.
- Threshold methodology.
- Area statistics.
- Validation / accuracy assessment.
- Methodology documentation.

### Track B — Web Dashboard

Focus:

- React + TypeScript + Vite.
- MapLibre map.
- GeoJSON change zones.
- Stats cards.
- Charts.
- Report preview.
- Clean dashboard UI.

### Track C — GIS Production Workflow

Focus:

- QGIS.
- Geometry validation.
- Topology checking.
- Spatial analysis.
- Spatial indexing benchmark.
- GPS / field data cleaning.
- CRS conversion, especially VN-2000 ↔ WGS84 / UTM 48N.
- Exportable maps and portfolio screenshots.

---

## 3. Important Shift After Review

The initial idea was to build a dashboard shell with mock data first.

After review, the recommended priority is:

> Build a real vertical slice first:  
> **Google Earth Engine → JSON/GeoJSON → Dashboard → QGIS map/report**

This means the first valuable MVP should not be just UI mockups.  
It should produce a real NDVI change result from a real AOI and display it in the dashboard.

---

## 4. MVP Definition

### MVP = One Real End-to-End Pipeline

The MVP must include:

1. A small AOI in peri-urban Hanoi.
2. Sentinel-2 NDVI analysis with same-season comparison.
3. NDVI difference map.
4. Thresholding using mean ± 1–1.5 standard deviation.
5. Export:
   - JSON statistics.
   - GeoJSON change zones.
   - optional PNG/PDF map output.
6. Basic validation:
   - compare detected change zones with Google Earth historical imagery or other reference evidence.
   - create 15–20 validation sample points if possible.
7. Dashboard:
   - MapLibre shows GeoJSON change zones.
   - stats cards read real exported JSON.
   - chart displays before/after NDVI.
   - report preview page.
8. QGIS:
   - import exported result.
   - create a print layout map.
   - export PNG/PDF.
9. Documentation:
   - methodology.
   - limitations.
   - data source.
   - threshold logic.
   - validation notes.

---

## 5. Out of Scope for MVP

Do not implement these in the first MVP:

- Full backend.
- Real-time Earth Engine frontend integration.
- User authentication.
- Commercial deployment.
- Deep learning.
- UAV/LiDAR processing.
- Full land cover classification.
- Complex multi-temporal time series.
- Full conflation workflow.
- PostGIS database.
- Playwright/Vitest testing unless easy and non-blocking.

---

## 6. Remote Sensing Methodology

### 6.1 Dataset

Primary dataset:

- Sentinel-2 Surface Reflectance Harmonized.
- Earth Engine ID: `COPERNICUS/S2_SR_HARMONIZED`.

### 6.2 First Index

Use NDVI first.

Formula:

```text
NDVI = (NIR - RED) / (NIR + RED)
```

Sentinel-2 bands:

```text
NIR = B8
RED = B4
```

### 6.3 Same-Season Comparison

Do **not** compare full year 2018 with full year 2024/2025 as the default.

Default method:

```text
before period: dry season of year A
after period:  dry season of year B
```

Suggested example:

```text
Before: 2018-11-01 to 2019-03-31
After:  2024-11-01 to 2025-03-31
```

Reason:

- Vegetation changes seasonally.
- Full-year composites may mix rainy season and dry season effects.
- Same-season comparison reduces false change caused by phenology.

This reasoning must be written in:

```text
docs/geo/INDICES.md
docs/geo/WORKFLOW.md
```

### 6.4 Cloud Mask

Use cloud masking before composite generation.

Recommended process:

1. Filter Sentinel-2 image collection by AOI.
2. Filter by date range.
3. Filter by cloud percentage.
4. Apply cloud mask.
5. Create median composite.

### 6.5 NDVI Difference

Compute:

```text
NDVI_diff = NDVI_after - NDVI_before
```

Interpretation:

```text
negative NDVI_diff = vegetation decrease
positive NDVI_diff = vegetation increase
near zero = relatively stable
```

### 6.6 Threshold Methodology

Avoid arbitrary fixed threshold like ±0.1 as the default.

Recommended default:

```text
threshold = mean ± 1.5 * std
```

For example:

```text
vegetation loss = NDVI_diff < mean - 1.5 * std
vegetation gain = NDVI_diff > mean + 1.5 * std
stable = otherwise
```

The project must document:

- why this threshold was chosen.
- what its limitations are.
- whether the result looks reasonable after validation.

### 6.7 Area Statistics

Compute:

- mean NDVI before.
- mean NDVI after.
- mean NDVI difference.
- vegetation loss area.
- vegetation gain area.
- stable area.
- percentage of AOI changed.

Export to:

```text
public/sample-analysis/hanoi-ndvi-change.json
```

### 6.8 Change Zones

Export vectorized change zones as:

```text
public/sample-analysis/hanoi-ndvi-change-zones.geojson
```

The GeoJSON should include attributes such as:

```text
change_type: vegetation_loss | vegetation_gain | stable
area_m2
area_ha
mean_ndvi_diff
confidence_note
```

### 6.9 Validation / Accuracy Assessment

Minimum validation:

- Open Google Earth or another visual reference source.
- Compare detected vegetation loss/gain zones with historical imagery.
- Record notes and screenshots.

Better validation:

- Create 15–20 validation points.
- Label each point manually:
  - changed
  - unchanged
  - uncertain
- Compare model result with manual label.
- Compute:
  - overall accuracy.
  - simple confusion matrix.
  - optional Kappa if time allows.

Validation output:

```text
docs/geo/VALIDATION.md
data/validation/validation_points.geojson
data/validation/accuracy_assessment.csv
```

---

## 7. GIS / QGIS / Job-Ready Track

### 7.1 Why This Track Matters

The target job requirements include:

- QGIS proficiency.
- topology checking.
- spatial analysis.
- field/GPS data cleaning.
- spatial indexing.
- conflation.
- multi-source data integration.

Therefore, the project must include a GIS production workflow, not only web visualization.

### 7.2 QGIS Deliverables

At minimum:

1. QGIS project file:

```text
qgis/satellite_change_dashboard.qgz
```

2. Imported GeoJSON change zones.
3. Styled change map:
   - vegetation loss.
   - vegetation gain.
   - stable/unchanged.
4. Print layout map.
5. Exported map PDF/PNG:

```text
outputs/maps/ndvi_change_map.pdf
outputs/maps/ndvi_change_map.png
```

6. Screenshots:

```text
docs/assets/qgis/
```

7. Step-by-step documentation:

```text
docs/qgis/QGIS_WORKFLOW.md
```

### 7.3 Topology / Geometry Validation

Add a mini workflow:

- invalid geometry detection.
- duplicate feature detection.
- overlap detection.
- gap detection if polygon dataset supports it.
- dangle/overshoot examples if line dataset exists.

Implementation can include:

- QGIS GUI workflow.
- Python/geopandas/shapely script.

Suggested files:

```text
scripts/gis/check_geometries.py
scripts/gis/topology_checks.py
docs/qgis/TOPOLOGY_QA.md
```

### 7.4 Spatial Analysis

Include common GIS operations:

- clip.
- buffer.
- intersect.
- spatial join.
- dissolve.
- area calculation by administrative unit.

Suggested output:

```text
outputs/tables/change_by_admin_unit.csv
outputs/layers/change_by_admin_unit.geojson
```

### 7.5 Spatial Indexing Benchmark

Add a small benchmark to show professional understanding of spatial performance.

Goal:

Compare spatial join time with and without spatial index.

Suggested file:

```text
scripts/gis/spatial_index_benchmark.py
```

Output:

```text
outputs/tables/spatial_index_benchmark.csv
```

Document:

```text
docs/qgis/SPATIAL_INDEXING.md
```

### 7.6 GPS / Field Data Cleaning

Create or use sample field survey data.

Tasks:

- import CSV/GPX.
- check coordinate fields.
- validate CRS.
- reproject.
- detect duplicates.
- detect outliers.
- spatial join GPS points to administrative boundaries.
- export cleaned layer.

Suggested files:

```text
data/raw/gps_points_sample.csv
scripts/gis/clean_gps_points.py
outputs/layers/gps_points_cleaned.geojson
docs/qgis/GPS_DATA_CLEANING.md
```

### 7.7 VN-2000 / WGS84 / UTM 48N

Add a CRS documentation section.

Document:

- WGS84.
- UTM Zone 48N.
- VN-2000.
- when to use geographic CRS.
- when to use projected CRS.
- why area calculation should use projected CRS.
- how to reproject data in QGIS.
- how to reproject data in Python/geopandas.

Suggested file:

```text
docs/geo/CRS_AND_PROJECTIONS.md
```

---

## 8. Web Dashboard

### 8.1 Stack

Frontend:

- React
- TypeScript
- Vite
- MapLibre GL JS
- Zustand
- React Router
- shadcn/ui
- Recharts
- lucide-react
- date-fns

### 8.2 Pages

Suggested pages:

```text
/
  Dashboard overview

/map
  Change detection map

/report
  Report preview

/gis-qa
  GIS data quality summary

/methodology
  Methodology explanation
```

### 8.3 Core UI Components

- App layout.
- Sidebar.
- Top bar.
- Map panel.
- Layer panel.
- Analysis summary cards.
- Before/after chart.
- Report preview.
- Methodology panel.
- Data source panel.
- QA summary panel.

### 8.4 Data Loading

Frontend should initially load static exported files:

```text
public/sample-analysis/hanoi-ndvi-change.json
public/sample-analysis/hanoi-ndvi-change-zones.geojson
```

No backend in MVP.

### 8.5 Dashboard Must Not Fake Final Results

The dashboard can use mock data only during early scaffolding.

The first portfolio-ready version must read real exported JSON/GeoJSON from the NDVI pipeline.

---

## 9. Repo Structure

Recommended structure:

```text
satellite-change-dashboard/
├── AGENTS.md
├── PROJECT_PLAN.md
├── PROJECT_STATUS.md
├── PROGRESS_LOG.md
├── DECISIONS.md
├── ROADMAP.md
├── README.md
├── docs/
│   ├── geo/
│   │   ├── INDICES.md
│   │   ├── WORKFLOW.md
│   │   ├── VALIDATION.md
│   │   ├── CRS_AND_PROJECTIONS.md
│   │   └── DATA_SOURCES.md
│   ├── qgis/
│   │   ├── QGIS_WORKFLOW.md
│   │   ├── TOPOLOGY_QA.md
│   │   ├── GPS_DATA_CLEANING.md
│   │   └── SPATIAL_INDEXING.md
│   ├── assets/
│   │   └── qgis/
│   └── prompts/
│       └── AGENT_PROMPTS.md
├── data/
│   ├── raw/
│   ├── processed/
│   └── validation/
├── notebooks/
│   ├── 01_sentinel2_ndvi_change.ipynb
│   └── 02_validation_accuracy_assessment.ipynb
├── scripts/
│   ├── gee/
│   │   └── gee_auth_test.py
│   └── gis/
│       ├── check_geometries.py
│       ├── topology_checks.py
│       ├── clean_gps_points.py
│       └── spatial_index_benchmark.py
├── qgis/
│   └── satellite_change_dashboard.qgz
├── outputs/
│   ├── maps/
│   ├── tables/
│   └── layers/
├── public/
│   └── sample-analysis/
│       ├── hanoi-ndvi-change.json
│       └── hanoi-ndvi-change-zones.geojson
├── src/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── store/
│   ├── types/
│   └── main.tsx
└── package.json
```

---

## 10. Simplified Agent Memory System

The previous memory system had too many files.

Use fewer files:

### Required files

```text
AGENTS.md
PROJECT_PLAN.md
PROJECT_STATUS.md
PROGRESS_LOG.md
DECISIONS.md
ROADMAP.md
docs/geo/INDICES.md
docs/geo/WORKFLOW.md
```

### Why

- `AGENTS.md`: behavior rules for agents.
- `PROJECT_PLAN.md`: complete project plan.
- `PROJECT_STATUS.md`: current state snapshot.
- `PROGRESS_LOG.md`: session log + handoff in one file.
- `DECISIONS.md`: important decisions.
- `ROADMAP.md`: phase plan.
- `docs/geo/INDICES.md`: remote sensing formulas and assumptions.
- `docs/geo/WORKFLOW.md`: geospatial processing steps.

### Rule

Every new agent session must read:

```text
AGENTS.md
PROJECT_PLAN.md
PROJECT_STATUS.md
PROGRESS_LOG.md
DECISIONS.md
ROADMAP.md
docs/geo/INDICES.md
docs/geo/WORKFLOW.md
```

### End of Session Rule

At the end of every session:

- update `PROJECT_STATUS.md`.
- append to `PROGRESS_LOG.md`.
- update `DECISIONS.md` if any decision was made.
- update related `docs/geo/` or `docs/qgis/` files if methodology changed.

---

## 11. Agent / Human Responsibilities

### Agent can do well

- scaffold React + Vite + TypeScript.
- build UI components.
- integrate MapLibre.
- build charts.
- write Python/geopandas scripts.
- write documentation drafts.
- generate sample JSON schemas.
- help debug build errors.
- refactor code.
- update project docs.

### Human must do or must understand deeply

- Google Earth Engine authentication.
- Google Cloud project setup.
- QGIS GUI operations.
- QGIS screenshots.
- visual validation with Google Earth or imagery.
- checking whether NDVI results are geospatially sensible.
- explaining NDVI, cloud mask, thresholding, CRS, topology, and spatial index in interview.
- deciding AOI based on domain logic.

### Important Learning Rule

Do not let agents write all RS/GIS logic without understanding it.

For every RS/GIS step, the human should write or review:

```text
What did we do?
Why did we do it?
What can go wrong?
How do we validate it?
```

---

## 12. Roadmap v3

### Phase 0 — Setup

Estimated time: 1–2 days.

Tasks:

- Create GitHub private repo.
- Clone repo locally.
- Scaffold Vite React TypeScript.
- Install frontend dependencies.
- Install Python environment.
- Install QGIS LTR.
- Register Google Earth Engine.
- Create Google Cloud Project.
- Run Earth Engine authentication test.
- Create project docs and memory files.

Deliverables:

- repo initialized.
- build passes.
- GEE auth confirmed.
- docs created.

### Phase 1 — NDVI Analysis Pipeline

Estimated time: 1–2 weeks.

Tasks:

- Choose small AOI: Hoài Đức / Gia Lâm / Thanh Trì.
- Create Sentinel-2 notebook.
- Load S2 surface reflectance.
- Apply cloud mask.
- Use same-season before/after date ranges.
- Create median composites.
- Compute NDVI before.
- Compute NDVI after.
- Compute NDVI difference.
- Compute mean/std of NDVI difference.
- Apply mean ± 1–1.5 std threshold.
- Export JSON statistics.
- Export GeoJSON change zones.
- Write methodology and limitations.
- Do initial visual validation.

Deliverables:

- `notebooks/01_sentinel2_ndvi_change.ipynb`
- `public/sample-analysis/hanoi-ndvi-change.json`
- `public/sample-analysis/hanoi-ndvi-change-zones.geojson`
- `docs/geo/WORKFLOW.md`
- `docs/geo/INDICES.md`

### Phase 2 — Dashboard

Estimated time: 1–2 weeks.

Tasks:

- Build app layout.
- Add MapLibre map.
- Load real GeoJSON change zones.
- Load real JSON stats.
- Build stats cards.
- Build before/after chart.
- Add layer switcher.
- Add report preview page.
- Add methodology page.
- Improve responsive UI.

Deliverables:

- working dashboard with real sample data.
- build passes.
- screenshots for README.

### Phase 3 — QGIS GIS Quality Workflow

Estimated time: 1–2 weeks.

Tasks:

- Import change result into QGIS.
- Style change zones.
- Create print layout.
- Export map PDF/PNG.
- Check geometry validity.
- Create topology QA workflow.
- Add geopandas/shapely scripts.
- Add spatial analysis examples.
- Add spatial index benchmark.
- Take screenshots.
- Write QGIS workflow docs.

Deliverables:

- `.qgz` file.
- QGIS map export.
- topology QA docs.
- spatial indexing benchmark.

### Phase 4 — GPS / Field Data Cleaning

Estimated time: 1 week.

Tasks:

- Create or collect sample GPS data.
- Clean coordinate fields.
- Validate CRS.
- Reproject.
- VN-2000 ↔ WGS84/UTM 48N documentation/demo.
- Remove duplicates.
- Detect outliers.
- Spatial join points to admin boundaries.
- Export cleaned layer.

Deliverables:

- cleaned GPS GeoJSON.
- CRS documentation.
- GPS cleaning script.
- workflow documentation.

### Phase 5 — Additional Indices and Classification

Optional.

Tasks:

- Add NDWI.
- Add NDBI.
- Add simple threshold-based or unsupervised LULC classification.
- Add index selector to dashboard.
- Document spectral interpretation.

### Phase 6 — Conflation Mini Demo

Optional.

Tasks:

- Create 2–3 scenarios:
  - shifted features.
  - duplicated features.
  - missing features.
- Compare two layers.
- Generate mismatch report.
- Document conflation concept.

### Phase 7 — Portfolio Polish

Tasks:

- README with screenshots.
- Methodology report.
- Map exports.
- Demo video.
- Deploy static dashboard with sample data.
- Make repo public when stable.

---

## 13. First Practical Implementation Order

Follow this exact order:

1. Create GitHub private repo: `satellite-change-dashboard`.
2. Clone repo locally.
3. Scaffold React app.
4. Install frontend dependencies.
5. Create docs and memory files.
6. Commit Phase 0 setup.
7. Set up Python virtual environment.
8. Install Earth Engine / geospatial packages.
9. Register and authenticate Earth Engine.
10. Choose final small AOI:
    - start with Hoài Đức unless better evidence suggests Gia Lâm or Thanh Trì.
11. Build Phase 1 notebook.
12. Export real JSON/GeoJSON.
13. Build dashboard reading real exported data.
14. Import result to QGIS.
15. Produce QGIS map PDF/PNG.
16. Add validation and methodology docs.
17. Add GIS QA/topology/spatial indexing.
18. Polish README and publish.

---

## 14. Prompt for Claude Review

Use this when asking Claude for strategic feedback:

```text
Please review this project plan from the perspective of:
1. Remote sensing / GIS learning value.
2. Job-readiness for GIS / mapping / surveying roles.
3. Practical implementation with Codex / Antigravity.
4. Whether the roadmap is too broad or missing important steps.
5. What should be accepted, delayed, or removed.

Please focus on concrete changes, not generic encouragement.
```

---

## 15. Prompt for Codex / Antigravity Session

Use this at the start of each new agent session:

```text
Read these files first:

- AGENTS.md
- PROJECT_PLAN.md
- PROJECT_STATUS.md
- PROGRESS_LOG.md
- DECISIONS.md
- ROADMAP.md
- docs/geo/INDICES.md
- docs/geo/WORKFLOW.md

After reading, summarize the current project state before editing.

Task:
[PASTE EXACT TASK HERE]

Rules:
- Do not guess.
- Ask questions if anything is unclear.
- Do not touch .env, credentials, tokens, or secret files.
- Do not force push.
- Do not deploy.
- Keep changes small and reviewable.
- Do not add speculative features.
- For frontend tasks, run npm run build.
- For Python/GEE tasks, run the relevant script/notebook check if possible.
- Before ending, update PROJECT_STATUS.md and PROGRESS_LOG.md.
- Update DECISIONS.md if a decision was made.
- Update docs/geo or docs/qgis if methodology changed.

Final report:
1. Summary of changes.
2. Files changed.
3. Commands run.
4. Build/test result.
5. Known issues.
6. Exact next recommended step.
```

---

## 16. First Agent Task

Use this as the first task only after repo is created:

```text
Task:
Initialize the repository documentation and project memory system for Satellite Change Detection Dashboard.

Do not implement the full app yet.

Create or update:
- AGENTS.md
- PROJECT_PLAN.md
- PROJECT_STATUS.md
- PROGRESS_LOG.md
- DECISIONS.md
- ROADMAP.md
- docs/geo/INDICES.md
- docs/geo/WORKFLOW.md
- docs/geo/DATA_SOURCES.md
- docs/geo/CRS_AND_PROJECTIONS.md
- docs/qgis/QGIS_WORKFLOW.md
- docs/prompts/AGENT_PROMPTS.md

If the React app already exists, verify npm run build.
If it does not exist, scaffold Vite React TypeScript first.

Final output:
- Explain what was created.
- Report build result.
- State next task: Phase 1 NDVI Analysis Pipeline.
```

---

## 17. Key Portfolio Deliverables

The final portfolio should show:

1. NDVI change map PDF/PNG from QGIS.
2. Live dashboard link.
3. Before/after map comparison.
4. JSON/GeoJSON exported analysis result.
5. Accuracy assessment table.
6. Methodology write-up.
7. QGIS workflow screenshots.
8. Spatial indexing benchmark.
9. GPS data cleaning workflow.
10. Clean README with screenshots and diagrams.

---

## 18. Success Criteria

The project is successful if the student can explain:

- why Sentinel-2 was used.
- why NDVI was selected first.
- why same-season comparison matters.
- how cloud mask works at a high level.
- how NDVI difference is calculated.
- why mean ± std threshold was used.
- how area statistics were calculated.
- how validation was done.
- how QGIS was used to inspect and present results.
- what topology errors are.
- what spatial indexing is.
- why CRS matters.
- how GPS data is cleaned and standardized.
- what limitations remain.

---

## 19. Current Best Next Step

The next step is:

> Create the repo and initialize Phase 0 with the simplified memory system.

Do not start coding the full dashboard yet.

