#!/usr/bin/env python3
"""
Generate sitemap.xml from top-level HTML files.
- Base URL defaults to https://www.sojon.org (override with BASE_URL env var)
- lastmod uses file mtime by default, or today when --set-today is passed
- changefreq/priority are assigned via a simple per-page map with sensible defaults
"""
from __future__ import annotations
import os
import sys
import argparse
import pathlib
import datetime as dt
from xml.etree.ElementTree import Element, SubElement, ElementTree

ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_BASE = os.getenv("BASE_URL", "https://www.sojon.org")

# Map per-file settings (without leading slash)
SETTINGS = {
    "index.html": ("weekly", "1.0"),
    "index-2.html": ("weekly", "0.7"),
    "index-3.html": ("weekly", "0.7"),
    "about.html": ("monthly", "0.8"),
    "service.html": ("monthly", "0.8"),
    "service-details.html": ("monthly", "0.6"),
    "portfolio.html": ("monthly", "0.7"),
    "portfolio-details.html": ("monthly", "0.6"),
    "blog.html": ("weekly", "0.7"),
    "blog-details.html": ("weekly", "0.5"),
    "team.html": ("monthly", "0.6"),
    "team-details.html": ("monthly", "0.4"),
    "donate.html": ("weekly", "0.9"),
    "contact.html": ("monthly", "0.8"),
    "404.html": ("yearly", "0.1"),
}
DEFAULT_CHANGEFREQ = "monthly"
DEFAULT_PRIORITY = "0.5"


def iso_date(d: dt.date) -> str:
    return d.isoformat()


def file_mdate(path: pathlib.Path) -> str:
    ts = path.stat().st_mtime
    return dt.date.fromtimestamp(ts).isoformat()


def collect_pages(root: pathlib.Path) -> list[pathlib.Path]:
    # Only top-level HTML files (exclude assets/, etc.)
    return sorted([p for p in root.glob("*.html") if p.is_file()])


def build_sitemap(base_url: str, pages: list[pathlib.Path], set_today: bool) -> Element:
    urlset = Element("urlset", {
        "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9"
    })
    today = dt.date.today().isoformat()

    for page in pages:
        name = page.name
        loc = base_url.rstrip("/") + "/"
        if name != "index.html":
            loc += name
        
        changefreq, priority = SETTINGS.get(name, (DEFAULT_CHANGEFREQ, DEFAULT_PRIORITY))
        lastmod = today if set_today else file_mdate(page)

        url_el = SubElement(urlset, "url")
        SubElement(url_el, "loc").text = loc
        SubElement(url_el, "lastmod").text = lastmod
        SubElement(url_el, "changefreq").text = changefreq
        SubElement(url_el, "priority").text = priority
    return urlset


def write_xml(elem: Element, out_path: pathlib.Path) -> None:
    tree = ElementTree(elem)
    # Ensure pretty newlines/indentation (simple, compatible)
    try:
        import xml.dom.minidom as minidom
        rough = ElementTree.tostring(elem, encoding="utf-8")  # type: ignore[attr-defined]
        reparsed = minidom.parseString(rough)
        out_path.write_text(reparsed.toprettyxml(indent="  "), encoding="utf-8")
    except Exception:
        tree.write(out_path, encoding="utf-8", xml_declaration=True)


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Generate sitemap.xml from HTML files")
    parser.add_argument("--base-url", default=DEFAULT_BASE, help="Base site URL, default from BASE_URL env or https://www.sojon.org")
    parser.add_argument("--set-today", action="store_true", help="Set lastmod to today's date for all pages")
    parser.add_argument("--output", default=str(ROOT / "sitemap.xml"), help="Output sitemap path")
    args = parser.parse_args(argv)

    base = args.base_url.rstrip("/")
    pages = collect_pages(ROOT)
    if not pages:
        print("No HTML pages found at repo root.")
        return 1

    urlset = build_sitemap(base, pages, set_today=args.set_today)
    out_path = pathlib.Path(args.output)
    write_xml(urlset, out_path)
    print(f"Wrote sitemap to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
