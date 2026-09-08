// Wallboard v0.1 — config-driven student dashboard
// Data source: config.json (same folder). If opened via file:// without a server,
// falls back to DEFAULT_CONFIG so the page still renders in a plain browser.

const DEFAULT_CONFIG = {
  clocks: [
    { city: "Boston", tz: "America/New_York" },
    { city: "Shanghai", tz: "Asia/Shanghai" }
  ],
  courses: [
    { days: [1, 3], time: "09:00-10:30", name: "Engineering Math" },
    { days: [2, 4], time: "13:00-14:30", name: "Control Systems" }
  ],
  deadlines: [
    { name: "HW1 (Math)", due: "2026-09-20T23:59" },
    { name: "Lab Report", due: "2026-10-01T17:00" }
  ],
  refreshSeconds: 30
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function loadConfig() {
  return fetch("config.json")
    .then(r => (r.ok ? r.json() : DEFAULT_CONFIG))
    .catch(() => DEFAULT_CONFIG);
}

function renderClocks(cfg, now) {
  document.getElementById("clocks").innerHTML = cfg.clocks
    .map(c => {
      const t = now.toLocaleTimeString("en-GB", { timeZone: c.tz, hour: "2-digit", minute: "2-digit" });
      return `<div class="clock"><div class="city">${c.city}</div><div class="time">${t}</div></div>`;
    })
    .join("");
}

function renderCourses(cfg, now) {
  const today = now.getDay();
  const list = cfg.courses
    .filter(c => c.days.includes(today))
    .sort((a, b) => a.time.localeCompare(b.time));
  document.getElementById("courselist").innerHTML = list.length
    ? list.map(c => `<div class="item"><small>${c.time}</small>${c.name}</div>`).join("")
    : `<div class="empty">No class today — good day for the gym.</div>`;
}

function renderDeadlines(cfg, now) {
  const items = cfg.deadlines
    .map(d => ({ ...d, ms: new Date(d.due) - now }))
    .filter(d => d.ms > -864e5)
    .sort((a, b) => a.ms - b.ms)
    .slice(0, 4);
  document.getElementById("ddllist").innerHTML = items.length
    ? items.map(d => {
        const h = d.ms / 36e5;
        const cls = h < 24 ? "urgent" : h < 72 ? "soon" : "";
        const label = h < 48 ? Math.max(0, Math.floor(h)) + " h" : Math.floor(h / 24) + " days";
        return `<div class="item ${cls}"><small>${label} left</small>${d.name}</div>`;
      }).join("")
    : `<div class="empty">Nothing due. Enjoy it.</div>`;
}

function tick(cfg) {
  const now = new Date();
  document.getElementById("date").textContent =
    now.toLocaleDateString("zh-CN", { month: "long", day: "numeric", year: "numeric" });
  document.getElementById("weekday").textContent = DAY_NAMES[now.getDay()];
  renderClocks(cfg, now);
  renderCourses(cfg, now);
  renderDeadlines(cfg, now);
}

loadConfig().then(cfg => {
  tick(cfg);
  setInterval(() => tick(cfg), (cfg.refreshSeconds || 30) * 1000);
});
