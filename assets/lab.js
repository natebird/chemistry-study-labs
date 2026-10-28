/* Shared helpers for the AP Chemistry study labs.
   Exposes a global `Lab` object: SVG chart drawing, chemistry helpers (element data, formula parsing,
   molar mass, significant figures, electron configurations), a quiz builder, page navigation. */
(function () {
  "use strict";

  /* Every topic in the course. A unit's labs go live when its number is in READY. */
  var READY = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  var UNIT_TITLES = { 1: "Atomic Structure and Properties", 2: "Compound Structure and Properties", 3: "Properties of Substances and Mixtures", 4: "Chemical Reactions", 5: "Kinetics", 6: "Thermochemistry", 7: "Equilibrium", 8: "Acids and Bases", 9: "Thermodynamics and Electrochemistry" };
  var UNIT_WEIGHTS = { 1: "7\u20139%", 2: "7\u20139%", 3: "18\u201322%", 4: "7\u20139%", 5: "7\u20139%", 6: "7\u20139%", 7: "7\u20139%", 8: "11\u201315%", 9: "7\u20139%" };
  var TOPICS = [
    { id: "1.1", file: "1-1-moles-molar-mass.html", title: "Moles and Molar Mass" },
    { id: "1.2", file: "1-2-mass-spectra.html", title: "Mass Spectra of Elements" },
    { id: "1.3", file: "1-3-elemental-composition.html", title: "Elemental Composition of Pure Substances" },
    { id: "1.4", file: "1-4-composition-of-mixtures.html", title: "Composition of Mixtures" },
    { id: "1.5", file: "1-5-electron-configuration.html", title: "Atomic Structure and Electron Configuration" },
    { id: "1.6", file: "1-6-photoelectron-spectroscopy.html", title: "Photoelectron Spectroscopy" },
    { id: "1.7", file: "1-7-periodic-trends.html", title: "Periodic Trends" },
    { id: "1.8", file: "1-8-valence-electrons-ionic-compounds.html", title: "Valence Electrons and Ionic Compounds" },
    { id: "2.1", file: "2-1-types-of-bonds.html", title: "Types of Chemical Bonds" },
    { id: "2.2", file: "2-2-potential-energy-bonding.html", title: "Intramolecular Force and Potential Energy" },
    { id: "2.3", file: "2-3-ionic-solids.html", title: "Structure of Ionic Solids" },
    { id: "2.4", file: "2-4-metals-alloys.html", title: "Structure of Metals and Alloys" },
    { id: "2.5", file: "2-5-lewis-diagrams.html", title: "Lewis Diagrams" },
    { id: "2.6", file: "2-6-resonance-formal-charge.html", title: "Resonance and Formal Charge" },
    { id: "2.7", file: "2-7-vsepr-hybridization.html", title: "VSEPR and Hybridization" },
    { id: "3.1", file: "3-1-intermolecular-forces.html", title: "Intermolecular and Interparticle Forces" },
    { id: "3.2", file: "3-2-properties-of-solids.html", title: "Properties of Solids" },
    { id: "3.3", file: "3-3-solids-liquids-gases.html", title: "Solids, Liquids, and Gases" },
    { id: "3.4", file: "3-4-ideal-gas-law.html", title: "Ideal Gas Law" },
    { id: "3.5", file: "3-5-kinetic-molecular-theory.html", title: "Kinetic Molecular Theory" },
    { id: "3.6", file: "3-6-deviation-from-ideal.html", title: "Deviation from Ideal Gas Law" },
    { id: "3.7", file: "3-7-solutions-mixtures.html", title: "Solutions and Mixtures" },
    { id: "3.8", file: "3-8-representations-of-solutions.html", title: "Representations of Solutions" },
    { id: "3.9", file: "3-9-separation-of-mixtures.html", title: "Separation of Solutions and Mixtures" },
    { id: "3.10", file: "3-10-solubility.html", title: "Solubility" },
    { id: "3.11", file: "3-11-spectroscopy.html", title: "Spectroscopy and the Electromagnetic Spectrum" },
    { id: "3.12", file: "3-12-properties-of-photons.html", title: "Properties of Photons" },
    { id: "3.13", file: "3-13-beer-lambert-law.html", title: "Beer\u2013Lambert Law" },
    { id: "4.1", file: "4-1-introduction-to-reactions.html", title: "Introduction for Reactions" },
    { id: "4.2", file: "4-2-net-ionic-equations.html", title: "Net Ionic Equations" },
    { id: "4.3", file: "4-3-representations-of-reactions.html", title: "Representations of Reactions" },
    { id: "4.4", file: "4-4-physical-chemical-changes.html", title: "Physical and Chemical Changes" },
    { id: "4.5", file: "4-5-stoichiometry.html", title: "Stoichiometry" },
    { id: "4.6", file: "4-6-titration.html", title: "Introduction to Titration" },
    { id: "4.7", file: "4-7-types-of-reactions.html", title: "Types of Chemical Reactions" },
    { id: "4.8", file: "4-8-acid-base-reactions.html", title: "Introduction to Acid\u2013Base Reactions" },
    { id: "4.9", file: "4-9-redox-reactions.html", title: "Oxidation\u2013Reduction (Redox) Reactions" },
    { id: "5.1", file: "5-1-reaction-rates.html", title: "Reaction Rates" },
    { id: "5.2", file: "5-2-rate-law.html", title: "Introduction to Rate Law" },
    { id: "5.3", file: "5-3-concentration-over-time.html", title: "Concentration Changes Over Time" },
    { id: "5.4", file: "5-4-elementary-reactions.html", title: "Elementary Reactions" },
    { id: "5.5", file: "5-5-collision-model.html", title: "Collision Model" },
    { id: "5.6", file: "5-6-reaction-energy-profile.html", title: "Reaction Energy Profile" },
    { id: "5.7", file: "5-7-reaction-mechanisms.html", title: "Introduction to Reaction Mechanisms" },
    { id: "5.8", file: "5-8-mechanism-and-rate-law.html", title: "Reaction Mechanism and Rate Law" },
    { id: "5.9", file: "5-9-pre-equilibrium.html", title: "Pre-Equilibrium Approximation" },
    { id: "5.10", file: "5-10-multistep-energy-profile.html", title: "Multistep Reaction Energy Profile" },
    { id: "5.11", file: "5-11-catalysis.html", title: "Catalysis" },
    { id: "6.1", file: "6-1-endothermic-exothermic.html", title: "Endothermic and Exothermic Processes" },
    { id: "6.2", file: "6-2-energy-diagrams.html", title: "Energy Diagrams" },
    { id: "6.3", file: "6-3-heat-transfer.html", title: "Heat Transfer and Thermal Equilibrium" },
    { id: "6.4", file: "6-4-calorimetry.html", title: "Heat Capacity and Calorimetry" },
    { id: "6.5", file: "6-5-phase-change-energy.html", title: "Energy of Phase Changes" },
    { id: "6.6", file: "6-6-enthalpy-of-reaction.html", title: "Introduction to Enthalpy of Reaction" },
    { id: "6.7", file: "6-7-bond-enthalpies.html", title: "Bond Enthalpies" },
    { id: "6.8", file: "6-8-enthalpy-of-formation.html", title: "Enthalpy of Formation" },
    { id: "6.9", file: "6-9-hess-law.html", title: "Hess\u2019s Law" },
    { id: "7.1", file: "7-1-introduction-to-equilibrium.html", title: "Introduction to Equilibrium" },
    { id: "7.2", file: "7-2-direction-of-reactions.html", title: "Direction of Reversible Reactions" },
    { id: "7.3", file: "7-3-q-and-k.html", title: "Reaction Quotient and Equilibrium Constant" },
    { id: "7.4", file: "7-4-calculating-k.html", title: "Calculating the Equilibrium Constant" },
    { id: "7.5", file: "7-5-magnitude-of-k.html", title: "Magnitude of the Equilibrium Constant" },
    { id: "7.6", file: "7-6-properties-of-k.html", title: "Properties of the Equilibrium Constant" },
    { id: "7.7", file: "7-7-equilibrium-concentrations.html", title: "Calculating Equilibrium Concentrations" },
    { id: "7.8", file: "7-8-representations-of-equilibrium.html", title: "Representations of Equilibrium" },
    { id: "7.9", file: "7-9-le-chatelier.html", title: "Introduction to Le Ch\u00e2telier\u2019s Principle" },
    { id: "7.10", file: "7-10-q-and-le-chatelier.html", title: "Reaction Quotient and Le Ch\u00e2telier\u2019s Principle" },
    { id: "7.11", file: "7-11-solubility-equilibria.html", title: "Introduction to Solubility Equilibria" },
    { id: "7.12", file: "7-12-common-ion-effect.html", title: "Common-Ion Effect" },
    { id: "8.1", file: "8-1-introduction-to-acids-bases.html", title: "Introduction to Acids and Bases" },
    { id: "8.2", file: "8-2-strong-acids-bases.html", title: "pH and pOH of Strong Acids and Bases" },
    { id: "8.3", file: "8-3-weak-acid-base-equilibria.html", title: "Weak Acid and Base Equilibria" },
    { id: "8.4", file: "8-4-acid-base-reactions-buffers.html", title: "Acid\u2013Base Reactions and Buffers" },
    { id: "8.5", file: "8-5-acid-base-titrations.html", title: "Acid\u2013Base Titrations" },
    { id: "8.6", file: "8-6-molecular-structure-acids.html", title: "Molecular Structure of Acids and Bases" },
    { id: "8.7", file: "8-7-ph-and-pka.html", title: "pH and pKa" },
    { id: "8.8", file: "8-8-properties-of-buffers.html", title: "Properties of Buffers" },
    { id: "8.9", file: "8-9-henderson-hasselbalch.html", title: "Henderson\u2013Hasselbalch Equation" },
    { id: "8.10", file: "8-10-buffer-capacity.html", title: "Buffer Capacity" },
    { id: "8.11", file: "8-11-ph-and-solubility.html", title: "pH and Solubility" },
    { id: "9.1", file: "9-1-introduction-to-entropy.html", title: "Introduction to Entropy" },
    { id: "9.2", file: "9-2-entropy-change.html", title: "Absolute Entropy and Entropy Change" },
    { id: "9.3", file: "9-3-gibbs-free-energy.html", title: "Gibbs Free Energy and Thermodynamic Favorability" },
    { id: "9.4", file: "9-4-thermodynamic-kinetic-control.html", title: "Thermodynamic and Kinetic Control" },
    { id: "9.5", file: "9-5-free-energy-equilibrium.html", title: "Free Energy and Equilibrium" },
    { id: "9.6", file: "9-6-free-energy-of-dissolution.html", title: "Free Energy of Dissolution" },
    { id: "9.7", file: "9-7-coupled-reactions.html", title: "Coupled Reactions" },
    { id: "9.8", file: "9-8-galvanic-electrolytic-cells.html", title: "Galvanic (Voltaic) and Electrolytic Cells" },
    { id: "9.9", file: "9-9-cell-potential-free-energy.html", title: "Cell Potential and Free Energy" },
    { id: "9.10", file: "9-10-nonstandard-cell-potential.html", title: "Cell Potential Under Nonstandard Conditions" },
    { id: "9.11", file: "9-11-electrolysis-faraday.html", title: "Electrolysis and Faraday\u2019s Law" }
  ];
  function unitOf(id) { return +String(id).split(".")[0]; }

  var NS = "http://www.w3.org/2000/svg";
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function el(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  /* frame(svg, opts) clears the svg and draws axes + grid.
     opts: { x:[min,max], y:[min,max], xLabel, yLabel, xTicks:[], yTicks:[], fmtX(v), fmtY(v),
             width (440), height (330) }
     Returns F with sx(), sy(), g (clipped plot group), svg, xr, yr. */
  function frame(svg, o) {
    var W = o.width || 440, H = o.height || 330, M = { l: 52, r: 18, t: 18, b: 46 };
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var xr = o.x, yr = o.y;
    var sx = function (v) { return M.l + (v - xr[0]) / (xr[1] - xr[0]) * (W - M.l - M.r); };
    var sy = function (v) { return H - M.b - (v - yr[0]) / (yr[1] - yr[0]) * (H - M.t - M.b); };
    var fx = o.fmtX || function () { return ""; }, fy = o.fmtY || function () { return ""; };
    var defs = el("defs", {}, svg);
    var cid = (svg.id || "c") + "-clip";
    var cp = el("clipPath", { id: cid }, defs);
    el("rect", { x: M.l, y: M.t, width: W - M.l - M.r, height: H - M.t - M.b }, cp);
    (o.xTicks || []).forEach(function (v) {
      el("line", { x1: sx(v), x2: sx(v), y1: M.t, y2: H - M.b, stroke: "var(--grid)" }, svg);
      el("text", { x: sx(v), y: H - M.b + 16, "text-anchor": "middle" }, svg, fx(v));
    });
    (o.yTicks || []).forEach(function (v) {
      el("line", { x1: M.l, x2: W - M.r, y1: sy(v), y2: sy(v), stroke: "var(--grid)" }, svg);
      el("text", { x: M.l - 8, y: sy(v) + 4, "text-anchor": "end" }, svg, fy(v));
    });
    el("line", { x1: M.l, x2: M.l, y1: M.t, y2: H - M.b, stroke: "var(--ink)", "stroke-width": 1.5 }, svg);
    el("line", { x1: M.l, x2: W - M.r, y1: H - M.b, y2: H - M.b, stroke: "var(--ink)", "stroke-width": 1.5 }, svg);
    el("text", { x: (M.l + W - M.r) / 2, y: H - 8, "text-anchor": "middle", "class": "lbl", style: "fill:var(--ink)" }, svg, o.xLabel || "");
    var my = (M.t + H - M.b) / 2;
    el("text", { x: 14, y: my, "text-anchor": "middle", "class": "lbl", style: "fill:var(--ink)", transform: "rotate(-90 14 " + my + ")" }, svg, o.yLabel || "");
    var g = el("g", { "clip-path": "url(#" + cid + ")" }, svg);
    return { sx: sx, sy: sy, g: g, svg: svg, xr: xr, yr: yr, W: W, H: H, M: M };
  }

  /* line(F, [[x,y],...], color, width, dash) — polyline in data coords, clipped to plot. */
  function line(F, pts, color, w, dash) {
    var d = pts.map(function (p, i) { return (i ? "L" : "M") + F.sx(p[0]).toFixed(1) + " " + F.sy(p[1]).toFixed(1); }).join(" ");
    return el("path", { d: d, fill: "none", stroke: color, "stroke-width": w || 3, "stroke-linecap": "round", "stroke-dasharray": dash || null }, F.g);
  }
  /* fn(F, f, color, width, dash, steps) — plot y = f(x) across the x range. */
  function fn(F, f, color, w, dash, steps) {
    var n = steps || 60, pts = [];
    for (var i = 0; i <= n; i++) { var x = F.xr[0] + (F.xr[1] - F.xr[0]) * i / n; pts.push([x, f(x)]); }
    return line(F, pts, color, w, dash);
  }
  function vline(F, x, color, w, dash) { return line(F, [[x, F.yr[0]], [x, F.yr[1]]], color, w, dash); }
  function hline(F, y, color, w, dash) { return line(F, [[F.xr[0], y], [F.xr[1], y]], color, w, dash); }
  /* tag(F, x, y, text, color, anchor) — bold label, clamped inside the plot. */
  function tag(F, x, y, txt, color, anchor) {
    var cx = Math.max(F.xr[0], Math.min(F.xr[1], x)), cy = Math.max(F.yr[0], Math.min(F.yr[1], y));
    return el("text", { x: F.sx(cx), y: F.sy(cy), style: "fill:" + color, "class": "lbl", "text-anchor": anchor || "start" }, F.svg, txt);
  }
  /* dot(F, x, y, color, guides, xLabel, yLabel) — equilibrium point with dashed guides to the axes. */
  function dot(F, x, y, color, guides, xl, yl) {
    if (guides) line(F, [[x, F.yr[0]], [x, y], [F.xr[0], y]], "var(--muted)", 1, "3 3");
    el("circle", { cx: F.sx(x), cy: F.sy(y), r: 6, fill: color || "var(--ink)", stroke: "var(--surface)", "stroke-width": 2 }, F.g);
    if (xl) el("text", { x: F.sx(x), y: F.H - F.M.b + 16, "text-anchor": "middle", style: "fill:var(--ink); font-weight:600" }, F.svg, xl);
    if (yl) el("text", { x: F.M.l - 8, y: F.sy(y) - 6, "text-anchor": "end", style: "fill:var(--ink); font-weight:600" }, F.svg, yl);
  }
  /* arrow(F, x1,y1,x2,y2,color) — a shift arrow. */
  function arrow(F, x1, y1, x2, y2, color) {
    var X1 = F.sx(x1), Y1 = F.sy(y1), X2 = F.sx(x2), Y2 = F.sy(y2);
    var len = Math.hypot(X2 - X1, Y2 - Y1); if (len < 8) return;
    var ux = (X2 - X1) / len, uy = (Y2 - Y1) / len, h = 8;
    el("path", { d: "M" + X1 + " " + Y1 + " L" + X2 + " " + Y2, stroke: color, "stroke-width": 2, fill: "none" }, F.svg);
    el("path", { d: "M" + X2 + " " + Y2 + " L" + (X2 - h * ux + h * .5 * uy) + " " + (Y2 - h * uy - h * .5 * ux) + " L" + (X2 - h * ux - h * .5 * uy) + " " + (Y2 - h * uy + h * .5 * ux) + " Z", fill: color }, F.svg);
  }
  /* rect(F, x0,y0,x1,y1, fill, opacity) — shaded region in data coords. */
  function rect(F, x0, y0, x1, y1, fill, op) {
    return el("rect", { x: Math.min(F.sx(x0), F.sx(x1)), y: Math.min(F.sy(y0), F.sy(y1)), width: Math.abs(F.sx(x1) - F.sx(x0)), height: Math.abs(F.sy(y1) - F.sy(y0)), fill: fill, opacity: op == null ? .18 : op }, F.g);
  }

  function fmt(v, d) { var k = Math.pow(10, d == null ? 1 : d); return (Math.round(v * k) / k).toFixed(d == null ? 1 : d); }

  /* animate(duration, onFrame(t in 0..1), onDone) with ease-in-out; jumps to the end under reduced motion. */
  function animate(dur, onFrame, done) {
    if (reduceMotion) { onFrame(1); if (done) done(); return function () {}; }
    var t0 = null, id = null, stopped = false;
    function step(t) {
      if (stopped) return;
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      onFrame(e);
      if (k < 1) id = requestAnimationFrame(step); else if (done) done();
    }
    id = requestAnimationFrame(step);
    return function () { stopped = true; if (id) cancelAnimationFrame(id); };
  }

  /* quiz(questions, quizEl, scoreEl, resetBtn)
     questions: [{ s: stem, o: [options], c: correctIndex, w: explanation }] */
  function quiz(Q, quizEl, scoreEl, resetBtn) {
    var answered = 0, right = 0;
    function upd() { scoreEl.textContent = right + " / " + answered + " correct"; }
    function build() {
      quizEl.innerHTML = ""; answered = 0; right = 0; upd();
      Q.forEach(function (q, i) {
        var card = document.createElement("div"); card.className = "card q";
        card.innerHTML = '<div class="qn">Question ' + (i + 1) + ' of ' + Q.length + '</div><div class="stem"></div><div class="opts"></div><div class="why" hidden></div>';
        card.querySelector(".stem").textContent = q.s;
        var opts = card.querySelector(".opts"), why = card.querySelector(".why");
        q.o.forEach(function (t, j) {
          var b = document.createElement("button"); b.className = "opt"; b.type = "button";
          b.textContent = String.fromCharCode(65 + j) + ".  " + t;
          b.addEventListener("click", function () {
            var all = opts.querySelectorAll("button");
            all.forEach(function (x) { x.disabled = true; });
            all[q.c].classList.add("right");
            if (j !== q.c) b.classList.add("wrong"); else right++;
            answered++; upd();
            why.hidden = false;
            why.innerHTML = (j === q.c ? "<b style='color:var(--good)'>Correct.</b> " : "<b style='color:var(--bad)'>Not quite.</b> The answer is " + String.fromCharCode(65 + q.c) + ". ") + q.w;
          });
          opts.appendChild(b);
        });
        quizEl.appendChild(card);
      });
    }
    if (resetBtn) resetBtn.addEventListener("click", build);
    build();
  }

  /* nav(currentId) fills #topnav and #pager on a lab page.
     The topic chips show the current unit; the pager walks every ready lab in course order. */
  function nav(cur) {
    var u = unitOf(cur);
    var top = document.getElementById("topnav");
    if (top) {
      top.innerHTML = '<span style="display:flex;gap:16px;flex-wrap:wrap"><a href="../index.html">\u2190 All labs</a><a href="../terms/unit-' + u + '.html">Unit ' + u + ' terms</a><a href="../terms/index.html">All terms</a></span><nav class="topics" aria-label="Unit ' + u + ' topics"></nav>';
      var t = top.querySelector(".topics");
      TOPICS.filter(function (x) { return unitOf(x.id) === u; }).forEach(function (x) {
        var a = document.createElement("a"); a.href = x.file; a.textContent = x.id; a.title = x.title;
        if (x.id === cur) a.setAttribute("aria-current", "page");
        t.appendChild(a);
      });
    }
    var pg = document.getElementById("pager");
    if (pg) {
      var live = TOPICS.filter(function (x) { return READY.indexOf(unitOf(x.id)) >= 0 || unitOf(x.id) === u; });
      var i = live.findIndex(function (x) { return x.id === cur; });
      var prev = live[i - 1], next = live[i + 1];
      pg.innerHTML = (prev ? '<a href="' + prev.file + '">\u2190 ' + prev.id + ' ' + prev.title + '</a>' : '<a href="../index.html">\u2190 All labs</a>') +
        (next ? '<a href="' + next.file + '">' + next.id + ' ' + next.title + ' \u2192</a>' : '<a href="../index.html">Back to all labs \u2192</a>');
    }
  }

  /* ---------- Chemistry helpers ---------- */

  /* ELEMENTS: Z -> { s: symbol, n: name, m: molar mass (g/mol, AP periodic table values),
     en: Pauling electronegativity (null for He, Ne, Ar), ie: first ionization energy (kJ/mol),
     g: group (1-18), p: period }. Covers Z 1-56 plus Pt, Au, Hg, Pb, U.
     en and ie are given for Z 1-38 and a few heavier elements AP questions use often; otherwise null. */
  var EL_RAW = [
    // Z, sym, name, mass, en, ie
    [1,"H","Hydrogen",1.008,2.20,1312],[2,"He","Helium",4.00,null,2372],
    [3,"Li","Lithium",6.94,0.98,520],[4,"Be","Beryllium",9.01,1.57,900],[5,"B","Boron",10.81,2.04,801],[6,"C","Carbon",12.01,2.55,1086],
    [7,"N","Nitrogen",14.01,3.04,1402],[8,"O","Oxygen",16.00,3.44,1314],[9,"F","Fluorine",19.00,3.98,1681],[10,"Ne","Neon",20.18,null,2081],
    [11,"Na","Sodium",22.99,0.93,496],[12,"Mg","Magnesium",24.31,1.31,738],[13,"Al","Aluminum",26.98,1.61,578],[14,"Si","Silicon",28.09,1.90,787],
    [15,"P","Phosphorus",30.97,2.19,1012],[16,"S","Sulfur",32.06,2.58,1000],[17,"Cl","Chlorine",35.45,3.16,1251],[18,"Ar","Argon",39.95,null,1521],
    [19,"K","Potassium",39.10,0.82,419],[20,"Ca","Calcium",40.08,1.00,590],[21,"Sc","Scandium",44.96,1.36,633],[22,"Ti","Titanium",47.87,1.54,659],
    [23,"V","Vanadium",50.94,1.63,651],[24,"Cr","Chromium",52.00,1.66,653],[25,"Mn","Manganese",54.94,1.55,717],[26,"Fe","Iron",55.85,1.83,763],
    [27,"Co","Cobalt",58.93,1.88,760],[28,"Ni","Nickel",58.69,1.91,737],[29,"Cu","Copper",63.55,1.90,745],[30,"Zn","Zinc",65.38,1.65,906],
    [31,"Ga","Gallium",69.72,1.81,579],[32,"Ge","Germanium",72.63,2.01,762],[33,"As","Arsenic",74.92,2.18,947],[34,"Se","Selenium",78.97,2.55,941],
    [35,"Br","Bromine",79.90,2.96,1140],[36,"Kr","Krypton",83.80,3.00,1351],[37,"Rb","Rubidium",85.47,0.82,403],[38,"Sr","Strontium",87.62,0.95,550],
    [39,"Y","Yttrium",88.91,null,null],[40,"Zr","Zirconium",91.22,null,null],[41,"Nb","Niobium",92.91,null,null],[42,"Mo","Molybdenum",95.95,null,null],
    [43,"Tc","Technetium",97,null,null],[44,"Ru","Ruthenium",101.07,null,null],[45,"Rh","Rhodium",102.91,null,null],[46,"Pd","Palladium",106.42,null,null],
    [47,"Ag","Silver",107.87,1.93,731],[48,"Cd","Cadmium",112.41,null,null],[49,"In","Indium",114.82,null,null],[50,"Sn","Tin",118.71,1.96,709],
    [51,"Sb","Antimony",121.76,null,null],[52,"Te","Tellurium",127.60,null,null],[53,"I","Iodine",126.90,2.66,1008],[54,"Xe","Xenon",131.29,2.60,1170],
    [55,"Cs","Cesium",132.91,0.79,376],[56,"Ba","Barium",137.33,0.89,503],
    [78,"Pt","Platinum",195.08,null,null],[79,"Au","Gold",196.97,null,null],[80,"Hg","Mercury",200.59,null,null],[82,"Pb","Lead",207.2,null,null],[92,"U","Uranium",238.03,null,null]
  ];
  function groupPeriod(z) {
    var starts = [[1, 1], [3, 2], [11, 3], [19, 4], [37, 5], [55, 6], [87, 7]], p = 1, z0 = 1;
    starts.forEach(function (x) { if (z >= x[0]) { z0 = x[0]; p = x[1]; } });
    var k = z - z0;
    if (p === 1) return { p: 1, g: z === 1 ? 1 : 18 };
    if (p <= 3) return { p: p, g: k < 2 ? k + 1 : k + 11 };
    if (p <= 5) return { p: p, g: k + 1 };
    // periods 6-7: skip the 14 f-block elements (lanthanides/actinides placed in group 3)
    if (k < 2) return { p: p, g: k + 1 };
    if (k < 17) return { p: p, g: 3, f: true };
    return { p: p, g: k - 13 };
  }
  var ELEMENTS = {}, BY_SYMBOL = {};
  EL_RAW.forEach(function (r) {
    var gp = groupPeriod(r[0]);
    var e = { z: r[0], s: r[1], n: r[2], m: r[3], en: r[4], ie: r[5], g: gp.g, p: gp.p };
    ELEMENTS[r[0]] = e; BY_SYMBOL[r[1]] = e;
  });

  /* parseFormula("Ca(OH)2·5H2O") -> { Ca: 1, O: 7, H: 12 }. Handles parentheses, brackets,
     hydrate dots (· or * or .) with a leading coefficient, and ignores charges written as ^2+ or trailing +/-.
     Throws an Error with a readable message for unknown symbols. */
  function parseFormula(str) {
    str = String(str).replace(/\s+/g, "").replace(/\^?\d*[+\-]$/, "");
    var parts = str.split(/[·*.•]/), total = {};
    parts.forEach(function (part) {
      var m = part.match(/^(\d+)(.*)$/), mult = 1;
      if (m && /[A-Z(\[]/.test(m[2].charAt(0) || "")) { mult = +m[1]; part = m[2]; }
      var i = 0;
      function group() {
        var counts = {};
        while (i < part.length) {
          var ch = part[i];
          if (ch === "(" || ch === "[") { i++; var inner = group(); var n = num(); for (var k in inner) counts[k] = (counts[k] || 0) + inner[k] * n; }
          else if (ch === ")" || ch === "]") { i++; return counts; }
          else if (/[A-Z]/.test(ch)) {
            var sym = ch; i++;
            while (i < part.length && /[a-z]/.test(part[i])) sym += part[i++];
            if (!BY_SYMBOL[sym]) throw new Error("Unknown element symbol: " + sym);
            var c = num(); counts[sym] = (counts[sym] || 0) + c;
          } else throw new Error("Can't read \"" + ch + "\" in " + str);
        }
        return counts;
      }
      function num() { var d = ""; while (i < part.length && /\d/.test(part[i])) d += part[i++]; return d ? +d : 1; }
      var c = group();
      for (var k in c) total[k] = (total[k] || 0) + c[k] * mult;
    });
    return total;
  }
  /* molarMass("H2SO4") -> 98.08 (g/mol, unrounded sum of AP table masses). */
  function molarMass(str) {
    var c = typeof str === "string" ? parseFormula(str) : str, t = 0;
    for (var k in c) t += BY_SYMBOL[k].m * c[k];
    return t;
  }
  /* fmla("SO4^2-") -> HTML with subscripts and a superscript charge: SO<sub>4</sub><sup>2−</sup>.
     Digits after an element, ")" or "]" become subscripts; a leading coefficient stays normal size.
     Charge forms: "^2-", "^+", "^3+". States like (aq) (s) (l) (g) are kept as normal text. */
  function fmla(str) {
    var out = "", s = String(str), charge = "";
    var cm = s.match(/\^([0-9]*[+\-])$/);
    if (cm) { charge = cm[1].replace("-", "−"); s = s.slice(0, cm.index); }
    var states = /^\((aq|s|l|g)\)/;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i], st = s.slice(i).match(states);
      if (st) { out += st[0]; i += st[0].length - 1; continue; }
      if (/\d/.test(ch) && i > 0 && /[A-Za-z\)\]]/.test(s[i - 1])) {
        var d = ch; while (i + 1 < s.length && /\d/.test(s[i + 1])) d += s[++i];
        out += "<sub>" + d + "</sub>";
      } else out += ch === "<" ? "&lt;" : ch === "&" ? "&amp;" : ch;
    }
    return out + (charge ? "<sup>" + charge + "</sup>" : "");
  }
  /* sig(v, n) -> string with n significant figures, never in e-notation (use sci for that). */
  function sig(v, n) {
    if (!isFinite(v)) return String(v);
    if (v === 0) return (0).toFixed(Math.max(0, n - 1));
    if (v < 0) return "-" + sig(-v, n);
    var d = n - 1 - Math.floor(Math.log10(Math.abs(v)));
    // rounding can carry into the next power of ten (0.99999 -> 1.00), so recompute the exponent once
    var r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
    if (r !== 0) d = n - 1 - Math.floor(Math.log10(Math.abs(r)) + 1e-12);
    if (d >= 0) return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    var k = Math.pow(10, -d); return String(Math.round(v / k) * k);
  }
  /* sci(v, n) -> HTML "6.02 × 10<sup>23</sup>" with n significant figures (n defaults to 3).
     Values from 0.01 up to 10,000 are shown plainly unless force is true. */
  function sci(v, n, force) {
    n = n || 3;
    if (v === 0) return sig(0, n);
    var e = Math.floor(Math.log10(Math.abs(v))), mant = v / Math.pow(10, e);
    if (Math.abs(+mant.toFixed(n - 1)) >= 10) { mant /= 10; e += 1; }
    if (!force && e >= -2 && e <= 3) return sig(v, n);
    return mant.toFixed(n - 1) + " × 10<sup>" + String(e).replace("-", "−") + "</sup>";
  }
  /* config(z, opts) -> array of subshells in filling order: [{ n: 1, l: "s", e: 2 }, ...].
     Uses the Aufbau order with the Cr and Cu (and Mo, Ag, Au) exceptions.
     opts.charge removes electrons for cations (from the highest n first, so 4s leaves before 3d)
     or adds them for anions. */
  var ORDER = [[1,"s"],[2,"s"],[2,"p"],[3,"s"],[3,"p"],[4,"s"],[3,"d"],[4,"p"],[5,"s"],[4,"d"],[5,"p"],[6,"s"],[4,"f"],[5,"d"],[6,"p"],[7,"s"],[5,"f"],[6,"d"],[7,"p"]];
  var CAP = { s: 2, p: 6, d: 10, f: 14 }, LNUM = { s: 0, p: 1, d: 2, f: 3 };
  function config(z, opts) {
    var charge = (opts && opts.charge) || 0, left = z, out = [];
    ORDER.forEach(function (o) { if (left <= 0) return; var e = Math.min(CAP[o[1]], left); out.push({ n: o[0], l: o[1], e: e }); left -= e; });
    var ex = { 24: [3, 5], 29: [3, 10], 42: [4, 5], 47: [4, 10], 79: [5, 10] };
    if (ex[z]) {
      out.forEach(function (x) { if (x.l === "s" && x.n === ex[z][0] + 1) x.e = 1; if (x.l === "d" && x.n === ex[z][0]) x.e = ex[z][1]; });
    }
    if (charge > 0) {
      var k = charge;
      while (k > 0) {
        var best = null;
        out.forEach(function (x) { if (x.e > 0 && (!best || x.n > best.n || (x.n === best.n && LNUM[x.l] > LNUM[best.l]))) best = x; });
        best.e--; k--;
      }
      out = out.filter(function (x) { return x.e > 0; });
    } else if (charge < 0) {
      var add = -charge;
      ORDER.forEach(function (o) {
        if (add <= 0) return;
        var x = out.filter(function (y) { return y.n === o[0] && y.l === o[1]; })[0];
        if (!x) { x = { n: o[0], l: o[1], e: 0 }; out.push(x); }
        var room = CAP[o[1]] - x.e, a = Math.min(room, add); x.e += a; add -= a;
      });
    }
    return out;
  }
  /* configText(z, opts) -> HTML "1s<sup>2</sup> 2s<sup>2</sup> 2p<sup>6</sup>". opts.short uses a noble-gas core "[Ne] 3s<sup>1</sup>". */
  function configText(z, opts) {
    var sub = config(z, opts), core = null;
    if (opts && opts.short) {
      var gases = [86, 54, 36, 18, 10, 2], ze = z - ((opts && opts.charge) || 0);
      // largest noble-gas core below the electron count (an ion isoelectronic with a noble gas shows just that core)
      for (var i = 0; i < gases.length; i++) if (gases[i] < ze || (gases[i] === ze && ze !== z)) { core = gases[i]; break; }
      if (core) {
        var coreSubs = config(core).map(function (x) { return x.n + x.l; });
        var coreCount = {}; config(core).forEach(function (x) { coreCount[x.n + x.l] = x.e; });
        sub = sub.filter(function (x) { return !(coreSubs.indexOf(x.n + x.l) >= 0 && x.e === coreCount[x.n + x.l]); });
      }
    }
    return ((core ? "[" + ELEMENTS[core].s + "] " : "") + sub.map(function (x) { return x.n + x.l + "<sup>" + x.e + "</sup>"; }).join(" ")).trim();
  }
  var R = 0.08206, NA = 6.022e23, H_PLANCK = 6.626e-34, C_LIGHT = 2.998e8;
  var CONST = { R: R, R_J: 8.314, NA: NA, h: H_PLANCK, c: C_LIGHT, Kw: 1.0e-14, F: 96485 };

  /* periodicTable(container, opts) renders a clickable mini periodic table (Z 1-56, then the
     6th-period main-group and Pt/Au/Hg when present) as buttons in a CSS grid.
     opts: { maxZ: 36 (default), onPick(el), selected: z, label(el) -> extra text under the symbol,
             disabled(el) -> bool, color(el) -> CSS color for the tile background }
     Returns { select(z) }. Style lives in lab.css (.ptable). */
  function periodicTable(box, opts) {
    opts = opts || {};
    var maxZ = opts.maxZ || 36, btns = {};
    box.innerHTML = ""; box.classList.add("ptable");
    box.setAttribute("role", "group"); box.setAttribute("aria-label", opts.ariaLabel || "Periodic table");
    Object.keys(ELEMENTS).map(Number).filter(function (z) { return z <= maxZ; }).forEach(function (z) {
      var e = ELEMENTS[z]; if (e.p >= 6 && (z > 56 && z < 81) && [78, 79, 80].indexOf(z) < 0) return;
      var b = document.createElement("button"); b.type = "button";
      b.style.gridColumn = e.g; b.style.gridRow = e.p;
      b.innerHTML = '<span class="z">' + z + '</span><b>' + e.s + '</b>' + (opts.label ? '<span class="x">' + opts.label(e) + '</span>' : "");
      b.title = e.n + " (Z = " + z + ")"; b.setAttribute("aria-label", e.n);
      if (opts.color) { var c = opts.color(e); if (c) b.style.background = c; }
      if (opts.disabled && opts.disabled(e)) b.disabled = true;
      b.addEventListener("click", function () { select(z); if (opts.onPick) opts.onPick(e); });
      box.appendChild(b); btns[z] = b;
    });
    function select(z) { for (var k in btns) btns[k].setAttribute("aria-pressed", +k === z ? "true" : "false"); }
    if (opts.selected) select(opts.selected);
    return { select: select, buttons: btns };
  }

  /* bars(svg, cfg) draws a simple vertical bar chart (mass spectra, PES, composition).
     cfg = { x: [min, max], y: [min, max], xLabel, yLabel, xTicks, yTicks, fmtX, fmtY,
             bars: [{ x, y, color, label, width (data units, default 0.6) }], reverseX: bool (PES plots binding energy decreasing to the right) }
     Returns the frame F so callers can add tags. */
  function bars(svg, cfg) {
    var xr = cfg.reverseX ? [cfg.x[1], cfg.x[0]] : cfg.x;
    var F = frame(svg, { x: xr, y: cfg.y, xLabel: cfg.xLabel, yLabel: cfg.yLabel, xTicks: cfg.xTicks, yTicks: cfg.yTicks, fmtX: cfg.fmtX, fmtY: cfg.fmtY, width: cfg.width, height: cfg.height });
    (cfg.bars || []).forEach(function (b) {
      var w = (b.width || 0.6) / 2;
      rect(F, b.x - w, cfg.y[0], b.x + w, b.y, b.color || "var(--accent)", 1);
      if (b.label) tag(F, b.x, b.y + (cfg.y[1] - cfg.y[0]) * 0.03, b.label, b.color || "var(--accent)", "middle");
    });
    return F;
  }

  window.Lab = { TOPICS: TOPICS, READY: READY, UNIT_TITLES: UNIT_TITLES, UNIT_WEIGHTS: UNIT_WEIGHTS, unitOf: unitOf,
    ELEMENTS: ELEMENTS, BY_SYMBOL: BY_SYMBOL, CONST: CONST, parseFormula: parseFormula, molarMass: molarMass, fmla: fmla, sig: sig, sci: sci, config: config, configText: configText, periodicTable: periodicTable, bars: bars,
    el: el, frame: frame, line: line, fn: fn, vline: vline, hline: hline, tag: tag, dot: dot, arrow: arrow, rect: rect, fmt: fmt, animate: animate, quiz: quiz, nav: nav, reduceMotion: reduceMotion };
})();
