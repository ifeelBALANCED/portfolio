import type { Localized } from '../domain/locale';

export const profile = {
  name: { en: 'Vladyslav Herasymenko', uk: 'Владислав Герасименко' } satisfies Localized<string>,
  location: { en: 'Kyiv, Ukraine', uk: 'Київ, Україна' } satisfies Localized<string>,
  timezone: 'UTC+2 / +3',
  email: 'vladislavherasymenko@gmail.com',
  github: 'https://github.com/ifeelBALANCED',
  linkedin: 'https://www.linkedin.com/in/vladyslav-herasymenko',
};

export interface Job {
  readonly start: string;
  readonly end: string | null;
  readonly role: Localized<string>;
  readonly org: Localized<string>;
  readonly place: Localized<string>;
  readonly points: Localized<readonly string[]>;
}

export const experience: readonly Job[] = [
  {
    start: '04.2023',
    end: null,
    role: { en: 'Frontend Developer', uk: 'Фронтенд-розробник' },
    org: { en: 'SE “Infotech”', uk: 'SE “Infotech”' },
    place: { en: 'Kyiv', uk: 'Київ' },
    points: {
      en: [
        'Architected scalable React + TypeScript applications with Feature-Sliced Design and Atomic Design, improving maintainability and onboarding of new developers.',
        'Built GIS interfaces with the ArcGIS JS SDK: interactive map layers and spatial data visualizations.',
        'Introduced dependency injection (Inversify) to improve testability and modularity.',
        'Wrote and maintained Jest unit and integration suites, reducing regressions and increasing release confidence.',
        'Mentored junior developers, ran knowledge-sharing sessions, took part in planning and code review.',
      ],
      uk: [
        'Спроєктував масштабовані React + TypeScript-застосунки з Feature-Sliced Design та Atomic Design, що покращило підтримуваність і онбординг нових розробників.',
        'Створював GIS-інтерфейси на ArcGIS JS SDK: інтерактивні шари карт і візуалізації просторових даних.',
        'Запровадив dependency injection (Inversify) для кращої тестованості й модульності.',
        'Писав і підтримував unit- та інтеграційні тести на Jest, що зменшило кількість регресій і підвищило впевненість у релізах.',
        'Менторив джуніор-розробників, проводив сесії обміну знаннями, брав участь у плануванні та код-рев’ю.',
      ],
    },
  },
  {
    start: '08.2022',
    end: '03.2023',
    role: { en: 'Frontend Developer', uk: 'Фронтенд-розробник' },
    org: { en: 'Unit Space', uk: 'Unit Space' },
    place: { en: 'Kharkiv', uk: 'Харків' },
    points: {
      en: [
        'Developed cryptocurrency service modules for web platforms and online stores, including multi-currency wallet integrations.',
        'Implemented authorization with two-factor authentication and role-based access control.',
        'Built an admin panel covering user management, account settings and support tickets.',
        'Refactored legacy code to reduce technical debt and standardize component patterns.',
      ],
      uk: [
        'Розробляв модулі криптовалютних сервісів для вебплатформ та інтернет-магазинів, зокрема інтеграції мультивалютних гаманців.',
        'Реалізував авторизацію з двофакторною автентифікацією та рольовим контролем доступу.',
        'Створив адмін-панель для керування користувачами, налаштувань акаунтів і тікетів підтримки.',
        'Рефакторив legacy-код, щоб зменшити технічний борг і уніфікувати патерни компонентів.',
      ],
    },
  },
  {
    start: '05.2021',
    end: '07.2022',
    role: { en: 'Frontend Developer', uk: 'Фронтенд-розробник' },
    org: { en: 'Zfort Group', uk: 'Zfort Group' },
    place: { en: 'Kharkiv', uk: 'Харків' },
    points: {
      en: [
        'Built analytics dashboard visualizations with Recharts, Chart.js and react-charts.',
        'Integrated the frontend with multiple backend services and databases.',
        'Delivered responsive, cross-browser interfaces from design specs; reviewed peers’ code and proposed tooling improvements.',
      ],
      uk: [
        'Створював візуалізації аналітичних дашбордів на Recharts, Chart.js і react-charts.',
        'Інтегрував фронтенд з кількома бекенд-сервісами та базами даних.',
        'Робив адаптивні кросбраузерні інтерфейси за дизайн-специфікаціями; переглядав код колег і пропонував покращення інструментів.',
      ],
    },
  },
  {
    start: '09.2020',
    end: '04.2021',
    role: { en: 'Freelance Frontend Developer', uk: 'Фронтенд-розробник (фріланс)' },
    org: { en: 'Private clients', uk: 'Приватні клієнти' },
    place: { en: 'Remote', uk: 'Віддалено' },
    points: {
      en: ['Delivered frontend development projects for private clients.'],
      uk: ['Виконував фронтенд-проєкти для приватних клієнтів.'],
    },
  },
  {
    start: '05.2019',
    end: '08.2020',
    role: { en: 'Frontend Developer', uk: 'Фронтенд-розробник' },
    org: { en: 'KE Development', uk: 'KE Development' },
    place: { en: 'Kharkiv', uk: 'Харків' },
    points: {
      en: [
        'Implemented UI designs in JavaScript and CSS; shipped features and fixed bugs.',
        'Wrote tested code, conducted code reviews, took part in architecture planning with backend and UX/UI teams.',
      ],
      uk: [
        'Реалізовував UI-дизайни на JavaScript і CSS; випускав фічі та виправляв баги.',
        'Писав протестований код, проводив код-рев’ю, брав участь в архітектурному плануванні з бекенд- та UX/UI-командами.',
      ],
    },
  },
];

export const stack = [
  {
    group: 'languages',
    items: ['TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Sass/SCSS', 'Rust (OSS)'],
  },
  {
    group: 'frontend',
    items: [
      'React',
      'Next.js',
      'Redux Toolkit',
      'Redux Saga',
      'React Router',
      'Tailwind CSS',
      'Material UI',
      'Vite',
    ],
  },
  {
    group: 'architecture',
    items: ['Feature-Sliced Design', 'Atomic Design', 'Dependency injection (Inversify)'],
  },
  { group: 'testing', items: ['Jest', 'Cypress', 'Unit & integration', 'TDD'] },
  { group: 'data', items: ['ArcGIS JS SDK', 'Recharts', 'Chart.js', 'REST', 'GraphQL', 'Swagger'] },
  {
    group: 'backend',
    items: ['Node.js', 'NestJS', 'PostgreSQL', 'MongoDB', 'SQLite', 'Docker', 'Git', 'ESLint'],
  },
] as const;

export const education = {
  school: {
    en: 'V. N. Karazin Kharkiv National University',
    uk: 'Харківський національний університет імені В. Н. Каразіна',
  } satisfies Localized<string>,
  degree: {
    en: 'Bachelor’s, Computer Science and Cybersecurity',
    uk: 'Бакалавр, комп’ютерні науки та кібербезпека',
  } satisfies Localized<string>,
  period: {
    en: '2019 — 2023 · top 15% of class',
    uk: '2019 — 2023 · топ-15% випуску',
  } satisfies Localized<string>,
};

export interface Project {
  readonly name: string;
  readonly stars: number;
  readonly lang: string;
  readonly desc: Localized<string>;
  readonly href: string;
  readonly demo?: string;
  /** At most one: shown as a highlighted card above the rest. */
  readonly featured?: true;
}

export const projects: readonly Project[] = [
  {
    name: 'effector-vite-template',
    stars: 21,
    lang: 'TypeScript',
    desc: {
      en: 'Dockerized React + Effector + Feature-Sliced Design + Vite starter.',
      uk: 'Стартер у Docker: React + Effector + Feature-Sliced Design + Vite.',
    },
    href: 'https://github.com/ifeelBALANCED/effector-vite-template',
    demo: 'https://effector-vite-template.surge.sh',
    featured: true,
  },
  {
    name: 'nest-react-monorepo',
    stars: 1,
    lang: 'TypeScript',
    desc: {
      en: 'Nest.js and React in one monorepo behind Nginx, containerized with Docker.',
      uk: 'Nest.js і React в одному монорепо за Nginx, у контейнерах Docker.',
    },
    href: 'https://github.com/ifeelBALANCED/nest-react-monorepo',
  },
  {
    name: 'task-planner-nest-bot',
    stars: 3,
    lang: 'TypeScript',
    desc: {
      en: 'Telegram task-planner bot built with Telegraf, Nest.js and Postgres.',
      uk: 'Telegram-бот для планування завдань на Telegraf, Nest.js і Postgres.',
    },
    href: 'https://github.com/ifeelBALANCED/task-planner-nest-bot',
  },
  {
    name: 'vite-todo-app',
    stars: 2,
    lang: 'TypeScript',
    desc: {
      en: 'React app with authentication, Chakra UI, Cypress e2e tests, ESLint, Prettier and git hooks.',
      uk: 'React-застосунок з автентифікацією, Chakra UI, e2e-тестами на Cypress, ESLint, Prettier і git-хуками.',
    },
    href: 'https://github.com/ifeelBALANCED/vite-todo-app',
  },
];
