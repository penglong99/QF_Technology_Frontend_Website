import { filterProducts, matchesSearch, sortProducts } from './filterProducts';
import { buildProductView } from '@/test/factories';

const laptop = buildProductView({
  id: 'a',
  name: 'ROG Strix G16',
  brandId: 'asus',
  categoryId: 'laptops',
  price: 1599,
  memoryGb: 16,
  processorFamily: 'Intel Core i7',
  popularity: 50,
  createdAt: '2026-01-01',
});
const desktop = buildProductView({
  id: 'b',
  name: 'Mac Studio',
  brandId: 'apple',
  categoryId: 'desktops',
  price: 5999,
  memoryGb: 64,
  processorFamily: 'Apple Silicon',
  popularity: 90,
  createdAt: '2026-03-01',
});
const printer = buildProductView({
  id: 'c',
  name: 'EcoTank L3250',
  brandId: 'epson',
  categoryId: 'printers',
  price: 189,
  stockStatus: 'out-of-stock',
  popularity: 10,
  createdAt: '2026-02-01',
});
const all = [laptop, desktop, printer];

describe('matchesSearch', () => {
  it('matches every word in any order, ignoring case', () => {
    expect(matchesSearch(laptop, 'g16 strix')).toBe(true);
    expect(matchesSearch(laptop, 'STRIX')).toBe(true);
    expect(matchesSearch(laptop, 'strix mac')).toBe(false);
  });

  it('searches tags that are not shown on the card', () => {
    const tagged = buildProductView({ categoryId: 'laptops', searchTags: ['Gaming'] });
    expect(matchesSearch(tagged, 'gaming')).toBe(true);
    expect(matchesSearch(laptop, 'gaming')).toBe(false);
  });

  it('searches brand names and spec values', () => {
    expect(matchesSearch(laptop, 'asus')).toBe(true);
    expect(matchesSearch(laptop, '16GB')).toBe(true);
  });
});

describe('filterProducts', () => {
  it('returns everything with no filters', () => {
    expect(filterProducts(all, {})).toHaveLength(3);
  });

  it('combines filters with AND across groups and OR within a group', () => {
    const result = filterProducts(all, { brandIds: ['asus', 'apple'], memoryGb: [64] });
    expect(result.map((product) => product.id)).toEqual(['b']);
  });

  it('excludes products without the filtered attribute', () => {
    expect(filterProducts(all, { processorFamilies: ['Apple Silicon'] })).toEqual([desktop]);
  });

  it('hides out-of-stock products when requested', () => {
    expect(filterProducts(all, { inStockOnly: true })).not.toContain(printer);
  });
});

describe('sortProducts', () => {
  it('sorts by price both ways', () => {
    expect(sortProducts(all, 'price-asc').map((p) => p.id)).toEqual(['c', 'a', 'b']);
    expect(sortProducts(all, 'price-desc').map((p) => p.id)).toEqual(['b', 'a', 'c']);
  });

  it('sorts by popularity and date', () => {
    expect(sortProducts(all, 'popular')[0]).toBe(desktop);
    expect(sortProducts(all, 'newest').map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });

  it('does not mutate the input', () => {
    const input = [...all];
    sortProducts(input, 'price-asc');
    expect(input).toEqual(all);
  });
});
