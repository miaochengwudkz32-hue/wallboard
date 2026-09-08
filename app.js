// Wallboard v0.1.1 — config-driven student dashboard
// Data source: config.json (same folder). Falls back to DEFAULT_CONFIG on file://.

const DEFAULT_CONFIG = {
  layout: { weekbar: "tl", clocks: "tr", courses: "ml", deadlines: "bl", events: "br" },
  clocks: [
    { city: "Boston", tz: "America/New_York" },
    { city: "Shanghai", tz: "Asia/Shanghai" }
  ],
  termStart: "2027-01-11",
  courses: [
    { days: [1, 3], time: "09:00-10:30", name: "Engineering Math" },
    { days: [2, 4], time: "13:00-14:30", name: "Control Systems" }
  ],
  deadlines: [
    { name: "HW1 (Math)", due: "2026-09-20T23:59" },
    { name: "Lab Report", due: "2026-10-01T17:00" }
  ],
  events: [
    { name: "赴美出发", date: "2026-12-28" },
    { name: "开学第一天", date: "2027-01-11" }
  ],
  refreshSeconds: 30
};

const DAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const POS = ["tl", "tc", "tr", "ml", "c", "mr", "bl", "bc", "br", "none"];

function loadConfig() {
  return fetch("config.json")
    .then(r => (r.ok ? r.json() : DEFAULT_CONFIG))
    .catch(() => DEFAULT_CONFIG);
}

/* 把 config.layout 的关键字应用到面板位置 */
function applyLayout(layout) {
  const map = { weekbar: "weekbar", clocks: "clocks", courses: "courses", deadlines: "deadlines", events: "events" };
  for (const [key, id] of Object.entries(map)) {
    const el = document.getElementById(id);
    el.className = "panel " + (POS.includes(layout[key]) ? "pos-" + layout[key] : "pos-" + key);
  }
}

/* 该时区的日期字符串（用于和系统本地日期比较） */
function dateInTz(now, tz) {
  return now.toLocaleDateString("en-CA", { timeZone: tz }); // YYYY-MM-DD
}

function renderClocks(cfg, now) {
  const localDate = dateInTz(now, Intl.DateTimeFormat().resolvedOptions().timeZone);
  document.getElementById("clocks").innerHTML = cfg.clocks
    .map(c => {
      const t = now.toLocaleTimeString("en-GB", { timeZone: c.tz, hour: "2-digit", minute: "2-digit" });
      // 只有时差导致该时区日期与系统本地日期不同时，才显示那边的日期
      const d = dateInTz(now, c.tz);
      const badge = d !== localDate ? `<div class="date">${d.slice(5).replace("-", "/")}</div>` : "";
      return `<div class="clock"><div class="city">${c.city}</div><div class="time">${t}</div>${badge}</div>`;
    })
    .join("");
}

function renderWeekbar(cfg, now) {
  const el = document.getElementById("weekbar");
  if (!cfg.termStart) { el.className += " hidden"; return; }
  const start = new Date(cfg.termStart + "T00:00");
  const days = Math.floor((now - start) / 864e5);
  const week = Math.floor(days / 7) + 1;
  el.innerHTML = days < 0
    ? `距开学 <span style="color:#ffd166">${Math.abs(days)}</span> 天<small>${DAY_NAMES[now.getDay()]}</small>`
    : `第 ${week} 周<small>${DAY_NAMES[now.getDay()]}</small>`;
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

function renderEvents(cfg, now) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const items = cfg.events
    .map(e => ({ ...e, days: Math.round((new Date(e.date + "T00:00") - today) / 864e5) }))
    .filter(e => e.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 3);
  document.getElementById("eventlist").innerHTML = items.length
    ? items.map(e => {
        const cls = e.days <= 7 ? "urgent" : e.days <= 30 ? "soon" : "";
        return `<div class="item ${cls}"><small>${e.days === 0 ? "TODAY" : e.days + " d"}</small>${e.name}</div>`;
      }).join("")
    : `<div class="empty">—</div>`;
}

function tick(cfg) {
  const now = new Date();
  renderClocks(cfg, now);
  renderWeekbar(cfg, now);
  renderCourses(cfg, now);
  renderDeadlines(cfg, now);
  renderEvents(cfg, now);
}

loadConfig().then(cfg => {
  applyLayout(cfg.layout || DEFAULT_CONFIG.layout);
  tick(cfg);
  setInterval(() => tick(cfg), (cfg.refreshSeconds || 30) * 1000);
});
