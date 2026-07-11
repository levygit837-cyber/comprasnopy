#!/usr/bin/env python3
"""Import the supplier PDF as structured product data and verified WebP assets.

The script never synthesizes packaging. Product pixels come directly from the
embedded PDF image. The presentation layer only removes the connected outer
background, scales the cutout, and places it on a Viana-colored canvas.
"""

from __future__ import annotations

import argparse
import io
import json
import re
import unicodedata
from collections import deque
from pathlib import Path
from typing import Any

import pdfplumber
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from pypdf import PdfReader


PAGE_TOP = 100
PAGE_BOTTOM = 979
COLS = 4
ROWS = 3
CANVAS_SIZE = 800
BACKGROUND = (242, 247, 244, 255)
ACCENT = (194, 105, 61, 255)


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")


def localized(value: str) -> dict[str, str]:
    return {"es": value, "pt": value, "en": value}


def parse_card(text: str, page_number: int, slot: int) -> dict[str, Any] | None:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return None

    has_image = "SIN IMAGEN" not in lines
    lines = [line for line in lines if line != "SIN IMAGEN"]
    price_index = next((i for i, line in enumerate(lines) if line.startswith("U$")), -1)
    code_index = next((i for i, line in enumerate(lines) if line.startswith("Cod:")), -1)
    if price_index <= 0 or code_index < 0:
        raise ValueError(f"Unable to parse page {page_number}, slot {slot + 1}: {lines}")

    name = " ".join(lines[:price_index]).rstrip("*").strip()
    price_match = re.search(r"U\$\s*([0-9]+(?:[.,][0-9]+)?)", lines[price_index])
    code_match = re.search(r"Cod:\s*([0-9]+)", lines[code_index])
    if not price_match or not code_match:
        raise ValueError(f"Missing price or code on page {page_number}, slot {slot + 1}")

    code = code_match.group(1)
    return {
        "id": f"supplier-{code}",
        "slug": f"{slugify(name)}-{code}",
        "name": localized(name),
        "desc": {
            "es": "Presentacion segun el catalogo del proveedor. Confirma disponibilidad por WhatsApp.",
            "pt": "Apresentacao conforme o catalogo do fornecedor. Confirme a disponibilidade pelo WhatsApp.",
            "en": "Presentation as listed by the supplier. Confirm availability on WhatsApp.",
        },
        "priceUSD": float(price_match.group(1).replace(",", ".")),
        "category": categorize(name),
        "image": "",
        "sku": code,
        "lab": find_lab(name),
        "source": {
            "kind": "supplier-pdf",
            "document": "Product_List (7).pdf",
            "page": page_number,
            "slot": slot + 1,
        },
        "imageStatus": "verified-source" if has_image else "awaiting-reference",
    }


def categorize(name: str) -> str:
    upper = name.upper()
    if upper.startswith(("ACIDO HIALURONICO", "BOTOX")):
        return "estetica-dermocosmetica"
    if upper.startswith("ANAB ") or upper.startswith("TESTO "):
        return "esteroides-anabolicos"
    if upper.startswith(("RETATRUTIDE", "TIRZEPATIDA")):
        return "hormonas-peptidos"
    if upper.startswith("ESTI CLEMB"):
        return "metabolicos-quemagrasas"
    if upper.startswith("TADALAFILA"):
        return "moduladores-hormonales"
    if upper.startswith("MED "):
        if "CBD" in upper:
            return "bienestar-antienvejecimiento"
        return "moduladores-hormonales"
    if upper.startswith("PEP "):
        if any(token in upper for token in ("BPC", "TB-500", "GHK-CU", "SS31", "KPV", "GLOW", "EPITALON")):
            return "regeneracion-reparacion"
        if any(token in upper for token in ("NAD+", "WELLNESS")):
            return "bienestar-antienvejecimiento"
        return "hormonas-peptidos"
    return "farmacia-cuidados"


def find_lab(name: str) -> str | None:
    upper = name.upper()
    labs = (
        "ALPHA PHARMA",
        "NATURALLIFE",
        "SAFEPROLABS",
        "PEPTIDE SCIENCES",
        "SK BIO",
        "GEN-HEALTH",
        "BIOGENESIS",
        "BIOGENISIS",
        "LANDERLAN",
        "COOPER",
        "MEDPLUS",
        "SYNEDICA",
        "VELTRANE",
        "LIPOLAND",
        "LIPOLESS",
        "TIRZEDAL",
        "TIRZEC",
        "ALLUVI",
        "AUREX",
        "THERA",
        "GENIQ",
        "ZPHC",
        "LILLY",
        "MELINE",
        "BOTAONE",
        "DYSPORT",
        "ISRADERM",
    )
    return next((lab for lab in labs if lab in upper), None)


def page_card_images(page: Any) -> list[Image.Image | None]:
    cards: list[Image.Image | None] = []
    for embedded in page.images:
        image = embedded.image
        if image.size == (185, 342):
            cards.append(None)
            continue
        if cards and image.format == "JPEG" and 145 <= image.width <= 210 and 175 <= image.height <= 210:
            cards[-1] = image.convert("RGB")
    return cards


def background_color(source: Image.Image) -> tuple[int, int, int]:
    rgb = source.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    border: list[tuple[int, int, int]] = []
    for x in range(width):
        border.append(pixels[x, 0])
        border.append(pixels[x, height - 1])
    for y in range(height):
        border.append(pixels[0, y])
        border.append(pixels[width - 1, y])
    return tuple(sorted(channel)[len(channel) // 2] for channel in zip(*border))


def trim_to_content(source: Image.Image) -> Image.Image:
    rgb = source.convert("RGB")
    background = background_color(rgb)
    flat = Image.new("RGB", rgb.size, background)
    difference = ImageChops.difference(rgb, flat)
    mask = difference.convert("L").point(lambda value: 255 if value >= 10 else 0)
    bbox = mask.getbbox()
    if not bbox:
        return rgb

    padding = max(8, int(max(rgb.size) * 0.07))
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(rgb.width, bbox[2] + padding)
    bottom = min(rgb.height, bbox[3] + padding)
    return rgb.crop((left, top, right, bottom))


def connected_background_alpha(source: Image.Image) -> Image.Image:
    image = trim_to_content(source).convert("RGBA")
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    background = background_color(rgb)

    def is_background(x: int, y: int) -> bool:
        pixel = pixels[x, y]
        distance = sum((pixel[i] - background[i]) ** 2 for i in range(3)) ** 0.5
        return distance <= 28

    queue: deque[tuple[int, int]] = deque()
    visited = bytearray(width * height)
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    alpha = Image.new("L", (width, height), 255)
    alpha_pixels = alpha.load()
    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if visited[index]:
            continue
        visited[index] = 1
        if not is_background(x, y):
            continue
        alpha_pixels[x, y] = 0
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    alpha = alpha.filter(ImageFilter.GaussianBlur(0.45))
    image.putalpha(alpha)
    bbox = image.getbbox()
    return image.crop(bbox) if bbox else image


def fit(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    scale = min(max_width / image.width, max_height / image.height)
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(size, Image.Resampling.LANCZOS)


def render_asset(source: Image.Image, detail: bool = False) -> Image.Image:
    cutout = connected_background_alpha(source)
    target = fit(cutout, 680 if detail else 610, 650 if detail else 590)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), BACKGROUND)

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_width = max(180, int(target.width * 0.72))
    shadow_draw.ellipse(
        (
            (CANVAS_SIZE - shadow_width) // 2,
            655,
            (CANVAS_SIZE + shadow_width) // 2,
            690,
        ),
        fill=(8, 72, 53, 42),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas.alpha_composite(shadow)

    x = (CANVAS_SIZE - target.width) // 2
    y = max(55, 365 - target.height // 2)
    canvas.alpha_composite(target, (x, y))
    ImageDraw.Draw(canvas).rectangle((0, CANVAS_SIZE - 7, CANVAS_SIZE, CANVAS_SIZE), fill=ACCENT)
    return canvas.convert("RGB")


def extract_records(pdf_path: Path, image_dir: Path) -> list[dict[str, Any]]:
    image_dir.mkdir(parents=True, exist_ok=True)
    pdf_reader = PdfReader(str(pdf_path))
    records: list[dict[str, Any]] = []

    with pdfplumber.open(str(pdf_path)) as document:
        for page_index, (text_page, image_page) in enumerate(zip(document.pages, pdf_reader.pages)):
            x_edges = [text_page.width * index / COLS for index in range(COLS + 1)]
            y_edges = [PAGE_TOP + (PAGE_BOTTOM - PAGE_TOP) * index / ROWS for index in range(ROWS + 1)]
            images = page_card_images(image_page)
            slot = 0
            for row in range(ROWS):
                for col in range(COLS):
                    cell = text_page.crop((x_edges[col], y_edges[row], x_edges[col + 1], y_edges[row + 1]))
                    parsed = parse_card(cell.extract_text(x_tolerance=2, y_tolerance=2) or "", page_index + 1, slot)
                    source_image = images[slot] if slot < len(images) else None
                    slot += 1
                    if parsed is None:
                        continue

                    if source_image is not None:
                        full_name = f"{parsed['id']}-full.webp"
                        detail_name = f"{parsed['id']}-detail.webp"
                        render_asset(source_image).save(image_dir / full_name, "WEBP", quality=88, method=6)
                        render_asset(source_image, detail=True).save(image_dir / detail_name, "WEBP", quality=88, method=6)
                        parsed["images"] = [
                            f"/images/products/verified/{full_name}",
                            f"/images/products/verified/{detail_name}",
                        ]
                    else:
                        parsed["imageStatus"] = "awaiting-reference"
                    records.append(parsed)

    return records


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--data-out", type=Path, required=True)
    parser.add_argument("--image-dir", type=Path, required=True)
    args = parser.parse_args()

    records = extract_records(args.pdf, args.image_dir)
    args.data_out.parent.mkdir(parents=True, exist_ok=True)
    args.data_out.write_text(json.dumps(records, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")

    with_images = sum(1 for record in records if record.get("images"))
    print(f"Imported {len(records)} products: {with_images} with verified PDF images, {len(records) - with_images} awaiting reference.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
