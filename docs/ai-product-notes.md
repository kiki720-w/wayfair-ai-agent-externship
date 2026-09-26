# AI Product Notes

## Product statement

Help a rugs category team convert fragmented market signals into traceable trends, competitor movements, creative directions, and recommended actions through an AI-assisted market-intelligence workflow.

## Primary users

- Category manager
- Merchandising analyst
- Marketing strategist
- Supplier-management partner

## Current problem

Market research is spread across product listings, reviews, design publications, and social signals. Manual collection is slow; interpretation is inconsistent; and insights frequently lose their source evidence before they reach merchandising or marketing teams.

## MVP workflow

1. Capture a category or style question.
2. Collect permitted public data from configured sources.
3. Normalize products, prices, reviews, and design signals.
4. Detect repeated attributes and emerging changes.
5. Generate evidence-linked trend and competitor summaries.
6. Convert approved insights into visual directions and content drafts.
7. Publish decisions and evidence to a dashboard.

## Agent boundary

Use deterministic automation for collection, cleaning, deduplication, scheduling, calculations, and dashboard updates. Use an LLM for classification, synthesis, explanation, prompt expansion, and content drafting. Require human review for business recommendations and publishable marketing content.

## Success metrics

- Source retrieval success rate
- Required-field completeness
- Duplicate rate
- Evidence-link coverage
- Trend precision against a human-labeled test set
- Unsupported-claim rate
- Brand-voice adherence
- Workflow completion rate
- Median latency and cost per run
- Analyst time saved per report

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Unsupported trend claims | Require source URLs and minimum evidence thresholds |
| Stale data | Display collection timestamp and freshness status |
| Scraping or source restrictions | Use permitted APIs/datasets and source-specific rate limits |
| Prompt drift | Version system prompts and run regression evaluations |
| Brand inconsistency | Brand rubric plus human approval |
| Sensitive credentials | Store only in n8n credentials; never in workflow exports |

## Initial evaluation plan

Create a labeled set of at least 20 style ideas. Score each generated prompt from 0–2 on subject clarity, style specificity, material/color coverage, scene coherence, photography direction, negative constraints, and preservation of user intent. Record model, prompt version, latency, and reviewer notes.

