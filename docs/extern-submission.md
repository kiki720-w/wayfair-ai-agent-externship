# Extern Submission — Prompt Generator

## Workflow

**Name:** Prompt Generator  
**Flow:** On Chat Message → AI Agent → Google Gemini Chat Model

Add the following before submission:

- Screenshot 1: full n8n workflow canvas
- Screenshot 2: n8n chat showing the generated prompt

## Verified live run

- **Date:** 27 September 2026
- **Model:** Gemini 3.8 Flash
- **Latency:** 6.443 seconds
- **Output tokens:** 459
- **Workflow result:** Success

### Style idea

`Design a cozy Scandinavian living room rug moodboard using warm ivory, oatmeal, and muted sage, with natural wool and subtle geometric texture.`

### Actual Gemini output

A professional interior design moodboard centered on a cozy Scandinavian living room area rug as the hero subject, presented in a clean and cohesive catalog-style layout. The rug features an understated, modern geometric high-low pattern woven from plush natural wool in a soothing palette of warm ivory, heathered oatmeal, and soft muted sage green. The board includes a styled Nordic living room scene showcasing the rug anchored on light white-oak flooring beneath a low minimalist oak coffee table and raw linen sofa corner, illuminated by soft, diffused morning daylight. Flanking panels display tactile macro close-ups highlighting the hand-tufted loop pile texture, yarn twist, and clean serged edge details, alongside complementary decor elements including ribbed matte sage ceramic vessels, an unbleached linen fabric swatch, and light blonde wood samples. Shot with crisp, medium-format editorial photography, balanced lighting, gentle realistic shadows, and an inviting, serene hygge atmosphere, 8k resolution. Negative constraints: no people, no text, no logos, no watermarks, no distorted furniture, no duplicate objects.

### Runtime note

The course template originally referenced Gemini 2.5 Flash. Google returned a 404 stating that model was no longer available to new users, so the workflow was migrated to Gemini 3.8 Flash. The first 3.8 request encountered a temporary high-demand 503; retrying succeeded without changing the prompt or workflow logic.

## Example 1

### Style idea

`bohemian rugs, neutral tones`

### Expected prompt format

Create a clean, cohesive interior-design moodboard centered on a handwoven 5x7 bohemian jute-and-wool area rug in warm neutral tones of sand, oatmeal, ivory, taupe, and muted terracotta, featuring subtle geometric motifs, visible natural fibers, braided edges, and tactile close-up texture details. Include a sunlit modern-bohemian living room with pale oak flooring, an off-white linen sofa, light wood furniture, ceramic vessels, pampas grass, woven baskets, and restrained organic decor that complements rather than competes with the rug. Combine one hero room scene, one overhead rug view, two macro material swatches, and a compact neutral color-palette strip in an editorial, inspiration-ready layout. Use soft natural daylight from large side windows, gentle shadows, warm color grading, realistic materials, high-resolution catalog photography, and balanced negative space; no people, no text, no logos, no distorted furniture, and no duplicate objects.

## Example 2

### Style idea

`green botanical rug for a sunlit modern living room`

### Expected prompt format

Create a polished moodboard centered on a contemporary 5x7 botanical area rug with layered sage, olive, eucalyptus, moss, and cream leaf motifs, a soft low-pile wool texture, precise woven edges, and detailed close-up views of the fibers and pattern. Place the rug as the hero element in a bright modern living room with light oak floors, a warm-white modular sofa, walnut accents, sculptural ceramic planters, restrained indoor greenery, and linen textiles. Arrange one wide hero interior, one top-down product view, two material-and-pattern macro details, and a five-color palette strip as a clean, cohesive design-team reference. Use soft morning sunlight at a 45-degree angle, realistic shadows, natural color reproduction, high-resolution editorial catalog photography, and generous negative space; no people, no text, no logos, no distorted furniture, and no duplicate objects.

## Reflection

I wanted to turn short and ambiguous rug-style ideas into prompts detailed enough to create consistent, presentation-ready visual directions. The main improvement came from explicitly separating the subject, style, material, color palette, room context, composition, lighting, and negative constraints. Compared with a short prompt, the structured result gives the image model clearer control over what must remain prominent—the rug—and what should only support it. I also noticed that constraints such as “no text,” “no people,” and “no duplicate objects” reduce common visual-generation failures. The workflow demonstrates how a reusable system prompt can standardize creative input before it reaches an image-generation model.

## Final checks

- Add real screenshots.
- Verify the Google Doc contains no API keys.
- Set the document sharing level required by Extern immediately before submission.
