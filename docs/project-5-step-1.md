# Project 5 · Step 1 — Understanding the Dashboard Builder Agent

## Objective

Project 5 combines the existing Project 2 market-trend report and Project 3 competitor-analysis report into one management-ready dashboard. The agent is an orchestration and presentation layer: it does not create new market insights or independently analyze new data.

## Five-minute dashboard exercise

The exercise dashboard topic is **AI Product Portfolio & Learning Progress Dashboard**. It tracks completed agents, workflow nodes, validated runs, portfolio assets, capability growth, and delivery milestones across the Wayfair × Extern program.

The single-file HTML dashboard is stored at `sites/ai-product-portfolio-dashboard/dist/index.html` and has been privately deployed through Sites.

### Extern answers

1. **What topic did you choose?**

   AI Product Portfolio & Learning Progress Dashboard

2. **What impressed you most?**

   Information organization

3. **How useful would automated dashboard generation be in real work?**

   5 — Very useful; it can save hours.

## Prerequisite check

- Project 2 HTML input: `output/html/area-rug-market-trend-report.html`
- Project 3 HTML input: `output/html/wayfair-competitor-analysis-report.html`
- Both files are standalone `.html` documents and are ready for direct upload to the n8n agent.
- n8n is already available locally.
- No OAuth login, API key, or external credential is required for Project 5.

## Product framing

The Dashboard Builder Agent acts like an internal briefing assistant. It receives two established analyst reports, parses their HTML with Cheerio, extracts the decision-relevant sections, and renders a unified category-management dashboard. This makes the AI product story stronger because it demonstrates a reusable operating workflow rather than a one-off visual.

## Next step

Project 5 Step 2 will build the n8n workflow that accepts the two HTML files and parses them with Cheerio before dashboard assembly.
