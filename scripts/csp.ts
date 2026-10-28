import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { contentSecurityPolicy, inlineScripts } from '../src/domain/csp.ts';

interface Header {
  key: string;
  value: string;
}
interface Rule {
  source: string;
  headers: Header[];
}
interface VercelConfig {
  headers: Rule[];
}

const DIST = 'dist';
const CONFIG = 'vercel.json';
const KEY = 'Content-Security-Policy';

const sha256 = (text: string): string =>
  `sha256-${createHash('sha256').update(text).digest('base64')}`;

const expected = contentSecurityPolicy(
  readdirSync(DIST, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.html'))
    .flatMap((file) => inlineScripts(readFileSync(join(DIST, file), 'utf8')).map(sha256)),
);

const config: VercelConfig = JSON.parse(readFileSync(CONFIG, 'utf8'));
const everywhere = config.headers.find((rule) => rule.source === '/(.*)');
if (!everywhere) throw new Error(`${CONFIG} has no "/(.*)" header rule`);
const current = everywhere.headers.find((header) => header.key === KEY);

if (process.argv.includes('--write')) {
  if (current) current.value = expected;
  else everywhere.headers.push({ key: KEY, value: expected });
  writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`${CONFIG}: ${KEY} written`);
} else if (current?.value === expected) {
  console.log(`${CONFIG}: ${KEY} matches the inline scripts in ${DIST}`);
} else {
  console.error(
    `${CONFIG}: ${KEY} is stale.\n  expected ${expected}\n  found    ${current?.value ?? '(missing)'}\nRun pnpm csp:sync.`,
  );
  process.exit(1);
}
