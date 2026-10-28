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
