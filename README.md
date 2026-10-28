# Chemistry Study Labs

Interactive study pages for **AP Chemistry**, following the College Board course outline (fall 2024 revision: 9 units, 91 topics). Each lab has a hands-on model, simulator, or step-by-step calculator, a live explanation of what changed and why, a reference table, FRQ tips, common mistakes, eight AP-style practice questions, and the key terms for that topic.

Live site: https://chem.natebird.co

Labs are live for Units 1–4. Terminology guides cover all nine units.

## Terminology guides

A searchable glossary of every key term in the course, with flashcards (progress saved in the browser) and a self-quiz.

- [Master guide: all nine units](terms/index.html)
- Unit guides: [1](terms/unit-1.html) · [2](terms/unit-2.html) · [3](terms/unit-3.html) · [4](terms/unit-4.html) · [5](terms/unit-5.html) · [6](terms/unit-6.html) · [7](terms/unit-7.html) · [8](terms/unit-8.html) · [9](terms/unit-9.html)

Terms live in `assets/glossary/unit-N.js`. Each term is stored once, in the topic where the course introduces it, and an `also` list places it in later topics that reuse it.

## Using it

Open `index.html` in any browser, or visit the GitHub Pages site. There is no build step and nothing to install. Every page is plain HTML, CSS, and JavaScript.

## Layout

```
index.html          Landing page linking every lab (generated)
assets/lab.css      Shared styles (light and dark themes, periodic table, equations)
assets/lab.js       Shared helpers: topic list, SVG primitives, element data, formula parsing,
                    molar mass, sig figs, electron configurations, quiz builder, navigation
assets/prefs.js     Appearance picker: light/dark mode and accent color
assets/glossary.js  Glossary viewer: term list, flashcards, quiz
assets/glossary/    Term data, one file per unit
labs/               One page per course topic (N-k-slug.html)
terms/              Master glossary and one page per unit (generated)
scripts/topics.py   The 91 topics, unit titles, and exam weights
scripts/build_index.py  Regenerates index.html and terms/ from topics.py and READY in lab.js
docs/LAB_GUIDE.md   How a lab page is built (use it for Units 5–9)
```

## Adding a unit

1. Write its labs in `labs/` following `docs/LAB_GUIDE.md`.
2. Add the unit number to `READY` in `assets/lab.js`.
3. Run `python3 scripts/build_index.py`.

## A note on the numbers

Simulations run on simplified teaching models. Constants and molar masses match the AP Chemistry reference sheet; values marked illustrative are for teaching, not measured data.
