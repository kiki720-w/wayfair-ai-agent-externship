# Project 5 · Step 2 — Dashboard Builder Agent

## Outcome

The complete six-node Dashboard Builder Agent is implemented, imported into local n8n, and verified with a successful end-to-end form execution.

## Workflow

1. **Upload Form** — collects the category and the Project 2 and Project 3 HTML files.
2. **Fetch Template** — retrieves the official dashboard template from the public Extern endpoint.
3. **Extract Form Files** — identifies the two uploads and exposes them as `p2_binary` and `p3_binary`.
4. **Parse P2 & P3 Reports** — extracts controlled, evidence-grounded structures without external packages.
5. **Build Dashboard HTML** — replaces every official template placeholder and constructs repeated cards, bars, tables, alerts, and actions.
6. **Prepare Download** — emits the completed dashboard as an HTML binary file.

## Verified execution

- n8n workflow: `P5_DashboardBuilder_WangLuofei`
- form input category: `Area Rug`
- P2 input: `output/html/area-rug-market-trend-report.html`
- P3 input: `output/html/wayfair-competitor-analysis-report.html`
- result: all six nodes completed successfully with one output item
- output: `output/html/Area_Rug_Dashboard_2026-09-27.html`

## Validation

- dashboard HTML length: 64,682 characters
- unresolved template placeholders: 0
- P2 segments parsed: 3
- P2 risks parsed: 4
- P2 recommendations parsed: 4
- P3 strategic actions parsed: 4
- supplier groups parsed: 3
- retailer product counts: 10 Wayfair, 10 Amazon, 10 Walmart
- sampled average prices: $187.73 Wayfair, $44.99 Amazon, $30.45 Walmart
- browser visual review: passed

## Files

- `workflows/project-5-dashboard-builder-agent.json` — importable, self-contained n8n workflow
- `scripts/project5-extract-form-files.js` — upload normalization
- `scripts/project5-parse-reports.js` — deterministic report parser
- `scripts/project5-build-dashboard.js` — official-template renderer
- `scripts/project5-prepare-download.js` — binary download output
- `scripts/build-project5-workflow.js` — reproducible workflow exporter
- `scripts/test-project5-dashboard.js` — local integration test
- `output/html/Area_Rug_Dashboard_2026-09-27.html` — final dashboard

## Submission links

- Workflow JSON (Google Doc, public viewer): https://docs.google.com/document/d/1doSUL0MqXDG2r91wrf-4Kq4zwcr4RMHSY3CTv-EzSTI/edit?usp=sharing
- Final dashboard HTML (Google Drive, public viewer): https://drive.google.com/file/d/1vvkUGN1uMZ5GTNJcTNkLM7stSxXumawp/view?usp=sharing

## Product-quality decisions

- The parser is grounded in the controlled report structure rather than relying on an LLM for extraction.
- The workflow fails clearly when the template or either input file is missing.
- All 54 official template placeholders are resolved before download.
- The dashboard carries the reports' evidence boundary and human-review requirement.
- No OAuth credentials, API keys, or external packages are required.
