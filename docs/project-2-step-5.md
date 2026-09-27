# Project 2 — Step 5: Stages 3–4 AI Processing and Visual Generation

## Outcome

Stages 3 and 4 extend the market-trend workflow from data collection into product classification, normalized attributes, micro-segment discovery, image-prompt construction, and visual output.

Verified input: `Area Rug` with `focus: washable`

- End-to-end status: success
- Runtime: 11.239 seconds
- Products retained: 10 through the provider-outage fallback
- Micro-segments: 3
- Clean image prompts: 3
- Encoded visual results: 3
- Hugging Face route: fully configured but not called because no token is present
- Current visual mode: labelled structured SVG previews

## Stage 3

`Merge All Data1 → Wait2 → Judge Product Category → Remove Invalid Products → Wait1 → Standardize Details → Save Standardized Data → Wait → Identify Top Trends → Save Trend List → Split Segments for Images → Check Segment Exists`

The three AI tasks have narrowly scoped JSON contracts:

1. category classification with confidence and evidence;
2. controlled-vocabulary attribute normalization;
3. evidence-grounded micro-segment identification.

Parsing nodes remove model formatting, preserve source URLs, and provide deterministic fallbacks when a model response is unavailable or malformed.

## Stage 4

`Wait3 → Generate Image Prompt → Clean Prompt → Image API Configured?`

- TRUE: `Generate Image (Hugging Face) → Encode to Base64`
- FALSE: `Generate Visual Preview → Encode to Base64`

The Hugging Face HTTP node targets `fal-ai/flux/schnell` and reads the token only from `HUGGINGFACE_API_KEY`; no secret is stored in the workflow export. Without a token, the workflow produces a clearly labelled SVG preview rather than pretending that a photorealistic model call succeeded.

## Verified fallback micro-segments

1. Modern Washable Neutrals
2. Soft Vintage Medallions
3. Natural Textured Minimalism

These are provisional opportunity hypotheses, not demand forecasts. The production workflow should replace fallback segments with live AI output and validate each segment against product coverage, price distribution, source diversity, freshness, and human category-manager review.

## Reliability findings

During testing, Gemini returned repeated `Service unavailable` errors and the Hugging Face endpoint correctly returned HTTP 401 without a token. The workflow therefore includes automatic retries, safe JSON parsing, deterministic structured fallbacks, an API-availability branch, and explicit generation-mode labels. The AI Agent nodes are currently disabled so the successful execution is reproducible during the provider outage; re-enable them after Gemini service recovers.

## Submission response

The part that required the most troubleshooting was external-model reliability and multi-item handling. Gemini intermittently returned service-unavailable errors even after retries, while the Hugging Face endpoint required a separate token. I added typed parsing, provider-aware fallback paths, and explicit status labels so the workflow remains testable without presenting fallback results as model-generated evidence. I also fixed n8n's default Code-node behavior, which initially collapsed three micro-segments into one output, by mapping all input items explicitly.

## Submission files

- `deliverables/project-2-step-5-stages-3-4-full.png` — complete workflow and successful execution
- `deliverables/project-2-step-5-stages-3-4-detail.png` — closer view of the Stage 3–4 nodes
