import { useState } from 'react';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { SearchBar } from '@/features/search/components/SearchBar';
import { classNames } from '@/lib/classNames';
import { catalogPath, paths } from '@/app/paths';
import { Container } from '../Container/Container';
import { Logo } from '../Logo/Logo';
import { primaryNavItems } from './navItems';
import { useComputerBrands } from './useComputerBrands';
import styles from './Header.module.css';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const computerBrands = useComputerBrands();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  // Show the current query while on the search page; keying on it resets the field per search.
  const searchQuery = pathname === paths.search ? (searchParams.get('q')?.trim() ?? '') : '';

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Logo size="sm" />

        <nav aria-label="Main" className={styles.desktopNav}>
          <ul className={styles.navList}>
            {primaryNavItems.map((item) => {
              const hasBrandMenu = item.to === paths.catalog && computerBrands.length > 0;
              return (
                <li key={item.to} className={hasBrandMenu ? styles.navItemWithMenu : undefined}>
                  <NavLink
                    to={item.to}
                    end={item.to === paths.home}
                    className={({ isActive }) =>
                      classNames(styles.navLink, isActive && styles.active)
                    }
                  >
                    {item.label}
                    {hasBrandMenu && (
                      <ChevronDown aria-hidden="true" className={styles.navChevron} />
                    )}
                  </NavLink>
                  {hasBrandMenu && (
                    // Opens on hover, and on keyboard focus so the links can be tabbed to
                    <div className={styles.brandMenu}>
                      <div className={styles.brandPanel}>
                        <p className={styles.brandTitle} id="brand-menu-title">
                          Computers by brand
                        </p>
                        <ul className={styles.brandList} aria-labelledby="brand-menu-title">
                          {computerBrands.map(({ brand, count }) => (
                            <li key={brand.id}>
                              <Link
                                to={catalogPath({ brand: brand.id })}
                                className={styles.brandLink}
                                onClick={(event) => event.currentTarget.blur()}
                              >
                                {brand.name}
                                <span className={styles.brandCount}>{count}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={paths.catalog}
                          className={styles.brandAll}
                          onClick={(event) => event.currentTarget.blur()}
                        >
                          View full catalog <ArrowRight aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <SearchBar
            key={searchQuery}
            initialQuery={searchQuery}
            compact
            className={styles.search}
          />
          <IconButton
            label={menuOpen ? 'Close menu' : 'Open menu'}
            icon={menuOpen ? <X /> : <Menu />}
            variant="ghost"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          />
        </div>
      </Container>

      <nav id="mobile-navigation" aria-label="Main" className={styles.mobileNav} hidden={!menuOpen}>
        <Container>
          <ul className={styles.mobileList}>
            {primaryNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === paths.home}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    classNames(styles.mobileLink, isActive && styles.active)
                  }
                >
                  {item.label}
                </NavLink>
                {item.to === paths.catalog && computerBrands.length > 0 && (
                  <ul className={styles.mobileBrands} aria-label="Computers by brand">
                    {computerBrands.map(({ brand }) => (
                      <li key={brand.id}>
                        <Link
                          to={catalogPath({ brand: brand.id })}
                          onClick={closeMenu}
                          className={styles.mobileBrand}
                        >
                          {brand.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
