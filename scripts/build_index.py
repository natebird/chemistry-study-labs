#!/usr/bin/env python3
"""Rebuild index.html and the terms/ pages from scripts/topics.py and READY in assets/lab.js.

Run from anywhere:  python3 scripts/build_index.py
Each lab's card text comes from its <meta name="description">, falling back to its lede.
The topic list itself lives in three places that must agree: scripts/topics.py (this script),
TOPICS in assets/lab.js, and UNITS in assets/glossary.js.
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ns = {}
exec(open(os.path.join(ROOT, "scripts/topics.py"), encoding="utf-8").read(), ns)
UNITS = ns["UNITS"]
js = open(os.path.join(ROOT, "assets/lab.js"), encoding="utf-8").read()
ready = json.loads(re.search(r"var READY = (\[[^\]]*\]);", js).group(1))
N = len(UNITS)
HEAD = '''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{p}assets/lab.css?v=1">
<script src="{p}assets/prefs.js?v=2"></script>'''
GLOSS_SCRIPTS = "\n".join(f'<script src="../assets/glossary/unit-{u}.js"></script>' for u in UNITS)

def esc(t): return html.escape(t, quote=False)

def blurb(path):
    try:
        s = open(path, encoding="utf-8").read()
    except FileNotFoundError:
        return ""
    m = re.search(r'<meta name="description" content="([^"]+)"', s) or re.search(r'<p class="lede">(.*?)</p>', s, re.S)
    if not m:
        return ""
    text = re.sub(r"<[^>]+>", "", m.group(1)).strip()
    first = re.split(r"(?<=[.!?])\s", text)[0]
    return esc(html.unescape(first))

# ---------- index.html ----------
units_html = []
for u, (title, weight, ts) in UNITS.items():
    head = f'''  <div class="unit-head">
    <h2 id="unit-{u}" style="font-size:1.4rem;"><span class="num">Unit {u}</span> {esc(title)}</h2>
    <span class="meta">{weight} of the multiple-choice section · <a href="terms/unit-{u}.html">Unit {u} terms</a></span>
  </div>'''
    if u in ready:
        cards = "\n".join(
            f'    <a class="card lab-card" href="labs/{f}.html"><span class="num">Topic {i}</span><h3>{esc(t)}</h3><p>{blurb(os.path.join(ROOT, "labs", f + ".html"))}</p><span class="go">Open lab →</span></a>'
            for i, f, t in ts)
        body = f'  <div class="labs">\n{cards}\n  </div>'
    else:
        items = " · ".join(f"{i} {esc(t)}" for i, f, t in ts)
        body = f'  <p class="soon">Labs for this unit are on the way ({items}). The <a href="terms/unit-{u}.html">Unit {u} terminology guide</a> is ready now.</p>'
    units_html.append(f'<section aria-labelledby="unit-{u}" class="unit">\n{head}\n{body}\n</section>')

n_labs = sum(len(ts) for u, (t, w, ts) in UNITS.items() if u in ready)
n_all = sum(len(ts) for t, w, ts in UNITS.values())
jump = " ".join(f'<a href="#unit-{u}">Unit {u}</a>' for u in UNITS)
term_cards = "\n".join(f'    <a class="card" href="terms/unit-{u}.html"><span class="num">Unit {u}</span><b>{esc(t)}</b></a>' for u, (t, w, ts) in UNITS.items())
page = f'''<!DOCTYPE html>
<html lang="en">
<head>
{HEAD.format(p="")}
<title>AP Chemistry Study Labs</title>
<meta name="description" content="Interactive study labs and terminology guides for AP Chemistry.">
<style>
.labs {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }}
.lab-card {{ display: grid; gap: 8px; text-decoration: none; color: var(--ink); align-content: start; }}
.lab-card:hover {{ border-color: var(--accent); }}
.lab-card:focus-visible {{ outline: 3px solid var(--accent); outline-offset: 2px; }}
.lab-card .num, .unit-head .num {{ font-family: var(--mono); font-size: .8rem; color: var(--accent); }}
.lab-card p {{ color: var(--muted); font-size: .94rem; }}
.lab-card .go {{ color: var(--accent); font-weight: 500; font-size: .9rem; }}
.unit-head {{ display: grid; gap: 4px; border-bottom: 1px solid var(--rule); padding-bottom: 8px; }}
.unit-head .meta {{ font-size: .88rem; color: var(--muted); }}
.unit-head a, .soon a, .jump a {{ color: var(--accent); }}
.soon {{ color: var(--muted); }}
.jump {{ display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: .92rem; }}
.unit {{ scroll-margin-top: 16px; }}
footer {{ color: var(--muted); font-size: .86rem; border-top: 1px solid var(--rule); padding-top: 16px; }}
</style>
</head>
<body>
<div class="wrap">

<header>
  <span class="kicker">AP Chemistry</span>
  <h1>AP Chemistry Study Labs</h1>
  <p class="lede">Interactive study labs for the AP Chemistry course, one for each topic. Each lab has a hands-on model or calculator, a running explanation of what changed and why, a reference table, FRQ tips, common mistakes, practice questions, and the key terms for that topic.</p>
  <nav class="jump" aria-label="Jump to a unit">{jump} <a href="terms/index.html">All terms</a></nav>
</header>

<section aria-labelledby="terms-h">
  <div style="display:grid; gap:6px;">
    <h2 id="terms-h" style="font-size:1.3rem;">Terminology guides</h2>
    <p style="color:var(--muted); max-width:70ch;">Every key term in the course, with search, flashcards, and a self-quiz.</p>
  </div>
  <div class="unit-cards">
    <a class="card" href="terms/index.html"><span class="num">All units</span><b>Master terminology guide</b><span class="meta">Search and study every term in the course</span></a>
{term_cards}
  </div>
</section>

{chr(10).join(units_html)}

<footer>Topics follow the College Board AP Chemistry Course and Exam Description (fall 2024 revision). Simulations use simplified teaching models; constants and molar masses match the AP reference sheet. {n_labs} of {n_all} labs are live.</footer>

</div>
</body>
</html>
'''
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(page)

# ---------- terms pages ----------
def terms_nav(cur):
    links = [f'<a href="index.html"{" aria-current=\"page\"" if cur == 0 else ""}>All units</a>']
    for u, (t, w, ts) in UNITS.items():
        links.append(f'<a href="unit-{u}.html" title="Unit {u}: {esc(t)}"{" aria-current=\"page\"" if cur == u else ""}>Unit {u}</a>')
    return f'<div class="topnav"><a href="../index.html">← Study labs home</a><nav class="topics" aria-label="Terminology guides">{"".join(links)}</nav></div>'

def terms_page(title, nav, kicker, h1, lede, extra, mount, pager):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
{HEAD.format(p="../")}
<title>{esc(title)}</title>
</head>
<body>
<div class="wrap">
{nav}

<header>
  <span class="kicker">{kicker}</span>
  <h1>{h1}</h1>
  <p class="lede">{lede}</p>
</header>
{extra}
<section aria-label="Terms">
  <div id="glossary"></div>
</section>

<div class="pager">{pager}</div>
</div>
{GLOSS_SCRIPTS}
<script src="../assets/lab.js?v=1"></script>
<script src="../assets/glossary.js?v=1"></script>
<script>{mount}</script>
</body>
</html>
'''

os.makedirs(os.path.join(ROOT, "terms"), exist_ok=True)
cards = "\n".join(f'    <a class="card" href="unit-{u}.html"><span class="num">Unit {u} · {w}</span><b>{esc(t)}</b><span class="meta" data-unit-count="{u}"></span></a>' for u, (t, w, ts) in UNITS.items())
count_js = 'document.querySelectorAll("[data-unit-count]").forEach(function (e) { var u = +e.getAttribute("data-unit-count"); var n = (window.GLOSSARY || []).filter(function (x) { return x.u === u; }).length; e.textContent = n ? n + " terms" : ""; });'
open(os.path.join(ROOT, "terms/index.html"), "w", encoding="utf-8").write(terms_page(
    "AP Chemistry Terms: All Units", terms_nav(0), "AP Chemistry · All units", "Master terminology guide",
    f"Every key term from all {N} units of AP Chemistry in one place. Search across the whole course, filter by unit or topic, and study with flashcards or a quick quiz. The percentages show each unit's share of the multiple-choice section.",
    f'\n<section aria-label="Unit guides">\n  <div class="unit-cards">\n{cards}\n  </div>\n</section>\n',
    'Glossary.mount(document.getElementById("glossary"), { storageKey: "all" });\n' + count_js,
    '<a href="../index.html">← Study labs home</a><a href="unit-1.html">Unit 1 terms →</a>'))
keys = list(UNITS)
for k, u in enumerate(keys):
    t, w, ts = UNITS[u]
    prev = f'<a href="unit-{keys[k-1]}.html">← Unit {keys[k-1]} terms</a>' if k else '<a href="index.html">← All units</a>'
    nxt = f'<a href="unit-{keys[k+1]}.html">Unit {keys[k+1]} terms →</a>' if k + 1 < len(keys) else '<a href="index.html">All units →</a>'
    open(os.path.join(ROOT, f"terms/unit-{u}.html"), "w", encoding="utf-8").write(terms_page(
        f"Unit {u} Terms: {t}", terms_nav(u), f"AP Chemistry · Unit {u} · {w} of the exam", f"Unit {u} terminology guide",
        f"Every key term for <b>{esc(t)}</b>, grouped by topic. Read the list, flip through flashcards, or quiz yourself. Flashcard progress is saved in this browser.",
        "", f'Glossary.mount(document.getElementById("glossary"), {{ units: [{u}], storageKey: "unit-{u}" }});', prev + nxt))

print(f"index.html and {len(keys) + 1} terms pages rebuilt: units ready {ready}, {n_labs} labs")
