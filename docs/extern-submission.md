# Extern Submission — Prompt Generator

## Workflow

**Name:** Prompt Generator  
**Flow:** On Chat Message → AI Agent → Google Gemini Chat Model

Add the following before submission:

- Screenshot 1: full n8n workflow canvas
- Screenshot 2: n8n chat showing the generated prompt

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

- Replace the expected outputs with the actual Gemini outputs if they differ.
- Add real screenshots.
- Verify the Google Doc contains no API keys.
- Set the document sharing level required by Extern immediately before submission.

