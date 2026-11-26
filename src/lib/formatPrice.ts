export type CurrencyCode = 'USD' | 'KHR';

const formatters: Record<CurrencyCode, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  KHR: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KHR',
    maximumFractionDigits: 0,
  }),
};

/** Formats an amount stored in the given currency's main unit (e.g. dollars, riel). */
export function formatPrice(amount: number, currency: CurrencyCode = 'USD'): string {
  return formatters[currency].format(amount);
}
