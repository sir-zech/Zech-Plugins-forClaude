#!/usr/bin/env node
// live-plugins statusline widget: one line listing the live (enabled) plugins.
// Use standalone, or let token-meter compose it as a second line (default).
//
// Wire standalone in settings.json:
//   "statusLine": { "type": "command",
//     "command": "node \"<plugin>/scripts/statusline.mjs\"" }

import { pluginsLine } from './plugins-line.mjs';

const line = pluginsLine();
if (line) process.stdout.write(line);
