import { Badge, ButtonLink } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { Checklist } from '@/features/guides/components/Checklist';
import { usePageTitle } from '@/hooks/usePageTitle';
import { paths } from '@/app/paths';
import styles from './BuyingGuidePage.module.css';

const sections = [
  {
    title: 'Processor: more than clock speed',
    text: "A chip that boosts to 5.5GHz for three seconds means nothing if it throttles down to 3GHz once the fans spin up. We test sustained performance under 30-minute loads, because that's what actually matters for rendering, compiling, or exporting video.",
  },
  {
    title: 'Memory: prioritize RAM over raw speed',
    text: 'For creative and technical work, we almost always recommend more RAM over a slightly faster processor. Running out of memory forces your system to swap to disk, which is far slower than any CPU upgrade would help with.',
  },
  {
    title: 'Storage: plan for growth',
    text: "NVMe speed matters, but so does upgradeability. Some ultra-thin laptops solder storage directly to the board; once it's full, it's full. We flag which units have a free M.2 slot so you can expand later instead of buying new.",
  },
  {
    title: 'Ports and peripherals',
    text: 'Check what you actually plug in every day. If you run dual monitors, verify the machine supports it natively rather than through a dock. If you use specific peripherals, confirm the port types before you buy, not after.',
  },
  {
    title: 'Real-world benchmarks, not marketing numbers',
    text: "Our technicians run every unit through the software you'll actually use, whether that's AutoCAD, Premiere Pro, or Docker, plus a 24-hour stress test to catch thermal issues before they become your problem.",
  },
  {
    title: 'Test it in person',
    text: "A spec sheet can't tell you if a keyboard feels mushy or a trackpad is too small for your hand. Every unit in our showroom is available to test before you commit.",
  },
];

export function BuyingGuidePage() {
  usePageTitle('Choosing the right hardware');

  return (
    <Container width="narrow" className={styles.page}>
      <header className={styles.header}>
        <Badge tone="neutral">Buying Guide</Badge>
        <h1 className={styles.title}>Choosing the Right Hardware</h1>
        <p className={styles.lead}>
          A practical guide to picking hardware that actually fits how you work, not just what looks
          fastest on paper.
        </p>
      </header>

      <article className={styles.article}>
        <p>
          High performance is about more than just a fast CPU. When you visit us in-store, we
          encourage you to look at thermal management and sustained performance under load, not just
          headline clock speeds. Every machine we sell has been benchmarked with real workloads, not
          synthetic scores.
        </p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </article>

      <Checklist title="Quick Checklist Before You Buy" />

      <div className={styles.cta}>
        <p className={styles.ctaTitle}>Still not sure which one fits you?</p>
        <ButtonLink to={paths.contact}>Talk to a Technician</ButtonLink>
      </div>
    </Container>
  );
}
