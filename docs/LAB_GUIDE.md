# How a lab page is built

Every lab follows the same shape as the AP Macroeconomics labs (natebird/macroeconomics-study-labs, e.g. `labs/1-6-market-equilibrium.html`), adapted to chemistry. One self-contained HTML file per topic in `labs/`, named exactly as in `scripts/topics.py` (`N-k-slug.html`). No build step, no frameworks, no external JS. Plain HTML, CSS, and ES5-style JavaScript (`var`, `function`), same as the shared assets.

## Audience and voice

A high-school student taking AP Chemistry, studying on her own. Plain, direct sentences. Explain *why*, not just *what*. Say what the AP exam expects ("AP answer: …"). No filler, no exclamation marks, no emoji. Numbers, constants and molar masses match the AP Chemistry reference sheet (R = 0.08206 L·atm/(mol·K) = 8.314 J/(mol·K), Nₐ = 6.022 × 10²³, h = 6.626 × 10⁻³⁴ J·s, c = 2.998 × 10⁸ m/s, 1 atm = 760 torr). Accuracy matters more than anything else: every fact, number, explanation and answer key must be correct, and stay inside the scope of the fall 2024 AP Chemistry CED for that topic (note when something is beyond the exam).

## Page skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{Topic title} Study Lab</title>
<meta name="description" content="{One sentence: what the student does in this lab. Used on the home page card.}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/lab.css?v=1">
<script src="../assets/prefs.js?v=2"></script>
<style>/* page-specific styles only */</style>
</head>
<body>
<div class="wrap">
<div class="topnav" id="topnav"></div>
<header>
  <span class="kicker">AP Chemistry · Unit N · Topic N.k</span>
  <h1>{Topic title} Study Lab</h1>
  <p class="lede">{2–3 sentences: the big idea, then what the student will do.}</p>
</header>

<section> 1. The interactive lab (sec-head h2 + intro p, then .lab grid: a .card.graph-card with an <svg class="chart"> or other visual, and a .card side panel of controls / .scenarios buttons; then .lab-bar legend, .readout stats, and a <div class="story" id="story" aria-live="polite"> explanation that rewrites itself on every change and ends with an "AP answer:" line.)
<section> 2. Key ideas (.concepts grid of 5–6 .card each with <span class="tag">, <h3>, <p>)
<section> 3. A reference table / cheat sheet (.tbl-wrap > table)
<section> 4. FRQ tips (.two: "What earns points on the FRQ" list + "Common mistakes" list, 5–6 bullets each)
<section> 5. Practice questions (score + Start over button, <div class="quiz" id="quiz">)
<section> 6. Key terms (<div id="key-terms">, text links to ../terms/unit-N.html)
<div class="pager" id="pager"></div>
</div>
<script src="../assets/glossary/unit-1.js"></script> … through unit-9.js (all nine, in order)
<script src="../assets/glossary.js?v=1"></script>
<script src="../assets/lab.js?v=2"></script>
<script> (function () { "use strict"; … Lab.nav("N.k"); Lab.quiz(Q, …); })(); </script>
<script>Glossary.mount(document.getElementById("key-terms"), { units: [N], topic: "N.k", compact: true, storageKey: "topic-N.k" });</script>
</body>
</html>
```

Copy the exact section markup, class names, and quiz/score/reset wiring from the macro lab so every page looks the same. Use the macro CSS classes only (see `assets/lab.css`), plus the chemistry additions at the bottom of that file: `.ptable`, `.eqn`, `.chem`, `.particles`, `ol.steps`.

## The interactive lab (section 1) is the heart of the page

Make it something the student *does*, that responds instantly and explains itself: a simulator, a particle-level model, a calculator that shows its work step by step, a sorting/classifying game, a builder. Good examples: a mass-spectrum builder from isotope abundances; a PES spectrum you generate by picking an element; a gas-law piston with sliders; a titration curve you drive with a burette slider; a particle diagram of a solution before/after mixing; a stoichiometry "limiting reactant" mixer. Include preset scenario buttons (`.scenarios button[aria-pressed]`) that jump to the classic exam cases, plus free controls (range sliders in `.controls > .ctl`). Readouts in `.readout > .stat`. Animate with `Lab.animate` (it honors reduced motion). Draw diagrams in SVG with the `Lab` helpers; colors only via CSS variables (`var(--accent)`, `--c1` orange, `--c2` green, `--c3` purple, `--c4` magenta, `--good`, `--bad`, `--muted`, `--ghost`, `--ink`, `--surface`) so light/dark mode and the accent picker work.

## Shared helpers in `assets/lab.js` (global `Lab`)

- `Lab.nav("1.1")` fills `#topnav` and `#pager`. `Lab.quiz(Q, quizEl, scoreEl, resetBtn)` with `Q = [{ s: stem, o: [4 options], c: correctIndex, w: explanation }]`.
- SVG: `Lab.frame(svg, {x:[min,max], y:[min,max], xLabel, yLabel, xTicks, yTicks, fmtX, fmtY, width, height})` returns `F` with `sx`, `sy`, `g`; then `Lab.line(F, pts, color, w, dash)`, `Lab.fn(F, f, color, w, dash, steps)`, `Lab.vline`, `Lab.hline`, `Lab.tag(F, x, y, text, color, anchor)`, `Lab.dot(F, x, y, color, guides, xLabel, yLabel)`, `Lab.arrow(F, x1, y1, x2, y2, color)`, `Lab.rect(F, x0, y0, x1, y1, fill, opacity)`, `Lab.el(tag, attrs, parent, text)` for raw SVG. `Lab.bars(svg, {x, y, bars:[{x, y, color, label, width}], reverseX, ...})` for mass spectra, PES, composition bars.
- Chemistry: `Lab.ELEMENTS[z]` / `Lab.BY_SYMBOL["Fe"]` → `{ z, s, n, m (molar mass), en (Pauling), ie (first IE, kJ/mol), g, p }` (Z 1–56 plus Pt, Au, Hg, Pb, U; `en`/`ie` filled for Z 1–38 and a few heavier ones, otherwise null). `Lab.parseFormula("CuSO4·5H2O")`, `Lab.molarMass("H2SO4")` (unrounded), `Lab.fmla("SO4^2-")` → HTML with sub/superscripts, `Lab.sig(v, n)` significant figures, `Lab.sci(v, n, force)` → "6.02 × 10<sup>23</sup>" HTML, `Lab.config(z, {charge})` / `Lab.configText(z, {short, charge})` electron configurations (Aufbau, Cr/Cu exceptions, cations lose highest-n first), `Lab.CONST` (R, R_J, NA, h, c, Kw, F), `Lab.periodicTable(box, {maxZ, onPick, selected, label, disabled, color})` clickable mini periodic table, `Lab.fmt(v, d)`, `Lab.animate(ms, onFrame, done)`.

If a lab needs something these don't cover, write it inline in that lab's script. Do not edit the shared assets.

## Practice questions

Eight AP-style multiple-choice questions per lab, four options each. Mix calculation, particle-diagram/representation reasoning, and "which claim/justification is correct" items, like the real exam. The correct letter should vary (not always B). Every explanation says why the right answer is right and names the trap in at least one wrong choice. Work every calculation yourself and double-check the arithmetic and sig figs.

## Glossary

Terms live in `assets/glossary/unit-N.js` (written separately). Each lab's Key terms section shows the terms whose `tp` (or `also`) is that topic, so the lab doesn't write terms itself.

## Checks before a lab is done

Open it in headless Chromium (Playwright is installed: `require('playwright')`, `chromium.launch()`), at desktop (1280 px) and phone (390 px) widths, in light and dark (`localStorage.setItem("chem-theme","dark")`): no console errors, every scenario button and slider works, the story updates, the quiz grades, nothing overflows horizontally, and SVG text is legible. Look at a screenshot.

## Lessons from Units 1–4

- **Build in a self-check.** The best labs carry a small check at the end of their script that verifies their own data and logs `console.error` when something is wrong: equations balance in atoms and charge, oxidation numbers sum to the charge, conjugate pairs differ by one H⁺, computed answers match hand-typed expected values. Plant one wrong value once to confirm the check fires, then remove it.
- **Generate, don't type, anything derivable.** Balanced equations, net ionic equations, mole tables, and worked steps should be computed from the data so they can't drift from the numbers on screen.
- **Name the simplifications.** Where the page simplifies (H₂SO₄ treated as fully dissociating, single vs. double arrows, illustrative constants), say so in one line on the page.
- **Scope claims need a source.** Only say "the exam does / doesn't test X" if the CED says so; otherwise phrase it as "most often tested" or leave it out. The equations sheet is at https://apcentral.collegeboard.org/media/pdf/ap-chemistry-equations-sheet.pdf.
- **The glossary is written.** `assets/glossary/unit-N.js` has terms for every topic in all nine units; check your Key terms section shows them, and don't edit the glossary files.
- **Keep testing compact.** View only a few screenshots and grep files rather than printing them whole; very long sessions can't be resumed if interrupted.
