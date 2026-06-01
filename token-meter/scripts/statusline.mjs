#!/usr/bin/env node
// token-meter: live PLAN usage + context-window meter for the Claude Code statusline.
//
// Everything comes from the JSON Claude Code pipes on stdin — no API calls.
//   rate_limits.five_hour.used_percentage / .resets_at  -> the 5-hour plan limit
//       (the same number the Claude app shows; Pro/Max only, after the 1st API
//        response in a session — shows "5h —" until then)
//   context_window.used_percentage                      -> this conversation vs its limit
//   cost.total_cost_usd                                 -> session cost
//
// Renders, e.g.:
//   [CAVEMAN] ⬡ Opus 4.8 · ▕██░░░░░░░░░░▏ 14% 5h (4h31m left) · ctx 36% · $0.21
//
// Env: TOKEN_METER_WIDTH (bar cells, default 12), NO_COLOR. Needs Claude Code
// >= 2.1.132 for the native fields; older versions fall back to the transcript.
// Must never throw — a crash blanks the statusline.

import { readFileSync, openSync, fstatSync, readSync, closeSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const NO_COLOR = !!process.env.NO_COLOR;
const CELLS = parseInt(process.env.TOKEN_METER_WIDTH || '', 10) || 12;
const FALLBACK_LIMIT = parseInt(process.env.TOKEN_METER_LIMIT || '', 10) || 200000;

const paint = (c, s) => (NO_COLOR ? String(s) : `\x1b[${c}m${s}\x1b[0m`);
const DIM = '38;5;244';

function readStdin() { try { return readFileSync(0, 'utf8'); } catch { return ''; } }

// green < 60%, yellow 60-85%, red >= 85%
function fracColor(f) { return f >= 0.85 ? '38;5;203' : f >= 0.60 ? '38;5;179' : '38;5;42'; }

function bar(frac) {
  const f = Math.max(0, Math.min(frac, 1));
  const filled = Math.round(f * CELLS);
  return paint(DIM, '▕')
    + paint(fracColor(f), '█'.repeat(filled))
    + paint('38;5;238', '░'.repeat(Math.max(0, CELLS - filled)))
    + paint(DIM, '▏');
}

function fmtReset(sec) {
  if (!isFinite(sec) || sec <= 0) return 'now';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h${m}m` : `${m}m`;
}

function pctSeg(label, percent) {
  const f = percent / 100;
  return paint(DIM, label + ' ') + paint(fracColor(f), Math.round(percent) + '%');
}

// --- Fallback for Claude Code older than 2.1.132 (no context_window on stdin) ---
function tail(path, maxBytes = 262144) {
  let fd;
  try {
    fd = openSync(path, 'r');
    const size = fstatSync(fd).size;
    const len = Math.min(size, maxBytes);
    const buf = Buffer.alloc(len);
    if (len > 0) readSync(fd, buf, 0, len, size - len);
    return buf.toString('utf8');
  } catch { return ''; } finally { if (fd !== undefined) { try { closeSync(fd); } catch {} } }
}

function contextPctFromTranscript(path) {
  if (!path) return null;
  const text = tail(path);
  if (!text) return null;
  const lines = text.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line || line[0] !== '{') continue;
    let obj; try { obj = JSON.parse(line); } catch { continue; }
    if (obj.isSidechain === true) continue;
    const u = obj.message && obj.message.usage;
    if (!u) continue;
    const used = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
    if (used > 0) return Math.min((used / FALLBACK_LIMIT) * 100, 100);
  }
  return null;
}

// Re-render the caveman tag if this script replaces the caveman statusline.
function cavemanTag() {
  try {
    const dir = process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude');
    const raw = readFileSync(join(dir, '.caveman-active'), 'utf8');
    if (raw.length > 64) return '';
    const mode = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    const valid = ['off', 'lite', 'full', 'ultra', 'wenyan-lite', 'wenyan', 'wenyan-full', 'wenyan-ultra', 'commit', 'review', 'compress'];
    if (!valid.includes(mode)) return '';
    const label = (mode === '' || mode === 'full') ? '[CAVEMAN]' : `[CAVEMAN:${mode.toUpperCase()}]`;
    return paint('38;5;172', label) + ' ';
  } catch { return ''; }
}

function contextPct(data) {
  const cw = data.context_window;
  if (cw && typeof cw.used_percentage === 'number') return cw.used_percentage;
  if (cw && cw.current_usage) {
    const u = cw.current_usage;
    const used = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
    const size = cw.context_window_size || FALLBACK_LIMIT;
    return size > 0 ? Math.min((used / size) * 100, 100) : null;
  }
  return contextPctFromTranscript(data.transcript_path);
}

// Second line: the live-plugins chip row. token-meter bundles its own copy of the
// renderer (../scripts/plugins-line.mjs) so it works as a standalone install — plugins
// can't read files outside their own dir once cached. Point STATUSLINE_PLUGINS_MODULE
// at the installed live-plugins module to use that instead, or set
// STATUSLINE_SHOW_PLUGINS=0 to drop the row.
async function pluginsLine2() {
  if (process.env.STATUSLINE_SHOW_PLUGINS === '0') return '';
  try {
    const spec = process.env.STATUSLINE_PLUGINS_MODULE
      ? pathToFileURL(process.env.STATUSLINE_PLUGINS_MODULE).href
      : new URL('./plugins-line.mjs', import.meta.url).href;
    const mod = await import(spec);
    const line = mod.pluginsLine ? mod.pluginsLine() : '';
    return line ? '\n' + line : '';
  } catch {
    return '';
  }
}

async function main() {
  let data = {};
  try { data = JSON.parse(readStdin() || '{}'); } catch { data = {}; }

  const now = Date.now() / 1000;
  const segs = [];

  const model = data.model && data.model.display_name;
  if (model) segs.push(paint('38;5;38', '⬡ ' + model));

  // PRIMARY: 5-hour plan usage (the subscription limit that actually throttles you).
  const five = data.rate_limits && data.rate_limits.five_hour;
  if (five && typeof five.used_percentage === 'number') {
    const f = five.used_percentage / 100;
    let seg = bar(f) + ' ' + paint(fracColor(f), Math.round(five.used_percentage) + '%') + ' ' + paint(DIM, '5h');
    if (typeof five.resets_at === 'number') seg += ' ' + paint(DIM, '(' + fmtReset(five.resets_at - now) + ' left)');
    segs.push(seg);
  } else {
    segs.push(paint(DIM, '5h —'));
  }

  // SECONDARY: context window for the current conversation.
  const ctx = contextPct(data);
  if (ctx !== null && ctx !== undefined) segs.push(pctSeg('ctx', ctx));

  // 7-day plan limit, only when present.
  const seven = data.rate_limits && data.rate_limits.seven_day;
  if (seven && typeof seven.used_percentage === 'number') segs.push(pctSeg('7d', seven.used_percentage));

  if (data.cost && typeof data.cost.total_cost_usd === 'number') {
    segs.push(paint(DIM, '$' + data.cost.total_cost_usd.toFixed(2)));
  }

  // When the live-plugins chip row is showing, caveman already appears there as a
  // chip — so drop the redundant [CAVEMAN] tag from line 1. Keep it otherwise.
  const line2 = await pluginsLine2();
  const tag = line2 ? '' : cavemanTag();
  process.stdout.write(tag + segs.join(paint(DIM, ' · ')) + line2);
}

main();
