# Semantics-to-Contact (S2C)

Project website: https://qiaoguanren.github.io/S2C/

A Stagewise Framework for Robust Contact-Rich Manipulation.

## Website

Static HTML/CSS/JavaScript website with the full one-minute overview film, 18 individual experiment recordings, original CUHK-Shenzhen and DexForce logos, method figure, quantitative results and citation.

GitHub Pages is configured to deploy from `main`, `/ (root)`. No build step or dependency installation is needed.

Local preview: `python3 -m http.server 8000`, then open http://localhost:8000.

## Content notes

- Five ID clips show the ordinary black-cloth setup. Thirteen OOD clips include changed tablecloths and strong/colored lighting, even if the cloth remains black. Classifications are recorded in `assets/demos.json`.
- Test-tube and hard-drive removal are additional tasks, separate from the six-task insertion benchmark.
- Result averages are calculated from the manuscript's per-task counts. HIL-ConRFT's training counts yield 110/120 = 91.67%, correcting the manuscript's arithmetic typo of 91.76%.
- NeurIPS 2026 acceptance is provided by the project author. The BibTeX entry uses the conference proceedings title; no volume, page range, DOI or arXiv identifier is inferred. The framework PDF is available; a compiled manuscript PDF was not part of the supplied files.
- Author names and all three affiliations follow the supplied S2C manuscript. The two requested institutional logos are displayed.

## Attribution

Research, figures and footage: supplied by the project authors.

Institutional logos: https://edem-ai.github.io/FTC-website/

Visual inspiration: https://supermimic.github.io/ (original implementation; no copied site code or footage).

Research footage, figures and institutional marks retain their respective owners' rights.
