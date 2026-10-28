import type { Locale } from '../domain/locale';
import { en, type Dictionary } from './en';
import { uk } from './uk';

const dictionaries: Record<Locale, Dictionary> = { en, uk };

export const t = (locale: Locale): Dictionary => dictionaries[locale];
