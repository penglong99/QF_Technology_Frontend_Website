import type { Brand } from '@/features/products/types';

const brand = (id: string, name: string, status: Brand['status'] = 'active'): Brand => ({
  id,
  name,
  status,
});

export const mockBrands: Brand[] = [
  brand('qf', 'QF Technology'),
  brand('apple', 'Apple'),
  brand('lenovo', 'Lenovo'),
  brand('dell', 'Dell'),
  brand('hp', 'HP'),
  brand('asus', 'Asus'),
  brand('acer', 'Acer'),
  brand('microsoft', 'Microsoft'),
  brand('msi', 'MSI'),
  brand('razer', 'Razer'),
  brand('samsung', 'Samsung'),
  brand('lg', 'LG'),
  brand('logitech', 'Logitech'),
  brand('corsair', 'Corsair'),
  brand('canon', 'Canon'),
  brand('epson', 'Epson'),
  brand('hikvision', 'Hikvision'),
  brand('dahua', 'Dahua', 'inactive'),
];
