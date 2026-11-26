import { Outlet, ScrollRestoration } from 'react-router';
import { AnnouncementBar } from '../AnnouncementBar/AnnouncementBar';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import styles from './MainLayout.module.css';

/** Public storefront shell: announcement bar, sticky header, page content, footer. */
export function MainLayout() {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
