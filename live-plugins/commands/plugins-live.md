---
description: Show all installed plugins and which are live (enabled) in the terminal
argument-hint: "[--json] [--no-color]"
allowed-tools: Bash(node:*)
---
The command below lists every installed Claude Code plugin. `●` = live (enabled), `○` = installed but not enabled.

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/list-plugins.mjs" $ARGUMENTS`

Show the output above to the user verbatim in a code block. Do not summarize or re-order it. If it is empty, say no plugins are installed.
