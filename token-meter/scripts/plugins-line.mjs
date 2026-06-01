// Bundled copy of live-plugins/scripts/plugins-line.mjs.
// Installed plugins are copied to an isolated cache and can't read files outside
// their own directory, so token-meter ships its own copy rather than importing the
// live-plugins one. Keep the two in sync (or point STATUSLINE_PLUGINS_MODULE at the
// installed live-plugins module to use that instead).
//
// Renders the live (enabled) plugins as colored [CHIP] tags, à la [CAVEMAN]. Each
// plugin gets its own color, cycling from orange. "live" = enabledPlugins[key] === true.
// Returns a one-line string, or null. Honors NO_COLOR and LIVE_PLUGINS_MAX (default 10).

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const readJSON = (p) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; } };
const clean = (s) => String(s ?? '').replace(/[\x00-\x1f\x7f]/g, '');

// Distinct, readable 256-colors. Index 0 = orange (the [CAVEMAN] hue), then cycles.
const PALETTE = [
  '38;5;172', // orange
  '38;5;39',  // azure
  '38;5;42',  // green
  '38;5;170', // magenta
  '38;5;220', // gold
  '38;5;75',  // steel blue
  '38;5;203', // salmon
  '38;5;141', // violet
  '38;5;79',  // teal
  '38;5;208', // dark orange
];

export function pluginsLine(opts = {}) {
  const noColor = !!opts.noColor || !!process.env.NO_COLOR;
  const maxPlugins = opts.maxPlugins || parseInt(process.env.LIVE_PLUGINS_MAX || '', 10) || 10;
  const paint = (c, s) => (noColor ? String(s) : `\x1b[${c}m${s}\x1b[0m`);

  const configDir = process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');
  const installed = readJSON(join(configDir, 'plugins', 'installed_plugins.json'));
  if (!installed || !installed.plugins) return null;
  const enabled = (readJSON(join(configDir, 'settings.json')) || {}).enabledPlugins || {};

  // token-meter renders this very row, so its own [TOKEN-METER] chip is just noise — drop
  // it. Override the hidden set with LIVE_PLUGINS_HIDE (comma-separated plugin names).
  const hide = new Set((process.env.LIVE_PLUGINS_HIDE ?? 'token-meter')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));

  const live = Object.keys(installed.plugins)
    .filter((k) => enabled[k] === true)
    .map((k) => { const key = clean(k); const at = key.lastIndexOf('@'); return at > 0 ? key.slice(0, at) : key; })
    .filter((n) => !hide.has(n.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  if (live.length === 0) return paint('38;5;244', '[ no live plugins ]');

  let names = live;
  let extra = 0;
  if (names.length > maxPlugins) { extra = names.length - maxPlugins; names = names.slice(0, maxPlugins); }

  // Non-bold chips for dyslexia-friendliness (set OpenDyslexic as the terminal font
  // for the actual typeface — ANSI can't choose a font face).
  let s = names.map((n, i) => paint(PALETTE[i % PALETTE.length], `[${n.toUpperCase()}]`)).join(' ');
  if (extra) s += ' ' + paint('38;5;244', `+${extra}`);
  return s;
}
