import { parseLedger } from '../domain/contributions';
import raw from './ledger.json';

// Parsed once at the boundary; a malformed ledger fails the build.
export const ledger = parseLedger(raw);
