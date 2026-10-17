"""Build the three supplied late-season write-ups and add them to trails.json."""

from pathlib import Path
import json
import re
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import KeepTogether, Paragraph, SimpleDocTemplate, Spacer


ROOT = Path(__file__).resolve().parents[1]
SEASONS = [
    {
        "source": ROOT / "content/season-14-hallowed-peak-2025.md",
        "id": "2025-autumn",
        "year": 2025,
        "season": "Autumn",
        "title": "Hallowed Peak",
        "pdf": "pdfs/2025/Hallowed Peak 2025 Write Up.pdf",
    },
    {
        "source": ROOT / "content/season-15-wintermas-2025.md",
        "id": "2025-winter",
        "year": 2025,
        "season": "Winter",
        "title": "Wintermas",
        "pdf": "pdfs/2025/Wintermas 2025 Write Up.pdf",
    },
    {
        "source": ROOT / "content/season-16-the-great-undoing-2026.md",
        "id": "2026-finale",
        "year": 2026,
        "season": "Finale",
        "title": "The Great Undoing",
        "pdf": "pdfs/2026/The Great Undoing Write Up.pdf",
    },
]


def parse_source(path):
    text = path.read_text(encoding="utf-8")
    matches = list(re.finditer(r"(?m)^## (\d+)\. (.+)$", text))
    entries = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        block = text[match.end():end].strip()
        lines = block.splitlines()
        fields = {}
        for line in lines[:3]:
            key, sep, value = line.partition(": ")
            if sep:
                fields[key] = value.strip()
        title = match.group(2).strip()
        secret = title.endswith(" · Secret trail")
        if secret:
            title = title.removesuffix(" · Secret trail")
        recap = " ".join(line.strip() for line in lines[3:] if line.strip())
        if not recap or not fields.get("Main character"):
            raise ValueError(f"Incomplete trail {path.name}: {title}")
        entries.append({
            "number": int(match.group(1)),
            "title": title,
            "main": fields["Main character"],
            "others": [part.strip() for part in fields.get("Other characters", "").split(",") if part.strip()],
            "themes": [part.strip() for part in fields.get("Themes", "").split(",") if part.strip()],
            "recap": recap,
            "secret": secret,
        })
    if [entry["number"] for entry in entries] != list(range(1, len(entries) + 1)):
        raise ValueError(f"Trail numbers are incomplete in {path.name}")
    return entries


def make_pdf(season, entries):
    destination = ROOT / season["pdf"]
    destination.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(destination), pagesize=A4, rightMargin=22 * mm, leftMargin=22 * mm,
        topMargin=23 * mm, bottomMargin=23 * mm,
        title=f"Phantom Peak: {season['title']} {season['year']}",
        author="Phantom Peak Explorers Club",
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ArchiveTitle", parent=styles["Title"], fontName="Times-Bold",
        fontSize=23, leading=27, textColor=colors.HexColor("#281a37"),
        spaceAfter=9 * mm, alignment=TA_CENTER,
    )
    intro_style = ParagraphStyle(
        "Intro", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9, leading=13, textColor=colors.HexColor("#665767"),
        spaceAfter=12 * mm, alignment=TA_CENTER,
    )
    heading_style = ParagraphStyle(
        "TrailHeading", parent=styles["Heading2"], fontName="Times-Bold",
        fontSize=14, leading=17, textColor=colors.HexColor("#9e3835"),
        spaceBefore=8 * mm, spaceAfter=2 * mm,
    )
    meta_style = ParagraphStyle(
        "TrailMeta", parent=styles["Normal"], fontName="Helvetica-Bold",
        fontSize=8, leading=12, textColor=colors.HexColor("#5f5361"),
        spaceAfter=3 * mm,
    )
    body_style = ParagraphStyle(
        "TrailBody", parent=styles["Normal"], fontName="Helvetica",
        fontSize=9.5, leading=14.4, textColor=colors.HexColor("#251a2e"),
        spaceAfter=5 * mm,
    )
    story = [
        Paragraph(escape(f"PHANTOM PEAK: {season['title'].upper()} ({season['year']})"), title_style),
        Paragraph(f"{len(entries)} trail recaps · Based on season notes supplied to the Explorers Club", intro_style),
    ]
    for entry in entries:
        heading = f"{entry['number']} · {entry['title']}"
        if entry["secret"]:
            heading += " · Secret trail"
        metadata = f"Main character: {entry['main']}"
        if entry["themes"]:
            metadata += f"  |  Themes: {', '.join(entry['themes'])}"
        story.append(KeepTogether([
            Paragraph(escape(heading), heading_style),
            Paragraph(escape(metadata), meta_style),
            Paragraph(escape(entry["recap"]), body_style),
        ]))
    story.append(Spacer(1, 5 * mm))

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#827586"))
        canvas.drawString(22 * mm, 14 * mm, "PHANTOM PEAK TRAIL ARCHIVE")
        canvas.drawRightString(A4[0] - 22 * mm, 14 * mm, str(doc.page))
        canvas.restoreState()

    document.build(story, onFirstPage=footer, onLaterPages=footer)
    return destination


def main():
    index_path = ROOT / "trails.json"
    existing = json.loads(index_path.read_text(encoding="utf-8"))
    prefixes = tuple(f"{season['id']}-" for season in SEASONS)
    original = [item for item in existing if not item["id"].startswith(prefixes)]
    added = []
    for season in SEASONS:
        entries = parse_source(season["source"])
        destination = make_pdf(season, entries)
        for entry in entries:
            summary = entry["recap"][:205].rsplit(" ", 1)[0].rstrip(" ,;:-")
            if len(entry["recap"]) > 205:
                summary += "…"
            added.append({
                "id": f"{season['id']}-{entry['number']}",
                "year": season["year"],
                "season": season["season"],
                "seasonTitle": season["title"],
                "number": entry["number"],
                "title": entry["title"],
                "summary": summary,
                "mainCharacter": entry["main"],
                "otherCharacters": entry["others"],
                "themes": entry["themes"],
                "searchText": entry["recap"],
                "pdf": season["pdf"],
                "image": None,
                "secret": entry["secret"],
            })
        print(f"{season['title']} {season['year']}: {len(entries)} trails, {destination}")
    index_path.write_text(json.dumps(original + added, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Indexed {len(original) + len(added)} trails")


if __name__ == "__main__":
    main()
