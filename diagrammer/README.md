# diagrammer

A Claude Code plugin that draws software diagrams from plain-language descriptions and
picks the right tool for each type.

| Type | Tool | Output |
|------|------|--------|
| Use Case | PlantUML | `.puml` |
| Control Flow / flowchart | Mermaid | `.mmd` |
| Data Flow Diagram (DFD) | Graphviz or PlantUML | `.dot` / `.puml` |
| Sequence / Class / State / ER | Mermaid | `.mmd` |

It emits diagram **source** in a fenced block, writes it to a file, and (optionally)
**renders** it to SVG/PNG.

## Components

- `skills/diagrammer/SKILL.md` — auto-triggers on "draw / diagram / use case / flowchart /
  DFD / UML / mermaid / plantuml". Holds the tool-selection table and workflow.
- `skills/diagrammer/references/` — deep syntax cheatsheets per type
  (`usecase.md`, `controlflow.md`, `dfd.md`).
- `commands/` — `/usecase`, `/flow`, `/dfd` for explicit invocation.
- `scripts/render.ps1` / `render.sh` — render a source file to SVG/PNG.
- `.claude-plugin/` — `plugin.json` + `marketplace.json`.

## Install

From the published marketplace:

```
/plugin marketplace add sir-zech/Zech-Plugins-forClaude
/plugin install diagrammer@zech-plugins
```

Or from a local checkout:

```
/plugin marketplace add "W:/Work Space/Play & Practice/Claude Plugins and Skills/diagrammer"
/plugin install diagrammer@diagrammer
```

(`plugin@marketplace` — both are named `diagrammer` in the local case.)

## Rendering setup (install only what you use)

| Renderer | Provides | Install |
|----------|----------|---------|
| mermaid-cli | `mmdc` | `npm install -g @mermaid-js/mermaid-cli` |
| Graphviz | `dot` | `choco install graphviz` / `brew install graphviz` / `apt install graphviz` |
| PlantUML | `plantuml` or `java -jar plantuml.jar` | Java + [plantuml.jar](https://plantuml.com/download), then set `PLANTUML_JAR` |

No local renderer? Re-run with `-AllowRemote` (PowerShell) / `--allow-remote` (bash) to
render via **kroki.io**. This sends your diagram source to a public server — off by default.

## Usage

- Natural language: *"draw a use case diagram for an online bookstore"* — the skill fires.
- Explicit: `/flow user login with 2FA`, `/dfd ordering system, context + level 1`.
- Render manually:
  ```
  pwsh scripts/render.ps1 -File checkout-flow.mmd -Format svg
  ./scripts/render.sh order-dfd.dot svg
  ```

## Notes

- The renderer never sends source to a remote server unless you pass the remote flag.
- DFDs follow Yourdon / Gane–Sarson notation; see `references/dfd.md`.
- Diagram-type → tool mapping lives in `SKILL.md`; tweak it there to change defaults.
