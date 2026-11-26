import type {
  KeySpec,
  ProcessorFamily,
  Product,
  ProductImage,
  SpecRow,
} from '@/features/products/types';
import { stockStatusFor } from '@/features/products/lib/stock';

/**
 * Helpers that keep the mock catalogue readable. POS data is converted by `pos/posMapper.ts`
 * instead, so nothing outside `services/mock/` depends on these.
 */

/** A mock product plus whether it is shown on the website (drafts are hidden). */
export interface MockProduct extends Product {
  publishStatus: 'published' | 'draft';
}

const IMAGE_ROOT = '/images/products';

export function productImages(name: string, files: readonly string[]): ProductImage[] {
  return files.map((file, index) => ({
    src: `${IMAGE_ROOT}/${file}.webp`,
    alt: index === 0 ? name : `${name} — view ${index + 1}`,
  }));
}

interface BaseInput {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  label: string;
  searchTags?: readonly string[];
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  images?: readonly string[];
  description: string[];
  isFeatured?: boolean;
  popularity: number;
  createdAt: string;
  publishStatus?: MockProduct['publishStatus'];
}

function base(input: BaseInput): Omit<MockProduct, 'keySpecs' | 'specifications'> {
  return {
    id: input.id,
    slug: input.id,
    referenceId: `#QF-${input.id
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)}-${String(input.popularity * 37).padStart(4, '0')}`,
    name: input.name,
    brandId: input.brandId,
    categoryId: input.categoryId,
    label: input.label,
    searchTags: input.searchTags,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    stockQuantity: input.stockQuantity,
    stockStatus: stockStatusFor(input.stockQuantity),
    publishStatus: input.publishStatus ?? 'published',
    images: productImages(input.name, input.images ?? []),
    description: input.description,
    isFeatured: input.isFeatured ?? false,
    popularity: input.popularity,
    createdAt: input.createdAt,
  };
}

interface ComputerInput extends BaseInput {
  processor: string;
  processorFamily: ProcessorFamily;
  memory: string;
  memoryGb: number;
  storage: string;
  storageGb: number;
  graphics: string;
  display?: string;
  battery?: string;
  extraSpecs?: SpecRow[];
}

/** Builds a laptop / desktop / workstation with the four key specs shown on product cards. */
export function computer(input: ComputerInput): MockProduct {
  const keySpecs: KeySpec[] = [
    { kind: 'processor', label: 'Processor', value: input.processor },
    { kind: 'memory', label: 'Memory', value: input.memory },
    { kind: 'storage', label: 'Storage', value: input.storage },
    { kind: 'graphics', label: 'Graphics', value: input.graphics },
  ];
  if (input.display) keySpecs.push({ kind: 'display', label: 'Display', value: input.display });
  if (input.battery) keySpecs.push({ kind: 'battery', label: 'Battery', value: input.battery });

  return {
    ...base(input),
    keySpecs,
    specifications: [
      ...keySpecs.map(({ label, value }) => ({ label, value })),
      ...(input.extraSpecs ?? []),
    ],
    processorFamily: input.processorFamily,
    memoryGb: input.memoryGb,
    storageGb: input.storageGb,
  };
}

interface GeneralInput extends BaseInput {
  keySpecs: KeySpec[];
  extraSpecs?: SpecRow[];
}

/** Builds a non-computer product (monitor, printer, camera, accessory, service…). */
export function generalProduct(input: GeneralInput): MockProduct {
  return {
    ...base(input),
    keySpecs: input.keySpecs,
    specifications: [
      ...input.keySpecs.map(({ label, value }) => ({ label, value })),
      ...(input.extraSpecs ?? []),
    ],
  };
}
