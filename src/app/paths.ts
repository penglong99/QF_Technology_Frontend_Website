/** Every route path in one place, so links never drift from the router. */
export const paths = {
  home: '/',
  catalog: '/catalog',
  product: (slug: string) => `/products/${slug}`,
  search: '/search',
  compare: '/compare',
  buyingGuide: '/buying-guide',
  about: '/about',
  contact: '/contact',
  policies: '/policies',
} as const;

export function catalogPath(params: { category?: string; brand?: string } = {}): string {
  const search = new URLSearchParams();
  if (params.category) search.set('category', params.category);
  if (params.brand) search.set('brand', params.brand);
  const query = search.toString();
  return query ? `${paths.catalog}?${query}` : paths.catalog;
}

export function searchPath(query: string): string {
  return `${paths.search}?q=${encodeURIComponent(query)}`;
}
