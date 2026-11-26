import { screen, within } from '@testing-library/react';
import { Header } from './Header';
import { renderWithRouter } from '@/test/renderWithRouter';

describe('Header', () => {
  it('lists computer brands under Catalog, each linking to its catalog results', async () => {
    renderWithRouter(<Header />);

    // The closed phone menu is hidden, so this finds the desktop dropdown's list
    const brands = await screen.findByRole('list', { name: 'Computers by brand' });

    expect(within(brands).getByRole('link', { name: /Apple/ })).toHaveAttribute(
      'href',
      '/catalog?brand=apple',
    );
    // Brands that only sell accessories or printers are left out
    expect(within(brands).queryByRole('link', { name: /Logitech/ })).toBeNull();
    expect(within(brands).queryByRole('link', { name: /Canon/ })).toBeNull();
  });
});
