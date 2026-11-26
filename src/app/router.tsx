import { createBrowserRouter, type RouteObject } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout/MainLayout';
import { HomePage } from '@/pages/HomePage/HomePage';
import { CatalogPage } from '@/pages/CatalogPage/CatalogPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage/ProductDetailsPage';
import { SearchPage } from '@/pages/SearchPage/SearchPage';
import { ComparePage } from '@/pages/ComparePage/ComparePage';
import { BuyingGuidePage } from '@/pages/BuyingGuidePage/BuyingGuidePage';
import { AboutPage } from '@/pages/AboutPage/AboutPage';
import { ContactPage } from '@/pages/ContactPage/ContactPage';
import { PoliciesPage } from '@/pages/PoliciesPage/PoliciesPage';
import { NotFoundPage } from '@/pages/NotFoundPage/NotFoundPage';
import { Spinner } from '@/components/ui';
import { paths } from './paths';

/** Strips the leading slash: child routes are declared relative to their parent. */
const relative = (path: string) => path.replace(/^\//, '');

const storefrontRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: relative(paths.catalog), element: <CatalogPage /> },
  { path: 'products/:slug', element: <ProductDetailsPage /> },
  { path: relative(paths.search), element: <SearchPage /> },
  { path: relative(paths.compare), element: <ComparePage /> },
  { path: relative(paths.buyingGuide), element: <BuyingGuidePage /> },
  { path: relative(paths.about), element: <AboutPage /> },
  { path: relative(paths.contact), element: <ContactPage /> },
  { path: relative(paths.policies), element: <PoliciesPage /> },
  ...(import.meta.env.DEV
    ? [
        {
          path: 'design-system',
          hydrateFallbackElement: <Spinner />,
          lazy: async () => {
            const { DesignSystemPage } = await import('@/pages/DesignSystemPage/DesignSystemPage');
            return { Component: DesignSystemPage };
          },
        },
      ]
    : []),
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter([
  { path: '/', element: <MainLayout />, children: storefrontRoutes },
]);
