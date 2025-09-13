# Sojon Static Site

## SEO Utilities

### CI: Auto-generate sitemap
A GitHub Action regenerates `sitemap.xml` on every push to `main` (when HTML changes) and on manual dispatch.

Triggers:
- Push to `main` affecting `*.html`, `scripts/generate_sitemap.py`, or the workflow file.
- Manual run from the Actions tab.

It runs the Python generator with `--set-today` and commits `sitemap.xml` back to the repo.

### Regenerate sitemap.xml
Use the Python helper to regenerate `sitemap.xml` from the top-level HTML files.

Requirements: Python 3.9+

```bash
# macOS zsh examples
cd /Users/abdurrahman/Downloads/sojon
python3 scripts/generate_sitemap.py --set-today
# or with a custom base URL
BASE_URL="https://www.sojon.org" python3 scripts/generate_sitemap.py --set-today
```

Options:
- `--base-url`: default `https://www.sojon.org` (or `BASE_URL` env)
- `--set-today`: sets all `<lastmod>` to today’s date
- `--output`: path to write the sitemap (default `sitemap.xml` at repo root)

### Robots
`robots.txt` already allows all bots and references the sitemap.
