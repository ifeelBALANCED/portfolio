import type { Dictionary } from './en';

export const uk: Dictionary = {
  meta: {
    title: 'Владислав Герасименко — Фронтенд-інженер',
    description:
      'Фронтенд-інженер (React / TypeScript) у Києві. 5+ років у GIS, фінтеху та аналітиці; змерджені зміни в TanStack DB; робота над Rust-лінтером Oxc.',
    ogLocale: 'uk_UA',
    ogImage: '/og-uk.png',
  },
  skip: 'Перейти до вмісту',
  toolbar: { brand: 'VH / ФРОНТЕНД-ІНЖЕНЕР' },
  nav: {
    label: 'Основна навігація',
    changeset: 'Open source',
    history: 'Досвід',
    spec: 'Стек',
    inventory: 'Репозиторії',
    contact: 'Контакти',
  },
  switchers: { theme: 'Тема', language: 'Мова' },
  hero: {
    kicker: 'РЕВ. {date} · КИЇВ · UTC+2/+3',
    headingLead: 'Фронтенд-',
    headingTail: 'інженер',
    dimension: 'масштаб 1:1',
    lede: 'Я будую насичені даними інтерфейси на React і TypeScript: GIS на ArcGIS, фінтех, аналітичні дашборди. Виправляю й самі бібліотеки. Список справжній, разом із PR, які не змерджили.',
    spec: {
      focus: { label: 'Фокус', value: 'Мапи (ArcGIS), фінтех, аналітика' },
      stack: { label: 'Стек', value: 'React · TypeScript' },
      experience: { label: 'Досвід', value: '5+ років' },
      base: { label: 'Локація', value: 'Київ' },
      status: { label: 'Статус', value: 'Відкритий до віддалених фронтенд-ролей' },
    },
    contact: 'Написати мені',
    seePrs: 'До PR',
    github: 'GitHub',
    cv: 'Завантажити CV (PDF)',
  },
  ledger: {
    title: 'Зміни в open source',
    filterLabel: 'Фільтр pull request’ів',
    filters: { all: 'Усі', merged: 'Змерджені', open: 'Відкриті', closed: 'Закриті' },
    states: { merged: 'Змерджено', open: 'Відкрито', closed: 'Закрито · без мерджу' },
    stat: 'Стан на {date}',
    closedNote: 'PR, закриті без мерджу, показано навмисно.',
  },
  history: {
    title: 'Історія змін',
    present: 'Нині',
    education: 'Освіта',
  },
  spec: {
    title: 'Специфікація',
    groups: {
      languages: 'Мови',
      frontend: 'Фронтенд',
      architecture: 'Архітектура',
      testing: 'Тестування',
      data: 'Дані та мапи',
      backend: 'Бекенд та інструменти',
    },
  },
  inventory: {
    title: 'Інвентар',
    intro: 'Публічні проєкти в особистий час. Код роботодавців приватний і тут не наведений.',
    featured: 'Головний проєкт · найпопулярніший',
    demo: 'демо',
    live: 'Онлайн',
  },
  contact: {
    title: 'Контакти',
    lead: 'Відкритий до віддалених фронтенд-ролей.',
    linkedin: 'LinkedIn',
  },
  notFound: {
    title: 'Сторінку не знайдено',
    text: 'Такої адреси на цьому сайті немає.',
    home: 'На головну',
  },
};
