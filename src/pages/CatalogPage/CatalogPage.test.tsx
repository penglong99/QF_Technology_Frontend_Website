import { screen, within } from '@testing-library/react';
import { CatalogPage } from './CatalogPage';
import { renderWithRouter } from '@/test/renderWithRouter';

describe('CatalogPage', () => {
  it('filters by brand and writes the filter to the URL', async () => {
    const { user, router } = renderWithRouter(<CatalogPage />, { path: '/catalog' });
    expect(await screen.findByText(/Showing/)).toHaveTextContent(/Showing \d+ products/);

    const sidebar = screen.getByRole('complementary', { name: 'Product filters' });
    await user.click(within(sidebar).getByRole('button', { name: 'Brand' }));
    await user.click(within(sidebar).getByRole('checkbox', { name: 'Apple' }));

    expect(router.state.location.search).toBe('?brand=apple');
    const grid = await screen.findAllByRole('article');
    expect(grid.length).toBeGreaterThan(0);
    for (const card of grid) expect(within(card).getByText('Apple')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apple\s*Remove filter/ })).toBeInTheDocument();
  });

  it('restores filters from the URL and can clear them', async () => {
    const { user, router } = renderWithRouter(<CatalogPage />, {
      path: '/catalog',
      initialEntry: '/catalog?category=printers&sort=price-asc',
    });
    const cards = await screen.findAllByRole('article');
    const prices = cards.map((card) =>
      Number(within(card).getAllByText(/^\$/)[0]?.textContent?.replace(/[$,]/g, '')),
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));

    await user.click(
      within(screen.getByRole('complementary')).getByRole('button', { name: 'Clear All' }),
    );
    expect(router.state.location.search).toBe('?sort=price-asc');
  });
});
