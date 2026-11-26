import { parseCatalogParams } from './useCatalogParams';

describe('parseCatalogParams', () => {
  it('uses sensible defaults', () => {
    expect(parseCatalogParams(new URLSearchParams())).toEqual({
      filters: {
        search: '',
        categoryIds: [],
        brandIds: [],
        processorFamilies: [],
        memoryGb: [],
        inStockOnly: false,
      },
      sort: 'popular',
      page: 1,
      view: 'grid',
    });
  });

  it('reads every supported parameter', () => {
    const params = new URLSearchParams(
      'category=laptops&brand=asus,dell&cpu=Intel Core i7&ram=32,64&instock=1&sort=price-asc&page=3&view=list',
    );
    const result = parseCatalogParams(params);
    expect(result.filters.brandIds).toEqual(['asus', 'dell']);
    expect(result.filters.processorFamilies).toEqual(['Intel Core i7']);
    expect(result.filters.memoryGb).toEqual([32, 64]);
    expect(result.filters.inStockOnly).toBe(true);
    expect(result).toMatchObject({ sort: 'price-asc', page: 3, view: 'list' });
  });

  it('ignores invalid values from hand-edited URLs', () => {
    const result = parseCatalogParams(new URLSearchParams('sort=cheap&page=-2&ram=7&cpu=Pentium'));
    expect(result).toMatchObject({ sort: 'popular', page: 1 });
    expect(result.filters.memoryGb).toEqual([]);
    expect(result.filters.processorFamilies).toEqual([]);
  });
});
