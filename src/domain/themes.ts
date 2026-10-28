export interface ThemeTokens {
  readonly id: string;
  readonly label: string;
  readonly scheme: 'light' | 'dark';
  readonly bg: string;
  readonly surface: string;
  readonly fg: string;
  readonly muted: string;
  readonly line: string;
  readonly accent: string;
  readonly onAccent: string;
  readonly add: string;
  readonly del: string;
  readonly open: string;
  /** Share of the status colour mixed into a ledger row (yellow tints turn olive, so Meter uses less). */
  readonly rowTint: number;
}

/** Single source for colours: the CSS blocks and the contrast tests both derive from this. */
export const THEMES: readonly ThemeTokens[] = [
  {
    id: 'paper',
    label: 'Paper',
    scheme: 'light',
    bg: '#F3F0E8',
    surface: '#FBF9F4',
    fg: '#17191C',
    muted: '#585A5F',
    line: '#8A877E',
    accent: '#2437B8',
    onAccent: '#FFFFFF',
    add: '#17683A',
    del: '#B3261E',
    open: '#8A5A00',
    rowTint: 0.14,
  },
  {
    id: 'graphite',
    label: 'Graphite',
    scheme: 'dark',
    bg: '#101214',
    surface: '#171A1D',
    fg: '#E7E9EB',
    muted: '#9AA1A8',
    line: '#68717A',
    accent: '#FF7A3D',
    onAccent: '#1A0B03',
    add: '#58D68D',
    del: '#FF7B72',
    open: '#E3B341',
    rowTint: 0.14,
  },
  {
    id: 'blueprint',
    label: 'Blueprint',
    scheme: 'dark',
    bg: '#0B2A4A',
    surface: '#0F3358',
    fg: '#E9F1FA',
    muted: '#A9C2DC',
    line: '#5F8DBB',
    accent: '#FFD25A',
    onAccent: '#1B1500',
    add: '#7EE0A6',
    del: '#FF9A8F',
    open: '#FFB86B',
    rowTint: 0.14,
  },
  {
    id: 'meter',
    label: 'Meter',
    scheme: 'light',
    bg: '#F4D80E',
    surface: '#FBE94F',
    fg: '#141200',
    muted: '#4B4300',
    line: '#6E6200',
    accent: '#141200',
    onAccent: '#F4D80E',
    add: '#0E5A2B',
    del: '#9E1C14',
    open: '#5C3B00',
    rowTint: 0.09,
  },
  {
    id: 'lab',
    label: 'Lab',
    scheme: 'light',
    bg: '#E8EFEC',
    surface: '#F5F9F7',
    fg: '#0F1F1A',
    muted: '#475A53',
    line: '#6C8279',
    accent: '#0A6B57',
    onAccent: '#FFFFFF',
    add: '#17683A',
    del: '#B3261E',
    open: '#865300',
    rowTint: 0.14,
  },
];

type Rgb = readonly [number, number, number];

const parseHex = (hex: string): Rgb => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const toHex = ([r, g, b]: Rgb): string =>
  `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;

const toLinear = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (linear: number): number => {
  const c = Math.min(1, Math.max(0, linear));
  return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
};

const luminance = (hex: string): number => {
  const [r, g, b] = parseHex(hex).map(toLinear) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a: string, b: string): number => {
  const [light, dark] = [luminance(a), luminance(b)].toSorted((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
};

const toOklab = (hex: string): Rgb => {
  const [r, g, b] = parseHex(hex).map(toLinear) as [number, number, number];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const fromOklab = ([L, a, b]: Rgb): string => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return toHex([
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]);
};

/** Equivalent of CSS `color-mix(in oklab, a <share>%, b)`. */
export const mixOklab = (a: string, b: string, share: number): string => {
  const [la, aa, ba] = toOklab(a);
  const [lb, ab, bb] = toOklab(b);
  return fromOklab([
    la * share + lb * (1 - share),
    aa * share + ab * (1 - share),
    ba * share + bb * (1 - share),
  ]);
};

const declarations = (theme: ThemeTokens, suffix = ''): string =>
  [
    ['bg', theme.bg],
    ['surface', theme.surface],
    ['fg', theme.fg],
    ['muted', theme.muted],
    ['line', theme.line],
    ['accent', theme.accent],
    ['on-accent', theme.onAccent],
    ['add', theme.add],
    ['del', theme.del],
    ['open', theme.open],
    ['row-tint', `${Math.round(theme.rowTint * 100)}%`],
  ]
    .map(([name, value]) => `--${name}: ${String(value).toLowerCase()}${suffix};`)
    .join(' ');

export const themeCss = (themes: readonly ThemeTokens[]): string => {
  const [fallback] = themes;
  if (!fallback) throw new Error('At least one theme is required');
  const [first = fallback] = themes.filter((theme) => theme.scheme === 'light');
  const [night = fallback] = themes.filter((theme) => theme.scheme === 'dark');
  const blocks = [
    `:root { ${declarations(first)} color-scheme: light; }`,
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) { ${declarations(night)} color-scheme: dark; }\n}`,
    ...themes.map(
      (theme) =>
        `[data-theme='${theme.id}'] { ${declarations(theme)} color-scheme: ${theme.scheme}; }`,
    ),
    ...themes.map(
      (theme) =>
        `:root:has(#t-${theme.id}:checked) { ${declarations(theme)} color-scheme: ${theme.scheme}; }`,
    ),
    `@media print {\n  :root, :root[data-theme] { ${declarations(first, ' !important')} }\n}`,
  ];
  return blocks.join('\n');
};
