/** Store details shown in the announcement bar, "Visit the Shop", contact page and footer. */
export const storeInfo = {
  name: 'QF Technology',
  shortName: 'QF Tech',
  tagline:
    'Expert hardware, local service. Verified laptops, desktops, accessories and repairs in Phnom Penh.',
  address: 'Street 6A, Sangkat Prek Leap, Khan Chroy Changvar, Phnom Penh, Cambodia.',
  phoneDisplay: '(+855) 96 374 9999',
  phoneHref: 'tel:+855963749999',
  /** Every number customers can call, main line first. */
  phones: [
    { display: '(+855) 96 374 9999', href: 'tel:+855963749999' },
    { display: '(+855) 88 374 9999', href: 'tel:+855883749999' },
  ],
  // Placeholder — replace with the store's real email address.
  email: 'hello@qftechnology.com',
  coordinates: { lat: 11.6350449, lng: 104.9204662 },
  hours: [{ days: 'Mon — Sun', time: '8am - 8pm' }],
  openTodayLabel: 'Open Today: 8:00 AM to 8:00 PM',
  social: [
    { name: 'Instagram', href: 'https://www.instagram.com/', icon: '/images/social/instagram.png' },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/qftechnologyofficial',
      icon: '/images/social/facebook.png',
    },
    { name: 'Telegram', href: 'https://t.me/', icon: '/images/social/telegram.svg' },
    { name: 'TikTok', href: 'https://www.tiktok.com/', icon: '/images/social/tiktok.svg' },
  ],
} as const;

// Share link for the store's Google Maps listing.
export const googleMapsUrl = 'https://maps.app.goo.gl/ZfT4cNp2Q4EXnVtY9';
