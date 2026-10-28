export const profile = {
  name: 'Vladyslav Herasymenko',
  role: 'Senior Frontend Engineer',
  stackLine: 'React · TypeScript',
  location: 'Kyiv, Ukraine',
  timezone: 'UTC+2 / +3',
  email: 'vladislavherasymenko@gmail.com',
  github: 'https://github.com/ifeelBALANCED',
  linkedin: 'https://www.linkedin.com/in/vladyslav-herasymenko',
  summary:
    'Frontend developer with 5+ years of experience building React and TypeScript applications for enterprise GIS, fintech and analytics platforms. Strong in frontend architecture and automated testing. Looking for a remote Senior Frontend role in a product team where I can own architecture decisions and grow towards Team Lead.',
};

export const experience = [
  {
    period: '04.2023 — Present',
    role: 'Frontend Developer',
    org: 'SE “Infotech”',
    place: 'Kyiv',
    points: [
      'Architected scalable React + TypeScript applications with Feature-Sliced Design and Atomic Design, improving maintainability and onboarding of new developers.',
      'Built GIS interfaces with the ArcGIS JS SDK: interactive map layers and spatial data visualizations.',
      'Introduced dependency injection (Inversify) to improve testability and modularity.',
      'Wrote and maintained Jest unit and integration suites, reducing regressions and increasing release confidence.',
      'Mentored junior developers, ran knowledge-sharing sessions, took part in planning and code review.',
    ],
  },
  {
    period: '08.2022 — 03.2023',
    role: 'Frontend Developer',
    org: 'Unit Space',
    place: 'Kharkiv',
    points: [
      'Developed cryptocurrency service modules for web platforms and online stores, including multi-currency wallet integrations.',
      'Implemented authorization with two-factor authentication and role-based access control.',
      'Built an admin panel covering user management, account settings and support tickets.',
      'Refactored legacy code to reduce technical debt and standardize component patterns.',
    ],
  },
  {
    period: '05.2021 — 07.2022',
    role: 'Frontend Developer',
    org: 'Zfort Group',
    place: 'Kharkiv',
    points: [
      'Built analytics dashboard visualizations with Recharts, Chart.js and react-charts.',
      'Integrated the frontend with multiple backend services and databases.',
      'Delivered responsive, cross-browser interfaces from design specs; reviewed peers’ code and proposed tooling improvements.',
    ],
  },
  {
    period: '09.2020 — 04.2021',
    role: 'Freelance Frontend Developer',
    org: 'Private clients',
    place: 'Remote',
    points: ['Delivered frontend development projects for private clients.'],
  },
  {
    period: '05.2019 — 08.2020',
    role: 'Frontend Developer',
    org: 'KE Development',
    place: 'Kharkiv',
    points: [
      'Implemented UI designs in JavaScript and CSS; shipped features and fixed bugs.',
      'Wrote tested code, conducted code reviews, took part in architecture planning with backend and UX/UI teams.',
    ],
  },
];

export const stack = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Sass/SCSS', 'Rust (OSS)'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Redux Toolkit', 'Redux Saga', 'React Router', 'Tailwind CSS', 'Material UI', 'Vite'] },
  { group: 'Architecture', items: ['Feature-Sliced Design', 'Atomic Design', 'Dependency injection (Inversify)'] },
  { group: 'Testing', items: ['Jest', 'Cypress', 'Unit & integration', 'TDD'] },
  { group: 'Data & visualization', items: ['ArcGIS JS SDK', 'Recharts', 'Chart.js', 'REST', 'GraphQL', 'Swagger'] },
  { group: 'Backend & tools', items: ['Node.js', 'NestJS', 'PostgreSQL', 'MongoDB', 'SQLite', 'Docker', 'Git', 'ESLint'] },
];

export const education = {
  school: 'V. N. Karazin Kharkiv National University',
  degree: 'Bachelor’s, Computer Science and Cybersecurity',
  period: '2019 — 2023 · top 15% of class',
};

export const projects = [
  { name: 'effector-vite-template', stars: 21, lang: 'TypeScript', desc: 'Dockerized React + Effector + Feature-Sliced Design + Vite starter. My most-starred repository.', href: 'https://github.com/ifeelBALANCED/effector-vite-template' },
  { name: 'nest-react-monorepo', stars: 1, lang: 'TypeScript', desc: 'Nest.js and React in one monorepo behind Nginx, containerized with Docker.', href: 'https://github.com/ifeelBALANCED/nest-react-monorepo' },
  { name: 'task-planner-nest-bot', stars: 3, lang: 'TypeScript', desc: 'Telegram task-planner bot built with Telegraf, Nest.js and Postgres.', href: 'https://github.com/ifeelBALANCED/task-planner-nest-bot' },
  { name: 'vite-todo-app', stars: 2, lang: 'TypeScript', desc: 'React app with authentication, Chakra UI, Cypress e2e tests, ESLint, Prettier and git hooks.', href: 'https://github.com/ifeelBALANCED/vite-todo-app' },
];
