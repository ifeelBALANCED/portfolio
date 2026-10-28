import { describe, expect, it } from 'vitest';
import { fill, formatPeriod } from '../../src/domain/format';

describe('fill', () => {
  it('replaces named placeholders', () => {
    expect(fill('Status as of {date}.', { date: '2026-10-28' })).toBe('Status as of 2026-10-28.');
  });

  it('throws on a placeholder without a value', () => {
    expect(() => fill('as of {date}', {})).toThrow(/date/);
  });
});

describe('formatPeriod', () => {
  it('joins start and end with an em dash', () => {
    expect(formatPeriod('08.2022', '03.2023', 'Present')).toBe('08.2022 — 03.2023');
  });

  it('uses the present label for an open-ended job', () => {
    expect(formatPeriod('04.2023', null, 'Нині')).toBe('04.2023 — Нині');
  });
});
