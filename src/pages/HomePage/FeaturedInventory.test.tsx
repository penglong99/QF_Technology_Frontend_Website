import { fireEvent, screen } from '@testing-library/react';
import { FeaturedProductCard } from './FeaturedProductCard';
import { FeaturedInventory } from './FeaturedInventory';
import { productService } from '@/services/productService';
import { buildProductView } from '@/test/factories';
import { renderWithRouter } from '@/test/renderWithRouter';

describe('FeaturedProductCard', () => {
  it('shows the name, brand, price, stock status and a link to the details page', () => {
    const product = buildProductView({
      name: 'QFBook Pro 14',
      slug: 'qfbook-pro-14',
      price: 1499,
      stockStatus: 'low-stock',
    });
    renderWithRouter(<FeaturedProductCard product={product} />);

    expect(screen.getByRole('heading', { name: 'QFBook Pro 14' })).toBeInTheDocument();
    expect(screen.getByText(product.brand.name)).toBeInTheDocument();
    expect(screen.getByText('$1,499.00')).toBeInTheDocument();
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/products/qfbook-pro-14',
    );
  });
});

describe('FeaturedInventory', () => {
  const products = [
    buildProductView({ id: '1', name: 'First', slug: 'first' }),
    buildProductView({ id: '2', name: 'Second', slug: 'second' }),
  ];

  beforeEach(() => {
    vi.spyOn(productService, 'getFeatured').mockResolvedValue(products);
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(2000);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(800);
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    HTMLElement.prototype.scrollBy = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('lists every featured product and links to the full catalog', async () => {
    renderWithRouter(<FeaturedInventory />);

    expect(await screen.findByRole('heading', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Second' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view all products/i })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it('starts at the beginning and scrolls forward with the next button', async () => {
    renderWithRouter(<FeaturedInventory />);

    const next = await screen.findByRole('button', { name: 'Next products' });
    expect(screen.getByRole('button', { name: 'Previous products' })).toBeDisabled();
    expect(next).toBeEnabled();

    fireEvent.click(next);
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' }),
    );
  });
});
