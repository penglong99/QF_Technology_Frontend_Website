import styles from './HomePage.module.css';

interface Brand {
  name: string;
  /** White logo in /images/brands. Brands without one show their name as text. */
  logo?: string;
  /** Logo height in px: symbols need more height than wide wordmarks to look the same size. */
  height?: number;
}

const BRANDS: Brand[] = [
  { name: 'Apple', logo: 'apple', height: 34 },
  { name: 'Lenovo', logo: 'lenovo', height: 24 },
  { name: 'Dell', logo: 'dell', height: 36 },
  { name: 'HP', logo: 'hp', height: 36 },
  { name: 'Asus', logo: 'asus', height: 18 },
  { name: 'Microsoft', logo: 'microsoft', height: 30 },
  { name: 'Acer', logo: 'acer', height: 20 },
  { name: 'MSI', logo: 'msi', height: 36 },
  { name: 'Canon' },
  { name: 'Hikvision' },
];

/** Scrolling brand strip (Figma "Marketing/Brands Marquee"). Pauses for reduced motion. */
export function BrandMarquee() {
  return (
    <section className={styles.marquee} aria-label="Brands we carry">
      <ul className={styles.marqueeTrack}>
        {[...BRANDS, ...BRANDS].map((brand, index) => (
          <li
            key={`${brand.name}-${index}`}
            className={styles.marqueeItem}
            aria-hidden={index >= BRANDS.length || undefined}
          >
            {brand.logo ? (
              <img
                src={`/images/brands/${brand.logo}.svg`}
                alt={brand.name}
                height={brand.height}
                style={{ height: brand.height }}
                className={styles.marqueeLogo}
              />
            ) : (
              brand.name
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
