#!/usr/bin/env python3
"""Download exact product-page images and convert them to responsive WebP.

Only explicitly reviewed product-to-page mappings are accepted. This avoids
fuzzy matching a similar name or dosage to the wrong physical presentation.
"""

from __future__ import annotations

import argparse
import io
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
from import_product_list import ACCENT, BACKGROUND, CANVAS_SIZE, trim_to_content  # noqa: E402


REVIEWED_MAPPINGS = {
    "epitalon-50mg": "/product-page/epithalon-50-mg-zphc-1frasco-50mg",
    "bpc-157-20mg": "/product-page/bpc-157-20-mg-1-frasco-20-mg",
    "tirzepatide-150mg": "/product-page/tirzepatide-zphc-150-mg-5-frascos-50-mg",
    "ll37": "/product-page/ll-37-25-mg-5-frasco-5-mg",
    "ultra-rehab-50mg": "/product-page/ultra-rehab-mix-50-mg-zphc-5-frasco-10-mg",
    "mots-c": "/product-page/mots-c-20-mg",
    "glow-pro-mix": "/product-page/glow",
    "melanotan-2-10mg": "/product-page/melanotan-ii-mt-2-1-frasco-10-mg",
    "super-slim-27mg": "/product-page/super-slim-mix-27-50-mg-5-frasco-11-mg",
    "hgh-fragment-5mg": "/product-page/hgh-fragment-176-191-5-mg-1-frasco-5-mg",
    "ghk-cu-60mg": "/product-page/ghk-cu-60-mg-1-frasco",
    "aod-9604-25mg": "/product-page/aod9604-25-mg-5-frascos-5-mg",
    "mega-mass-mix": "/product-page/mega-mass-mix-50-mg-5-frascos-10-mg",
    "ipamorelin": "/product-page/ipamorelin-25-mg-5-frascos-5-mg",
    "igf-1-1mg": "/product-page/igf-1-l3-1-mg-5-frascos-0-2mg",
    "tirzepatida-pen-75mg": "/product-page/tirzepatide-75-mg-caneta",
    "retatrutide-pen-60mg": "/product-page/retatrutide-caneta-zphc-cartucho-de-camara-dupla-agua-esteril",
    "nad-1000mg": "/product-page/nad-1000-mg-1-frasco",
    "tb-500-20mg": "/product-page/tb-500-20-mg-1-frasco-20-mg",
    "ghrp-6": "/product-page/ghrp-6-25-mg-5-frasco-5-mg",
}


def normalized_path(url: str) -> str:
    replacements = {
        "%C3%A2": "a",
        "%C3%A1": "a",
        "%C3%A3": "a",
        "%C3%A9": "e",
        "%C3%A9": "e",
        "%C3%AD": "i",
        "%C3%B3": "o",
        "%C3%BA": "u",
        "â": "a",
        "á": "a",
        "ã": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
    }
    value = url.lower()
    for source, target in replacements.items():
        value = value.replace(source.lower(), target)
    return value.rstrip("/")


def parse_sitemap(path: Path) -> dict[str, dict[str, Any]]:
    root = ET.parse(path).getroot()
    namespace = {
        "sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "image": "http://www.google.com/schemas/sitemap-image/1.1",
    }
    pages: dict[str, dict[str, Any]] = {}
    for url_node in root.findall("sm:url", namespace):
        location = url_node.findtext("sm:loc", default="", namespaces=namespace)
        images = [node.text for node in url_node.findall("image:image/image:loc", namespace) if node.text]
        pages[normalized_path(location)] = {"page": location, "images": images}
    return pages


def download(url: str) -> Image.Image:
    request = urllib.request.Request(url, headers={"User-Agent": "CompraspyCatalogAssetPipeline/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return Image.open(io.BytesIO(response.read())).convert("RGB")


def render(source: Image.Image) -> Image.Image:
    content = trim_to_content(source)
    content.thumbnail((720, 690), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), BACKGROUND)

    shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.ellipse((175, 655, 625, 695), fill=(8, 72, 53, 35))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(20)))

    x = (CANVAS_SIZE - content.width) // 2
    y = max(45, (CANVAS_SIZE - content.height) // 2 - 15)
    canvas.alpha_composite(content.convert("RGBA"), (x, y))
    ImageDraw.Draw(canvas).rectangle((0, CANVAS_SIZE - 7, CANVAS_SIZE, CANVAS_SIZE), fill=ACCENT)
    return canvas.convert("RGB")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sitemap", type=Path, required=True)
    parser.add_argument("--image-dir", type=Path, required=True)
    parser.add_argument("--manifest-out", type=Path, required=True)
    args = parser.parse_args()

    pages = parse_sitemap(args.sitemap)
    args.image_dir.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, Any] = {}

    for product_id, expected_path in REVIEWED_MAPPINGS.items():
        match = next((entry for key, entry in pages.items() if key.endswith(normalized_path(expected_path))), None)
        if not match:
            raise ValueError(f"Reviewed page missing from sitemap: {expected_path}")

        output_images: list[str] = []
        for index, image_url in enumerate(match["images"]):
            suffix = "full" if index == 0 else f"view-{index + 1}"
            filename = f"{product_id}-{suffix}.webp"
            render(download(image_url)).save(args.image_dir / filename, "WEBP", quality=88, method=6)
            output_images.append(f"/images/products/verified/{filename}")

        manifest[product_id] = {
            "images": output_images,
            "source": {"kind": "reviewed-product-page", "page": match["page"]},
        }
        print(f"ok {product_id}: {len(output_images)} image(s)")

    args.manifest_out.parent.mkdir(parents=True, exist_ok=True)
    args.manifest_out.write_text(json.dumps(manifest, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(f"Imported {len(manifest)} reviewed product pages.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
