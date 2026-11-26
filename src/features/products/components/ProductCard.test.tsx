import { screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { buildProductView } from '@/test/factories';
import { renderWithRouter } from '@/test/renderWithRouter';

describe('ProductCard', () => {
  it('shows the name, price and a link to the details page', () => {
    renderWithRouter(
      <ProductCard
        product={buildProductView({ name: 'QFBook Pro 14', slug: 'qfbook-pro-14', price: 1499 })}
      />,
    );
    expect(screen.getByRole('heading', { name: 'QFBook Pro 14' })).toBeInTheDocument();
    expect(screen.getByText('$1,499.00')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/products/qfbook-pro-14',
    );
  });

  it('shows the out-of-stock badge', () => {
    renderWithRouter(
      <ProductCard product={buildProductView({ name: 'Sold', stockStatus: 'out-of-stock' })} />,
    );
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
