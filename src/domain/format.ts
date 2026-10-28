export const fill = (template: string, values: Readonly<Record<string, string>>): string =>
  template.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`Missing value for placeholder {${name}}`);
    return value;
  });

export const formatPeriod = (start: string, end: string | null, presentLabel: string): string =>
  `${start} — ${end === null ? presentLabel : end}`;
