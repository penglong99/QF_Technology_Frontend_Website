import { screen } from '@testing-library/react';
import { AboutPage } from './AboutPage';
import { googleMapsUrl } from '@/features/store-info/data';
import { renderWithRouter } from '@/test/renderWithRouter';

describe('AboutPage', () => {
  it('leads with the page heading and links to the catalog', () => {
    renderWithRouter(<AboutPage />, { path: '/about' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your Tech Partner. Quality & Fast.',
    );
    expect(screen.getByRole('link', { name: 'Explore Our Products' })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it('offers ways to get in touch and find the store', () => {
    renderWithRouter(<AboutPage />, { path: '/about' });

    for (const link of screen.getAllByRole('link', { name: 'Contact Us' })) {
      expect(link).toHaveAttribute('href', '/contact');
    }
    expect(screen.getByRole('link', { name: /Get Directions/ })).toHaveAttribute(
      'href',
      googleMapsUrl,
    );
  });

  it('states our vision and mission', () => {
    renderWithRouter(<AboutPage />, { path: '/about' });

    expect(screen.getByRole('heading', { name: 'Our Vision' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Our Mission' })).toBeInTheDocument();
  });

  it('links each offering to its catalog category', () => {
    renderWithRouter(<AboutPage />, { path: '/about' });

    expect(screen.getByRole('link', { name: /Printers & Networking/ })).toHaveAttribute(
      'href',
      '/catalog?category=printers',
    );
    expect(screen.getByRole('link', { name: /CCTV & Repairs/ })).toHaveAttribute(
      'href',
      '/catalog?category=cctv',
    );
  });
});
