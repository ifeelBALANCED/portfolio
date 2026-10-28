import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy, inlineScripts } from '../../src/domain/csp';

describe('inlineScripts', () => {
  it('returns the bodies of executable inline scripts only', () => {
    const html = [
      '<script>var a=1</script>',
      '<script is:inline type="text/javascript">var b=2</script>',
      '<script src="/x.js"></script>',
      '<script type="application/ld+json">{"@type":"Person"}</script>',
      '<script type="module">import "/y.js"</script>',
    ].join('');
    expect(inlineScripts(html)).toEqual(['var a=1', 'var b=2', 'import "/y.js"']);
  });

  it('keeps multi-line bodies byte for byte', () => {
    expect(inlineScripts('<script>\n  one();\n  two();\n</script>')).toEqual([
      '\n  one();\n  two();\n',
    ]);
  });

  it('finds nothing in a page without scripts', () => {
    expect(inlineScripts('<p>no scripts</p>')).toEqual([]);
  });
});

const scriptSrc = (hashes: readonly string[]) =>
  contentSecurityPolicy(hashes)
    .split('; ')
    .find((part) => part.startsWith('script-src '));

describe('contentSecurityPolicy', () => {
  it('allows scripts only by hash, sorted and without duplicates', () => {
    expect(scriptSrc(['sha256-b', 'sha256-a', 'sha256-b'])).toBe(
      "script-src 'sha256-a' 'sha256-b'",
    );
  });

  it('lists a single hash as the only source', () => {
    expect(scriptSrc(['sha256-a'])).toBe("script-src 'sha256-a'");
  });

  it('blocks scripts entirely when the page has none', () => {
    expect(scriptSrc([])).toBe("script-src 'none'");
  });

  // Vite inlines small font files as data: URIs; without it the browser blocks them (found in a real load).
  it('denies everything not listed and forbids framing, forms and base changes', () => {
    const csp = contentSecurityPolicy(['sha256-a']);
    for (const part of [
      "default-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
      "font-src 'self' data:",
      "img-src 'self' data:",
      "style-src 'unsafe-inline'",
      "manifest-src 'self'",
    ]) {
      expect(csp.split('; ')).toContain(part);
    }
  });
});
