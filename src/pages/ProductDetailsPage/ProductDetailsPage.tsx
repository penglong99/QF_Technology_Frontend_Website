import { useParams } from 'react-router';
import { PackageX, TriangleAlert } from 'lucide-react';
import { Breadcrumb, Button, ButtonLink, EmptyState, Spinner, Tabs } from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { ProductGallery } from '@/features/products/components/ProductGallery';
import { SpecificationTable } from '@/features/products/components/SpecificationTable';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { VisitShopSection } from '@/features/store-info/components/VisitShopSection';
import { warrantyParagraphs } from '@/features/products/warranty';
import type { ProductView } from '@/features/products/types';
import { NotFoundError } from '@/services/errors';
import { productService } from '@/services/productService';
import { useAsync } from '@/hooks/useAsync';
import { usePageTitle } from '@/hooks/usePageTitle';
import { catalogPath, paths } from '@/app/paths';
import { PurchasePanel } from './PurchasePanel';
import styles from './ProductDetailsPage.module.css';

export function ProductDetailsPage() {
  const { slug = '' } = useParams();
  const product = useAsync(() => productService.getBySlug(slug), [slug]);
  usePageTitle(product.data?.name ?? 'Product');

  if (product.status === 'loading') return <Spinner label="Loading product" />;

  if (product.status === 'error') {
    const notFound = product.error instanceof NotFoundError;
    return (
      <Container>
        <EmptyState
          tone={notFound ? 'neutral' : 'error'}
          icon={notFound ? <PackageX /> : <TriangleAlert />}
          title={notFound ? 'Product not found' : 'Something went wrong'}
          description={
            notFound
              ? 'This unit may have been sold or removed from our catalog.'
              : 'We could not load this product. Please try again.'
          }
          actions={
            notFound ? (
              <ButtonLink to={paths.catalog}>Browse Catalog</ButtonLink>
            ) : (
              <Button onClick={product.reload}>Retry</Button>
            )
          }
        />
      </Container>
    );
  }

  return <ProductDetails product={product.data} />;
}

function ProductDetails({ product }: { product: ProductView }) {
  const related = useAsync(() => productService.getRelated(product, 4), [product.id]);

  return (
    <Container className={styles.page}>
      <div className={styles.top}>
        <Breadcrumb
          items={[
            { label: 'Home', to: paths.home },
            { label: 'Catalog', to: paths.catalog },
            { label: product.category.name, to: catalogPath({ category: product.category.slug }) },
            { label: product.name },
          ]}
        />

        <div className={styles.overview}>
          <ProductGallery
            images={product.images}
            productName={product.name}
            categoryIcon={product.category.icon}
          />
          <PurchasePanel product={product} />
        </div>
      </div>

      <Tabs
        label="Product information"
        className={styles.tabs}
        items={[
          {
            id: 'description',
            label: 'Description',
            content: (
              <div className={styles.prose}>
                {product.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ),
          },
          {
            id: 'specifications',
            label: 'Specifications',
            content: <SpecificationTable rows={product.specifications} />,
          },
          {
            id: 'warranty',
            label: 'Warranty',
            content: (
              <div className={styles.prose}>
                {warrantyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ),
          },
        ]}
      />

      <VisitShopSection variant="card" />

      {related.status === 'success' && related.data.length > 0 && (
        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading" className={styles.relatedTitle}>
            Related {product.category.name}
          </h2>
          <ProductGrid products={related.data} variant="compact" columns={4} />
        </section>
      )}
    </Container>
  );
}
