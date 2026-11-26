import { MessageCircleHeart, ShieldCheck, Store, Wrench } from 'lucide-react';
import { Container } from '@/components/layout/Container/Container';
import styles from './HomePage.module.css';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Quality You Can Trust',
    text: 'Every unit is tested before it reaches our shelves, and the specs are exactly as listed.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Honest Expert Advice',
    text: 'We help you pick the right device for your needs and budget, not the most expensive one.',
  },
  {
    icon: Wrench,
    title: 'Repair & Support',
    text: 'Our in-house technicians keep your devices running long after you buy.',
  },
  {
    icon: Store,
    title: 'Open Every Day',
    text: 'Visit our Chroy Changvar showroom any day of the week and try before you buy.',
  },
];

export function WhyUsSection() {
  return (
    <section id="why-us" className={styles.section} aria-labelledby="why-heading">
      <Container>
        <div className={styles.whyHeading}>
          <span className={styles.whyAccent} aria-hidden="true" />
          <h2 id="why-heading" className={styles.whyTitle}>
            Why Choose <span className={styles.whyTitleAccent}>Us</span>
          </h2>
          <p className={styles.whyDescription}>
            Quality products and fast, friendly service, all in one place.
          </p>
        </div>
        <ul className={styles.reasons}>
          {reasons.map(({ icon: Icon, title, text }) => (
            <li key={title} className={styles.reason}>
              <span className={styles.reasonIcon} aria-hidden="true">
                <Icon />
              </span>
              <h3 className={styles.reasonTitle}>{title}</h3>
              <p className={styles.reasonText}>{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
