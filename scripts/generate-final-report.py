from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "area-rug-trend-report-2026-09-27.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

PURPLE = HexColor("#4C1D95")
VIOLET = HexColor("#7C3AED")
LAVENDER = HexColor("#F5F3FF")
INK = HexColor("#292524")
MUTED = HexColor("#78716C")
LINE = HexColor("#DDD6FE")
CREAM = HexColor("#F7F3EC")


def register_fonts():
    candidates = [
        ("Aptos", Path("C:/Windows/Fonts/aptos.ttf")),
        ("Arial", Path("C:/Windows/Fonts/arial.ttf")),
    ]
    for name, path in candidates:
        if path.exists():
            pdfmetrics.registerFont(TTFont(name, str(path)))
            return name
    return "Helvetica"


FONT = register_fonts()
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleWhite", parent=styles["Title"], fontName=FONT, fontSize=28, leading=34, textColor=colors.white, alignment=TA_LEFT, spaceAfter=8))
styles.add(ParagraphStyle(name="CoverSub", parent=styles["BodyText"], fontName=FONT, fontSize=13, leading=19, textColor=HexColor("#EDE9FE")))
styles.add(ParagraphStyle(name="H1Purple", parent=styles["Heading1"], fontName=FONT, fontSize=19, leading=24, textColor=PURPLE, spaceBefore=8, spaceAfter=10))
styles.add(ParagraphStyle(name="H2Purple", parent=styles["Heading2"], fontName=FONT, fontSize=14, leading=19, textColor=PURPLE, spaceBefore=8, spaceAfter=6))
styles.add(ParagraphStyle(name="BodyClean", parent=styles["BodyText"], fontName=FONT, fontSize=9.6, leading=14.2, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name="SmallMuted", parent=styles["BodyText"], fontName=FONT, fontSize=7.8, leading=11, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name="Metric", parent=styles["BodyText"], fontName=FONT, fontSize=17, leading=21, textColor=PURPLE, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="MetricLabel", parent=styles["BodyText"], fontName=FONT, fontSize=7.5, leading=10, textColor=MUTED, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="CenterSmall", parent=styles["BodyText"], fontName=FONT, fontSize=8, leading=11, textColor=MUTED, alignment=TA_CENTER))


def p(text, style="BodyClean"):
    return Paragraph(text, styles[style])


def bullets(items):
    return [p("&#8226; " + item) for item in items]


def numbered(items):
    return [p(f"<b>{i}.</b> {item}") for i, item in enumerate(items, 1)]


def metric_card(value, label):
    t = Table([[p(value, "Metric")], [p(label, "MetricLabel")]], colWidths=[41 * mm], rowHeights=[11 * mm, 9 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LAVENDER),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t


def section_heading(title):
    return [p(title, "H1Purple"), Table([[""]], colWidths=[174 * mm], rowHeights=[0.7 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), LINE)])), Spacer(1, 4 * mm)]


def trend_visual(title, palette, motif):
    data = [[p(f"<b>{title}</b>", "H2Purple")], [p(motif, "SmallMuted")]]
    swatches = Table([["", "", ""]], colWidths=[47 * mm] * 3, rowHeights=[13 * mm])
    swatches.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), HexColor(palette[0])),
        ("BACKGROUND", (1, 0), (1, 0), HexColor(palette[1])),
        ("BACKGROUND", (2, 0), (2, 0), HexColor(palette[2])),
        ("BOX", (0, 0), (-1, -1), 0.4, colors.white),
        ("INNERGRID", (0, 0), (-1, -1), 1, colors.white),
    ]))
    data.append([swatches])
    box = Table(data, colWidths=[154 * mm])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LAVENDER),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return box


class ReportDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(filename, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=18 * mm, title="Area Rug Trend Report", author="Wayfair x Extern educational project")
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="body")
        self.addPageTemplates(PageTemplate(id="all", frames=frame, onPage=self.decorate))

    def decorate(self, canvas, doc):
        page = canvas.getPageNumber()
        if page == 1:
            canvas.setFillColor(PURPLE)
            canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
            canvas.setFillColor(VIOLET)
            canvas.circle(A4[0] - 15 * mm, A4[1] - 18 * mm, 58 * mm, fill=1, stroke=0)
            return
        canvas.saveState()
        canvas.setFont(FONT, 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(18 * mm, 10 * mm, "Wayfair x Extern | AI Product Trend Discovery")
        canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, f"Page {page}")
        canvas.setStrokeColor(LINE)
        canvas.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
        canvas.restoreState()


story = []

# Cover
story += [Spacer(1, 62 * mm), p("AREA RUG TREND REPORT", "TitleWhite"), p("Decision-oriented market intelligence generated by an end-to-end n8n AI agent workflow", "CoverSub"), Spacer(1, 12 * mm)]
cover_meta = Table([
    [p("CATEGORY", "SmallMuted"), p("Area Rug", "CoverSub")],
    [p("FOCUS", "SmallMuted"), p("Washable products", "CoverSub")],
    [p("GENERATED", "SmallMuted"), p("September 27, 2026", "CoverSub")],
    [p("METHOD", "SmallMuted"), p("Product, social, editorial and market signal synthesis", "CoverSub")],
], colWidths=[33 * mm, 115 * mm])
cover_meta.setStyle(TableStyle([("TEXTCOLOR", (0, 0), (-1, -1), colors.white), ("LINEBELOW", (0, 0), (-1, -2), 0.35, HexColor("#8B5CF6")), ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 7), ("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
story += [cover_meta, Spacer(1, 40 * mm), p("EDUCATIONAL PROJECT", "SmallMuted"), p("Evidence should be refreshed and independently verified before business use.", "CoverSub"), PageBreak()]

# Executive Summary
story += section_heading("1. Executive Summary")
story += [p("<b>Opportunity.</b> The sampled Area Rug market shows a useful intersection between washable practicality and three distinct visual territories: warm neutral modernism, softened vintage medallions and natural textured minimalism.")]
story += bullets([
    "Treat the three micro-segments as testable assortment and merchandising hypotheses, not as demand forecasts.",
    "Lead with cleanability, exact sizing, pile height and room-context visualization because these reduce purchase uncertainty.",
    "Validate every expansion decision against conversion, margin, return reasons and review sentiment by segment.",
])
story += [Spacer(1, 4 * mm), Table([[metric_card("10", "Amazon products"), metric_card("16", "Social/editorial items"), metric_card("3", "Market reports"), metric_card("3", "Micro-segments")]], colWidths=[43.5 * mm] * 4, style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 1), ("RIGHTPADDING", (0, 0), (-1, -1), 1)])), Spacer(1, 7 * mm)]
story += [p("<b>Recommended product move.</b> Launch a controlled, well-instrumented test across the three territories and use standardized attributes plus room visualization to make comparison easier.")]

# Scope
story += section_heading("2. Scope of Research")
scope_rows = [
    [p("Signal", "H2Purple"), p("Coverage", "H2Purple"), p("Role in the analysis", "H2Purple")],
    [p("Amazon products"), p("10 sampled listings"), p("Price, rating, naming, construction and merchandising language")],
    [p("Instagram"), p("8 curated items"), p("Aesthetic language, captions and engagement context")],
    [p("Pinterest"), p("5 curated items"), p("Visual motifs, palette and room-styling direction")],
    [p("Blogs / market"), p("3 curated documents"), p("Long-form trend context, care, materials and market framing")],
]
scope_table = Table(scope_rows, colWidths=[42 * mm, 42 * mm, 90 * mm], repeatRows=1)
scope_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), PURPLE), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("BACKGROUND", (0, 1), (-1, -1), colors.white), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
story += [scope_table, Spacer(1, 4 * mm), p("The workflow accepts a category and optional focus. This run used <b>Area Rug</b> with <b>washable</b> as the focus, then collected available Extern API evidence, normalized fields, identified micro-segments, generated visual previews and assembled a validated report.")]

# Market
story += section_heading("3. Market Research")
story += [p("The supplied market material frames carpets and rugs as a growing global category and highlights online retail, premium design and eco-friendly choices as demand drivers. It cites a 2025 global market size of USD 62.90B and a projected 2033 size of USD 130.62B, with 9.59% CAGR for 2026-2033."), p("<b>Decision use:</b> These figures establish strategic context only. They are not independently verified in this project and should not be used in external claims without checking the original methodology, scope and publication date."), p("<b>Qualitative direction:</b> Warm earth tones, organic texture, modern-vintage fusion, irregular shapes, washable performance and sustainable materials recur across the provided trend documents.")]

# Category
story += section_heading("4. Category Deep Dive")
segments = [
    ("Modern Washable Neutrals", ["#F4E9D8", "#A9907E", "#777777"], "Cream / Taupe / Gray", "Practical low-pile rugs in warm neutrals for high-use family spaces.", "Subtle geometry; washable construction; living room and family room; mid-range hypothesis."),
    ("Soft Vintage Medallions", ["#A8B5A2", "#FFF7E8", "#7F9BAD"], "Sage / Ivory / Dusty Blue", "Faded ornamental motifs balance heritage character with relaxed contemporary rooms.", "Distressed medallion; soft contrast; bedroom and living room; mid-range hypothesis."),
    ("Natural Textured Minimalism", ["#D8C3A5", "#D8C7A3", "#8A6248"], "Sand / Oatmeal / Warm Brown", "Tactile natural-looking surfaces and restrained patterns support calm interiors.", "Woven texture; organic irregularity; dining room and entryway; value hypothesis."),
]
for name, palette, palette_text, desc, details in segments:
    story += [KeepTogether([trend_visual(name, palette, f"Palette: {palette_text}"), Spacer(1, 2 * mm), p(desc), p("<b>Working profile:</b> " + details), Spacer(1, 5 * mm)])]

# Attributes
story += section_heading("5. Product Attribute Analysis")
attr_rows = [
    [p("Attribute", "H2Purple"), p("Observed implication", "H2Purple"), p("Product requirement", "H2Purple")],
    [p("Washability"), p("Repeated in product titles and focus request"), p("Expose care method and machine-size constraints")],
    [p("Pile / texture"), p("Low-pile practicality competes with plush comfort"), p("Standardize pile height and room suitability")],
    [p("Size"), p("5x7, 6x9 and 8x10 appear in sampled listings"), p("Provide exact dimensions and furniture-layout guidance")],
    [p("Material"), p("Synthetic performance and natural-looking texture coexist"), p("Clarify fiber, backing, stain resistance and durability")],
    [p("Style"), p("Modern, vintage, boho, floral and abstract language"), p("Use consistent style tags and visual similarity")],
]
attr_table = Table(attr_rows, colWidths=[38 * mm, 65 * mm, 71 * mm], repeatRows=1)
attr_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), PURPLE), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LAVENDER]), ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
story += [attr_table]

# Visual trends
story += section_heading("6. Visual Trend Analysis")
story += bullets([
    "Warm neutrals: cream, taupe, sand and oatmeal provide flexible room coordination and soften the move away from cool gray.",
    "Softened heritage: distressed medallions preserve visual character while lowering contrast for contemporary rooms.",
    "Tactile restraint: woven-looking surfaces and irregular organic details make minimalism feel warmer and less generic.",
    "Merchandising implication: show close texture, edge construction, backing and a full-room scale reference in a consistent image sequence.",
])
story += [p("The three visuals in this report are structured previews generated by the workflow when no Hugging Face token is configured. They communicate palette and segment identity, not photorealistic product proposals.", "SmallMuted")]

# Risks
story += [PageBreak()]
story += section_heading("7. Risks & Caveats")
risks = [
    ["R1", "Sample bias", "The curated sample may not represent Wayfair's full assortment or customer base.", "Refresh from first-party catalog and behavior data."],
    ["R2", "Intent gap", "Social engagement is not the same as purchase intent.", "Triangulate with search, PDP and transaction metrics."],
    ["R3", "Freshness", "Source dates and market figures can age quickly.", "Store timestamps and schedule recurring refreshes."],
    ["R4", "AI error", "Classification and synthesis can omit context or overstate patterns.", "Use human review and evidence links for decisions."],
    ["R5", "Visual fidelity", "Fallback previews are conceptual, not product photography.", "Replace with approved image-generation or studio assets."],
]
risk_rows = [[p("ID", "H2Purple"), p("Risk", "H2Purple"), p("Why it matters", "H2Purple"), p("Mitigation", "H2Purple")]] + [[p(a), p(b), p(c), p(d)] for a, b, c, d in risks]
risk_table = Table(risk_rows, colWidths=[13 * mm, 31 * mm, 65 * mm, 65 * mm], repeatRows=1)
risk_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), PURPLE), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LAVENDER]), ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
story += [risk_table]

# Recommendations
story += section_heading("8. Recommendations")
story += numbered([
    "Run a controlled assortment or landing-page test for each micro-segment, keeping price and placement comparable.",
    "Add standardized filters for washable status, material, pile height, backing, exact size and recommended room.",
    "Create a consistent image sequence: room context, full rug, texture close-up, backing, edge and care instructions.",
    "Measure conversion, gross margin, return rate, return reason and review sentiment at segment level.",
    "Connect the agent to governed first-party evidence and retain source-level citations in every generated section.",
    "Replace the fallback image branch with an approved provider once credentials and usage controls are available.",
])
story += [Spacer(1, 5 * mm), p("<b>30-day experiment:</b> Publish three equal-traffic curated collections, one per segment. Use one primary success metric (conversion), two guardrails (return rate and margin), and qualitative review analysis to decide whether to expand, revise or stop each hypothesis.")]

# Methodology and sources
story += section_heading("Methodology & Sources")
story += [p("<b>Workflow:</b> 53-node n8n pipeline covering input validation, API collection, normalization, AI-ready classification, micro-segmentation, visual generation, eight-section report assembly, validation and downloadable HTML packaging.", "SmallMuted"), p("<b>Runtime result:</b> 8 of 8 required report sections found; 3 embedded visual previews; 0 validation warnings; full run completed successfully on September 27, 2026.", "SmallMuted"), p("<b>Data endpoints:</b> Extern project API routes for Amazon products, Instagram trends, Pinterest trends and blog / market trends at 34.196.186.128:8000. The workflow JSON preserves the exact routes and transformations. Market statistics and trend statements are summarized from the supplied educational dataset; verify original sources before publication or investment decisions.", "SmallMuted")]

doc = ReportDoc(str(OUT))
doc.build(story)
print(OUT)
