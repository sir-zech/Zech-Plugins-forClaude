# live-plugins

Show every installed Claude Code plugin and which ones are **live** (enabled), right in the terminal.

```
  Claude Code plugins  C:\Users\you\.claude
  ─────────────────────────────────────────────────────────────
  ● caveman            @caveman                  84cc3c14fa1e  [user]
  ● frontend-design    @claude-plugins-official  —             [local,user]
  ○ firebase           @claude-plugins-official  —             [project]
  ○ superpowers        @claude-plugins-official  5.1.0         [local]
  ─────────────────────────────────────────────────────────────
  ● 2 live  /  4 installed    ○ = installed, not enabled
```

`●` = live (enabled), `○` = installed but not enabled. Each row shows the plugin name, its `@marketplace`, the version, and the install scope(s) (`user` / `project` / `local`).

## Use

```
/plugins-live              # pretty list in the terminal
/plugins-live --json       # machine-readable
/plugins-live --no-color   # plain text
```

You can also run the script directly:

```
node "<plugin>/scripts/list-plugins.mjs"
```

## Show it live in the statusline

Live (enabled) plugins as colored `[CHIP]` tags pinned to the bottom of the terminal (à la `[CAVEMAN]`). Each plugin is a non-bold, UPPER-CASE chip in its own color, cycling from orange:

```
[CAVEMAN] [FRONTEND-DESIGN] [LIVE-PLUGINS] [TOKEN-METER]
```

Two ways to show it:

- **Combined with token-meter (default).** If your statusline is the `token-meter` script, this chip row is appended automatically below the usage meter. Nothing to wire. Turn off with `STATUSLINE_SHOW_PLUGINS=0`.
- **Standalone.** Point `settings.json` at the widget directly:
  ```jsonc
  "statusLine": { "type": "command",
    "command": "node \"W:\\Work Space\\Play & Practice\\Claude Plugins and Skills\\live-plugins\\scripts\\statusline.mjs\"" }
  ```

Cap with `LIVE_PLUGINS_MAX` (default 10; extra plugins collapse to `+N`). Only enabled plugins appear — what's loaded and in use. Run `/plugins-live` for the full table (live + disabled, versions, scope).

### Dyslexia-friendly chips

The chips render **non-bold** — heavy weights are harder to read for many dyslexic readers. ANSI cannot pick a typeface, so for an actual dyslexic-friendly **font** set your terminal's font to [OpenDyslexic](https://opendyslexic.org/) (or similar) in your terminal app's settings. Set `NO_COLOR=1` if color hurts readability.

## How it reads the data

- Config dir: `$CLAUDE_CONFIG_DIR` if set, otherwise `~/.claude`.
- Installed plugins: `<config>/plugins/installed_plugins.json`.
- Live state: a plugin counts as live when `enabledPlugins["name@marketplace"] === true` in `<config>/settings.json`. (Per-project enablement set elsewhere is not reflected — this reads your main settings file.)

No network, no dependencies — just Node (which Claude Code already ships with). Plugin names are stripped of control characters before printing, so a crafted name can't inject terminal escapes.

## Install

From the published marketplace:

```
/plugin marketplace add sir-zech/Zech-Plugins-forClaude
/plugin install live-plugins@zech-plugins
```

Or from a local checkout:

```
/plugin marketplace add "W:\Work Space\Play & Practice\Claude Plugins and Skills\live-plugins"
/plugin install live-plugins@live-plugins
```
