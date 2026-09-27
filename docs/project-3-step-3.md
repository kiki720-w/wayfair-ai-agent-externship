# Project 3 Step 3 - Competitor Monitoring Agent Delivery

## Outcome

The Project 3 workflow now covers all six required stages and produces a validated competitor-monitoring report for Wayfair, Amazon, and Walmart.

- Input used for the verified run: `Area Rug` with `focus: washable`
- Products retrieved: 10 per retailer, 30 total
- Workflow size: 27 connected n8n nodes
- AI model: Google Gemini 3.8 Flash
- Required report sections: 7 of 7 present
- Validator result: `isValid: true`
- Missing sections: none
- Validation warnings: none

## Architecture

1. Chat input parser validates the supported rug category and extracts an optional focus.
2. Three parallel HTTP branches retrieve Wayfair, Amazon, and Walmart product samples.
3. Retailer-specific code nodes normalize names, prices, ratings, review counts, and URLs.
4. A merge node combines all retailer evidence into one downstream item.
5. Gemini agents generate the executive summary, competitor analysis, comparison, pricing whitespace, strategic recommendations, and supplier research.
6. Deterministic evidence-based fallbacks preserve every required section during transient model rate limits.
7. The assembler builds a responsive HTML report, the validator checks all required headings, and the final node emits a downloadable file.

## AI product management decisions

- **Evidence grounding:** prompts receive the normalized retailer records instead of relying on general model knowledge.
- **Auditability:** product names in competitor sections retain their source URLs.
- **Reliability:** transient Gemini failures retry automatically; deterministic fallbacks prevent an incomplete deliverable.
- **Human oversight:** the report clearly labels the sample as directional and requires current margin, conversion, inventory, and supplier validation before action.
- **Decision orientation:** recommendations include owners, measurable next steps, KPIs, and guardrails.

## Deliverables

- Importable workflow: `workflows/project-3-competitor-monitoring-agent.json`
- Workflow builder: `scripts/build-project3-full.js`
- PDF generator: `scripts/generate-project3-report.py`
- Final report: `output/pdf/wayfair-competitor-monitoring-report.pdf`
- Google Doc workflow export: `https://docs.google.com/document/d/1VHFaccjQJT2F60U2KyOlxR5zy2HpA6W30slL5s9tJ5k`

## Suggested reflection answers

**Tactical action Wayfair should take:** Launch a focused $80-$150 washable area-rug assortment test, supported by stronger washable filters, size visualization, and care proof points. Measure conversion, contribution margin, add-to-cart rate, and returns against the current assortment before scaling.

**Strongest feature:** The strongest feature is evidence-grounded cross-retailer synthesis. The agent retrieves the same category from three retailers, normalizes the records, and converts price, rating, review, and source-link evidence into a single decision-ready report while retaining deterministic fallbacks and a validation gate.

## Submission note

The optional Loom field can remain blank unless Extern explicitly makes it mandatory on the final submission page. The final PDF is intentionally more polished than the workflow's downloadable HTML while using the same retailer data and strategic logic.
