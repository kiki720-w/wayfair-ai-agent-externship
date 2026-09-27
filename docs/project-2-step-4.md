# Project 2 — Step 4: Stage 2B Social & Industry Signals

## Outcome

Stage 2B extends the market-trend agent with four evidence streams from Extern's curated API:

- Instagram posts (8 returned in the verified Area Rug run)
- Pinterest pins (5)
- Editorial/blog articles (3)
- Market research reports (1)

The workflow normalizes these sources into a single downstream contract, extracts a capped set of six image candidates, and creates structured caption, hashtag, engagement, and timestamp signals for later micro-segmentation.

## Workflow

`Category Validator1 (true) → Get Category Key → four parallel API requests → Merge api data → Merge Social Data1 → Merge Image Analysis`

The four GET requests use the normalized `area_rug` category key and the official program API:

- `/api/trends/instagram?category=area_rug&limit=20`
- `/api/trends/pinterest?category=area_rug&limit=20`
- `/api/trends/blogs?category=area_rug&limit=10`
- `/api/trends/blogs?category=area_rug&limit=10&blog_type=market`

## Verified output

Input: `Area Rug` with `focus: washable`

- End-to-end workflow status: success
- Runtime: 20.408 seconds
- Social/editorial items: 16
- Market reports: 1
- Image candidates retained: 6 (three per visual source)
- Instagram, Pinterest, blogs, and market endpoint status: success
- Final trend-analysis status: success

## Product-quality improvements over the starter example

1. Market research remains a distinct `marketData` collection instead of being fetched and then discarded.
2. Actual base64 image candidates remain in `socialImages`; caption-level records use a separate `socialInsights` field.
3. Every signal retains its source URL and timestamp for evidence traceability.
4. Images are capped at three per visual source to control payload size and downstream model cost.
5. The final output exposes source health and item totals so later stages can detect partial-data conditions.

## AI product-manager interpretation

Social captions, hashtags, and engagement are qualitative trend signals, not direct proof of market demand. The curated samples are small and may contain selection, recency, geography, or platform bias. Later stages should triangulate social themes against product attributes, reviews, and market research; show citations; label confidence; and avoid presenting a single platform's activity as a demand forecast.

The program endpoint currently uses HTTP and provides historical curated data (the verified social samples date to November 2024 and the blog/market samples to January 2025). A production system should require HTTPS, explicit provenance and refresh metadata, access controls, retention limits for image payloads, and periodic freshness checks.

## Submission evidence

Use `deliverables/project-2-step-4-stage-2b-tested.png`. It shows all Stage 2B nodes with green successful-execution paths and the 20.408-second successful run.
