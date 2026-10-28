# UI

Read when touching styles, markup, fonts, colors, themes or motion.

- Look ("Changeset"): the PR ledger is a diff (`+` merged, `~` open, `−` closed) in a spec-sheet frame: hairline rules, mono labels, ruler ticks on section heads. Fonts: Onest (sans) and JetBrains Mono, both with Cyrillic; no italics (Onest has none). No cards, gradients, icon sets or decoration that is not data.
- Tailwind v4 via `@tailwindcss/vite`: `@import 'tailwindcss'`, tokens in `@theme inline` that point at CSS variables. Do not use `@astrojs/tailwind` (deprecated) or a `tailwind.config.js`.
- **Colors live only in `src/domain/themes.ts`.** `Base.astro` emits the CSS from it (`themeCss`), so tokens and the contrast tests cannot drift. Never hardcode a color in markup or CSS; use `bg surface fg muted line accent on-accent add del open`.
- A theme must pass `tests/unit/themes.test.ts`: text 4.5:1, lines 3:1, status colours 4.5:1 on their own row tint. Never apply opacity to text or `--line`; hide filtered rows with `display:none`, do not dim them.
- Themes: `data-theme` on `<html>`, set by an inline head script before first paint (localStorage `vh-theme`, else the OS scheme). With JS off, the OS scheme still applies. Colour changes interpolate through registered `@property` colors.
- Motion: CSS only; scroll-linked effects animate decorative layers (tint, bars), never text, inside `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`. The unanimated state is the finished one. The e2e axe tests emulate reduced motion so they judge final colors.
- Cross-document view transitions were tried and removed: they threw `InvalidStateError` on language switch. Do not re-add without a passing e2e.
- Semantics: one `h1`, section `h2`s labelled by `aria-labelledby`, skip link first in tab order, `nav` named "Primary" (desktop toolbar only), language links named "English"/"Українська". e2e relies on these.
- Text must survive Ukrainian: no fixed heights, no truncation of PR titles, `min-width: 0` on grid/flex children. Mobile ≥ 360px must not scroll horizontally (tested).
