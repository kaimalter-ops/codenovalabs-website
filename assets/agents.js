/* Rubrik Multi-Agent: animierte „Agent HQ“-Szene (SVG, ohne Bibliotheken) */
(() => {
  const svg = document.getElementById("hq-svg");
  const NS = "http://www.w3.org/2000/svg";
  // Auf schmalen Bildschirmen näher heranzoomen
  const fit = () => svg.setAttribute("viewBox", innerWidth < 700 ? "170 25 660 525" : "120 22 760 522");
  fit(); addEventListener("resize", fit);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const S = 33, CX = 500, CY = 305;
  const iso = (x, y, z = 0) => [CX + (x - y) * S * 0.866, CY + (x + y) * S * 0.5 - z * S];
  const P = (...pts) => pts.map((p) => iso(...p).map((n) => n.toFixed(1)).join(",")).join(" ");
  const el = (tag, attrs = {}, parent = svg) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

  // ---------- Filter & Verläufe ----------
  const defs = el("defs");
  defs.innerHTML = `
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="glowBig" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter>
    <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5ee6ff" stop-opacity=".55"/><stop offset="1" stop-color="#5ee6ff" stop-opacity="0"/></linearGradient>
    <radialGradient id="coreG"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#c6f432"/><stop offset="1" stop-color="#c6f432" stop-opacity="0"/></radialGradient>
    <linearGradient id="slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2022"/><stop offset="1" stop-color="#0f1011"/></linearGradient>`;

  // ---------- Plattform ----------
  const R = 6.4, T = 0.5;
  el("polygon", { points: P([R, -R, 0], [R, R, 0], [R, R, -T], [R, -R, -T]), fill: "#141617", stroke: "rgba(244,244,242,.08)" });
  el("polygon", { points: P([-R, R, 0], [R, R, 0], [R, R, -T], [-R, R, -T]), fill: "#0f1011", stroke: "rgba(244,244,242,.08)" });
  el("polygon", { points: P([-R, -R, 0], [R, -R, 0], [R, R, 0], [-R, R, 0]), fill: "url(#slab)", stroke: "rgba(198,244,50,.35)", "stroke-width": 1.2 });
  const grid = el("g", { stroke: "rgba(244,244,242,.05)", "stroke-width": 1 });
  for (let i = -R + 1.1; i < R; i += 1.1) {
    el("polyline", { points: P([i, -R, 0], [i, R, 0]), fill: "none" }, grid);
    el("polyline", { points: P([-R, i, 0], [R, i, 0]), fill: "none" }, grid);
  }
  // Leuchtender Rand vorn
  el("polyline", { points: P([-R, R, 0], [R, R, 0], [R, -R, 0]), fill: "none", stroke: "#c6f432", "stroke-width": 1.5, opacity: .5, filter: "url(#glow)" });

  // ---------- Teams ----------
  const D = 4.3;
  const TEAMS = [
    { id: "research", name: "RESEARCH", x: -D, y: 0, tasks: ["Scanning 240 sources", "Summarising market report", "Checking competitor prices"], out: ["12 leads qualified", "3 trends found", "report draft ready"] },
    { id: "sales", name: "SALES", x: 0, y: -D, tasks: ["Writing offer for lead #482", "Scoring inbound leads", "Updating CRM pipeline"], out: ["offer drafted", "7 hot leads", "CRM synced"] },
    { id: "support", name: "SUPPORT", x: 0, y: D, tasks: ["Answering ticket #1093", "Tagging 31 new emails", "Drafting FAQ update"], out: ["ticket resolved", "inbox triaged", "FAQ proposal"] },
    { id: "finance", name: "FINANCE", x: D, y: 0, tasks: ["Matching 58 invoices", "Forecasting cash flow", "Flagging unusual costs"], out: ["invoices matched", "forecast updated", "2 anomalies flagged"] },
  ];

  // Datenleitungen zum Kern (unter den Büros)
  const lanes = el("g");
  TEAMS.forEach((t) => {
    const sx = Math.sign(t.x), sy = Math.sign(t.y);
    t.path = [[t.x - sx * 1.5, t.y - sy * 1.5], [sx * 0.9, sy * 0.9]].map(([a, b]) => [a, b, 0.02]);
    const pts = P(...t.path);
    el("polyline", { points: pts, fill: "none", stroke: "rgba(198,244,50,.18)", "stroke-width": 3, "stroke-linecap": "round" }, lanes);
    t.lane = el("polyline", { points: pts, fill: "none", stroke: "#c6f432", "stroke-width": 1.2, "stroke-dasharray": "2 10", opacity: .6 }, lanes);
    // Knotenpunkte
    for (let k = 1; k <= 2; k++) {
      const f = k / 3, [a, b] = [t.path[0][0] + (t.path[1][0] - t.path[0][0]) * f, t.path[0][1] + (t.path[1][1] - t.path[0][1]) * f];
      const [px, py] = iso(a, b, 0.02);
      el("ellipse", { cx: px, cy: py, rx: 4.5, ry: 2.6, fill: "#121314", stroke: "rgba(198,244,50,.5)" }, lanes);
    }
  });

  // ---------- Kern (Orchestrator) ----------
  const core = el("g");
  const [kx, ky] = iso(0, 0, 0);
  for (let i = 0; i < 3; i++) el("ellipse", { cx: kx, cy: ky - i * 3, rx: 58 - i * 10, ry: 29 - i * 5, fill: i ? "none" : "#0d0e0f", stroke: i ? "rgba(94,230,255,.35)" : "rgba(198,244,50,.5)" }, core);
  el("polygon", { points: P([-0.55, -0.55, 0], [0.55, -0.55, 0], [0.55, 0.55, 0], [-0.55, 0.55, 0]), fill: "rgba(198,244,50,.12)", stroke: "#c6f432", "stroke-width": 1 }, core);
  // Lichtsäule
  const [, topY] = iso(0, 0, 5.9);
  el("rect", { x: kx - 9, y: topY, width: 18, height: ky - topY, fill: "url(#beam)", opacity: .9 }, core);
  el("rect", { x: kx - 1, y: topY, width: 2, height: ky - topY, fill: "#5ee6ff", opacity: .55 }, core);
  // Ringe
  const rings = [1.0, 1.8, 2.6].map((z, i) => {
    const [, ry0] = iso(0, 0, z);
    return el("ellipse", { cx: kx, cy: ry0, rx: 44 - i * 8, ry: 22 - i * 4, fill: "none", stroke: i === 1 ? "#c6f432" : "#5ee6ff", "stroke-width": 1.4, "stroke-dasharray": i === 1 ? "30 12 4 12" : "6 8", opacity: .8 }, core);
  });
  const [, orbY] = iso(0, 0, 1.8);
  const halo = el("circle", { cx: kx, cy: orbY, r: 34, fill: "#c6f432", opacity: .25, filter: "url(#glowBig)" }, core);
  const orb = el("circle", { cx: kx, cy: orbY, r: 13, fill: "url(#coreG)" }, core);
  el("text", { x: kx, y: ky + 46, "text-anchor": "middle", fill: "#a3a6a8", "font-family": "JetBrains Mono, monospace", "font-size": 11, "letter-spacing": "1.5" }, core).textContent = "ORCHESTRATOR";

  // ---------- Hologramm-Panel oben ----------
  const holo = el("g");
  const [hx, hy] = iso(0, 0, 6.3);
  el("rect", { x: hx - 150, y: hy - 58, width: 300, height: 76, rx: 10, fill: "rgba(94,230,255,.06)", stroke: "rgba(94,230,255,.45)" }, holo);
  el("rect", { x: hx - 150, y: hy - 58, width: 300, height: 20, rx: 10, fill: "rgba(94,230,255,.10)" }, holo);
  const hTitle = el("text", { x: hx - 136, y: hy - 44, fill: "#5ee6ff", "font-family": "JetBrains Mono, monospace", "font-size": 10.5, "letter-spacing": "1" }, holo);
  hTitle.textContent = "OUTPUT // MERGED RESULT";
  const hLine = el("text", { x: hx - 136, y: hy - 18, fill: "#f4f4f2", "font-family": "JetBrains Mono, monospace", "font-size": 12 }, holo);
  const hBarBg = el("rect", { x: hx - 136, y: hy - 6, width: 272, height: 4, rx: 2, fill: "rgba(244,244,242,.1)" }, holo);
  const hBar = el("rect", { x: hx - 136, y: hy - 6, width: 0, height: 4, rx: 2, fill: "#c6f432" }, holo);
  hLine.textContent = "Waiting for agents …";
  // Text nie breiter als das Panel: notfalls zusammenschieben
  const setLine = (txt) => {
    hLine.textContent = txt; hLine.removeAttribute("textLength"); hLine.removeAttribute("lengthAdjust");
    try { if (hLine.getComputedTextLength() > 272) { hLine.setAttribute("textLength", 272); hLine.setAttribute("lengthAdjust", "spacingAndGlyphs"); } } catch { /* noch nicht sichtbar */ }
  };

  // ---------- Büros ----------
  const backLayer = el("g"), officesLayer = el("g");
  const screens = [];
  const W = 1.45, H = 1.7;
  function office(t) {
    const g = el("g", { class: "office", tabindex: 0, "data-id": t.id }, t.x + t.y < 0 ? backLayer : officesLayer);
    const x0 = t.x - W, x1 = t.x + W, y0 = t.y - W, y1 = t.y + W;
    // Boden + Rückwände
    el("polygon", { points: P([x0, y0, 0.01], [x1, y0, 0.01], [x1, y1, 0.01], [x0, y1, 0.01]), fill: "rgba(198,244,50,.05)", stroke: "rgba(198,244,50,.35)" }, g);
    el("polygon", { points: P([x0, y0, 0], [x1, y0, 0], [x1, y0, H], [x0, y0, H]), fill: "rgba(244,244,242,.035)", stroke: "rgba(244,244,242,.14)" }, g);
    el("polygon", { points: P([x0, y0, 0], [x0, y1, 0], [x0, y1, H], [x0, y0, H]), fill: "rgba(244,244,242,.05)", stroke: "rgba(244,244,242,.14)" }, g);
    // Schreibtisch
    el("polygon", { points: P([t.x - 0.9, t.y - 0.25, 0.55], [t.x + 0.9, t.y - 0.25, 0.55], [t.x + 0.9, t.y + 0.25, 0.55], [t.x - 0.9, t.y + 0.25, 0.55]), fill: "#2a2e31", stroke: "rgba(244,244,242,.2)" }, g);
    // Zwei Agenten mit Bildschirm
    [-0.5, 0.5].forEach((dx) => {
      const ax = t.x + dx, ay = t.y + 0.75;
      // Bildschirm (zum Agenten gedreht)
      const scr = el("polygon", { points: P([ax - 0.32, t.y - 0.15, 0.62], [ax + 0.32, t.y - 0.15, 0.62], [ax + 0.32, t.y - 0.15, 1.12], [ax - 0.32, t.y - 0.15, 1.12]), fill: "#5ee6ff", opacity: .55, filter: "url(#glow)" }, g);
      screens.push(scr);
      // Code-Zeilen auf dem Bildschirm
      for (let r = 0; r < 3; r++) el("polyline", { points: P([ax - 0.24, t.y - 0.16, 1.0 - r * 0.11], [ax - 0.24 + 0.15 + Math.random() * 0.3, t.y - 0.16, 1.0 - r * 0.11]), stroke: "#121314", "stroke-width": 1.4, opacity: .7 }, g);
      // Agent: Körper + Kopf (leuchtend)
      const [bx, by] = iso(ax, ay, 0.35);
      el("ellipse", { cx: bx, cy: by + 6, rx: 9, ry: 4.5, fill: "rgba(0,0,0,.4)" }, g);
      el("path", { d: `M${bx - 8},${by + 6} Q${bx - 8},${by - 12} ${bx},${by - 12} Q${bx + 8},${by - 12} ${bx + 8},${by + 6} Z`, fill: "#e9ece6" }, g);
      const head = el("circle", { cx: bx, cy: by - 20, r: 6.5, fill: "#f4f4f2" }, g);
      el("circle", { cx: bx, cy: by - 20, r: 2.2, fill: "#c6f432" }, g);
      t.heads = (t.heads || []).concat(head);
    });
    // Vordere Glaswände
    const glass = el("g", { class: "glass", opacity: .75 }, g);
    el("polygon", { points: P([x1, y0, 0], [x1, y1, 0], [x1, y1, H], [x1, y0, H]), fill: "rgba(94,230,255,.06)", stroke: "rgba(94,230,255,.35)" }, glass);
    el("polygon", { points: P([x0, y1, 0], [x1, y1, 0], [x1, y1, H], [x0, y1, H]), fill: "rgba(94,230,255,.08)", stroke: "rgba(94,230,255,.35)" }, glass);
    el("polygon", { points: P([x0, y0, H], [x1, y0, H], [x1, y1, H], [x0, y1, H]), fill: "rgba(94,230,255,.04)", stroke: "rgba(198,244,50,.55)" }, glass);
    // Schild über dem Büro
    const [lx, ly] = iso(t.x, t.y, H + 1.15);
    const tag = el("g", {}, g);
    el("line", { x1: lx, y1: ly + 12, x2: lx, y2: iso(t.x, t.y, H)[1], stroke: "rgba(198,244,50,.35)", "stroke-dasharray": "2 3" }, tag);
    el("rect", { x: lx - 58, y: ly - 14, width: 116, height: 26, rx: 13, fill: "rgba(18,19,20,.88)", stroke: "rgba(198,244,50,.45)" }, tag);
    t.dot = el("circle", { cx: lx - 42, cy: ly - 1, r: 3.5, fill: "#c6f432" }, tag);
    el("text", { x: lx - 32, y: ly + 3, fill: "#f4f4f2", "font-family": "JetBrains Mono, monospace", "font-size": 11, "font-weight": 600, "letter-spacing": "1" }, tag).textContent = t.name;
    t.g = g;
  }
  // Zeichenreihenfolge: hinten zuerst
  [...TEAMS].sort((a, b) => a.x + a.y - (b.x + b.y)).forEach(office);
  // Kern zwischen hinteren und vorderen Büros
  svg.insertBefore(core, officesLayer);
  officesLayer.before(core);
  officesLayer.after(holo);

  // ---------- Datenpakete ----------
  const packets = el("g");
  const live = [];
  function spawn(t) {
    const g = el("g", {}, packets);
    el("polygon", { points: "0,-5 6,0 0,5 -6,0", fill: "#c6f432", filter: "url(#glow)" }, g);
    live.push({ t, g, p: 0, speed: 0.0045 + Math.random() * 0.002 });
  }
  const outs = [];
  function spawnOut() {
    const g = el("circle", { r: 3.5, fill: "#5ee6ff", filter: "url(#glow)" }, packets);
    outs.push({ g, p: 0 });
  }

  // ---------- Ticker & Hologramm ----------
  const ticker = document.getElementById("hq-ticker");
  const stats = document.getElementById("hq-stats");
  let merged = 0, buffer = new Set(), barW = 0;
  const now = () => new Date().toTimeString().slice(0, 8);
  function log(agent, msg) {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `<span class="t">${now()}</span><span class="a">[${agent}]</span><span class="m">${msg}</span>`;
    ticker.appendChild(row);
    while (ticker.children.length > 5) ticker.firstChild.remove();
  }
  const RESULTS = ["Weekly report sent to CEO ✓", "Offer + invoice sent to client ✓", "Pipeline & cash forecast updated ✓", "Customer reply approved & sent ✓"];

  function arrive(t) {
    buffer.add(t.id);
    pulse = 1;
    const o = t.out[Math.floor(Math.random() * t.out.length)];
    log("orchestrator", `received <b>${o}</b> from ${t.id}-agent`);
    barW = Math.min(272, (buffer.size / TEAMS.length) * 272);
    setLine(`Merging ${buffer.size}/4 streams …`);
    if (buffer.size === TEAMS.length) {
      buffer.clear(); merged++;
      setTimeout(() => {
        const r = RESULTS[merged % RESULTS.length];
        setLine(r); barW = 272; spawnOut();
        log("orchestrator", `<b>${r}</b>`);
        stats.textContent = `4 teams · 8 agents · ${merged} tasks merged`;
        setTimeout(() => { barW = 0; }, 1600);
      }, 500);
    }
  }

  // Aufgaben starten
  function work(t) {
    const task = t.tasks[Math.floor(Math.random() * t.tasks.length)];
    log(`${t.id}-agent`, task + " …");
    t.busy = 1;
    setTimeout(() => { spawn(t); t.busy = 0; }, 900 + Math.random() * 1400);
  }

  // ---------- Tooltip ----------
  const tip = document.getElementById("hq-tip");
  const hq = document.getElementById("hq");
  TEAMS.forEach((t) => {
    const show = () => {
      const b = t.g.getBoundingClientRect(), h = hq.getBoundingClientRect();
      tip.innerHTML = `<b>${t.name} TEAM · 2 agents</b>now: ${t.tasks[0]}<br>tools: ${{ research: "web search, RSS, PDFs", sales: "CRM, email, calendar", support: "helpdesk, email, FAQ", finance: "accounting, bank feed, sheets" }[t.id]}<br><span class="ok">● online · sends to orchestrator</span>`;
      tip.style.left = Math.min(h.width - 250, Math.max(10, b.left - h.left + b.width / 2 - 115)) + "px";
      tip.style.top = Math.max(50, b.top - h.top - 20) + "px";
      tip.classList.add("on"); t.g.classList.add("focus");
    };
    const hide = () => { tip.classList.remove("on"); t.g.classList.remove("focus"); };
    t.g.addEventListener("mouseenter", show); t.g.addEventListener("mouseleave", hide);
    t.g.addEventListener("focus", show); t.g.addEventListener("blur", hide);
  });

  // ---------- Animation ----------
  let pulse = 0, last = performance.now(), dash = 0, rot = 0;
  const ptOnPath = (t, p) => { const [a, b] = t.path; return iso(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, 0.25); };
  function frame(ts) {
    const dt = Math.min(50, ts - last); last = ts;
    dash -= dt * 0.03; rot += dt * 0.02;
    TEAMS.forEach((t) => t.lane.setAttribute("stroke-dashoffset", dash.toFixed(1)));
    rings.forEach((r, i) => r.setAttribute("stroke-dashoffset", (i % 2 ? -rot : rot).toFixed(1)));
    // Bildschirme flackern
    if (Math.random() < 0.25) { const s = screens[Math.floor(Math.random() * screens.length)]; s.setAttribute("opacity", (0.35 + Math.random() * 0.5).toFixed(2)); }
    // Status-Punkte
    TEAMS.forEach((t) => t.dot.setAttribute("fill", t.busy && Math.floor(ts / 250) % 2 ? "#5ee6ff" : "#c6f432"));
    // Pakete
    for (let i = live.length - 1; i >= 0; i--) {
      const k = live[i]; k.p += k.speed * dt / 16;
      const [x, y] = ptOnPath(k.t, Math.min(1, k.p));
      k.g.setAttribute("transform", `translate(${x.toFixed(1)},${y.toFixed(1)})`);
      if (k.p >= 1) { k.g.remove(); live.splice(i, 1); arrive(k.t); }
    }
    for (let i = outs.length - 1; i >= 0; i--) {
      const o = outs[i]; o.p += 0.012 * dt / 16;
      o.g.setAttribute("cx", kx); o.g.setAttribute("cy", (orbY - (orbY - hy - 18) * o.p).toFixed(1));
      if (o.p >= 1) { o.g.remove(); outs.splice(i, 1); }
    }
    // Kern pulsiert
    pulse = Math.max(0, pulse - dt * 0.0025);
    const base = 0.22 + 0.06 * Math.sin(ts / 600);
    halo.setAttribute("opacity", (base + pulse * 0.5).toFixed(2));
    orb.setAttribute("r", (13 + pulse * 6).toFixed(1));
    // Fortschrittsbalken
    const cur = +hBar.getAttribute("width"); hBar.setAttribute("width", (cur + (barW - cur) * 0.08).toFixed(1));
    requestAnimationFrame(frame);
  }

  if (reduce) {
    setLine("Weekly report sent to CEO ✓"); hBar.setAttribute("width", 272);
    log("research-agent", "12 leads qualified"); log("sales-agent", "offer drafted"); log("orchestrator", "<b>Weekly report sent to CEO ✓</b>");
    return;
  }
  // Nur animieren, wenn sichtbar
  let started = false;
  new IntersectionObserver((e) => {
    if (e[0].isIntersecting && !started) {
      started = true;
      requestAnimationFrame(frame);
      TEAMS.forEach((t, i) => setTimeout(function loop() { work(t); setTimeout(loop, 3800 + Math.random() * 2600); }, 400 + i * 700));
    }
  }, { threshold: 0.15 }).observe(hq);
})();
