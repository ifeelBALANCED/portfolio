export const en = {
  meta: {
    title: 'Vladyslav Herasymenko — Frontend engineer',
    description:
      'Frontend engineer (React / TypeScript) in Kyiv. 5+ years across GIS, fintech and analytics; merged TanStack DB contributor; Rust linter work in Oxc.',
    ogLocale: 'en_US',
  },
  skip: 'Skip to content',
  toolbar: { brand: 'VH / FRONTEND ENGINEER' },
  nav: {
    label: 'Primary',
    changeset: 'Open source',
    history: 'Experience',
    spec: 'Stack',
    inventory: 'Repos',
    contact: 'Contact',
  },
  switchers: { theme: 'Theme', language: 'Language' },
  hero: {
    kicker: 'REV. {date} · KYIV · UTC+2/+3',
    headingLead: 'Frontend ',
    headingTail: 'engineer',
    dimension: 'scale 1:1',
    lede: 'I build map-heavy, data-dense interfaces in React and TypeScript: GIS with ArcGIS, fintech, analytics dashboards. I also fix things upstream. The changeset is real, including the PRs that did not land.',
    spec: {
      focus: { label: 'Focus', value: 'Maps (ArcGIS), fintech, analytics' },
      stack: { label: 'Stack', value: 'React · TypeScript' },
      experience: { label: 'Experience', value: '5+ yrs' },
      base: { label: 'Base', value: 'Kyiv' },
    },
    seePrs: 'See the PRs',
    github: 'GitHub',
    cv: 'Download CV (PDF)',
  },
  ledger: {
    title: 'Open-source changeset',
    filterLabel: 'Filter pull requests',
    filters: { all: 'All', merged: 'Merged', open: 'Open', closed: 'Closed' },
    states: { merged: 'Merged', open: 'Open', closed: 'Closed · not merged' },
    stat: 'Status as of {date}',
    closedNote: 'Closed-unmerged PRs are listed on purpose.',
  },
  history: {
    title: 'Revision history',
    present: 'Present',
    education: 'Education',
  },
  spec: {
    title: 'Specification',
    groups: {
      languages: 'Languages',
      frontend: 'Frontend',
      architecture: 'Architecture',
      testing: 'Testing',
      data: 'Data & maps',
      backend: 'Backend & tools',
    },
  },
  inventory: {
    title: 'Inventory',
    intro: 'Public, personal-time projects. Employer code is private and not listed.',
    code: 'code',
    demo: 'live demo',
    live: 'Live',
  },
  contact: {
    title: 'Contact',
    lead: 'Open to remote frontend roles.',
    linkedin: 'LinkedIn',
  },
  footer: { note: 'Static site: Astro, Tailwind CSS v4, no framework JS.' },
};

export type Dictionary = typeof en;
