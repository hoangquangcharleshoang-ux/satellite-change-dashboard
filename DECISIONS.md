# DECISIONS.md

## Confirmed Decisions

- Project name: Satellite Change Detection Dashboard
- Repository visibility: Private during development
- First map library: MapLibre GL JS
- First remote sensing index: NDVI
- First study region: Hanoi, with a small peri-urban AOI to be selected
- First dataset: Sentinel-2 Surface Reflectance Harmonized
- Main comparison method: same-season comparison, not full-year comparison
- First threshold method: NDVI difference using mean ± 1–1.5 standard deviation
- Agent tools: Codex Plus and Antigravity Pro
- Graphify: not used
- First combined urban-expansion candidate rule: strong NDVI loss AND strong
  NDBI gain, explicitly treated as `candidate_not_validated`
- CodeGraph / Understand-Anything: delayed, not used in Phase 0–2
