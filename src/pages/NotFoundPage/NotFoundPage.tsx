import { ButtonLink } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { paths } from '@/app/paths';
import { usePageTitle } from '@/hooks/usePageTitle';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <Container className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      <div className={styles.actions}>
        <ButtonLink to={paths.home}>Go Home</ButtonLink>
        <ButtonLink to={paths.catalog} variant="secondary">
          Browse Catalog
        </ButtonLink>
      </div>
    </Container>
  );
}
