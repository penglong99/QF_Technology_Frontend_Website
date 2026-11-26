import { useState, type ReactNode } from 'react';
import { ArrowRight, Download, Plus, SearchX, Settings, Trash, TriangleAlert } from 'lucide-react';
import {
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  EmptyState,
  IconButton,
  Modal,
  Pagination,
  Price,
  QuantityStepper,
  SegmentedControl,
  SelectField,
  Skeleton,
  Tabs,
  TextArea,
  TextField,
  Toggle,
} from '@/components/ui';
import { Container } from '@/components/layout/Container/Container';
import { usePageTitle } from '@/hooks/usePageTitle';
import styles from './DesignSystemPage.module.css';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.row}>{children}</div>
    </section>
  );
}

/**
 * Development-only reference of the shared components, mirroring the Figma
 * "Design System" frame. Not linked from the storefront.
 */
export function DesignSystemPage() {
  usePageTitle('Design system');
  const [page, setPage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [plan, setPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [inStock, setInStock] = useState(true);
  const [sort, setSort] = useState('popular');
  const [modal, setModal] = useState<'none' | 'success' | 'delete'>('none');

  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>QF Technology design system</h1>

      <Section title="Buttons">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive" leadingIcon={<Trash />}>
          Delete
        </Button>
        <Button disabled>Disabled</Button>
        <Button loading>Saving</Button>
      </Section>
      <Section title="Button sizes & icons">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button leadingIcon={<Plus />}>Add Item</Button>
        <Button variant="secondary" trailingIcon={<ArrowRight />}>
          Next Page
        </Button>
        <Button variant="secondary" leadingIcon={<Download />} trailingIcon={<ArrowRight />}>
          Export File
        </Button>
      </Section>
      <Section title="On dark surfaces">
        <div className={styles.inverse}>
          <Button variant="inverse">Reserve Your Visit</Button>
          <Button variant="outlineInverse">View Full Catalog</Button>
        </div>
      </Section>
      <Section title="Icon buttons">
        <IconButton label="Settings" icon={<Settings />} />
        <IconButton label="Settings" icon={<Settings />} shape="circle" />
        <IconButton label="Delete" icon={<Trash />} variant="danger" />
      </Section>

      <Section title="Badges">
        <Badge tone="success" dot>
          In Stock
        </Badge>
        <Badge tone="warning">Low Stock</Badge>
        <Badge tone="error">Out of Stock</Badge>
        <Badge tone="neutral">Completed</Badge>
        <Badge tone="info">Draft</Badge>
        <Badge tone="solid">New</Badge>
      </Section>

      <Section title="Form controls">
        <div className={styles.formGrid}>
          <TextField label="Field label" placeholder="Placeholder text" />
          <TextField
            label="With error"
            placeholder="Placeholder text"
            error="This is an error message."
          />
          <TextField label="Disabled" placeholder="Placeholder text" disabled />
          <SelectField
            label="Status"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'popular', label: 'Most Popular' },
              { value: 'newest', label: 'Newest Arrivals' },
            ]}
          />
          <TextArea label="Message" placeholder="How can we help you?" />
          <div className={styles.stack}>
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Unchecked" meta="(12)" />
            <Toggle label="In Stock Only" checked={inStock} onChange={setInStock} />
          </div>
        </div>
      </Section>

      <Section title="Segmented control, quantity, price">
        <SegmentedControl
          label="Plan"
          value={plan}
          onChange={setPlan}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
            { value: 'lifetime', label: 'Lifetime' },
          ]}
        />
        <QuantityStepper label="Demo" value={quantity} onChange={setQuantity} max={5} />
        <Price amount={1499} compareAt={1649} size="lg" />
      </Section>

      <Section title="Navigation">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Catalog', to: '/catalog' },
            { label: 'Laptops' },
          ]}
        />
        <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
      </Section>

      <Section title="Tabs">
        <Tabs
          label="Product information"
          className={styles.full}
          items={[
            { id: 'description', label: 'Description', content: <p>Description content.</p> },
            { id: 'specs', label: 'Specifications', content: <p>Specification table.</p> },
            { id: 'warranty', label: 'Warranty', content: <p>Warranty details.</p> },
          ]}
        />
      </Section>

      <Section title="Modals">
        <Button variant="secondary" onClick={() => setModal('success')}>
          Success dialog
        </Button>
        <Button variant="destructive" onClick={() => setModal('delete')}>
          Delete dialog
        </Button>
        <Modal
          open={modal === 'success'}
          onClose={() => setModal('none')}
          title="Changes Saved"
          description="This record has been updated."
          icon={<ArrowRight />}
          iconTone="success"
          footer={<Button onClick={() => setModal('none')}>Close</Button>}
        />
        <Modal
          open={modal === 'delete'}
          onClose={() => setModal('none')}
          title="Delete Computer?"
          description="Are you sure you want to delete QFBook Pro 14 from your listings? This action cannot be undone."
          icon={<TriangleAlert />}
          iconTone="danger"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModal('none')}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setModal('none')}>
                Delete Computer
              </Button>
            </>
          }
        />
      </Section>

      <Section title="Empty state & loading">
        <EmptyState
          className={styles.full}
          icon={<SearchX />}
          title="No computers found"
          description="Try checking your spelling or using more general terms."
          actions={<Button>Clear Search</Button>}
        />
        <Skeleton className={styles.skeleton} />
      </Section>
    </Container>
  );
}
