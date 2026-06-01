<div align="center">

# 🧩 zech-plugins

### A small marketplace of statusline & productivity plugins for [Claude Code](https://claude.com/claude-code)

[![Marketplace](https://img.shields.io/badge/Claude%20Code-marketplace-orange)](https://github.com/sir-zech/Zech-Plugins-forClaude)
[![Plugins](https://img.shields.io/badge/plugins-3-blue)](#-the-plugins)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

`live-plugins` · `token-meter` · `diagrammer`

</div>

---

## ✨ What is this?

A **Claude Code marketplace** is just a public git repo with a `.claude-plugin/marketplace.json` catalog at its root. You add the repo once, then install individual plugins from it. This repo ships three:

| Plugin | What it does | Commands |
|--------|--------------|----------|
| 🟢 **[live-plugins](./live-plugins)** | Lists every installed plugin (live vs disabled, version, scope) and shows the live ones as colored `[CHIP]` tags in the statusline. | `/plugins-live` |
| 📊 **[token-meter](./token-meter)** | Live statusline meter — 5-hour **plan usage**, context-window fill, 7-day limit, and session cost — plus the live-plugins chip row. | `/token-meter-enable` |
| 🖊️ **[diagrammer](./diagrammer)** | Draws use-case, control-flow, and data-flow diagrams from plain text via Mermaid, PlantUML, and Graphviz. | `/usecase` · `/flow` · `/dfd` |

---

## 🚀 Install

### 1. Add the marketplace

```text
/plugin marketplace add sir-zech/Zech-Plugins-forClaude
```

> 💡 Prefer a local checkout? Clone the repo and add the path instead:
> ```text
> /plugin marketplace add "/path/to/Zech-Plugins-forClaude"
> ```

### 2. Install the plugins you want

```text
/plugin install live-plugins@zech-plugins
/plugin install token-meter@zech-plugins
/plugin install diagrammer@zech-plugins
```

> ℹ️ The `@zech-plugins` suffix is the **marketplace id** (the `name` in `marketplace.json`), not the repo name — they don't have to match.

### 3. Verify

```text
/plugins-live
```

You should see the freshly installed plugins listed as **live** (`●`).

---

## 🧩 The plugins

### 🟢 live-plugins

Shows every installed plugin and which ones are **live** (enabled), right in the terminal.

```text
  Claude Code plugins  C:\Users\you\.claude
  ─────────────────────────────────────────────────────────────
  ● caveman            @caveman                  84cc3c14fa1e  [user]
  ● frontend-design    @claude-plugins-official  —             [local,user]
  ○ firebase           @claude-plugins-official  —             [project]
  ─────────────────────────────────────────────────────────────
  ● 2 live  /  3 installed    ○ = installed, not enabled
```

Live plugins also render as colored `[CHIP]` tags in the statusline:

```text
[CAVEMAN] [FRONTEND-DESIGN] [LIVE-PLUGINS] [TOKEN-METER]
```

- `/plugins-live` — pretty table
- `/plugins-live --json` — machine-readable
- `/plugins-live --no-color` — plain text

→ Details: **[live-plugins/README.md](./live-plugins/README.md)**

### 📊 token-meter

A live statusline meter. After installing, wire it in:

```text
/token-meter-enable
```

It points `settings.json` at the meter and re-renders the `[CAVEMAN]` tag plus the live-plugins chip row.

```text
[CAVEMAN] ⬡ Opus 4.8 · ▕██░░░░░░░░░░▏ 14% 5h (4h31m left) · ctx 36% · $0.21
```

→ Details: **[token-meter/README.md](./token-meter/README.md)**

### 🖊️ diagrammer

Turns plain-language descriptions into diagrams, picking the right tool per type:

| Command | Diagram | Renderer |
|---------|---------|----------|
| `/usecase <desc>` | UML Use Case | PlantUML |
| `/flow <desc>` | Control flow / flowchart | Mermaid |
| `/dfd <desc>` | Data Flow Diagram | Graphviz / PlantUML |

Emits diagram source and renders to SVG/PNG. Install only the renderers you use — see the plugin README for setup.

→ Details: **[diagrammer/README.md](./diagrammer/README.md)**

---

## ♿ Accessibility

The statusline `[CHIP]` tags render **non-bold** — heavy weights are harder to read for many dyslexic readers. ANSI cannot choose a typeface, so for an actual dyslexic-friendly **font**, set your terminal's font to [OpenDyslexic](https://opendyslexic.org/) (or similar) in your terminal app's settings. Set `NO_COLOR=1` if color reduces readability.

---

## 🔄 Updating

Maintainers ship updates by bumping each plugin's `version` in its `plugin.json` and pushing. Users pull them with:

```text
/plugin marketplace update
```

---

## 🛠️ Requirements

- **Claude Code** (CLI, desktop, or IDE extension)
- **Node.js** — already bundled with Claude Code; the statusline scripts use it directly, with no extra dependencies and no network calls.
- **diagrammer** only: a local renderer (Mermaid CLI / PlantUML / Graphviz) for the diagram type you use.

---

## 📁 Repo layout

```text
Zech-Plugins-forClaude/
├─ .claude-plugin/
│  └─ marketplace.json     # the catalog Claude Code reads
├─ live-plugins/           # plugin: list + chip statusline
├─ token-meter/            # plugin: usage meter statusline
├─ diagrammer/             # plugin: text → diagrams
├─ LICENSE
└─ README.md
```

---

## 📜 License

[MIT](./LICENSE) © [sir-zech](https://github.com/sir-zech)
