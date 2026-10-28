import { describe, expect, it } from 'vitest';
import {
  THEMES,
  contrastRatio,
  mixOklab,
  themeCss,
  type ThemeTokens,
} from '../../src/domain/themes';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 1);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });
});

describe('mixOklab', () => {
  it('returns the endpoints at 0 and 1 and a different colour in between', () => {
    expect(mixOklab('#ff0000', '#0000ff', 0)).toBe('#0000ff');
    expect(mixOklab('#ff0000', '#0000ff', 1)).toBe('#ff0000');
    expect(mixOklab('#ff0000', '#0000ff', 0.5)).not.toBe('#800080');
  });
});

const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));

describe('mixOklab against Chromium color-mix(in oklab)', () => {
  // Reference values read back from a canvas in Chromium, so the maths is checked independently.
  const reference: readonly [string, string, number, string][] = [
    ['#ff0000', '#0000ff', 0.5, '#8c53a2'],
    ['#00ff00', '#ff00ff', 0.25, '#e780dc'],
    ['#0000ff', '#ffffff', 0.75, '#306dff'],
    ['#2437b8', '#fbf9f4', 0.14, '#d9dfee'],
    ['#58d68d', '#171a1d', 0.14, '#21302b'],
  ];

  it.each(reference)('%s over %s at %s', (a, b, share, expected) => {
    const actual = channels(mixOklab(a, b, share));
    channels(expected).forEach((channel, i) =>
      expect(Math.abs(channel - (actual[i] ?? 0))).toBeLessThanOrEqual(1),
    );
  });
});

describe('themes', () => {
  it('ships exactly five themes with unique ids', () => {
    expect(THEMES.map((theme) => theme.id)).toEqual([
      'paper',
      'graphite',
      'blueprint',
      'meter',
      'lab',
    ]);
  });

  it.each(THEMES)('$id: text tokens reach 4.5:1 on bg and surface', (theme) => {
    for (const ground of [theme.bg, theme.surface]) {
      expect(contrastRatio(theme.fg, ground)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.muted, ground)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.accent, ground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(THEMES)('$id: on-accent text reaches 4.5:1 on accent', (theme) => {
    expect(contrastRatio(theme.onAccent, theme.accent)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(THEMES)('$id: lines reach 3:1 on bg and surface', (theme) => {
    expect(contrastRatio(theme.line, theme.bg)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(theme.line, theme.surface)).toBeGreaterThanOrEqual(3);
  });

  it.each(THEMES)('$id: status colours stay readable on their own row tint', (theme) => {
    for (const state of [theme.add, theme.del, theme.open]) {
      const tint = mixOklab(state, theme.surface, theme.rowTint);
      expect(contrastRatio(theme.fg, tint)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(theme.muted, tint)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(state, tint)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(state, theme.surface)).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('themeCss edge cases', () => {
  const dark = THEMES.filter((theme) => theme.scheme === 'dark');
  const light = THEMES.filter((theme) => theme.scheme === 'light');

  it('rejects an empty theme list', () => {
    expect(() => themeCss([])).toThrow(/at least one theme/i);
  });

  it('falls back to the only theme for both schemes', () => {
    const [graphite] = dark;
    const css = themeCss(graphite ? [graphite] : []);
    expect(css).toMatch(/:root\s*\{[^}]*--bg:\s*#101214/);
    expect(css).toMatch(/not\(\[data-theme\]\)\s*\{[^}]*--bg:\s*#101214/);
  });

  it('falls back to the first dark theme when none is light', () => {
    expect(themeCss(dark)).toMatch(/:root\s*\{[^}]*--bg:\s*#101214/);
  });

  it('falls back to the first light theme when none is dark', () => {
    expect(themeCss(light)).toMatch(/not\(\[data-theme\]\)\s*\{[^}]*--bg:\s*#f3f0e8/);
  });

  it('writes each theme row tint as a percentage', () => {
    const css = themeCss(THEMES);
    expect(css).toMatch(/\[data-theme='paper'\][^}]*--row-tint:\s*14%/);
    expect(css).toMatch(/\[data-theme='meter'\][^}]*--row-tint:\s*9%/);
  });
});

describe('themeCss', () => {
  const css = themeCss(THEMES);

  it('uses the OS preference until a theme is chosen', () => {
    expect(css).toMatch(/:root\s*\{[^}]*--bg:\s*#f3f0e8/i);
    expect(css).toMatch(
      /prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme\]\)\s*\{[^}]*--bg:\s*#101214/,
    );
  });

  it('emits an explicit block and a no-JS radio fallback per theme', () => {
    for (const { id } of THEMES) {
      expect(css).toContain(`[data-theme='${id}']`);
      expect(css).toContain(`:root:has(#t-${id}:checked)`);
    }
  });

  it('forces the Paper tokens when printing', () => {
    expect(css).toMatch(/@media print\s*\{[^}]*--bg:\s*#f3f0e8\s*!important/i);
  });

  it('declares the colour scheme of each theme', () => {
    const meter = THEMES.find((theme: ThemeTokens) => theme.id === 'meter');
    expect(meter?.scheme).toBe('light');
    expect(css).toMatch(/\[data-theme='blueprint'\][^}]*color-scheme:\s*dark/);
  });
});
