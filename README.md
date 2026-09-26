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
├── .gitignore
└── README.md
```

## Import into n8n

1. Open n8n and choose **Import from File**.
2. Import `workflows/prompt-generator-gemini.json`.
3. Open **Google Gemini Chat Model** and create/select a Gemini credential.
4. Use `models/gemini-3.8-flash`, or select another currently available Gemini chat model in your n8n version.
5. Open the chat and test a style idea such as:

   `bohemian rugs, neutral tones`

6. Save screenshots of the workflow and generated output for the Extern submission.

Never commit an API key. Credentials are stored inside n8n; `.env.example` is documentation only.

### Verified local runtime

The workflow was successfully imported with the n8n `2.40.7` CLI. A local self-hosted instance can be kept isolated from the repository by setting `N8N_USER_FOLDER` to `.n8n-local`; both `.n8n-local/` and `.n8n-runtime/` are ignored by Git.

On 27 September 2026, the complete workflow was run successfully against Gemini 3.8 Flash. The original Gemini 2.5 Flash selection returned a deprecation error for new users, so the archived workflow was migrated to the current model. The verified run completed in 6.443 seconds and produced a 459-token prompt.

## Example inputs

- `bohemian rugs, neutral tones`
- `green botanical rug for a sunlit modern living room`

Ready-to-submit sample outputs and the reflection are in [docs/extern-submission.md](docs/extern-submission.md).

The Project 2 planning artifact is documented in [docs/project-2-step-1.md](docs/project-2-step-1.md), including a four-block workflow sketch for the Area Rugs market-trend agent.

## Product direction

This first workflow is the input-quality layer of a broader AI market-intelligence product for a rugs category team:

1. consumer trend discovery;
2. competitor monitoring;
3. evidence-grounded insight and content generation;
4. a decision-oriented market intelligence dashboard.

The product framing, metrics, risks, and evaluation plan are documented in [docs/ai-product-notes.md](docs/ai-product-notes.md).

## Status

- [x] Prompt Generator workflow scaffold
- [x] JSON parsed and imported successfully in n8n 2.40.7
- [x] System prompt and sample inputs
- [x] Submission-ready document draft
- [x] Initial evaluation rubric
- [x] Connect the user's Gemini credential in local n8n (credential is not stored in Git)
- [x] Execute the end-to-end workflow successfully with Gemini 3.8 Flash
- [ ] Capture real n8n output screenshots
- [x] Record the first actual evaluation result
- [ ] Build the image-generation stage
