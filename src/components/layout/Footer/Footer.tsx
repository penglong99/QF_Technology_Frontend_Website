import { Link } from 'react-router';
import { storeInfo } from '@/features/store-info/data';
import { catalogPath, paths } from '@/app/paths';
import { Container } from '../Container/Container';
import { Logo } from '../Logo/Logo';
import styles from './Footer.module.css';

const footerColumns = [
  {
    title: 'Catalog',
    links: [
      { label: 'Laptops', to: catalogPath({ category: 'laptops' }) },
      { label: 'Desktops', to: catalogPath({ category: 'desktops' }) },
      { label: 'Workstations', to: catalogPath({ category: 'workstations' }) },
      { label: 'Printers & CCTV', to: catalogPath({ category: 'printers' }) },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: paths.about },
      { label: 'Locations', to: `${paths.contact}#visit` },
      { label: 'Support', to: paths.buyingGuide },
      { label: 'Contact', to: paths.contact },
    ],
  },
  {
    title: 'Policy',
    links: [
      { label: 'Returns', to: `${paths.policies}#returns` },
      { label: 'Warranty', to: `${paths.policies}#warranty` },
      { label: 'Privacy', to: `${paths.policies}#privacy` },
      { label: 'Terms', to: `${paths.policies}#terms` },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo size="md" />
            <p className={styles.tagline}>{storeInfo.tagline}</p>
          </div>

          <nav aria-label="Footer" className={styles.columns}>
            {footerColumns.map((column) => (
              <div key={column.title} className={styles.column}>
                <h2 className={styles.columnTitle}>{column.title}</h2>
                <ul className={styles.links}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {storeInfo.name}. All rights reserved.
          </p>
          <ul className={styles.social}>
            {storeInfo.social.map((item) => (
              <li key={item.name}>
                <a href={item.href} target="_blank" rel="noreferrer" className={styles.socialLink}>
                  <img src={item.icon} alt={item.name} width={20} height={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
