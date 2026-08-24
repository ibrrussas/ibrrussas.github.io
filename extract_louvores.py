#!/usr/bin/env python3
"""
Extracts hymn lyrics from .docx files and generates louvores_data.js
"""
import os
import json
import re
from docx import Document

LOUVORES_DIR = "docs/lista_louvores/Textos_Louvores"
OUTPUT_FILE = "louvores_data.js"


def extract_hymn(filepath):
    """Extract hymn data from a .docx file."""
    try:
        doc = Document(filepath)
    except Exception as e:
        print(f"  ERROR reading {filepath}: {e}")
        return None

    paragraphs = doc.paragraphs
    if not paragraphs:
        return None

    # First paragraph is the title
    title = paragraphs[0].text.strip()
    if not title:
        # Use filename as title fallback
        title = os.path.splitext(os.path.basename(filepath))[0]

    sections = []
    for p in paragraphs[1:]:
        text = p.text.strip()
        if not text:
            continue

        # Check if this paragraph has bold+italic formatting (refrão)
        has_bold = False
        has_italic = False
        for run in p.runs:
            if run.bold:
                has_bold = True
            if run.italic:
                has_italic = True

        is_refrao = has_bold and has_italic

        # Check if text is just a reference like [REFRÃO] or [REFRÃO 2X]
        is_ref = bool(re.match(r'^\[REF(RÃO|RAO).*\]$', text.strip(), re.IGNORECASE))
        
        # Check for repeat instructions like [REPETE TODA]
        is_instruction = bool(re.match(r'^\[.+\]$', text.strip()))

        sections.append({
            "text": text,
            "isRefrao": is_refrao,
            "isRef": is_ref,
            "isInstruction": is_instruction and not is_ref
        })

    return {
        "title": title,
        "sections": sections
    }


def main():
    hymns = []
    files = sorted(os.listdir(LOUVORES_DIR))

    for fname in files:
        if not fname.endswith(".docx"):
            continue
        if fname.startswith("~$"):  # skip temp files
            continue
        if fname.endswith(".lnk"):  # skip shortcuts
            continue

        filepath = os.path.join(LOUVORES_DIR, fname)
        print(f"Processing: {fname}")
        hymn = extract_hymn(filepath)
        if hymn:
            hymns.append(hymn)

    # Sort alphabetically by title (case-insensitive)
    hymns.sort(key=lambda h: h["title"].upper())

    # Write JS data file
    js_content = "// Auto-generated hymn data\nconst LOUVORES_DATA = "
    js_content += json.dumps(hymns, ensure_ascii=False, indent=2)
    js_content += ";\n"

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\nExtracted {len(hymns)} hymns to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
