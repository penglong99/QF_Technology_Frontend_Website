import { Cctv, Eye, Laptop, Mouse, Printer, Target } from 'lucide-react';
import { catalogPath } from '@/app/paths';

export const purposes = [
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'To be the tech partner people in Phnom Penh trust first for quality products and fast, reliable support.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To help every customer choose the right technology with honest advice, carefully selected products, and responsive service and repairs.',
  },
];

export const meanings = [
  { letter: 'Q', title: 'Quality', text: 'Products selected with care.' },
  { letter: 'F', title: 'Fast', text: 'Responsive service and support.' },
];

export const offerings = [
  {
    icon: Laptop,
    title: 'Laptops & PCs',
    text: 'Reliable devices for work, study, and everyday use.',
    to: catalogPath({ category: 'laptops' }),
  },
  {
    icon: Mouse,
    title: 'Accessories',
    text: 'Essential gear to help you do more.',
    to: catalogPath({ category: 'accessories' }),
  },
  {
    icon: Printer,
    title: 'Printers & Networking',
    text: 'Print, connect and keep your business running.',
    to: catalogPath({ category: 'printers' }),
  },
  {
    icon: Cctv,
    title: 'CCTV & Repairs',
    text: 'Security solutions and professional repair services.',
    to: catalogPath({ category: 'cctv' }),
  },
];
