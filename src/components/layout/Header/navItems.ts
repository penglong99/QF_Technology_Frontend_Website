import { paths } from '@/app/paths';

export const primaryNavItems = [
  { label: 'Home', to: paths.home },
  { label: 'Catalog', to: paths.catalog },
  { label: 'Compare', to: paths.compare },
  { label: 'About', to: paths.about },
  { label: 'Contact', to: paths.contact },
] as const;
