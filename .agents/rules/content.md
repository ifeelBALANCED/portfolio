# Content integrity

Read when adding or editing text, numbers, links, contact details or PR rows.

- Experience, education and skills come only from the CV PDF. A claim not in the CV or live GitHub does not go on the site.
- Ledger rows list PRs by their real GitHub state, including closed-unmerged ones. Do not hide or reword closed PRs as wins. Notes may state only what the PR itself claims (e.g. the `289 ms to 1 ms` figure is from the PR description).
- Employer code is private: list only public repositories.
- Never mention the war, blackouts or connectivity risk. Location (Kyiv) and timezone (UTC+2/+3) only. Why: owner vetoed it for job applications; same policy here.
- Public contact is the CV email, GitHub and LinkedIn. Never publish the phone number. The LinkedIn URL is unverified (inferred from the CV); flag it if asked about contact accuracy.
- Ukrainian text is a translation of the English source: same facts, no additions. The Ukrainian name spelling, the hero lede and the section captions are drafted copy the owner should confirm.
- Do not list English level (B2): it filters out senior roles.
- Domain `vladyslav-herasymenko.vercel.app` is hardcoded in `astro.config.mjs`, `public/robots.txt`, `public/sitemap.xml`; change all three together. Add new routes to `sitemap.xml` with their hreflang alternates.
