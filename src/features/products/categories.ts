import type { Category } from './types';

/**
 * The website's product categories: display name, description and icon. Pages link to these
 * slugs (e.g. `/catalog?category=laptops`), so they stay stable whatever the data source.
 * POS categories are matched to these by name in `services/pos/posMapper.ts`; a POS category
 * with no match here still appears, with a generic icon.
 */
export const siteCategories: Category[] = [
  {
    id: 'laptops',
    slug: 'laptops',
    name: 'Laptops',
    description: 'Portable computing solutions including ultrabooks, gaming, and business laptops.',
    icon: 'laptop',
  },
  {
    id: 'desktops',
    slug: 'desktops',
    name: 'Desktops',
    description: 'Traditional tower systems and compact desktops for home and office.',
    icon: 'desktop',
  },
  {
    id: 'all-in-one',
    slug: 'all-in-one',
    name: 'All-in-One',
    description: 'Space-saving computers with the display and system built into one unit.',
    icon: 'desktop',
  },
  {
    id: 'workstations',
    slug: 'workstations',
    name: 'Workstations',
    description: 'Certified high-performance machines for CAD, 3D rendering and engineering.',
    icon: 'workstation',
  },
  {
    id: 'gaming-pcs',
    slug: 'gaming-pcs',
    name: 'Gaming PCs',
    description: 'Custom-built and pre-built gaming desktops tuned and stress-tested in-store.',
    icon: 'gaming',
  },
  {
    id: 'monitors',
    slug: 'monitors',
    name: 'Monitors',
    description: 'Office, creative and high-refresh gaming displays.',
    icon: 'monitor',
  },
  {
    id: 'components',
    slug: 'components',
    name: 'Components',
    description: 'Graphics cards, memory, storage and other upgrade parts.',
    icon: 'component',
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Keyboards, mice, headsets and other everyday peripherals.',
    icon: 'accessory',
  },
  {
    id: 'printers',
    slug: 'printers',
    name: 'Printers',
    description: 'Ink tank, laser and multifunction printers plus supplies.',
    icon: 'printer',
  },
  {
    id: 'cctv',
    slug: 'cctv',
    name: 'CCTV & Security',
    description: 'Cameras, recorders and complete surveillance kits for homes and businesses.',
    icon: 'cctv',
  },
  {
    id: 'services',
    slug: 'services',
    name: 'Repair & Services',
    description: 'Diagnostics, repairs, installation and technical support by our in-house team.',
    icon: 'service',
  },
];
