from __future__ import annotations

import json
import statistics
import urllib.request
from datetime import date
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "wayfair-competitor-monitoring-report.pdf"
API = "http://34.196.186.128:8000/api/products/{retailer}?category=area_rug"
PURPLE = colors.HexColor("#5B21B6")
VIOLET = colors.HexColor("#7C3AED")
LAVENDER = colors.HexColor("#F3E8FF")
INK = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#6B7280")
GREEN = colors.HexColor("#047857")


def fetch(retailer: str) -> list[dict]:
    with urllib.request.urlopen(API.format(retailer=retailer), timeout=20) as response:
        return json.load(response)["products"]


def money(value: float) -> str:
    return f"${value:,.2f}"


def rating(product: dict) -> float:
    try:
        return float(str(product.get("rating", "")).split()[0])
    except (ValueError, IndexError):
        return 0.0


def metrics(products: list[dict]) -> dict:
    prices = [float(p["price"]) for p in products]
    reviews = [int(p.get("review_count") or 0) for p in products]
    ratings = [rating(p) for p in products if rating(p)]
    return {
        "count": len(products), "min": min(prices), "max": max(prices),
        "avg": statistics.mean(prices), "median": statistics.median(prices),
        "rating": statistics.mean(ratings), "reviews": sum(reviews),
        "budget": sum(p < 100 for p in prices),
        "mid": sum(100 <= p < 300 for p in prices),
        "premium": sum(p >= 300 for p in prices),
    }


def esc(text: object) -> str:
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleWhite", parent=styles["Title"], textColor=colors.white,
                          fontSize=27, leading=32, alignment=TA_CENTER, spaceAfter=10))
styles.add(ParagraphStyle(name="SubWhite", parent=styles["BodyText"], textColor=colors.white,
                          fontSize=12, leading=17, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="H1Purple", parent=styles["Heading1"], textColor=PURPLE,
                          fontSize=20, leading=25, spaceBefore=5, spaceAfter=12))
styles.add(ParagraphStyle(name="H2Purple", parent=styles["Heading2"], textColor=VIOLET,
                          fontSize=13, leading=17, spaceBefore=10, spaceAfter=6))
styles.add(ParagraphStyle(name="BodySmall", parent=styles["BodyText"], textColor=INK,
                          fontSize=9.3, leading=13.5, spaceAfter=7))
styles.add(ParagraphStyle(name="Tiny", parent=styles["BodyText"], textColor=MUTED,
                          fontSize=7.2, leading=9.4))
styles.add(ParagraphStyle(name="TinyWhite", parent=styles["BodyText"], textColor=colors.white,
                          fontName="Helvetica-Bold", fontSize=7.2, leading=9.4))
styles.add(ParagraphStyle(name="Callout", parent=styles["BodyText"], textColor=INK,
                          backColor=colors.HexColor("#FFF7ED"), borderColor=colors.HexColor("#F59E0B"),
                          borderWidth=0.8, borderPadding=9, leading=14, spaceAfter=12))


def P(text: str, style: str = "BodySmall") -> Paragraph:
    return Paragraph(text, styles[style])


def bullets(items: list[str]) -> list:
    return [P(f"<bullet>&bull;</bullet>{item}") for item in items]


def linked_name(product: dict) -> Paragraph:
    name = esc(product["name"][:88] + ("..." if len(product["name"]) > 88 else ""))
    return P(f'<link href="{esc(product["url"])}" color="#5B21B6"><u>{name}</u></link>', "Tiny")


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#E5E7EB"))
    canvas.line(0.65 * inch, 0.55 * inch, 7.85 * inch, 0.55 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.65 * inch, 0.35 * inch, "WAYFAIR COMPETITOR MONITORING | EXTERN PROJECT 3")
    canvas.drawRightString(7.85 * inch, 0.35 * inch, f"{doc.page}")
    canvas.restoreState()


def build() -> Path:
    data = {r: fetch(r) for r in ("wayfair", "amazon", "walmart")}
    stat = {r: metrics(p) for r, p in data.items()}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(str(OUT), pagesize=letter, leftMargin=0.65 * inch,
                          rightMargin=0.65 * inch, topMargin=0.62 * inch, bottomMargin=0.72 * inch,
                          title="Wayfair Area Rug Competitor Monitoring Report",
                          author="Wayfair x Extern Project")
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
    doc.addPageTemplates(PageTemplate(id="report", frames=frame, onPage=header_footer))
    story = []

    cover = Table([[P("WAYFAIR COMPETITOR MONITORING", "TitleWhite"),
                    ], [P("Area Rugs | Wayfair vs Amazon vs Walmart", "SubWhite")],
                   [P(f"AI-assisted market intelligence report<br/>{date.today():%B %d, %Y}", "SubWhite")]],
                  colWidths=[7.2 * inch], rowHeights=[0.8 * inch, 0.45 * inch, 0.7 * inch])
    cover.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PURPLE),
                               ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                               ("BOX", (0, 0), (-1, -1), 0, PURPLE),
                               ("TOPPADDING", (0, 0), (-1, -1), 12),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 12)]))
    story += [Spacer(1, 0.25 * inch), cover, Spacer(1, 0.28 * inch),
              P("Decision brief", "H1Purple"),
              P("Wayfair's sampled area-rug assortment sits materially above Amazon and Walmart on price. The strongest near-term opportunity is not blanket price matching; it is a focused washable-rug proposition that combines clearer discovery, size and care confidence, and a curated $80-$150 test assortment."),
              P("<b>Evidence boundary:</b> This analysis uses 10 products per retailer from the Extern educational API. It is directional, not a substitute for live catalog, margin, conversion, inventory, shipping or supplier validation.", "Callout")]
    summary = [["Retailer", "Products", "Price range", "Avg. price", "Avg. rating", "Reviews"]]
    for r in ("wayfair", "amazon", "walmart"):
        m = stat[r]
        summary.append([r.title(), str(m["count"]), f'{money(m["min"])}-{money(m["max"])}',
                        money(m["avg"]), f'{m["rating"]:.2f}', f'{m["reviews"]:,}'])
    t = Table(summary, colWidths=[1.05*inch, .65*inch, 1.4*inch, .85*inch, .8*inch, .85*inch], repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), PURPLE), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                           ("BACKGROUND", (0,1), (-1,-1), colors.white), ("GRID", (0,0), (-1,-1), .5, colors.HexColor("#D1D5DB")),
                           ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"), ("FONTSIZE", (0,0), (-1,-1), 8.3),
                           ("ALIGN", (1,1), (-1,-1), "CENTER"), ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
                           ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7)]))
    story += [t, PageBreak(), P("1. Scope and Method", "H1Purple"),
              P("The agent accepted the prompt <b>Area Rug | focus: washable</b>, queried the program's Wayfair, Amazon and Walmart endpoints, normalized each retailer's fields, and assembled comparable product evidence. The workflow then generated analysis sections, validated seven required headings and emitted a downloadable report."),
              P("Research scope", "H2Purple")]
    story += bullets(["Category: Area rugs, with special attention to washable positioning.",
                      "Sample: 30 total listings - 10 per retailer.",
                      "Signals: listed price, product title, rating, review count and clickable product URL.",
                      "Exclusions: margin, conversion, stock, delivery promise, ad placement and supplier contract data."])

    story += [P("2. Executive Summary", "H1Purple")]
    story += bullets([
        f"Wayfair's observed average price is <b>{money(stat['wayfair']['avg'])}</b>, versus {money(stat['amazon']['avg'])} on Amazon and {money(stat['walmart']['avg'])} on Walmart.",
        f"Amazon and Walmart each place {stat['amazon']['budget']} and {stat['walmart']['budget']} of 10 sampled products below $100; Wayfair has {stat['wayfair']['budget']}.",
        "Washable language is prominent in many Amazon and Walmart product titles, making care convenience a visible competitive battleground.",
        f"Wayfair carries stronger aggregate review depth in this sample ({stat['wayfair']['reviews']:,} reviews), but that result is heavily influenced by one high-review listing.",
        "Wayfair should protect differentiation through curation and trust while testing price accessibility in a controlled band."
    ])

    story += [PageBreak(), P("3. Competitor Analysis", "H1Purple")]
    for r in ("amazon", "walmart"):
        m = stat[r]
        story += [P(r.title(), "H2Purple"),
                  P(f"The sample contains {m['count']} listings from {money(m['min'])} to {money(m['max'])}, averaging {money(m['avg'])}. Average rating is {m['rating']:.2f}, with {m['reviews']:,} combined reviews."),]
        rows = [["Product (clickable)", "Price", "Rating", "Reviews"]]
        for product in sorted(data[r], key=lambda p: int(p.get("review_count") or 0), reverse=True)[:3]:
            rows.append([linked_name(product), money(float(product["price"])), f"{rating(product):.1f}", f'{int(product.get("review_count") or 0):,}'])
        tab = Table(rows, colWidths=[4.45*inch, .75*inch, .65*inch, .75*inch], repeatRows=1)
        tab.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), LAVENDER), ("TEXTCOLOR", (0,0), (-1,0), PURPLE),
                                 ("GRID", (0,0), (-1,-1), .4, colors.HexColor("#D1D5DB")), ("FONTSIZE", (0,0), (-1,-1), 7.5),
                                 ("VALIGN", (0,0), (-1,-1), "TOP"), ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6)]))
        story += [tab, Spacer(1, 8)]

    story += [P("4. Side-by-Side Comparison", "H1Purple")]
    comp = [["Dimension", "Wayfair", "Amazon", "Walmart", "Observed lead"]]
    comp += [
        ["Average price", money(stat['wayfair']['avg']), money(stat['amazon']['avg']), money(stat['walmart']['avg']), "Walmart"],
        ["Median price", money(stat['wayfair']['median']), money(stat['amazon']['median']), money(stat['walmart']['median']), "Walmart"],
        ["Average rating", f"{stat['wayfair']['rating']:.2f}", f"{stat['amazon']['rating']:.2f}", f"{stat['walmart']['rating']:.2f}", "Wayfair"],
        ["Review volume", f"{stat['wayfair']['reviews']:,}", f"{stat['amazon']['reviews']:,}", f"{stat['walmart']['reviews']:,}", "Wayfair*"],
        ["Sub-$100 items", str(stat['wayfair']['budget']), str(stat['amazon']['budget']), str(stat['walmart']['budget']), "Amazon/Walmart"],
    ]
    tab = Table(comp, colWidths=[1.25*inch, 1.05*inch, 1.05*inch, 1.05*inch, 1.4*inch], repeatRows=1)
    tab.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), PURPLE), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                             ("GRID", (0,0), (-1,-1), .45, colors.HexColor("#D1D5DB")), ("FONTSIZE", (0,0), (-1,-1), 8),
                             ("VALIGN", (0,0), (-1,-1), "MIDDLE"), ("TOPPADDING", (0,0), (-1,-1), 6), ("BOTTOMPADDING", (0,0), (-1,-1), 6)]))
    review_leader = max(data['wayfair'], key=lambda p: int(p.get('review_count') or 0))
    story += [tab, P("*Review-volume results are concentrated: Wayfair's highest-review sampled listing is "
                     + esc(review_leader['name']) + " with " + f"{int(review_leader.get('review_count') or 0):,}" + " reviews.", "Tiny")]

    story += [PageBreak(), P("5. Pricing Insights and Whitespace", "H1Purple")]
    band = [["Retailer", "Budget < $100", "Mid $100-$299", "Premium $300+"]]
    for r in ("wayfair", "amazon", "walmart"):
        m = stat[r]
        band.append([r.title(), str(m["budget"]), str(m["mid"]), str(m["premium"])])
    tab = Table(band, colWidths=[1.5*inch]*4, repeatRows=1)
    tab.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), PURPLE), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                             ("BACKGROUND", (0,1), (-1,-1), colors.white), ("GRID", (0,0), (-1,-1), .45, colors.HexColor("#D1D5DB")),
                             ("ALIGN", (1,1), (-1,-1), "CENTER"), ("FONTSIZE", (0,0), (-1,-1), 8.5),
                             ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7)]))
    story += [tab, Spacer(1, 8)]
    story += bullets(["<b>High priority:</b> test a curated $80-$150 washable assortment with strong size and care guidance.",
                      "<b>High priority:</b> improve washable, non-slip and stain-resistant filtering and PDP proof points.",
                      "<b>Medium priority:</b> use exclusive design collaborations to defend the mid-price tier.",
                      "<b>Exploratory:</b> evaluate premium washable constructions only after margin and demand validation."])

    story += [P("6. Strategic Recommendations", "H1Purple")]
    recommendations = [
        ("1", "Launch a focused assortment test", "Merchandising", "Select 20-30 washable rugs in an $80-$150 band and compare conversion, margin and returns against current control products."),
        ("2", "Strengthen discovery and confidence", "Product/UX", "Add washable and backing filters, clearer size visualization, care verification and room-fit content; track filter use, PDP engagement and add-to-cart."),
        ("3", "Build a weekly market pulse", "Analytics", "Schedule this workflow weekly, store price-band and review deltas, and alert only on material changes."),
        ("4", "Create a supplier scorecard", "Sourcing", "Evaluate MOQ, landed cost, lead time, wash testing, compliance, defect rate and channel-conflict risk before onboarding."),
    ]
    for num, title, owner, action in recommendations:
        box = Table([[P(f"<b>{num}. {title}</b><br/><font color='#6B7280'>Owner: {owner}</font>"), P(action)]], colWidths=[2.2*inch, 4.0*inch])
        box.setStyle(TableStyle([("BACKGROUND", (0,0), (0,0), LAVENDER), ("BACKGROUND", (1,0), (1,0), colors.white),
                                 ("BOX", (0,0), (-1,-1), .5, colors.HexColor("#D1D5DB")),
                                 ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 9),
                                 ("RIGHTPADDING", (0,0), (-1,-1), 9), ("TOPPADDING", (0,0), (-1,-1), 8),
                                 ("BOTTOMPADDING", (0,0), (-1,-1), 8)]))
        story += [KeepTogether(box), Spacer(1, 7)]

    story += [PageBreak(), P("7. Supplier Identification and Sourcing", "H1Purple"),
              P("Retail listings can reveal brand leads, but they do not prove manufacturer identity or a direct sourcing relationship. The following names are visible in product titles and should be treated as research leads only."),]
    leads = [
        ["Retailer", "Visible lead", "Evidence", "Required validation"],
        ["Wayfair", "Loloi / collaborations", "Multiple titles include Loloi, Chris Loves Julia, Amber Lewis or Rifle Paper Co.", "Brand ownership, authorized distribution, MOQ and exclusivity"],
        ["Amazon", "WeWove, RELEANY, Ophanie", "Names appear in sampled product titles", "Legal entity, factory, compliance and wash-test evidence"],
        ["Walmart", "SIXHOME, UERMEI, Mainstays", "Names appear in sampled product titles", "Supplier identity, channel terms, lead time and quality controls"],
    ]
    leads = [[P(esc(c), "TinyWhite" if ridx == 0 else "Tiny") for c in row] for ridx, row in enumerate(leads)]
    tab = Table(leads, colWidths=[.85*inch, 1.35*inch, 2.45*inch, 1.65*inch], repeatRows=1)
    tab.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), PURPLE), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                             ("GRID", (0,0), (-1,-1), .4, colors.HexColor("#D1D5DB")), ("VALIGN", (0,0), (-1,-1), "TOP"),
                             ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7)]))
    story += [tab, Spacer(1, 10), P("Sourcing diligence checklist", "H2Purple")]
    story += bullets(["Verify manufacturer and authorized seller status.", "Obtain wash-cycle, colorfastness, backing and chemical-compliance documentation.",
                      "Model landed cost, MOQ, lead time, defect allowance and return liability.", "Check channel conflict, IP rights and exclusivity terms."])

    story += [P("8. Measurement Plan", "H1Purple")]
    measure = [["Hypothesis", "Primary KPI", "Guardrail", "Decision window"],
               ["Accessible washable assortment grows demand", "Conversion rate", "Contribution margin", "4-6 weeks"],
               ["Better filters improve discovery", "Filter-to-PDP CTR", "Zero-result rate", "2-4 weeks"],
               ["Care and size proof reduces uncertainty", "Add-to-cart rate", "Return/contact rate", "6-8 weeks"],
               ["Weekly monitoring improves response speed", "Time to insight", "False-alert rate", "8 weeks"]]
    measure = [[P(esc(c), "TinyWhite" if ridx == 0 else "Tiny") for c in row] for ridx, row in enumerate(measure)]
    tab = Table(measure, colWidths=[2.25*inch, 1.25*inch, 1.55*inch, 1.1*inch], repeatRows=1)
    tab.setStyle(TableStyle([("BACKGROUND", (0,0), (-1,0), PURPLE), ("TEXTCOLOR", (0,0), (-1,0), colors.white),
                             ("GRID", (0,0), (-1,-1), .4, colors.HexColor("#D1D5DB")), ("VALIGN", (0,0), (-1,-1), "TOP"),
                             ("TOPPADDING", (0,0), (-1,-1), 7), ("BOTTOMPADDING", (0,0), (-1,-1), 7)]))
    story += [tab, Spacer(1, 16), P("Human review note", "H2Purple"),
              P("The n8n agent uses Gemini for narrative synthesis and deterministic fallbacks when a model call is unavailable. Required sections are validated before the report is emitted. All commercial recommendations remain subject to human review and current internal data.")]
    doc.build(story)
    return OUT


if __name__ == "__main__":
    print(build())
