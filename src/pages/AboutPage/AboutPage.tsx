import { Link } from 'react-router';
import { ArrowRight, CalendarDays, Clock, Navigation, Wrench } from 'lucide-react';
import { ButtonLink, buttonClassName } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { CtaBand } from '@/components/layout/CtaBand/CtaBand';
import { googleMapsUrl } from '@/features/store-info/data';
import { classNames } from '@/lib/classNames';
import { usePageTitle } from '@/hooks/usePageTitle';
import { paths } from '@/app/paths';
import { meanings, offerings, purposes } from './aboutData';
import styles from './AboutPage.module.css';

export function AboutPage() {
  usePageTitle('About us');

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Container className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>QF Technology</p>
            <h1 className={styles.heroTitle}>
              Your Tech Partner. <span>Quality &amp; Fast.</span>
            </h1>
            <p className={styles.heroLead}>Technology for work, study, and everyday life.</p>
            <div className={styles.heroActions}>
              <ButtonLink
                to={paths.catalog}
                size="lg"
                trailingIcon={<ArrowRight />}
                className={styles.primaryAction}
              >
                Explore Our Products
              </ButtonLink>
              <ButtonLink
                to={paths.contact}
                size="lg"
                variant="secondary"
                className={styles.secondaryAction}
              >
                Contact Us
              </ButtonLink>
            </div>
          </div>
          <img
            src="/images/site/visit-shop.webp"
            alt="The QF Technology shop, a tall building with a blue facade and QF Technology sign"
            width={819}
            height={724}
            fetchPriority="high"
            className={styles.heroImage}
          />
        </Container>
      </section>

      <section className={styles.story} aria-labelledby="story-heading">
        <Container className={styles.storyInner}>
          <img
            src="/images/site/about-showroom.webp"
            alt="The QF Technology showroom, with laptops on long tables and shelves of devices"
            width={920}
            height={510}
            loading="lazy"
            className={styles.storyImage}
          />
          <div className={styles.storyText}>
            <p className={styles.eyebrow}>Our Story</p>
            <h2 id="story-heading" className={styles.storyTitle}>
              Technology made personal.
            </h2>
            <p className={styles.storyLead}>
              Based in Chroy Changvar, Phnom Penh, we help you choose the right technology with
              confidence.
            </p>
            <p className={styles.storyLead}>
              From laptops and desktops to printers, CCTV and repairs, everything we sell is in our
              showroom, so you can see it, try it and ask questions before you buy.
            </p>
            <ul className={styles.facts}>
              <li>
                <CalendarDays aria-hidden="true" />
                Open 7 days a week
              </li>
              <li>
                <Clock aria-hidden="true" />
                8:00 AM – 8:00 PM
              </li>
              <li>
                <Wrench aria-hidden="true" />
                In-house repairs
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className={styles.purpose} aria-labelledby="purpose-heading">
        <Container>
          <p className={classNames(styles.eyebrow, styles.centered)}>What Drives Us</p>
          <h2 id="purpose-heading" className={styles.sectionTitle}>
            Vision &amp; Mission
          </h2>
          <ul className={styles.purposeGrid}>
            {purposes.map(({ icon: Icon, title, text }) => (
              <li key={title} className={styles.purposeCard}>
                <span className={styles.purposeIcon} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={styles.purposeTitle}>{title}</h3>
                <p className={styles.purposeText}>{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.meaning} aria-labelledby="meaning-heading">
        <Container>
          <h2 id="meaning-heading" className={classNames(styles.eyebrow, styles.centered)}>
            The Meaning Behind QF
          </h2>
          <ul className={styles.meaningGrid}>
            {meanings.map(({ letter, title, text }) => (
              <li key={letter} className={styles.meaningCard}>
                <span className={styles.meaningLetter} aria-hidden="true">
                  {letter}
                </span>
                <div>
                  <h3 className={styles.meaningTitle}>{title}</h3>
                  <p className={styles.meaningText}>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.offer} aria-labelledby="offer-heading">
        <Container>
          <p className={classNames(styles.eyebrow, styles.centered)}>Everything You Need</p>
          <h2 id="offer-heading" className={styles.sectionTitle}>
            One tech partner.
          </h2>
          <ul className={styles.offerGrid}>
            {offerings.map(({ icon: Icon, title, text, to }) => (
              <li key={title}>
                <Link to={to} className={styles.offerCard}>
                  <Icon aria-hidden="true" className={styles.offerIcon} />
                  <h3 className={styles.offerName}>{title}</h3>
                  <p className={styles.offerText}>{text}</p>
                  <span className={styles.offerArrow} aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand
        title="Have a question before you visit?"
        actions={
          <>
            <ButtonLink to={paths.contact} variant="inverse" size="lg">
              Contact Us
            </ButtonLink>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName({ variant: 'outlineInverse', size: 'lg' })}
            >
              <Navigation aria-hidden="true" />
              Get Directions
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </>
        }
      />
    </div>
  );
}
