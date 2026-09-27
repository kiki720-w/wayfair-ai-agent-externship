from __future__ import annotations

import html
from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "tmp" / "project4-inputs"


def convert(source: Path, title: str, filename: str) -> None:
    with pdfplumber.open(source) as pdf:
        pages = [page.extract_text() or "" for page in pdf.pages]
    sections = []
    for page_number, text in enumerate(pages, 1):
        paragraphs = "\n".join(
            f"<p>{html.escape(line)}</p>" for line in text.splitlines() if line.strip()
        )
        sections.append(f'<section data-page="{page_number}"><h2>Page {page_number}</h2>{paragraphs}</section>')
    document = (
        "<!doctype html><html><head><meta charset=\"utf-8\"><title>"
        + html.escape(title)
        + "</title></head><body><h1>"
        + html.escape(title)
        + "</h1>"
        + "".join(sections)
        + "</body></html>"
    )
    (OUTPUT / filename).write_text(document, encoding="utf-8")


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    convert(ROOT / "output" / "pdf" / "area-rug-trend-report-2026-09-27.pdf",
            "Project 2 - Area Rug Trend Report", "project-2-area-rug-trend-report.html")
    convert(ROOT / "output" / "pdf" / "wayfair-competitor-monitoring-report.pdf",
            "Project 3 - Wayfair Competitor Monitoring Report", "project-3-competitor-report.html")
    for path in sorted(OUTPUT.glob("*.html")):
        print(path)
