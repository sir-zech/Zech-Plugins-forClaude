#!/usr/bin/env node
// live-plugins: list installed Claude Code plugins and show which are live (enabled).
//
// Reads <config>/plugins/installed_plugins.json and <config>/settings.json.
// "Live" = enabled === true in settings.json -> enabledPlugins.
// Config dir = $CLAUDE_CONFIG_DIR or ~/.claude.
//
// Flags: --json (machine output), --no-color. Honors the NO_COLOR env convention.

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const NO_COLOR = !!process.env.NO_COLOR || argv.includes('--no-color');
const AS_JSON = argv.includes('--json');

const paint = (code, s) => (NO_COLOR ? String(s) : `\x1b[${code}m${s}\x1b[0m`);
const green = (s) => paint('38;5;42', s);
const dim = (s) => paint('38;5;244', s);
const bold = (s) => paint('1', s);
const yellow = (s) => paint('38;5;179', s);

const configDir = process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');

function readJSON(p) {
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

// Strip control chars so a crafted plugin name can't inject terminal escapes.
const clean = (s) => String(s ?? '').replace(/[\x00-\x1f\x7f]/g, '');

const installed = readJSON(join(configDir, 'plugins', 'installed_plugins.json'));
const settings = readJSON(join(configDir, 'settings.json')) || {};
const enabled = settings.enabledPlugins || {};

if (!installed || !installed.plugins || Object.keys(installed.plugins).length === 0) {
  console.log(dim(`No plugins installed (looked in ${join(configDir, 'plugins', 'installed_plugins.json')}).`));
  process.exit(0);
}

const rows = [];
for (const [rawKey, installs] of Object.entries(installed.plugins)) {
  const key = clean(rawKey);
  const at = key.lastIndexOf('@');
  const name = at > 0 ? key.slice(0, at) : key;
  const marketplace = at > 0 ? key.slice(at + 1) : '';
  const list = Array.isArray(installs) ? installs : [];
  const scopes = [...new Set(list.map((i) => i && i.scope).filter(Boolean))];
  const version = list.map((i) => i && i.version).find((v) => v && v !== 'unknown') || 'unknown';
  rows.push({ key, name, marketplace, live: enabled[rawKey] === true, scopes, version, installs: list.length });
}

if (AS_JSON) {
  console.log(JSON.stringify({ configDir, plugins: rows }, null, 2));
  process.exit(0);
}

rows.sort((a, b) => (Number(b.live) - Number(a.live)) || a.name.localeCompare(b.name));

const liveCount = rows.filter((r) => r.live).length;
const nameW = Math.max(4, ...rows.map((r) => r.name.length));
const rule = '  ' + '─'.repeat(nameW + 44);

console.log('');
console.log('  ' + bold('Claude Code plugins') + '  ' + dim(configDir));
console.log(rule);
for (const r of rows) {
  const dot = r.live ? green('●') : dim('○');
  const nm = r.live ? bold(r.name.padEnd(nameW)) : dim(r.name.padEnd(nameW));
  const mkt = dim('@' + (r.marketplace || '?'));
  const ver = r.version === 'unknown' ? dim('—') : yellow(r.version);
  const scope = dim('[' + (r.scopes.join(',') || '?') + ']');
  console.log(`  ${dot} ${nm}  ${mkt}  ${ver}  ${scope}`);
}
console.log(rule);
console.log(`  ${green('●')} ${green(liveCount + ' live')}  ${dim('/')}  ${rows.length} installed    ${dim('○ = installed, not enabled')}`);
console.log('');
