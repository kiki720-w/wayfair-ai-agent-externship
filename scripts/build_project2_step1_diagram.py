from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "deliverables" / "project-2-step-1-workflow.png"

W, H = 1800, 1040
BG = "#F4F0E8"
INK = "#17211B"
MUTED = "#5B665F"
GREEN = "#1F5B43"
LINE = "#B9C4BC"
WHITE = "#FFFFFF"


def font(size: int, bold: bool = False):
    candidates = [
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf"),
    ]
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

draw.text((90, 58), "Market Trend Discovery Agent", font=font(55, True), fill=INK)
draw.text((92, 125), "Project 2 · Step 1 workflow sketch · Category: Area Rugs", font=font(27), fill=MUTED)

blocks = [
    (
        "1  INPUT & ROUTING",
        ["Manual Trigger / Form", "Area Rugs + public URLs", "Set / Code: validate inputs"],
        "Validated category + URL list",
    ),
    (
        "2  PRODUCT DATA",
        ["HTTP Request: public product pages", "HTML Extract / Cheerio", "Code: normalize price, rating, attributes"],
        "Comparable product records",
    ),
    (
        "3  MARKET SIGNALS",
        ["HTTP Request: blogs / public social pages", "Extract text + source metadata", "Code: clean, deduplicate, timestamp"],
        "Evidence-backed trend signals",
    ),
    (
        "4  SYNTHESIS & OUTPUT",
        ["Merge + aggregate evidence", "Gemini: trends, risks, recommendations", "Code / HTML: charts + final report"],
        "Decision-ready HTML report",
    ),
]

margin = 90
gap = 35
box_w = (W - margin * 2 - gap * 3) // 4
box_y = 235
box_h = 430

for i, (title, items, output) in enumerate(blocks):
    x = margin + i * (box_w + gap)
    draw.rounded_rectangle((x, box_y, x + box_w, box_y + box_h), radius=28, fill=WHITE, outline=LINE, width=3)
    draw.rounded_rectangle((x, box_y, x + box_w, box_y + 82), radius=28, fill=GREEN)
    draw.rectangle((x, box_y + 54, x + box_w, box_y + 82), fill=GREEN)
    draw.text((x + 24, box_y + 25), title, font=font(23, True), fill=WHITE)

    y = box_y + 115
    for item in items:
        draw.ellipse((x + 26, y + 9, x + 38, y + 21), fill=GREEN)
        lines = []
        words = item.split()
        line = ""
        for word in words:
            candidate = f"{line} {word}".strip()
            if draw.textlength(candidate, font=font(21)) <= box_w - 82:
                line = candidate
            else:
                lines.append(line)
                line = word
        if line:
            lines.append(line)
        draw.multiline_text((x + 52, y), "\n".join(lines), font=font(21), fill=INK, spacing=7)
        y += 40 * len(lines) + 27

    draw.line((x + 24, box_y + 342, x + box_w - 24, box_y + 342), fill=LINE, width=2)
    draw.text((x + 26, box_y + 365), "OUTPUT", font=font(18, True), fill=MUTED)
    draw.multiline_text((x + 26, box_y + 395), output, font=font(21, True), fill=GREEN, spacing=5)

    if i < 3:
        ax = x + box_w + 7
        ay = box_y + box_h // 2
        draw.line((ax, ay, ax + gap - 14, ay), fill=GREEN, width=5)
        draw.polygon([(ax + gap - 14, ay - 10), (ax + gap - 14, ay + 10), (ax + gap - 2, ay)], fill=GREEN)

draw.rounded_rectangle((90, 720, 1710, 950), radius=30, fill="#E4EBE6", outline=LINE, width=2)
draw.text((125, 755), "FINAL REPORT", font=font(22, True), fill=GREEN)
report_items = [
    "Executive summary",
    "Methods + cited sources",
    "Styles / colors / materials",
    "Price and rating patterns",
    "Charts + product examples",
    "Recommendations + risks",
]
for idx, item in enumerate(report_items):
    col = idx % 3
    row = idx // 3
    x = 125 + col * 515
    y = 815 + row * 60
    draw.rounded_rectangle((x, y, x + 450, y + 42), radius=18, fill=WHITE)
    draw.text((x + 18, y + 9), item, font=font(19), fill=INK)

draw.text((90, 986), "Human review gate: validate definitions, evidence quality, bias, and recommendations before sharing.", font=font(20, True), fill=INK)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUTPUT, quality=95)
print(OUTPUT)
