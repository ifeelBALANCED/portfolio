# Content integrity

Read when adding or editing text, numbers, links, contact details or PR rows.

- Experience, education and skills come only from the CV PDF. A claim not in the CV or live GitHub does not go on the site.
- Ledger rows list PRs by their real GitHub state, including closed-unmerged ones. Do not hide or reword closed PRs as wins. Notes state outcomes, not hopes: never "Fixes #n" or implied adoption unless a maintainer said so. Verify against the PR body, its comments and the linked issue (`gh api repos/<repo>/pulls/<n>`, `.../issues/<n>/comments`) before writing or keeping a note; numbers come from the PR description (e.g. `289 ms to 1 ms`); a suggestion fix is not an auto-fix. Five notes failed this on 2026-10-28 and were rewritten.
- Employer code is private: list only public repositories.
- Never mention the war, blackouts or connectivity risk. Location (Kyiv) and timezone (UTC+2/+3) only. Why: owner vetoed it for job applications; same policy here.
- Public contact is the CV email, GitHub and LinkedIn. Never publish the phone number. The LinkedIn URL is unverified (inferred from the CV); flag it if asked about contact accuracy.
- Ukrainian text is a translation of the English source: same facts, no additions. The Ukrainian name spelling, the hero lede and the section captions are drafted copy the owner should confirm.
- Do not list English level (B2): it filters out senior roles.
- The origin lives in one place: `DEFAULT_SITE_URL` in `src/domain/env.ts` (overridable by `SITE_URL`). `robots.txt` and `sitemap.xml` are generated from it in `src/pages`; add new routes to `sitemap.xml.ts` with their hreflang alternates.
