<div align="center">

# 📊 token-meter

### Live **plan-usage** + context-window meter for the Claude Code statusline

[![Plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)](https://github.com/sir-zech/Zech-Plugins-forClaude)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](./.claude-plugin/plugin.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../LICENSE)

`/token-meter-enable`

</div>

---

## ✨ What it does

Leads with your **plan usage** — the 5-hour rolling limit that actually throttles you (the same number the Claude app shows under "Current session") — and keeps the **context-window** fill as a small secondary readout.

```text
[CAVEMAN] ❋ Opus 4.8 max · ▕██░░░░░░░░░░▏ 14% 5h (4h31m left) · ctx 36% · 7d 9% · $0.21
```

| Part | Meaning |
|------|---------|
| `❋ Opus 4.8` | active model (rendered in orange) |
| `max` | model reasoning effort — `low` / `medium` / `high` / `xhigh` / `max`; shown only when the model supports it |
| `▕██░░░░░░░░░░▏ 14% 5h` | **5-hour plan limit used** — green &lt;60%, yellow 60–85%, red ≥85% |
| `(4h31m left)` | time until the 5-hour window resets |
| `ctx 36%` | context window used (this conversation vs its 200k/1M limit) |
| `7d 9%` | 7-day plan limit used (shown only if present) |
| `$0.21` | session cost so far |
| `[CAVEMAN]` | caveman tag, re-rendered if you use the caveman plugin |

---

## ⚡ Commands

| Command | What it does |
|---------|--------------|
| `/token-meter-enable` | wires this statusline into your `settings.json` (replaces the current statusline) |

### How to activate

1. **Install** the plugin (below).
2. **Run `/token-meter-enable`** — it points `settings.json` at the meter using the resolved absolute path, preserves your other settings, and keeps the `[CAVEMAN]` tag + live-plugins chip row. Then send one message — the statusline refreshes per turn.
3. **Or wire it by hand** (absolute path — env vars are not expanded when the statusline runs):
   ```jsonc
   // <config>/settings.json
   "statusLine": {
     "type": "command",
     "command": "node \"W:\\Work Space\\Play & Practice\\Claude Plugins and Skills\\token-meter\\scripts\\statusline.mjs\""
   }
   ```

---

## 🤔 Two different "usages" — don't confuse them

- **Plan usage** (`5h` / `7d`): how much of your Pro/Max allowance you've burned across *all* sessions in the rolling window. This is what stops you when you hit it. **This is the headline.**
- **Context usage** (`ctx`): how full *this one conversation* is (clears when you `/clear` or `/compact`). Useful, but unrelated to the plan limit.

---

## 🔢 Where the numbers come from

All from the JSON Claude Code pipes to the statusline on stdin — **no API calls, no network**:

- `rate_limits.five_hour.used_percentage` / `.resets_at` → the `5h` meter
- `rate_limits.seven_day.used_percentage` → the `7d` meter
- `context_window.used_percentage` → the `ctx` meter
- `cost.total_cost_usd` → cost
- `effort.level` → the effort tag next to the model (omitted when the model has no effort setting)

**Notes:**
- `rate_limits` is sent **only for Claude.ai Pro/Max subscribers**, and only **after the first API response** in a session. Until then the meter shows `5h —`.
- Requires **Claude Code ≥ 2.1.132** for the native `rate_limits` / `context_window` fields. On older versions the `ctx` value falls back to tail-reading the transcript; `5h` is unavailable.
- The script never throws — a crash would blank the statusline.

---

## ⚙️ Config (env vars)

| Var | Default | Effect |
|-----|---------|--------|
| `TOKEN_METER_WIDTH` | `12` | bar width in cells |
| `TOKEN_METER_LIMIT` | `200000` | context-size fallback, only used on old Claude Code that doesn't send `context_window` |
| `STATUSLINE_SHOW_PLUGINS` | `1` | second line listing live plugins (from the `live-plugins` plugin); set `0` to hide |
| `STATUSLINE_PLUGINS_MODULE` | auto | path to `live-plugins/scripts/plugins-line.mjs`; set when the plugins are installed to separate dirs |
| `LIVE_PLUGINS_HIDE` | `token-meter` | comma-separated plugin names to omit from the live-plugins chip row; token-meter hides its own chip by default |
| `NO_COLOR` | — | disable ANSI color |

When the `live-plugins` plugin sits next to this one, the statusline appends a `[CHIP]` row below the meter — live plugins, each in its own color (cycling from orange). token-meter omits its own `[TOKEN-METER]` chip from that row (it's the thing drawing the row); change what's hidden with `LIVE_PLUGINS_HIDE`.

---

## 🚀 Install

From the published marketplace:

```text
/plugin marketplace add sir-zech/Zech-Plugins-forClaude
/plugin install token-meter@zech-plugins
```

Or from a local checkout:

```text
/plugin marketplace add "W:\Work Space\Play & Practice\Claude Plugins and Skills\token-meter"
/plugin install token-meter@token-meter
```

Then run **`/token-meter-enable`** to wire it into your statusline.

---

## 📜 License

[MIT](../LICENSE) © [sir-zech](https://github.com/sir-zech)
