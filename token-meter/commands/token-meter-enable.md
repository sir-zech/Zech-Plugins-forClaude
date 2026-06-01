---
description: Wire the token-meter live statusline into settings.json (replaces current statusline)
allowed-tools: Bash(node:*), Read, Edit
---
Enable the token-meter statusline so context-token usage shows live in the terminal.

Steps:
1. Config dir = `$CLAUDE_CONFIG_DIR` if set, else `~/.claude`.
2. The absolute path of this plugin is in `${CLAUDE_PLUGIN_ROOT}`. The statusline command must use that **resolved absolute path** (env vars are NOT expanded when the statusline runs), with backslashes escaped for JSON on Windows.
3. In `<config>/settings.json`, set:
   ```json
   "statusLine": { "type": "command", "command": "node \"<ABSOLUTE_PLUGIN_ROOT>/scripts/statusline.mjs\"" }
   ```
   Preserve every other key. Create the file as `{}` first if it does not exist.
4. Print the final `statusLine` value and tell the user to send one message (the statusline refreshes per turn).

Note: this replaces any existing statusline. The token-meter script already re-renders the `[CAVEMAN]` tag, so the caveman indicator is kept. To set a non-default limit, the user can set `TOKEN_METER_LIMIT` (e.g. 1000000 for a 1M-context model).
