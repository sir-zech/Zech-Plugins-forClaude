# token-meter

A live usage meter for the Claude Code statusline. It leads with your **plan usage** — the 5-hour rolling limit that actually throttles you (the same number the Claude app shows under "Current session") — and keeps the **context-window** fill as a small secondary readout.

```
[CAVEMAN] ⬡ Opus 4.8 · ▕██░░░░░░░░░░▏ 14% 5h (4h31m left) · ctx 36% · 7d 9% · $0.21
```

| Part | Meaning |
|------|---------|
| `⬡ Opus 4.8` | active model |
| `▕██░░░░░░░░░░▏ 14% 5h` | **5-hour plan limit used** — green &lt;60%, yellow 60–85%, red ≥85% |
| `(4h31m left)` | time until the 5-hour window resets |
| `ctx 36%` | context window used (this conversation vs its 200k/1M limit) |
| `7d 9%` | 7-day plan limit used (shown only if present) |
| `$0.21` | session cost so far |
| `[CAVEMAN]` | caveman tag, re-rendered if you use the caveman plugin |

## Two different "usages" — don't confuse them

- **Plan usage** (`5h` / `7d`): how much of your Pro/Max allowance you've burned across *all* sessions in the rolling window. This is what stops you when you hit it. **This is the headline.**
- **Context usage** (`ctx`): how full *this one conversation* is (clears when you `/clear` or `/compact`). Useful, but unrelated to the plan limit.

## Where the numbers come from

All from the JSON Claude Code pipes to the statusline on stdin — **no API calls, no network**:

- `rate_limits.five_hour.used_percentage` / `.resets_at` → the `5h` meter
- `rate_limits.seven_day.used_percentage` → the `7d` meter
- `context_window.used_percentage` → the `ctx` meter
- `cost.total_cost_usd` → cost

Notes:
- `rate_limits` is sent **only for Claude.ai Pro/Max subscribers**, and only **after the first API response** in a session. Until then the meter shows `5h —`.
- Requires **Claude Code ≥ 2.1.132** for the native `rate_limits` / `context_window` fields. On older versions the `ctx` value falls back to tail-reading the transcript; `5h` is unavailable.
- The script never throws — a crash would blank the statusline.

## Enable it

Point your statusline at this script (absolute path — env vars are not expanded when the statusline runs):

```jsonc
// <config>/settings.json   (this session's config dir is .claude-cris)
"statusLine": {
  "type": "command",
  "command": "node \"W:\\Work Space\\Play & Practice\\Claude Plugins and Skills\\token-meter\\scripts\\statusline.mjs\""
}
```

Or run **`/token-meter-enable`** and Claude wires it for you. Enabling replaces any current statusline; this script re-renders the `[CAVEMAN]` tag so the caveman indicator is preserved.

## Config (env vars)

| Var | Default | Effect |
|-----|---------|--------|
| `TOKEN_METER_WIDTH` | `12` | bar width in cells |
| `TOKEN_METER_LIMIT` | `200000` | context-size fallback, only used on old Claude Code that doesn't send `context_window` |
| `STATUSLINE_SHOW_PLUGINS` | `1` | second line listing live plugins (from the `live-plugins` plugin); set `0` to hide |
| `STATUSLINE_PLUGINS_MODULE` | auto | path to `live-plugins/scripts/plugins-line.mjs`; set when the plugins are installed to separate dirs |
| `NO_COLOR` | — | disable ANSI color |

When the `live-plugins` plugin sits next to this one, the statusline appends a `[CHIP]` row below the meter — live plugins, each in its own color (cycling from orange).

## Install

From the published marketplace:

```
/plugin marketplace add sir-zech/Zech-Plugins-forClaude
/plugin install token-meter@zech-plugins
```

Or from a local checkout:

```
/plugin marketplace add "W:\Work Space\Play & Practice\Claude Plugins and Skills\token-meter"
/plugin install token-meter@token-meter
```
