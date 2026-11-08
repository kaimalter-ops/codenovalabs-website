// CodeNova Labs – kleine Effekte ohne Bibliotheken
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Jahr im Footer
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Menü am Handy
  const btn = document.querySelector(".menu-btn");
  const menu = document.getElementById("menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }));
  }

  // Untermenü „Products“ (Klick/Tastatur; am Desktop zusätzlich per Hover via CSS)
  document.querySelectorAll(".has-sub").forEach((li) => {
    const b = li.querySelector(".sub-btn");
    if (!b) return;
    const set = (open) => { li.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open)); };
    b.addEventListener("click", (e) => { e.stopPropagation(); set(!li.classList.contains("open")); });
    li.addEventListener("keydown", (e) => { if (e.key === "Escape") { set(false); b.focus(); } });
    document.addEventListener("click", (e) => { if (!li.contains(e.target)) set(false); });
  });

  // Kontaktformular: Thema aus der Adresse vorwählen (z. B. /?topic=CodeNova%20Blog#contact)
  const topic = new URLSearchParams(location.search).get("topic");
  const topicSelect = document.querySelector('#contact-form select[name="topic"]');
  if (topic && topicSelect) [...topicSelect.options].forEach((o) => { if (o.text === topic) o.selected = true; });

  // Einblenden beim Scrollen
  const items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) items.forEach((el) => el.classList.add("in"));
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  // Terminal: Zeilen nacheinander tippen
  const term = document.getElementById("term");
  if (term) {
    const lines = [
      ["p", "$ ", "codenova init --project \"your-idea\""],
      ["ok", "✓ ", "research   user interviews & data"],
      ["ok", "✓ ", "design     ui / ux prototypes"],
      ["ok", "✓ ", "build      web · ios · android"],
      ["ok", "✓ ", "automate   ai agents with n8n"],
      ["p", "$ ", "deploy --production"],
      ["k", "→ ", "shipped. ready for real users."],
    ];
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const render = (done, partial) =>
      done.map(([c, pre, txt]) => `<span class="${c}">${pre}</span>${esc(txt)}`).join("\n") +
      (partial ? `${done.length ? "\n" : ""}<span class="${partial[0]}">${partial[1]}</span>${esc(partial[2])}` : "") +
      '<span class="cursor"></span>';
    if (reduce) term.innerHTML = render(lines);
    else {
      let i = 0;
      let j = 0;
      const tick = () => {
        if (i >= lines.length) {
          term.innerHTML = render(lines);
          setTimeout(() => { i = 0; j = 0; tick(); }, 5200);
          return;
        }
        const [c, pre, txt] = lines[i];
        const typed = c === "p" ? txt.slice(0, j) : txt;
        term.innerHTML = render(lines.slice(0, i), [c, pre, typed]);
        if (c === "p" && j < txt.length) { j++; setTimeout(tick, 38); }
        else { i++; j = 0; setTimeout(tick, c === "p" ? 420 : 260); }
      };
      tick();
    }
  }

  // Kontaktformular → n8n-Workflow „CodeNova Kontaktformular“ (CodeNova Labs/n8n/codenova-kontaktformular.json)
  // WEBHOOK_URL = Production URL des Webhooks, z. B. https://dein-n8n/webhook/codenova-contact (nicht /webhook-test/)
  const WEBHOOK_URL = "https://n8n.ubxplanner.com/webhook/codenova-contact";
  const form = document.getElementById("contact-form");
  if (form) {
    const msg = form.querySelector(".form-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data.website) return; // Spam-Falle
      if (!data.name || !data.email || !data.message || !String(data.email).includes("@")) {
        msg.textContent = "> Please fill in name, email and message.";
        return;
      }
      if (!WEBHOOK_URL) {
        msg.textContent = "> Our contact form goes live very soon. Thanks for your patience!";
        return;
      }
      msg.textContent = "> Sending …";
      try {
        const res = await fetch(WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
        if (res.status === 429) {
          msg.textContent = "> Too many messages in a short time. Please try again in an hour.";
          return;
        }
        if (res.status === 400) {
          msg.textContent = "> Please check your name, email and message.";
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        msg.textContent = "> Message sent. We’ll get back to you soon.";
      } catch {
        msg.textContent = "> Something went wrong. Please try again later or email us directly.";
      }
    });
  }
})();
