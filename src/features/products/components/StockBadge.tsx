import { Badge, type BadgeTone } from '@/components/ui';
import type { StockStatus } from '../types';

const stockLabels: Record<StockStatus, { label: string; tone: BadgeTone }> = {
  'in-stock': { label: 'In Stock', tone: 'success' },
  'low-stock': { label: 'Low Stock', tone: 'warning' },
  'out-of-stock': { label: 'Out of Stock', tone: 'error' },
};

export function StockBadge({ status, className }: { status: StockStatus; className?: string }) {
  const { label, tone } = stockLabels[status];
  return (
    <Badge tone={tone} dot={status === 'in-stock'} className={className}>
      {label}
    </Badge>
  );
}
