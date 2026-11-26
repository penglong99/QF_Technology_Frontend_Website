export type PageItem = number | 'ellipsis';

/**
 * Returns the page buttons to show, e.g. [1, 2, 3, 'ellipsis', 12].
 * Always includes the first and last page and one neighbour either side of the current page.
 */
export function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (currentPage >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => pages.add(page));
  }

  const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  return sorted.flatMap<PageItem>((page, index) => {
    const previous = sorted[index - 1];
    return previous !== undefined && page - previous > 1 ? ['ellipsis', page] : [page];
  });
}
