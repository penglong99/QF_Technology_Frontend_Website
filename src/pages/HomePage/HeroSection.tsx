import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { paths } from '@/app/paths';
import styles from './HomePage.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <Container className={styles.heroInner}>
        <div className={styles.heroText}>
          <p className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} aria-hidden="true" />
            Live Showroom Products
          </p>
          <h1 className={styles.heroTitle}>
            Find the right tech <span className={styles.heroTitleAccent}>before you visit.</span>
          </h1>
          <p className={styles.heroLead}>
            We maintain a live digital catalog of every laptop, desktop, accessory and security
            system currently on our showroom floor. No surprises, just what&apos;s in stock.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink to={paths.catalog} size="lg" trailingIcon={<ArrowRight />}>
              Explore Catalog
            </ButtonLink>
          </div>
          <p className={styles.heroStatus}>
            <span className={styles.heroStatusDot} aria-hidden="true" />
            Updated showroom stock
          </p>
        </div>

        <img
          src="/images/site/hero-laptops.webp"
          alt="A group of five laptops from brands including HP, Apple and ASUS, with their screens lit"
          className={styles.heroImage}
          width={1920}
          height={1032}
          fetchPriority="high"
        />
      </Container>
    </section>
  );
}
