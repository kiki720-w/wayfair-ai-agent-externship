# Project 4 Step 3 — Build and Test the Enhancement

## Submission package

- Enhanced n8n workflow: `workflows/project-4-enhanced-content-strategy-agent.json`
- Final report PDF: `output/pdf/wayfair-enhanced-content-strategy-report.pdf`
- Rendered HTML: `output/html/wayfair-enhanced-content-strategy-report.html`
- Verified execution summary: `output/data/project-4-step-3-execution-summary.json`
- Google Doc containing the complete workflow JSON: [P4 Enhanced Workflow JSON — Wang Luofei](https://docs.google.com/document/d/1b1aQisUkANaf2IXQpEuALslnv5DSsPPcFf2mkdWWIOo/edit)

## What was enhanced

The original content-strategy workflow was expanded into a more product-ready, evidence-grounded agent. The form now accepts five additional context fields: target audience, seasonal context, content objective, product focus, and priority competitor. The generation prompt adds Wayfair-specific voice rules and rejects generic AI language. The output now includes messaging pillars, a three-email sequence, a short-form video script, paid-ad variations, product copy and SEO guidance, quick wins, and an evaluation summary.

The agent also includes schema validation and semantic category-grounding checks. If a model returns valid JSON that is off-topic, the workflow does not silently pass it through. It produces a transparent, evidence-based fallback grounded in the submitted market-trend and competitor reports.

## Verified test

- n8n execution: `32`
- Status: successful
- Product category: Area Rug
- Trend focus: Washable & Value-Driven
- Audience: Budget-conscious renters
- Season: Fall refresh
- Objective: Education and conversion
- Product focus: Washable 5x7 rugs under $200
- Competitors: Amazon and Walmart
- Validation: passed with no missing sections
- Parse mode: `validated_fallback`
- Reason: the model response passed JSON parsing but failed category-grounding checks, so the guarded fallback replaced it
- Final output: 14-page Wayfair-ready AI Insights & Content Report

## Extern form answers

**Did you break the agent a few times while experimenting?**

Yes.

**Which part of n8n feels natural to you now, and which part still challenges you?**

The node-based data flow, form triggers, field mapping, and prompt iteration now feel natural to me. The most challenging part is maintaining reliable structured output across LLM responses and diagnosing cases where a model call succeeds technically but produces plausible, off-topic content. This project taught me to add schema checks, semantic grounding checks, transparent fallbacks, and end-to-end validation instead of treating a successful model call as a successful product outcome.

**Do you now feel confident you could build or refine another AI agent on your own?**

Yes.

## Approximately five-minute walkthrough script

### 0:00–0:35 — Introduction

Hello, I’m Wang Luofei. This is my enhanced Wayfair AI Insights and Content Strategy Agent for Project 4. The goal is to turn the market-trend report from Project 2 and the competitor-monitoring report from Project 3 into specific, Wayfair-ready marketing outputs. I will show the workflow, the enhancements I made, a successful execution, and the final report.

### 0:35–1:20 — Workflow overview

The workflow starts with an n8n form. After submission, the Extract Files node reads both reports and combines them with the form context. The AI Content node then asks Gemini to synthesize the evidence into a structured content strategy. The Parse Content node validates the response, the Build HTML node turns the strategy into a styled report, and the final nodes provide a downloadable file and browser preview.

The workflow has nine nodes in total, including the Gemini chat model and a note describing the architecture. The full workflow is also exported as JSON so it can be imported and reproduced.

### 1:20–2:20 — Product enhancements

I made three main enhancements. First, I expanded the brief with five new fields: target audience, seasonal context, content objective, product focus, and priority competitor. This makes the agent useful for a real campaign instead of producing a generic content list.

Second, I added Wayfair-specific brand constraints. The content must be warm, practical, design-confident, and useful. It avoids unsupported claims and generic AI phrases. It also explains product value through room context, durability, washability, sizing, and budget.

Third, I expanded the deliverables. The agent now creates messaging pillars, a full three-email sequence, a short-form video script, paid social and search ads, product copy and SEO recommendations, prioritized quick wins, and an evaluation summary.

### 2:20–3:10 — Test input

For this test, I selected Area Rug with a Washable and Value-Driven trend focus. The audience is budget-conscious renters, the seasonal context is Fall refresh, and the objective is education and conversion. The product focus is washable five-by-seven rugs under two hundred dollars, with Amazon and Walmart as the priority competitors.

The uploaded reports provide the evidence. For example, the competitor report shows a Wayfair sample average price of 187 dollars and 73 cents, compared with 44 dollars and 99 cents for Amazon and 30 dollars and 45 cents for Walmart. The agent uses those figures to recommend an 80-to-150-dollar test assortment rather than inventing a strategy without evidence.

### 3:10–4:00 — Reliability and debugging

One important learning came from deliberately breaking and retesting the agent. In one run, the model returned syntactically valid JSON but discussed outdoor patio furniture instead of area rugs. A simple JSON parser would have accepted that response.

I therefore added semantic category-grounding checks. The workflow verifies that the response is actually about the submitted product category and rejects conflicting topics such as patio sectionals. When a response fails, the workflow records the reason and uses a transparent, evidence-grounded fallback. In the verified execution shown here, the workflow completed successfully with no missing sections, and the validation note clearly explains that the fallback was used.

### 4:00–4:45 — Final output

The final report begins with the creative brief and executive summary, followed by the data foundation and content ideas. It then provides social captions, campaign concepts, email subject lines, competitive content angles, recommended priorities, Wayfair messaging pillars, the three-part email sequence, the short-form video script, paid-ad variations, product copy and SEO guidance, quick wins, and the evaluation summary.

The output is not just more content. It is more decision-ready because every recommendation connects to an audience, objective, competitor gap, product focus, or source metric.

### 4:45–5:10 — Closing

This project made the n8n workflow structure, field mapping, and prompt iteration feel natural to me. The hardest part was not connecting nodes; it was ensuring that a technically successful AI response was also relevant, grounded, and usable. I now feel confident building or refining another AI agent with validation, recovery logic, and measurable product-quality checks. Thank you.

## Recording checklist

1. Show the complete n8n canvas and all nine nodes.
2. Open the form fields or show the test input values.
3. Show the successful execution and the Parse Content validation fields.
4. Open the final report preview and scroll through every major section.
5. Keep the recording close to five minutes.
6. Export as MP4 or upload to Loom/Google Drive and copy a viewable link.
