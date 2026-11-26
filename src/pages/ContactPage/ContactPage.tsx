import {
  ArrowRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { buttonClassName } from '@/components/ui/Button/buttonClassName';
import { Container } from '@/components/layout/Container/Container';
import { SectionHeading } from '@/components/layout/SectionHeading/SectionHeading';
import { googleMapsUrl, storeInfo } from '@/features/store-info/data';
import { usePageTitle } from '@/hooks/usePageTitle';
import styles from './ContactPage.module.css';

const { lat, lng } = storeInfo.coordinates;
// Keyless Google Maps embed that pins the store's own listing. Google draws a place card in the
// top-left corner that can't be turned off, so the frame is pushed up to hide it (see .mapFrame).
// The map centre sits ~120 m north of the store so the pin still lands mid-card after that crop.
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(storeInfo.name)}&ll=${lat + 0.00105},${lng}&z=17&output=embed`;

interface InfoAction {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

function InfoItem({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  action?: InfoAction;
  children: ReactNode;
}) {
  return (
    <li className={styles.infoItem}>
      <span className={styles.infoIcon} aria-hidden="true">
        <Icon />
      </span>
      <div className={styles.infoBody}>
        <p className={styles.infoTitle}>{title}</p>
        <div className={styles.infoText}>{children}</div>
      </div>
      {action && (
        <a
          href={action.href}
          className={buttonClassName({ size: 'sm' }, styles.infoAction)}
          {...(action.external && { target: '_blank', rel: 'noreferrer' })}
        >
          <action.icon aria-hidden="true" />
          {action.label}
          <ArrowRight aria-hidden="true" />
          {action.external && <span className="visually-hidden"> (opens in a new tab)</span>}
        </a>
      )}
    </li>
  );
}

export function ContactPage() {
  usePageTitle('Contact us');

  return (
    <Container className={styles.page}>
      <SectionHeading
        as="h1"
        size="lg"
        eyebrow="Get in touch"
        title="We're happy to help"
        description="Whether you need a custom quote, a repair, or help checking a laptop's RAM upgrade limits, our team is ready to assist."
      />

      <div id="visit" className={styles.layout}>
        <ul className={styles.infoCard}>
          <InfoItem
            icon={Mail}
            title="Email"
            action={{ label: 'Email Us', href: `mailto:${storeInfo.email}`, icon: Mail }}
          >
            <a href={`mailto:${storeInfo.email}`}>{storeInfo.email}</a>
          </InfoItem>
          <InfoItem
            icon={Phone}
            title="Phone"
            action={{ label: 'Call Now', href: storeInfo.phoneHref, icon: Phone }}
          >
            {storeInfo.phones.map((phone, index) => (
              <Fragment key={phone.href}>
                {index > 0 && ' & '}
                <a href={phone.href}>{phone.display}</a>
              </Fragment>
            ))}
          </InfoItem>
          <InfoItem
            icon={MapPin}
            title="Store Address"
            action={{ label: 'Get Directions', href: googleMapsUrl, icon: MapPin, external: true }}
          >
            {storeInfo.address}
          </InfoItem>
          <InfoItem icon={Clock} title="Business Hours">
            {storeInfo.hours.map((entry) => (
              <p key={entry.days}>
                {entry.days}: {entry.time}
              </p>
            ))}
          </InfoItem>
        </ul>

        <div className={styles.mapCard}>
          <iframe
            className={styles.mapFrame}
            src={mapEmbedUrl}
            title={`Map showing ${storeInfo.name} in Phnom Penh`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClassName({ size: 'sm' }, styles.mapButton)}
          >
            <MapPin aria-hidden="true" />
            Open in Google Maps
            <ExternalLink aria-hidden="true" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </Container>
  );
}
