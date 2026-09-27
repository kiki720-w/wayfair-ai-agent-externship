# Project 2 Step 6 - Stages 5, 6 and 7

## Outcome

The Market Trend Discovery Agent now runs from category input through a validated, downloadable decision report. The tested workflow contains 53 nodes and completed an Area Rug / washable run in 11.815 seconds.

Validation result:

- required sections found: 8/8;
- sections missing: 0;
- embedded visual previews: 3;
- warnings: 0;
- final output: binary HTML report plus a submission-ready PDF.

## Stage 5 - Knowledge and report sections

The workflow collects the three generated visuals, extracts reusable context from the curated blog and market inputs, and creates the following evidence-grounded report sections:

1. Executive Summary
2. Scope of Research
3. Market Research
4. Category Deep Dive
5. Product Attribute Analysis
6. Visual Trend Analysis
7. Risks & Caveats
8. Recommendations

The Extern-recommended AI writer nodes are retained in the workflow and connected in sequence. They are currently deactivated because the configured Gemini provider returned repeated service errors during testing. Deterministic fallbacks keep the project fully testable and make all claims traceable to the structured inputs. The AI nodes can be re-enabled after provider recovery.

## Stage 6 - Report assembly

`Collect All Sections` packages the eight sections, metadata and visual assets. `Assemble HTML Report` applies a responsive Wayfair-purple design system with cards, section hierarchy and embedded Base64 visuals.

The final report separates observed evidence from product hypotheses. It also states the sample limitations and asks reviewers to verify market figures before external use.

## Stage 7 - Validation and download

`Section Validator1` checks that every required heading and a closing HTML tag are present, counts embedded images and returns warnings when required assets are missing. `Download Final Report` then emits the validated HTML as binary data using a stable category-and-date filename.

## AI product manager framing

This stage converts the workflow from a technical demo into a decision-support product:

- **User:** category managers, merchandising teams and product strategy teams.
- **Decision:** which trend territories should be tested, expanded, revised or stopped.
- **Evidence:** product listings, social and editorial signals, long-form market context and generated visual concepts.
- **Guardrails:** source freshness, sample bias, human review, transparent fallback behavior and no unsupported quantitative claims.
- **Success metrics:** conversion, gross margin, return rate, return reason and review sentiment by micro-segment.
- **Recommended experiment:** three equal-traffic curated collections, one per micro-segment, evaluated with conversion as the primary metric and margin plus return rate as guardrails.

## Files

- `workflows/stage-1-input-routing.json` - complete importable Stages 1-7 n8n workflow.
- `scripts/build-stage-5-7.js` - reproducible workflow extension script.
- `scripts/generate-final-report.py` - reproducible submission PDF generator.
- `output/pdf/area-rug-trend-report-2026-09-27.pdf` - final five-page report.

## Remaining manual submission action

The Extern form requires a 1-3 minute Loom walkthrough. Record the n8n canvas, run the `Area Rug / focus: washable` example, open the successful final output and briefly explain the AI-product decisions and fallbacks. The workflow JSON should be pasted into a viewable Google Doc, and the PDF should be uploaded separately.
