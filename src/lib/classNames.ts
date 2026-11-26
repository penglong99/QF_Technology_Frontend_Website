/** Joins truthy class names. Keeps conditional CSS-module classes readable. */
export function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
