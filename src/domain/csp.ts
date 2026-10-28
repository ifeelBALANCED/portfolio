const SCRIPT = /<script([^>]*)>([\s\S]*?)<\/script>/g;
const NOT_EXECUTED = /\ssrc=|type="application\/ld\+json"/;

/** Bodies of the inline scripts a browser would execute; data blocks (JSON-LD) are not subject to CSP. */
export const inlineScripts = (html: string): string[] => {
  const bodies: string[] = [];
  html.replaceAll(SCRIPT, (whole, attrs: string, body: string) => {
    if (!NOT_EXECUTED.test(attrs)) bodies.push(body);
    return whole;
  });
  return bodies;
};

/** `hashes` are CSP source expressions without quotes, e.g. `sha256-abc=`. */
export const contentSecurityPolicy = (hashes: readonly string[]): string => {
  const sources = [...new Set(hashes)].toSorted().map((hash) => `'${hash}'`);
  return [
    "default-src 'none'",
    `script-src ${sources.length > 0 ? sources.join(' ') : "'none'"}`,
    "style-src 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data:",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
};
