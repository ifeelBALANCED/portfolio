import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  LOCALES,
  alternates,
  isLocale,
  localeFromPath,
  localizedPath,
} from '../../src/domain/locale';

describe('locales', () => {
  it('offers English and Ukrainian with English as default', () => {
    expect([...LOCALES]).toEqual(['en', 'uk']);
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('recognises only supported locales', () => {
    expect(isLocale('uk')).toBe(true);
    expect(isLocale('ru')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe('localizedPath', () => {
  it('serves the default locale from the root and others under a prefix', () => {
    expect(localizedPath('en')).toBe('/');
    expect(localizedPath('uk')).toBe('/uk/');
  });
});

describe('localeFromPath', () => {
  it.each([
    ['/', 'en'],
    ['/uk/', 'uk'],
    ['/uk', 'uk'],
    ['/ukraine/', 'en'],
    ['/en/', 'en'],
  ])('maps %s to %s', (path, expected) => {
    expect(localeFromPath(path)).toBe(expected);
  });
});

describe('alternates', () => {
  it('lists every locale with an absolute URL plus x-default', () => {
    expect(alternates('https://example.com')).toEqual([
      { hreflang: 'en', href: 'https://example.com/' },
      { hreflang: 'uk', href: 'https://example.com/uk/' },
      { hreflang: 'x-default', href: 'https://example.com/' },
    ]);
  });
});
