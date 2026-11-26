import { Container } from '@/components/layout/Container/Container';
import { SectionHeading } from '@/components/layout/SectionHeading/SectionHeading';
import { warrantyParagraphs } from '@/features/products/warranty';
import { usePageTitle } from '@/hooks/usePageTitle';
import styles from './PoliciesPage.module.css';

/*
 * The footer's "Policy" links need a destination, but the design has no policy pages.
 * This page holds short starter text that the store owner should review and replace.
 */
const policies = [
  {
    id: 'returns',
    title: 'Returns',
    paragraphs: [
      'Unopened items can be returned within 7 days with proof of purchase. Opened items can be exchanged within 7 days if they are faulty.',
      'Because every unit is tested in store before purchase, change-of-mind returns on opened computers are not accepted.',
    ],
  },
  { id: 'warranty', title: 'Warranty', paragraphs: [...warrantyParagraphs] },
  {
    id: 'privacy',
    title: 'Privacy',
    paragraphs: [
      'We only collect the details you give us (such as your name, phone number and email) to handle repairs and enquiries. We never sell your information.',
    ],
  },
  {
    id: 'terms',
    title: 'Terms',
    paragraphs: [
      'Prices and availability shown online are updated regularly but are confirmed in store at the time of purchase.',
    ],
  },
];

export function PoliciesPage() {
  usePageTitle('Store policies');

  return (
    <Container width="narrow" className={styles.page}>
      <SectionHeading as="h1" size="lg" eyebrow="Policies" title="Store policies" />
      <nav aria-label="Policies" className={styles.toc}>
        {policies.map((policy) => (
          <a key={policy.id} href={`#${policy.id}`}>
            {policy.title}
          </a>
        ))}
      </nav>
      {policies.map((policy) => (
        <section key={policy.id} id={policy.id} className={styles.section}>
          <h2>{policy.title}</h2>
          {policy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </Container>
  );
}
