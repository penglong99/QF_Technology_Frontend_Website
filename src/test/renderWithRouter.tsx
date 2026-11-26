import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Renders a component inside a memory router. Extra routes let tests assert where a
 * navigation landed (e.g. `{ path: '/catalog', element: <p>Catalog</p> }`).
 */
export function renderWithRouter(
  element: ReactElement,
  {
    path = '/',
    initialEntry = path,
    routes = [],
  }: { path?: string; initialEntry?: string; routes?: RouteObject[] } = {},
) {
  const router = createMemoryRouter([{ path, element }, ...routes], {
    initialEntries: [initialEntry],
  });
  return { user: userEvent.setup(), router, ...render(<RouterProvider router={router} />) };
}
