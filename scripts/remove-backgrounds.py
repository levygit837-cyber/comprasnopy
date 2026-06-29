#!/usr/bin/env python3
"""
Viana Pharmacy — background removal for product photos.

Reads every *.png/*.jpg in assets/products/ and writes a transparent
cutout (.png) of the same name to src/assets/products/, removing the
background with rembg (on-device neural net, u2net model by default) and
cropping the cutout to the tight bounding box of its non-transparent
pixels so no empty void surrounds the product.

Setup (one time):
    pip install "rembg[cpu]"

Run:
    npm run images:bg        # or: python3 scripts/remove-backgrounds.py

Idempotent: skips an output if it already exists and is newer than the
source, so you can drop new photos in assets/products/ and re-run safely.

Re-trim existing cutouts in place (no rembg call):
    npm run images:trim
    python3 scripts/remove-backgrounds.py --trim-only

Higher-quality model (slower, better hair/edges) — swap the MODEL arg:
    python3 scripts/remove-backgrounds.py --model birefnet
"""
from __future__ import annotations

import argparse
import io
import sys
from pathlib import Path

# Root of the repo (this file lives in scripts/).
ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets" / "products"
OUT_DIR = ROOT / "src" / "assets" / "products"
EXTS = (".png", ".jpg", ".jpeg", ".webp")
MODEL_DEFAULT = "u2net"


def trim_transparent_padding(data: bytes) -> bytes:
    """Crop a PNG/JPEG byte stream to the tight bounding box of its non-
    transparent pixels. Skips images with no alpha channel (no-op).

    Uses Pillow (a rembg dependency) — no extra install steps.
    """
    from PIL import Image  # type: ignore

    im = Image.open(io.BytesIO(data))
    has_alpha = im.mode in ("RGBA", "LA") or (
        im.mode == "P" and "transparency" in im.info
    )
    if not has_alpha:
        return data
    im = im.convert("RGBA")
    bbox = im.split()[-1].getbbox()  # alpha channel: tight box of non-zero alpha
    if not bbox:
        return data  # fully transparent — leave unchanged
    trimmed = im.crop(bbox)
    buf = io.BytesIO()
    trimmed.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--model",
        default=MODEL_DEFAULT,
        help=f"rembg model (default {MODEL_DEFAULT}; birefnet for higher quality)",
    )
    parser.add_argument(
        "--trim-only",
        action="store_true",
        help="Re-trim existing cutouts in src/assets/products/ without "
             "running rembg. Useful after a transparent-padding audit.",
    )
    args = parser.parse_args()

    try:
        from rembg import remove, new_session  # type: ignore
    except ImportError:
        if not args.trim_only:
            print(
                "ERROR: rembg is not installed.\n"
                '  Install it once with:  pip install "rembg[cpu]"',
                file=sys.stderr,
            )
            return 1

    if args.trim_only:
        return trim_existing()

    if not SRC_DIR.exists():
        print(f"ERROR: source directory not found: {SRC_DIR}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = sorted(
        p
        for p in SRC_DIR.iterdir()
        if p.suffix.lower() in EXTS and not p.name.startswith(".")
    )
    if not sources:
        print(f"No images found in {SRC_DIR}")
        return 0

    session = new_session(args.model)
    processed = 0
    skipped = 0

    for src in sources:
        out = OUT_DIR / f"{src.stem}.png"
        if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
            print(f"  skip  {src.name}  (cutout up to date)")
            skipped += 1
            continue

        data = src.read_bytes()
        cutout = remove(data, session=session)
        cutout = trim_transparent_padding(cutout)
        out.write_bytes(cutout)
        print(f"  ok    {src.name} -> {out.relative_to(ROOT)}")
        processed += 1

    print(
        f"\nDone. {processed} processed, {skipped} skipped, "
        f"{len(sources)} total in {OUT_DIR.relative_to(ROOT)}."
    )
    return 0


def trim_existing() -> int:
    """Re-trim every cutout in src/assets/products/ to its alpha bbox."""
    if not OUT_DIR.exists():
        print(f"ERROR: cutout directory not found: {OUT_DIR}", file=sys.stderr)
        return 1
    cutouts = sorted(p for p in OUT_DIR.iterdir() if p.suffix.lower() in EXTS and not p.name.startswith("."))
    if not cutouts:
        print(f"No cutouts found in {OUT_DIR}")
        return 0
    processed = 0
    skipped = 0
    for cutout in cutouts:
        data = cutout.read_bytes()
        trimmed = trim_transparent_padding(data)
        if trimmed == data:
            skipped += 1
            continue
        from PIL import Image  # type: ignore
        before_size = Image.open(io.BytesIO(data)).size
        after_size = Image.open(io.BytesIO(trimmed)).size
        delta = "shrunk" if len(trimmed) < len(data) else "grew"
        print(f"  ok    {cutout.name}  {before_size} -> {after_size}  ({delta}, {len(data)} -> {len(trimmed)} bytes)")
        cutout.write_bytes(trimmed)
        processed += 1
    print(
        f"\nDone. {processed} re-trimmed, {skipped} unchanged, "
        f"{len(cutouts)} total in {OUT_DIR.relative_to(ROOT)}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
