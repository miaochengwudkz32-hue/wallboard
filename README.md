# Wallboard — 留学生课业壁纸

Turn your desktop wallpaper into a student dashboard: today's schedule, dual
time-zone clocks, and deadline countdowns — glanceable, zero clicks.

> Works as a wallpaper with [Lively Wallpaper](https://github.com/rocksdanister/Lively)
> (Microsoft Store) — add this folder's `index.html` as a web wallpaper.
> Also runs in any browser.

## Features (v0.1)

- Date + weekday, always visible
- Two time-zone clocks (home ↔ abroad) — configurable
- Today's courses, from `config.json`
- Deadline countdowns (red < 24 h, yellow < 72 h)

## Configuration

Edit `config.json`:

| Field | Meaning |
|---|---|
| `clocks` | city name + IANA time zone |
| `courses` | `days`: 0 = Sunday … 6 = Saturday |
| `deadlines` | `due` in `YYYY-MM-DDTHH:MM` (24 h) |
| `refreshSeconds` | how often the board re-renders |

Keep a personal copy (`config.local.json`) with your real schedule —
it is git-ignored, so your timetable never gets published.

## Roadmap

- [ ] v0.2 — auto-fetch deadlines from Canvas/any LMS via **ICS calendar feed** (no API/token needed)
- [ ] v0.3 — daily formula card (control engineering / math)
- [ ] v0.4 — theme presets, release on Lively's wallpaper library

## Use with Lively

1. Install Lively Wallpaper (Microsoft Store)
2. Lively → **Add Wallpaper** → select `index.html`
3. Done — your desktop is now the dashboard

MIT License © 2026 miaochengwudkz32-hue
