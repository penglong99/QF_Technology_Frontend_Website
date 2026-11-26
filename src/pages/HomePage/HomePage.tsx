import { ButtonLink } from '@/components/ui';
import { CtaBand } from '@/components/layout/CtaBand/CtaBand';
import { VisitShopSection } from '@/features/store-info/components/VisitShopSection';
import { paths } from '@/app/paths';
import { usePageTitle } from '@/hooks/usePageTitle';
import { HeroSection } from './HeroSection';
import { FeaturedInventory } from './FeaturedInventory';
import { CategoryShowcase } from './CategoryShowcase';
import { BrandMarquee } from './BrandMarquee';
import { WhyUsSection } from './WhyUsSection';

export function HomePage() {
  usePageTitle();

  return (
    <>
      <HeroSection />
      <CategoryShowcase />
      <FeaturedInventory />
      <BrandMarquee />
      <WhyUsSection />
      <CtaBand
        title="Found a unit you like? Visit us and test it in-store today."
        actions={
          <ButtonLink to={paths.catalog} variant="inverse">
            View Full Catalog
          </ButtonLink>
        }
      />
      <VisitShopSection />
    </>
  );
}
