<div align="center">

# 🖊️ diagrammer

### Plain-language → correct, renderable software diagrams — the right tool picked per type

[![Plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)](https://github.com/sir-zech/Zech-Plugins-forClaude)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](./.claude-plugin/plugin.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](../LICENSE)

`/usecase` · `/flow` · `/dfd`

</div>

---

## ✨ What it does

Describe a diagram in plain English. diagrammer picks the right tool, writes the diagram **source** to a file, shows it in a fenced block, and renders it to **SVG/PNG**.

| Diagram type | Tool | Output |
|------|------|--------|
| Use Case | PlantUML | `.puml` |
| Control Flow / flowchart | Mermaid | `.mmd` |
| Data Flow Diagram (DFD) | Graphviz *or* PlantUML | `.dot` / `.puml` |
| Sequence / Class / State / ER | Mermaid | `.mmd` |

---

## ⚡ Commands

| Command | Draws | Example argument |
|---------|-------|------------------|
| `/usecase <desc>` | UML **Use Case** (PlantUML) | `online bookstore: browse, buy, review` |
| `/flow <desc>` | **Control flow / flowchart** (Mermaid) | `user login with 2FA` |
| `/dfd <desc>` | **Data Flow Diagram** (Graphviz / PlantUML) | `ordering system, context + level 1` |

### How to activate

1. **Install** the plugin (below) — the commands register automatically.
2. **Slash command** — type it with your description:
   ```text
   /flow user login with 2FA
   /usecase online bookstore: browse, buy, review
   /dfd ordering system, context + level 1
   ```
3. **Natural language** — the **`diagrammer` skill** auto-fires when you say *"draw / sketch / visualize"* a *diagram, flowchart, use case, control flow, data flow / DFD, UML*, or mention *Mermaid / PlantUML / Graphviz*. No command needed:
   > *"draw a use case diagram for an online bookstore"*

---

## 🚀 Install

From the published marketplace:

```text
/plugin marketplace add sir-zech/Zech-Plugins-forClaude
/plugin install diagrammer@zech-plugins
```

Or from a local checkout:

```text
/plugin marketplace add "W:/Work Space/Play & Practice/Claude Plugins and Skills/diagrammer"
/plugin install diagrammer@diagrammer
```

> ℹ️ `plugin@marketplace` — both are named `diagrammer` in the local case.

---

## 🎨 Rendering setup (install only what you use)

| Renderer | Provides | Install |
|----------|----------|---------|
| mermaid-cli | `mmdc` | `npm install -g @mermaid-js/mermaid-cli` |
| Graphviz | `dot` | `choco install graphviz` / `brew install graphviz` / `apt install graphviz` |
| PlantUML | `plantuml` or `java -jar plantuml.jar` | Java + [plantuml.jar](https://plantuml.com/download), then set `PLANTUML_JAR` |

Render a source file manually:

```text
pwsh scripts/render.ps1 -File checkout-flow.mmd -Format svg
./scripts/render.sh order-dfd.dot svg
```

> 🌐 No local renderer? Re-run with `-AllowRemote` (PowerShell) / `--allow-remote` (bash) to render via **kroki.io**. This sends your diagram source to a public server — **off by default**.

---

## 🧩 Components

- **`skills/diagrammer/SKILL.md`** — auto-triggers on diagram keywords; holds the tool-selection table + workflow.
- **`skills/diagrammer/references/`** — deep syntax cheatsheets per type (`usecase.md`, `controlflow.md`, `dfd.md`).
- **`commands/`** — `/usecase`, `/flow`, `/dfd` for explicit invocation.
- **`scripts/render.ps1` / `render.sh`** — render a source file to SVG/PNG.
- **`.claude-plugin/`** — `plugin.json` + `marketplace.json`.

---

## 📝 Notes

- The renderer never sends source to a remote server unless you pass the remote flag.
- DFDs follow Yourdon / Gane–Sarson notation; see `references/dfd.md`.
- Diagram-type → tool mapping lives in `SKILL.md`; tweak it there to change defaults.

---

## 📜 License

[MIT](../LICENSE) © [sir-zech](https://github.com/sir-zech)
