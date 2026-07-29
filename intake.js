:root {
  --bg-0: #060a12;
  --bg-1: #0b111a;
  --bg-2: #131c2a;
  --panel: rgba(13, 19, 28, 0.72);
  --panel-inner: rgba(6, 10, 18, 0.6);
  --panel-border: rgba(0, 154, 168, 0.28);
  --panel-border-strong: rgba(0, 184, 199, 0.6);
  --hairline: rgba(255, 255, 255, 0.06);
  --hairline-strong: rgba(255, 255, 255, 0.12);
  --text: #f1f6fc;
  --text-dim: #a8b8cc;
  --text-faint: #6f8094;
  --teal: #009aa8;
  --teal-bright: #00b8c7;
  --teal-glow: rgba(0, 154, 168, 0.5);
  --teal-glow-soft: rgba(0, 154, 168, 0.18);
  --green: #4ade80;
  --amber: #fbbf24;
  --red: #f87171;
  --slate: #94a3b8;
  --radius-lg: 18px;
  --radius-md: 12px;
  --radius-sm: 8px;
  --max-w: 980px;
  --ease-out: cubic-bezier(0.32, 0.72, 0.24, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ==========================================================================
   Light theme
   Opt-in via <html data-theme="light">. The ft-design-system skill asks the
   user which theme they want; dark is the default (no attribute needed).
   This block re-maps the palette tokens for a white background and darkens
   the few component surfaces that were hardcoded for dark mode.
   ========================================================================== */
:root[data-theme="light"] {
  --bg-0: #ffffff;
  --bg-1: #f4f7fa;
  --bg-2: #e9eff5;
  --panel: rgba(255, 255, 255, 0.82);
  --panel-inner: rgba(244, 247, 250, 0.72);
  --panel-border: rgba(0, 154, 168, 0.30);
  --panel-border-strong: rgba(0, 154, 168, 0.55);
  --hairline: rgba(11, 31, 36, 0.10);
  --hairline-strong: rgba(11, 31, 36, 0.16);
  --text: #0b1f24;
  --text-dim: #3f5560;
  --text-faint: #6b7f89;
  --teal: #009aa8;
  --teal-bright: #00818f;
  --teal-glow: rgba(0, 154, 168, 0.35);
  --teal-glow-soft: rgba(0, 154, 168, 0.12);
  --green: #0b8043;
  --amber: #b45309;
  --red: #dc2626;
  --slate: #64748b;
}

/* Page background: light gradient with a faint teal wash top and bottom. */
[data-theme="light"] body {
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0, 154, 168, 0.10), transparent 60%),
    radial-gradient(ellipse 60% 50% at 50% 110%, rgba(0, 154, 168, 0.06), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, var(--bg-1) 60%, var(--bg-2) 100%);
  background-attachment: fixed;
}

/* Card shadow: soften the heavy dark drop shadow for a light surface. */
[data-theme="light"] .calc-card {
  box-shadow:
    0 20px 50px rgba(11, 31, 36, 0.10),
    0 0 0 1px rgba(11, 31, 36, 0.03) inset,
    0 1px 0 rgba(255, 255, 255, 0.60) inset;
}

/* Hover / surface tints that were white-on-dark become dark-on-light. */
[data-theme="light"] .mode-btn:hover { background: rgba(11, 31, 36, 0.04); }
[data-theme="light"] .switch:hover { background: rgba(11, 31, 36, 0.03); }
[data-theme="light"] .switch-track { background: rgba(11, 31, 36, 0.14); }

/* Inputs: dark fields become white on a light background. */
[data-theme="light"] .select-wrap,
[data-theme="light"] .input-wrap,
[data-theme="light"] .login-bar { background: rgba(255, 255, 255, 0.90); }
[data-theme="light"] .select-wrap:hover,
[data-theme="light"] .input-wrap:hover,
[data-theme="light"] .select-wrap:focus-within,
[data-theme="light"] .input-wrap:focus-within,
[data-theme="light"] .login-bar:hover,
[data-theme="light"] .login-bar:focus-within { background: #ffffff; }
[data-theme="light"] .login-bar { box-shadow: 0 4px 16px rgba(11, 31, 36, 0.08); }
[data-theme="light"] .login-bar.is-invalid { background: rgba(254, 242, 242, 0.92); }

/* Table header + inset data rows. */
[data-theme="light"] .tactic-table thead th { background: rgba(11, 31, 36, 0.04); }
[data-theme="light"] .reverse-rate-row { background: rgba(11, 31, 36, 0.05); }

/* Secondary CTA: near-invisible white overlay becomes a subtle white card. */
[data-theme="light"] .cta--secondary { background: rgba(255, 255, 255, 0.70); }

/* The interactive Vanta dots are dark-theme only — never show them on light. */
[data-theme="light"] .vanta-bg { display: none !important; }

* { box-sizing: border-box; }
html, body { height: 100%; }
[hidden] { display: none !important; }

::selection { background: rgba(0, 154, 168, 0.45); color: #fff; }
::-moz-selection { background: rgba(0, 154, 168, 0.45); color: #fff; }

::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 154, 168, 0.25); border-radius: 6px; border: 2px solid transparent; background-clip: padding-box; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 154, 168, 0.5); border: 2px solid transparent; background-clip: padding-box; }

body {
  margin: 0;
  font-family: "helvetica-neue-lt-pro", -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0, 154, 168, 0.14), transparent 60%),
    radial-gradient(ellipse 60% 50% at 50% 110%, rgba(0, 154, 168, 0.08), transparent 60%),
    linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 50%, var(--bg-2) 100%);
  background-attachment: fixed;
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.vanta-bg { position: fixed; inset: 0; z-index: 0; opacity: 0.5; }
.vanta-bg canvas { display: block; }

/* ---------- Header ---------- */
.site-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 22px 32px;
}

/* Wordmark inherits theme text color (currentColor); icon stays teal. */
.ft-logo { width: 100%; height: auto; display: block; color: var(--text); }

.header-link {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 200ms var(--ease-out), color 200ms var(--ease-out), background 200ms var(--ease-out), transform 200ms var(--ease-out);
}
.header-link:hover {
  color: var(--text);
  border-color: var(--panel-border-strong);
  background: rgba(0, 154, 168, 0.06);
}
.header-link:active { transform: scale(0.98); }

/* ---------- Layout ---------- */
.site-main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 24px 48px;
}

.view {
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  animation: fadeUp 480ms var(--ease-out);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ---------- Hero ---------- */
.hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.hero--compact { padding-top: 8px; }

.hero-logo {
  width: clamp(240px, 36vw, 380px);
  margin: 0 auto 12px;
  filter: drop-shadow(0 6px 24px rgba(0, 154, 168, 0.32)) drop-shadow(0 0 60px rgba(0, 154, 168, 0.12));
}

.tagline {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--teal-bright);
  margin: 0 0 14px;
  text-shadow: 0 0 24px rgba(0, 184, 199, 0.35);
}

.hero-blurb {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-dim);
  margin: 0 auto;
  max-width: 580px;
}

/* ---------- Calc card ---------- */
.calc-card {
  background: var(--panel);
  border: 1px solid var(--hairline-strong);
  border-radius: var(--radius-lg);
  padding: 28px;
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 1px 0 rgba(255, 255, 255, 0.05) inset;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ---------- Mode toggle (Rate card / Reverse) ---------- */
.mode-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 6px;
  background: var(--panel-inner);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
}
.mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  color: var(--text-dim);
  font-family: inherit;
  cursor: pointer;
  transition: background 200ms var(--ease-out), color 200ms var(--ease-out), border-color 200ms var(--ease-out);
}
.mode-btn:hover { color: var(--text); background: rgba(255, 255, 255, 0.02); }
.mode-btn.is-active {
  background: rgba(0, 184, 199, 0.12);
  border-color: rgba(0, 184, 199, 0.36);
  color: var(--text);
  box-shadow: 0 0 0 1px rgba(0, 184, 199, 0.12), 0 6px 18px rgba(0, 154, 168, 0.18);
}
.mode-label { font-size: 14px; font-weight: 700; letter-spacing: 0.02em; }
.mode-sub { font-size: 11.5px; font-weight: 500; color: var(--text-faint); }
.mode-btn.is-active .mode-sub { color: var(--text-dim); }

/* ---------- Service toggles ---------- */
.service-toggles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 640px) { .service-toggles { grid-template-columns: 1fr; } }

.switch {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--panel-inner);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 200ms var(--ease-out), background 200ms var(--ease-out);
}
.switch:hover { border-color: var(--panel-border); background: rgba(8, 14, 22, 0.7); }
.switch:has(input:checked) {
  border-color: var(--panel-border-strong);
  background: rgba(0, 184, 199, 0.07);
  box-shadow: 0 0 0 1px rgba(0, 184, 199, 0.12);
}
.switch input { position: absolute; opacity: 0; pointer-events: none; }
.switch input:focus-visible ~ .switch-track {
  outline: 2px solid var(--teal-bright);
  outline-offset: 2px;
}

.switch-track {
  position: relative;
  flex: 0 0 auto;
  width: 38px;
  height: 22px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--hairline-strong);
  border-radius: 999px;
  transition: background 200ms var(--ease-out), border-color 200ms var(--ease-out);
}
.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: var(--text-dim);
  border-radius: 50%;
  transition: transform 220ms var(--ease-spring), background 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
}
.switch input:checked + .switch-track {
  background: linear-gradient(135deg, var(--teal) 0%, var(--teal-bright) 100%);
  border-color: var(--panel-border-strong);
}
.switch input:checked + .switch-track .switch-thumb {
  transform: translateX(16px);
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.switch-label { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.switch-title { font-size: 13.5px; font-weight: 700; color: var(--text); letter-spacing: 0.01em; }
.switch-sub { font-size: 11.5px; color: var(--text-faint); line-height: 1.4; }

/* ---------- Controls ---------- */
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.control { display: flex; flex-direction: column; gap: 8px; }
.control-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.select-wrap, .input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(11, 17, 26, 0.78);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-sm);
  transition: border-color 200ms var(--ease-out), box-shadow 240ms var(--ease-out), background 200ms var(--ease-out);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}
.select-wrap:hover, .input-wrap:hover { border-color: rgba(0, 184, 199, 0.45); background: rgba(15, 22, 32, 0.85); }
.select-wrap:focus-within, .input-wrap:focus-within {
  border-color: var(--panel-border-strong);
  box-shadow: 0 0 0 4px rgba(0, 184, 199, 0.14);
  background: rgba(15, 22, 32, 0.92);
}

.select, .input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 15px;
  font-family: inherit;
  padding: 12px 14px;
  appearance: none;
  -webkit-appearance: none;
  min-width: 0;
}
.select { padding-right: 36px; cursor: pointer; }
.select option { background: var(--bg-1); color: var(--text); }
.select-chevron { position: absolute; right: 12px; pointer-events: none; color: var(--text-faint); }

.input-wrap--suffix .input { padding-right: 36px; }
.input-wrap--prefix .input { padding-left: 30px; }
.input-suffix, .input-prefix {
  position: absolute;
  color: var(--text-faint);
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
}
.input-suffix { right: 14px; }
.input-prefix { left: 14px; }

.control-hint {
  font-size: 11.5px;
  color: var(--text-faint);
  line-height: 1.4;
  margin: 0;
}

/* ---------- Results header ---------- */
.results-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.results-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.results-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0;
}
.results-status {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--text);
  margin: 0;
  line-height: 1.15;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: color 220ms var(--ease-out);
}
.results-status::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--slate);
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.12);
  flex-shrink: 0;
  transition: background 220ms var(--ease-out), box-shadow 220ms var(--ease-out);
}
/* When any service mode is on, the status dot + text shift to teal so
   it's instantly obvious the user is no longer in the default tier. */
.results-status[data-mode="managed"],
.results-status[data-mode="growth"],
.results-status[data-mode="both"] {
  color: var(--teal-bright);
}
.results-status[data-mode="managed"]::before,
.results-status[data-mode="growth"]::before,
.results-status[data-mode="both"]::before {
  background: var(--teal-bright);
  box-shadow: 0 0 0 3px rgba(0, 184, 199, 0.22);
}
.results-actions { display: flex; gap: 8px; }

.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--hairline-strong);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  font-family: inherit;
  cursor: pointer;
  transition: color 180ms var(--ease-out), border-color 180ms var(--ease-out), background 180ms var(--ease-out), transform 160ms var(--ease-out);
}
.ghost-btn:hover {
  color: var(--text);
  border-color: var(--panel-border-strong);
  background: rgba(0, 154, 168, 0.1);
}
.ghost-btn:active { transform: scale(0.97); }
.ghost-btn:focus-visible { outline: 2px solid var(--teal-bright); outline-offset: 2px; }

/* ---------- Tactic table ---------- */
.forward-pane, .reverse-pane {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Real-time blurb above the table — small muted prose with a soft
   pulsing dot to signal "live data feed". */
.results-blurb {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--text-dim);
  margin: -4px 0 0;
  max-width: 760px;
}
.live-dot {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--teal-bright);
  box-shadow: 0 0 0 3px rgba(0, 184, 199, 0.18);
  animation: liveDotPulse 2.2s ease-out infinite;
}
@keyframes liveDotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 184, 199, 0.45); }
  60%      { box-shadow: 0 0 0 6px rgba(0, 184, 199, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .live-dot { animation: none; }
}

.tactic-table-wrap {
  background: var(--panel-inner);
  border: 1px solid var(--hairline);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.tactic-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}
.tactic-table thead th {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-faint);
  padding: 12px 22px;
  background: rgba(0, 0, 0, 0.22);
  border-bottom: 1px solid var(--hairline);
  white-space: nowrap;
  text-align: left;
}
.tactic-table thead th.col-range,
.tactic-table thead th.col-avg { text-align: right; }

.tactic-table tbody td {
  padding: 16px 22px;
  border-bottom: 1px solid var(--hairline);
  vertical-align: middle;
  color: var(--text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.tactic-table tbody tr:last-child td { border-bottom: none; }
.tactic-table tbody tr:hover td { background: rgba(0, 184, 199, 0.04); }

.col-margin { width: 1%; white-space: nowrap; padding-right: 6px !important; }
.col-tactic { font-weight: 600; }
.col-range {
  text-align: right;
  color: var(--text-dim);
  font-weight: 500;
}
.col-range--accent {
  color: var(--teal-bright) !important;
  font-weight: 600;
}
.col-avg {
  text-align: right;
  color: var(--green);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.01em;
}

.row--flat td { font-style: italic; }
.row--flat .col-tactic { font-style: normal; }
.row--flat .margin-input { font-style: normal; }

/* ---------- Stock-ticker flash ---------- */
/* Cell wraps its value in a span so we can slide the value without
   affecting cell layout. The cell itself flashes a soft green/red
   background to signal direction; the span slides in from above/below. */
.cell-value {
  display: inline-block;
  will-change: transform, opacity;
}
.tactic-table tbody td.col-range,
.tactic-table tbody td.col-avg {
  transition: background-color 600ms var(--ease-out);
}
.tactic-table tbody td.tick-up { background-color: rgba(74, 222, 128, 0.10); }
.tactic-table tbody td.tick-down { background-color: rgba(248, 113, 113, 0.10); }
.tactic-table tbody td.tick-up .cell-value {
  animation: cellTickUp 420ms cubic-bezier(0.32, 0.72, 0.24, 1);
}
.tactic-table tbody td.tick-down .cell-value {
  animation: cellTickDown 420ms cubic-bezier(0.32, 0.72, 0.24, 1);
}
@keyframes cellTickUp {
  0%   { transform: translateY(7px); opacity: 0; }
  55%  { transform: translateY(-2px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes cellTickDown {
  0%   { transform: translateY(-7px); opacity: 0; }
  55%  { transform: translateY(2px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .tactic-table tbody td.tick-up,
  .tactic-table tbody td.tick-down { background-color: transparent; }
  .tactic-table tbody td.tick-up .cell-value,
  .tactic-table tbody td.tick-down .cell-value { animation: none; }
}

/* Flat inline margin input — no border-box look. Subtle hover/focus
   underline keeps it editable without competing with the data. */
.margin-cell {
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  padding: 4px 8px;
  border-radius: 6px;
  border-bottom: 1px solid transparent;
  background: transparent;
  transition: background 180ms var(--ease-out), border-color 200ms var(--ease-out);
}
.margin-cell:hover {
  background: rgba(0, 184, 199, 0.06);
  border-bottom-color: rgba(0, 184, 199, 0.35);
}
.margin-cell:focus-within {
  background: rgba(0, 184, 199, 0.09);
  border-bottom-color: var(--teal-bright);
}
.margin-input {
  width: 44px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: right;
  padding: 0;
  appearance: textfield;
  -webkit-appearance: none;
  -moz-appearance: textfield;
}
.margin-input::-webkit-outer-spin-button,
.margin-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.margin-suffix {
  color: var(--text-faint);
  font-size: 13px;
  font-weight: 600;
  pointer-events: none;
}

.footnote-mark {
  color: var(--amber);
  font-weight: 700;
  margin-left: 2px;
  font-family: "helvetica-neue-lt-pro", 'Helvetica Neue', Arial, sans-serif;
  font-style: normal;
}

.footnote {
  font-size: 11.5px;
  color: var(--text-faint);
  line-height: 1.5;
  margin: 0;
}

/* ---------- Reverse result card ---------- */
.reverse-result {
  display: flex;
  flex-direction: column;
}

.reverse-card {
  background: var(--panel-inner);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reverse-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.reverse-card-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0;
}

.reverse-rate-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.22);
  border-radius: 8px;
  border-left: 3px solid var(--teal-bright);
}
.reverse-rate-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.reverse-rate-value {
  font-size: 32px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--teal-bright);
  letter-spacing: -0.015em;
}

.reverse-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12.5px;
  color: var(--text-faint);
  line-height: 1.55;
}
.reverse-meta p { margin: 0; }
.reverse-viability {
  font-family: "helvetica-neue-lt-pro", 'Helvetica Neue', Arial, sans-serif !important;
  color: var(--text-dim) !important;
  font-size: 12.5px !important;
  margin-top: 4px !important;
}

.viability-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
}
.viability-pill::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.viability-pill--in_range { background: rgba(74, 222, 128, 0.1); color: var(--green); border-color: rgba(74, 222, 128, 0.3); }
.viability-pill--below_floor { background: rgba(248, 113, 113, 0.1); color: var(--red); border-color: rgba(248, 113, 113, 0.3); }
.viability-pill--above_ceiling { background: rgba(251, 191, 36, 0.1); color: var(--amber); border-color: rgba(251, 191, 36, 0.3); }

/* ---------- CTA row ---------- */
.cta-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 540px) { .cta-row { grid-template-columns: 1fr; } }

.cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 16px 18px;
  border-radius: var(--radius-md);
  text-decoration: none;
  position: relative;
  transition: transform 180ms var(--ease-out), box-shadow 240ms var(--ease-out), border-color 200ms var(--ease-out), background 200ms var(--ease-out), filter 200ms var(--ease-out);
  border: 1px solid transparent;
  overflow: hidden;
}
.cta::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 50%);
  pointer-events: none;
}
.cta:focus-visible { outline: 2px solid var(--teal-bright); outline-offset: 3px; }
.cta svg {
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.65;
  transition: opacity 200ms var(--ease-out), transform 220ms var(--ease-out);
}
.cta:hover svg { opacity: 1; transform: translate(2px, -2px); }
.cta-eyebrow {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.78;
}
.cta-main { font-size: 15px; font-weight: 600; }
.cta--primary {
  background: linear-gradient(135deg, var(--teal) 0%, var(--teal-bright) 100%);
  color: #ffffff;
  box-shadow: 0 6px 22px rgba(0, 154, 168, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
}
.cta--primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(0, 154, 168, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.22); filter: brightness(1.06); }
.cta--primary:active { transform: translateY(-1px); filter: brightness(0.98); }
.cta--secondary {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  border-color: var(--hairline-strong);
}
.cta--secondary:hover { border-color: var(--panel-border-strong); background: rgba(0, 154, 168, 0.1); transform: translateY(-2px); }
.cta--secondary:active { transform: translateY(-1px); background: rgba(0, 154, 168, 0.06); }

.footer-note {
  font-size: 11.5px;
  color: var(--text-faint);
  line-height: 1.5;
  margin: 0;
  text-align: center;
}

/* ---------- Toast ---------- */
.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translate(-50%, 16px);
  background: rgba(0, 154, 168, 0.94);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(0, 154, 168, 0.4);
  z-index: 50;
  opacity: 0;
  transition: opacity 220ms var(--ease-out), transform 240ms var(--ease-out);
  pointer-events: none;
}
.toast.is-visible { opacity: 1; transform: translate(-50%, 0); }

/* ---------- Footer ---------- */
.site-footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
  font-size: 11.5px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}

/* ---------- Responsive ---------- */
@media (max-width: 720px) {
  .tactic-table thead th, .tactic-table tbody td { padding: 12px 14px; font-size: 13px; }
}
@media (max-width: 600px) {
  .site-header { padding: 18px 20px; }
  .hero-logo { width: clamp(200px, 60vw, 300px); }
  .tagline { font-size: 11px; letter-spacing: 0.28em; }
  .calc-card { padding: 22px; }
  .tactic-table thead th, .tactic-table tbody td { padding: 10px 12px; font-size: 12.5px; }
  .reverse-rate-value { font-size: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ---------- Login screen ---------- */
.view--center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px);
}

.login-hero {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
}
.login-hero .hero-logo {
  width: clamp(260px, 38vw, 400px);
  margin: 0 auto 16px;
  filter: drop-shadow(0 6px 24px rgba(0, 154, 168, 0.32)) drop-shadow(0 0 60px rgba(0, 154, 168, 0.12));
}

.login-heading {
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.18;
  color: var(--text);
  margin: 4px 0 14px;
  max-width: 560px;
}

.login-blurb {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text-dim);
  margin: 0 auto 32px;
  max-width: 540px;
}

.login-form {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto 32px;
}

.login-bar {
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(11, 17, 26, 0.78);
  border: 1px solid var(--panel-border);
  border-radius: 999px;
  padding: 4px 4px 4px 20px;
  gap: 12px;
  transition: border-color 200ms var(--ease-out), box-shadow 240ms var(--ease-out), background 200ms var(--ease-out);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}
.login-bar:hover {
  border-color: rgba(0, 184, 199, 0.45);
  background: rgba(15, 22, 32, 0.85);
}
.login-bar:focus-within {
  border-color: var(--panel-border-strong);
  box-shadow: 0 0 0 4px rgba(0, 184, 199, 0.14), 0 14px 44px rgba(0, 154, 168, 0.22);
  background: rgba(15, 22, 32, 0.92);
}
.login-bar.is-invalid {
  border-color: rgba(248, 113, 113, 0.55);
  background: rgba(28, 14, 14, 0.7);
  box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.1), 0 6px 22px rgba(248, 113, 113, 0.16);
  animation: shake 420ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
.login-bar.is-invalid .login-icon { color: var(--red); }

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-5px); }
  40%, 60% { transform: translateX(5px); }
}

.login-icon { color: var(--text-faint); flex-shrink: 0; transition: color 200ms var(--ease-out); }
.login-bar:focus-within .login-icon { color: var(--teal-bright); }

.login-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 15.5px;
  font-family: inherit;
  font-weight: 500;
  padding: 14px 0;
  min-width: 0;
  caret-color: var(--teal-bright);
  letter-spacing: 0.02em;
}
.login-input::placeholder { color: var(--text-faint); font-weight: 400; letter-spacing: 0.01em; }

.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid transparent;
  background: linear-gradient(135deg, var(--teal) 0%, var(--teal-bright) 100%);
  color: #ffffff;
  letter-spacing: 0.02em;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 154, 168, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.18);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  transition: transform 160ms var(--ease-out), box-shadow 220ms var(--ease-out), filter 200ms var(--ease-out);
}
.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 154, 168, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  filter: brightness(1.08);
}
.login-btn:active { transform: translateY(0); filter: brightness(0.98); }
.login-btn:focus-visible { outline: 2px solid var(--teal-bright); outline-offset: 3px; }

.login-error {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--red);
  margin: 14px 0 0;
  font-weight: 500;
}

.cta-row--login { width: 100%; max-width: 620px; margin: 0 auto; }

.header-link--signout {
  color: var(--text-faint);
}
.header-link--signout:hover {
  color: var(--text-dim);
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.06);
}

@media (max-width: 540px) {
  .login-bar { padding: 4px 4px 4px 16px; gap: 8px; }
  .login-btn { padding: 11px 16px; font-size: 13px; }
  .login-btn svg { display: none; }
  .login-blurb { font-size: 13.5px; }
}
