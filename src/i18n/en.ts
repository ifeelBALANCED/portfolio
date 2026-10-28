export const en = {
  meta: {
    title: 'Vladyslav Herasymenko — Frontend engineer',
    description:
      'Frontend engineer (React / TypeScript) in Kyiv. 5+ years across GIS, fintech and analytics; merged TanStack DB contributor; Rust linter work in Oxc.',
    ogLocale: 'en_US',
    ogImage: '/og.png',
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
      status: { label: 'Status', value: 'Open to remote frontend roles' },
    },
    contact: 'Contact me',
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
    featured: 'Featured · most starred',
    demo: 'live demo',
    live: 'Live',
  },
  contact: {
    title: 'Contact',
    lead: 'Open to remote frontend roles.',
    linkedin: 'LinkedIn',
  },
  notFound: {
    title: 'Page not found',
    text: 'That address does not exist on this site.',
    home: 'Go to the home page',
  },
};

export type Dictionary = typeof en;
