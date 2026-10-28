export const LOCALES = ['en', 'uk'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type Localized<T> = Readonly<Record<Locale, T>>;

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale === value);

/** The default locale lives at the root; every other locale under `/<locale>/`. */
export const localizedPath = (locale: Locale): string =>
  locale === DEFAULT_LOCALE ? '/' : `/${locale}/`;

export const localeFromPath = (pathname: string): Locale => {
  const [segment] = pathname.split('/').filter(Boolean);
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
};

export const alternates = (origin: string): { hreflang: string; href: string }[] => [
  ...LOCALES.map((locale) => ({ hreflang: locale, href: `${origin}${localizedPath(locale)}` })),
  { hreflang: 'x-default', href: `${origin}${localizedPath(DEFAULT_LOCALE)}` },
];

/** Sitemap with one entry per language edition, each listing every alternate. */
export const sitemapXml = (origin: string): string => {
  const links = alternates(origin)
    .map(
      ({ hreflang, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
    )
    .join('\n');
  const urls = LOCALES.map(
    (locale) => `  <url>\n    <loc>${origin}${localizedPath(locale)}</loc>\n${links}\n  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
};
