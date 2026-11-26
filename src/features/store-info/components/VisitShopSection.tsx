import { Fragment } from 'react';
import {
  ArrowRight,
  Clock,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Users,
  Wrench,
} from 'lucide-react';
import logo from '@/assets/brand/qf-logo.png';
import { buttonClassName } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { googleMapsUrl, storeInfo } from '../data';
import { StoreMap } from './StoreMap';
import styles from './VisitShopSection.module.css';

const phones = [
  { display: '096 374 9999', href: storeInfo.phoneHref },
  { display: '088 374 9999', href: 'tel:+855883749999' },
];

const features = [
  { icon: ShoppingCart, label: 'Wide Range of Products' },
  { icon: Wrench, label: 'Repair & Service' },
  { icon: Users, label: 'Friendly Support' },
  { icon: ShieldCheck, label: 'Trusted Local Store' },
];

interface VisitShopSectionProps {
  /** "band" = full-width light section (home). "card" = navy rounded card (product details). */
  variant?: 'band' | 'card';
}

export function VisitShopSection({ variant = 'band' }: VisitShopSectionProps) {
  return variant === 'card' ? <VisitShopCard /> : <VisitShopBand />;
}

function VisitShopBand() {
  return (
    <section id="visit" className={styles.band} aria-labelledby="visit-heading">
      <Container className={styles.bandInner}>
        <div className={styles.bandDetails}>
          <p className={styles.bandBadge}>
            <span className={styles.bandBadgeIcon} aria-hidden="true">
              <MapPin />
            </span>
            Our Location
          </p>
          <div>
            <h2 id="visit-heading" className={styles.bandTitle}>
              Visit <span className={styles.bandTitleAccent}>{storeInfo.name}</span>
            </h2>
            <p className={styles.intro}>
              <span>We&apos;re located in Khan Chroy Changvar, Phnom Penh.</span>{' '}
              <span>Feel free to visit our store for products, services and expert support.</span>
            </p>
          </div>

          <dl className={styles.infoList}>
            <div className={styles.infoRow}>
              <dt>
                <span className={styles.infoIcon} aria-hidden="true">
                  <MapPin className={styles.solidIcon} />
                </span>
                Address
              </dt>
              <dd>
                Street 6A, Sangkat Prek Leap, Khan Chroy Changvar,
                <br />
                Phnom Penh, Cambodia.
              </dd>
            </div>
            <div className={styles.infoRow}>
              <dt>
                <span className={styles.infoIcon} aria-hidden="true">
                  <Clock />
                </span>
                Opening Hours
              </dt>
              <dd>Mon – Sun: 8:00 AM – 8:00 PM</dd>
            </div>
            <div className={styles.infoRow}>
              <dt>
                <span className={styles.infoIcon} aria-hidden="true">
                  <Phone className={styles.solidIcon} />
                </span>
                Phone
              </dt>
              <dd className={styles.phoneNumbers}>
                {phones.map((phone, index) => (
                  <Fragment key={phone.href}>
                    {index > 0 && ' / '}
                    <a href={phone.href} className={styles.bandPhone}>
                      {phone.display}
                    </a>
                  </Fragment>
                ))}
              </dd>
            </div>
          </dl>

          <div className={styles.bandActions}>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName({ size: 'lg' }, styles.directions)}
            >
              <Navigation aria-hidden="true" className={styles.solidIcon} />
              Get Directions
              <ArrowRight aria-hidden="true" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div className={styles.bandShop}>
          <img
            src="/images/site/visit-shop.webp"
            alt="The QF Technology shop, a tall building with a blue facade and QF Technology sign"
            width={819}
            height={724}
            loading="lazy"
          />
        </div>

        <div className={styles.bandSide}>
          <a href={googleMapsUrl} target="_blank" rel="noreferrer" className={styles.bandMap}>
            <span className={styles.mapCanvas}>
              <img
                src="/images/site/visit-map.webp"
                alt="Satellite map showing QF Technology by National Road 6 in Phnom Penh, near the Mekong River"
                width={1025}
                height={535}
                loading="lazy"
              />
              <span className={styles.mapMarker} aria-hidden="true">
                <span className={styles.mapPulse} />
                <span className={styles.mapPin}>
                  <svg viewBox="0 0 40 50">
                    <path d="M20 0C9 0 0 9 0 20c0 13 14 22 20 30 6-8 20-17 20-30C40 9 31 0 20 0Z" />
                  </svg>
                  <img src={logo} alt="" />
                </span>
                <span className={styles.mapPinLabel}>We&apos;re here</span>
              </span>
              <span className={styles.mapCredit}>Imagery &copy; Google</span>
            </span>
            <span className={styles.mapCallout}>
              <span className={styles.mapLogo} aria-hidden="true">
                <img src={logo} alt="" />
              </span>
              <span className={styles.mapCalloutText}>
                <strong>{storeInfo.name}</strong>
                <span>
                  Khan Chroy Changvar,
                  <br />
                  Phnom Penh, Cambodia
                </span>
                <span className={styles.mapLink}>
                  Open in Google Maps <ArrowRight aria-hidden="true" />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </span>
              </span>
            </span>
          </a>

          <ul className={styles.features}>
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className={styles.feature}>
                <Icon aria-hidden="true" className={styles.solidIcon} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function VisitShopCard() {
  return (
    <section className={styles.card} aria-label="Visit the shop">
      <div className={styles.details}>
        <h2 className={styles.title}>Visit the Shop</h2>
        <dl className={styles.list}>
          <div>
            <dt>Address</dt>
            <dd>{storeInfo.address}</dd>
          </div>
          <div>
            <dt>Hours Today</dt>
            <dd>Mon — Sun: 8:00 AM - 8:00 PM</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              {storeInfo.phones.map((phone, index) => (
                <Fragment key={phone.href}>
                  {index > 0 && ' & '}
                  <a href={phone.href} className={styles.phone}>
                    {phone.display}
                  </a>
                </Fragment>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      <div className={styles.cardMapColumn}>
        <StoreMap className={styles.cardMap} />
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonClassName({ variant: 'inverse', fullWidth: true })}
        >
          Get Directions
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
