# UI

Read when touching styles, markup, fonts, colors or motion.

- Look: ruled editorial index (hairline rules, serif display `Instrument Serif`, mono labels `JetBrains Mono`), one accent. Inspired by a restrained monospace reference; do not add cards, gradients or icon sets.
- All color comes from CSS tokens in `src/styles/global.css` `:root`, redefined for `prefers-color-scheme: dark`. Never hardcode a color in markup.
- Contrast is enforced by axe in both schemes. Accent text uses `--accent`; text on an accent background uses `--on-accent` (white on light, near-black on dark: white on the dark-mode orange fails AA).
- Motion: CSS only, wrapped in `prefers-reduced-motion: no-preference`. The e2e axe tests emulate reduced motion so they judge final colors, not mid-fade frames.
- Semantics: one `h1`, section `h2`s labelled by `aria-labelledby`, skip link first in tab order, `nav` named "Primary". e2e relies on these names.
- Mobile ≥ 360px must not scroll horizontally (tested).
