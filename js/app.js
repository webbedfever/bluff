/* =========================================================
   Bluff — static prototype interactions
   Visual behavior only: routing between placeholder views,
   profile menu, toggles, and empty structural slots.
   No data fetching, no game/stat/credit logic.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Hash routing between views ---------- */
  const ROUTES = ["home", "scores", "stats", "groups", "predictions", "matchup"];
  const views = document.querySelectorAll("[data-view]");
  const navLinks = document.querySelectorAll("[data-route]");
  const main = document.getElementById("main");

  function showRoute() {
    const hash = (location.hash || "#home").slice(1);
    const route = ROUTES.includes(hash) ? hash : "notfound";

    views.forEach((v) => { v.hidden = v.dataset.view !== route; });
    navLinks.forEach((a) => {
      const active = a.dataset.route === route;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    const title = route === "home" ? "Bluff — NBA hub" : `${capitalize(route === "matchup" ? "2K Matchups" : route)} — Bluff`;
    document.title = title;
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  window.addEventListener("hashchange", () => {
    showRoute();
    window.scrollTo({ top: 0 });
    main.focus({ preventScroll: true });
  });
  showRoute();

  /* ---------- Profile dropdown ---------- */
  const profileBtn = document.getElementById("profileButton");
  const profileMenu = document.getElementById("profileMenu");
  const menuItems = () => Array.from(profileMenu.querySelectorAll('[role="menuitem"]'));

  function openMenu(focusFirst) {
    profileMenu.hidden = false;
    profileBtn.setAttribute("aria-expanded", "true");
    if (focusFirst) menuItems()[0].focus();
  }
  function closeMenu(returnFocus) {
    profileMenu.hidden = true;
    profileBtn.setAttribute("aria-expanded", "false");
    if (returnFocus) profileBtn.focus();
  }

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.hidden ? openMenu(e.detail === 0) : closeMenu(false);
  });

  document.addEventListener("click", (e) => {
    if (!profileMenu.hidden && !profileMenu.contains(e.target)) closeMenu(false);
  });

  profileMenu.addEventListener("click", (e) => {
    if (e.target.closest('[role="menuitem"]')) closeMenu(false);
  });

  profileMenu.addEventListener("keydown", (e) => {
    const items = menuItems();
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
    if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
    if (e.key === "Tab") closeMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !profileMenu.hidden) closeMenu(true);
    // "/" focuses search, like most sports/media apps
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      document.querySelector(".search input").focus();
    }
  });

  /* ---------- Date line (display only) ---------- */
  const dateEl = document.getElementById("todayDate");
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" });

  function setDate(offset) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    dateEl.textContent = fmt.format(d);
  }
  setDate(0);

  /* ---------- Segmented controls (visual toggle only) ---------- */
  document.querySelectorAll(".segmented").forEach((group) => {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".segmented__btn");
      if (!btn) return;
      group.querySelectorAll(".segmented__btn").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      if (btn.dataset.day !== undefined) setDate(Number(btn.dataset.day));
    });
  });

  /* ---------- Filter chips (visual toggle only) ---------- */
  document.querySelectorAll(".chips").forEach((group) => {
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      group.querySelectorAll(".chip").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
    });
  });

  /* ---------- Structural placeholders ---------- */
  // Scoreboard: 6 empty game slots (layout only — no team or score data)
  const rail = document.getElementById("boardRail");
  const tpl = document.getElementById("slotTemplate");
  for (let i = 0; i < 6; i++) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.style.setProperty("--i", i);
    rail.appendChild(node);
  }

  // Standings: empty rows (rank positions only). Dashed rule after 6th = playoff line.
  const body = document.getElementById("standingsBody");
  const ROWS = 8;
  for (let r = 1; r <= ROWS; r++) {
    const tr = document.createElement("tr");
    if (r === 6) tr.className = "is-cut";
    tr.innerHTML =
      `<td class="num">${r}</td>` +
      `<td><span class="team-cell"><span class="slot__logo slot__logo--sm"></span><span class="bar bar--sm"></span></span></td>` +
      `<td class="num">—</td><td class="num">—</td><td class="num">—</td><td class="num">—</td>`;
    body.appendChild(tr);
  }
})();
