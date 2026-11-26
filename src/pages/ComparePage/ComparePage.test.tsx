import { screen, within } from '@testing-library/react';
import { ComparePage } from './ComparePage';
import { renderWithRouter } from '@/test/renderWithRouter';

const headerLinks = () =>
  screen
    .getAllByRole('columnheader')
    .slice(1)
    .map((header) => within(header).getByRole('link').textContent);

async function search(
  user: ReturnType<typeof renderWithRouter>['user'],
  column: number,
  text: string,
) {
  await user.type(await screen.findByRole('combobox', { name: `Product ${column}` }), text);
  return screen.findByRole('listbox', { name: `Product ${column} results` });
}

describe('ComparePage', () => {
  it('starts with our three house lines', async () => {
    renderWithRouter(<ComparePage />, { path: '/compare' });

    expect(await screen.findByRole('combobox', { name: 'Product 1' })).toBeInTheDocument();
    expect(headerLinks()).toEqual(['QFBook Air 13', 'QFBook Pro 14"', 'QF CoreLine X1']);
  });

  it('swaps a column for the searched product and keeps it in the link', async () => {
    const { user, router } = renderWithRouter(<ComparePage />, { path: '/compare' });

    const results = await search(user, 2, 'razer');
    await user.click(await within(results).findByRole('option', { name: /^Razer Blade 16/ }));

    expect(headerLinks()).toEqual(['QFBook Air 13', 'Razer Blade 16', 'QF CoreLine X1']);
    expect(screen.getByRole('row', { name: /^Price/ })).toHaveTextContent('$3,999.00');
    expect(new URLSearchParams(router.state.location.search).get('p')).toBe(
      'qfbook-air-13,razer-blade-16,qf-coreline-x1',
    );
  });

  it('can pick a result with the keyboard', async () => {
    const { user } = renderWithRouter(<ComparePage />, { path: '/compare' });

    const results = await search(user, 3, 'macbook pro 16');
    await within(results).findByRole('option', { name: /^MacBook Pro 16/ });
    await user.keyboard('{Enter}');

    expect(headerLinks()).toEqual(['QFBook Air 13', 'QFBook Pro 14"', 'MacBook Pro 16']);
  });

  it('leaves out products that are already in the table', async () => {
    const { user } = renderWithRouter(<ComparePage />, { path: '/compare' });

    const results = await search(user, 1, 'qf');
    expect(
      await within(results).findByRole('option', { name: /^QF Pro Studio X1 RTX/ }),
    ).toBeInTheDocument();
    expect(within(results).queryByRole('option', { name: /^QF CoreLine X1/ })).toBeNull();
  });

  it('only finds computers', async () => {
    const { user } = renderWithRouter(<ComparePage />, { path: '/compare' });

    await search(user, 1, 'ultrasharp');
    expect(await screen.findByText(/No computers match/)).toBeInTheDocument();
  });

  it('restores a selection from the link and fills gaps left by unknown products', async () => {
    renderWithRouter(<ComparePage />, {
      path: '/compare',
      initialEntry: '/compare?p=razer-blade-16,not-a-product,razer-blade-16',
    });

    await screen.findByRole('combobox', { name: 'Product 1' });
    expect(headerLinks()).toEqual(['Razer Blade 16', 'QFBook Air 13', 'QFBook Pro 14"']);
  });
});
