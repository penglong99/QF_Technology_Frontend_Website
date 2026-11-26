import { useEffect } from 'react';

const SITE_NAME = 'QF Technology';

/** Sets the browser tab title for the current page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Computer Store in Phnom Penh`;
  }, [title]);
}
