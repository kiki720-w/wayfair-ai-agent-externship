# Wayfair × Extern — AI Market Intelligence Agent Portfolio

Portfolio archive for the **Wayfair n8n AI Agent Engineering Externship**. The first completed artifact is an importable n8n Prompt Generator that transforms a short rug-design idea into a structured, image-generation-ready moodboard prompt.

> This repository documents an Extern project completed through Extern in collaboration with Wayfair. It does not represent employment by Wayfair, an official Wayfair product, or production Wayfair software.

## Current deliverable

`Style idea → n8n Chat Trigger → AI Agent → Google Gemini → structured moodboard prompt`

The system message requires the agent to produce:

- a clear rug subject and design style;
- color palette and material textures;
- styled-room context and complementary decor;
- composition, lighting, and photography direction;
- negative constraints for cleaner output;
- one final prompt ready for an image model.

## Repository structure

```text
.
├── workflows/
│   └── prompt-generator-gemini.json
├── docs/
│   ├── extern-submission.md
│   └── ai-product-notes.md
├── evaluation/
│   └── prompt-evaluation.csv
├── .env.example
└── README.md
```

## Import into n8n

1. Open n8n and choose **Import from File**.
2. Import `workflows/prompt-generator-gemini.json`.
3. Open **Google Gemini Chat Model** and create/select a Gemini credential.
4. Keep the suggested model or select another Gemini chat model available in your n8n version.
5. Open the chat and test a style idea such as:

   `bohemian rugs, neutral tones`

6. Save screenshots of the workflow and generated output for the Extern submission.

Never commit an API key. Credentials are stored inside n8n; `.env.example` is documentation only.

## Example inputs

- `bohemian rugs, neutral tones`
- `green botanical rug for a sunlit modern living room`

Ready-to-submit sample outputs and the reflection are in [docs/extern-submission.md](docs/extern-submission.md).

## Product direction

This first workflow is the input-quality layer of a broader AI market-intelligence product for a rugs category team:

1. consumer trend discovery;
2. competitor monitoring;
3. evidence-grounded insight and content generation;
4. a decision-oriented market intelligence dashboard.

The product framing, metrics, risks, and evaluation plan are documented in [docs/ai-product-notes.md](docs/ai-product-notes.md).

## Status

- [x] Prompt Generator workflow scaffold
- [x] System prompt and sample inputs
- [x] Submission-ready document draft
- [x] Initial evaluation rubric
- [ ] Connect the user's Gemini credential in n8n
- [ ] Capture real n8n output screenshots
- [ ] Record actual evaluation results
- [ ] Build the image-generation stage

