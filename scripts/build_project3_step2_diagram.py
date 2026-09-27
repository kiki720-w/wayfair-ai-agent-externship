from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "deliverables" / "project-3-step-2-stage-1-4-tested.png"

W, H = 1900, 1000
BG = "#171717"
GRID = "#252525"
CARD = "#252525"
EDGE = "#20B26B"
WHITE = "#F2F2F2"
MUTED = "#A7A7A7"
CODE = "#F2A65A"
HTTP = "#8DB8FF"
MERGE = "#73D6E6"


def font(size: int, bold: bool = False):
    paths = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for path in paths:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

for x in range(0, W, 28):
    for y in range(0, H, 28):
        draw.ellipse((x, y, x + 2, y + 2), fill=GRID)

draw.text((50, 35), "Wayfair Competitor Monitoring — Stages 1–4", font=font(31, True), fill=WHITE)
draw.text((50, 82), "Successful test · Area Rug · focus: washable · 10 products per retailer", font=font(20), fill=MUTED)


def node(cx, cy, label, kind, color):
    size = 108
    x1, y1 = cx - size // 2, cy - size // 2
    x2, y2 = cx + size // 2, cy + size // 2
    draw.rounded_rectangle((x1, y1, x2, y2), radius=17, fill=CARD, outline=EDGE, width=3)
    if kind == "chat":
        draw.rounded_rectangle((cx - 24, cy - 22, cx + 24, cy + 16), radius=6, outline=WHITE, width=4)
        draw.polygon([(cx - 9, cy + 15), (cx - 19, cy + 30), (cx + 2, cy + 17)], fill=WHITE)
    elif kind == "http":
        draw.ellipse((cx - 29, cy - 29, cx + 29, cy + 29), outline=color, width=5)
        draw.ellipse((cx - 13, cy - 29, cx + 13, cy + 29), outline=color, width=3)
        draw.line((cx - 28, cy, cx + 28, cy), fill=color, width=3)
    elif kind == "merge":
        draw.line((cx - 25, cy - 22, cx - 5, cy - 22, cx + 9, cy), fill=color, width=5)
        draw.line((cx - 25, cy + 22, cx - 5, cy + 22, cx + 9, cy), fill=color, width=5)
        draw.line((cx + 9, cy, cx + 28, cy), fill=color, width=5)
        draw.polygon([(cx + 29, cy), (cx + 15, cy - 8), (cx + 15, cy + 8)], fill=color)
    else:
        draw.text((cx - 25, cy - 32), "{ }", font=font(43, True), fill=color)
    draw.ellipse((x2 - 26, y2 - 27, x2 - 8, y2 - 9), fill=EDGE)
    draw.line((x2 - 22, y2 - 18, x2 - 17, y2 - 13, x2 - 10, y2 - 22), fill=WHITE, width=2)
    bbox = draw.textbbox((0, 0), label, font=font(20, True))
    draw.text((cx - (bbox[2] - bbox[0]) / 2, y2 + 16), label, font=font(20, True), fill=WHITE)
    return (x1, y1, x2, y2)


nodes = {
    "trigger": (180, 505, "When chat message received", "chat", WHITE),
    "parser": (445, 505, "Input Parser", "code", CODE),
    "wf_get": (760, 250, "Fetch Wayfair Products", "http", HTTP),
    "wf_shape": (1110, 250, "Reshape Wayfair Response", "code", CODE),
    "amz_get": (760, 505, "Fetch Amazon Products", "http", HTTP),
    "amz_shape": (1110, 505, "Reshape Amazon Response", "code", CODE),
    "wm_get": (760, 760, "Fetch Walmart Products", "http", HTTP),
    "wm_shape": (1110, 760, "Reshape Walmart Response", "code", CODE),
    "merge": (1510, 505, "Merge Retailer Data", "merge", MERGE),
}


def connect(a, b, bend=False):
    ax, ay = nodes[a][0], nodes[a][1]
    bx, by = nodes[b][0], nodes[b][1]
    start = (ax + 56, ay)
    end = (bx - 56, by)
    if bend:
        midx = (start[0] + end[0]) // 2
        pts = [start, (midx, start[1]), (midx, end[1]), end]
        draw.line(pts, fill=EDGE, width=4, joint="curve")
    else:
        draw.line((start, end), fill=EDGE, width=4)
    draw.polygon([(end[0], end[1]), (end[0] - 13, end[1] - 8), (end[0] - 13, end[1] + 8)], fill=EDGE)


connect("trigger", "parser")
connect("parser", "wf_get", True)
connect("parser", "amz_get")
connect("parser", "wm_get", True)
connect("wf_get", "wf_shape")
connect("amz_get", "amz_shape")
connect("wm_get", "wm_shape")
connect("wf_shape", "merge", True)
connect("amz_shape", "merge")
connect("wm_shape", "merge", True)

for values in nodes.values():
    node(*values)

for y, title in [(250, "WAYFAIR"), (505, "AMAZON"), (760, "WALMART")]:
    draw.text((605, y - 93), title, font=font(16, True), fill=MUTED)

draw.rounded_rectangle((1650, 415, 1840, 600), radius=18, fill="#1E2D25", outline=EDGE, width=2)
draw.text((1675, 440), "OUTPUT", font=font(17, True), fill=EDGE)
draw.text((1675, 478), "1 merged item", font=font(22, True), fill=WHITE)
draw.text((1675, 520), "Wayfair   10", font=font(18), fill=MUTED)
draw.text((1675, 550), "Amazon    10", font=font(18), fill=MUTED)
draw.text((1675, 580), "Walmart   10", font=font(18), fill=MUTED)
draw.line((1566, 505, 1650, 505), fill=EDGE, width=4)

draw.rounded_rectangle((55, 895, 1845, 960), radius=16, fill="#202820", outline="#355B45", width=2)
draw.text((85, 915), "✓ Workflow executed successfully in n8n · All 9 nodes completed · Three retailer branches merged by position", font=font(22, True), fill="#78E0A7")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUTPUT, quality=95)
print(OUTPUT)
