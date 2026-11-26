import { ArrowRight } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import { googleMapsUrl, storeInfo } from '../data';
import styles from './StoreMap.module.css';

/**
 * Illustrated map from the Figma design; the whole map links to Google Maps. No map SDK is loaded,
 * which keeps the page fast and avoids an API key.
 */
export function StoreMap({
  className,
  showCoordinates = true,
}: {
  className?: string;
  showCoordinates?: boolean;
}) {
  const { lat, lng } = storeInfo.coordinates;

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noreferrer"
      className={classNames(styles.map, className)}
    >
      <svg
        viewBox="0 0 340 220"
        preserveAspectRatio="xMidYMid slice"
        className={styles.illustration}
        role="img"
        aria-label={`Map showing ${storeInfo.name} on 6A Street, Phnom Penh`}
      >
        <rect width="340" height="220" fill="#e9ebea" />
        {/* streets */}
        <g fill="#ffffff">
          <rect x="0" y="34" width="340" height="8" />
          <rect x="0" y="86" width="340" height="8" />
          <rect x="0" y="140" width="340" height="8" />
          <rect x="0" y="182" width="340" height="6" />
          <rect x="52" y="0" width="8" height="220" />
          <rect x="118" y="0" width="8" height="220" />
          <rect x="184" y="0" width="6" height="220" />
          <rect x="250" y="0" width="8" height="220" />
          <rect x="300" y="0" width="6" height="220" />
        </g>
        {/* blocks */}
        <g fill="#d5dadb">
          <rect x="74" y="50" width="30" height="18" rx="3" />
          <rect x="200" y="12" width="36" height="12" rx="3" />
          <rect x="262" y="48" width="30" height="22" rx="3" />
          <rect x="74" y="160" width="30" height="14" rx="3" />
          <rect x="134" y="156" width="40" height="22" rx="3" />
          <rect x="262" y="158" width="30" height="18" rx="3" />
        </g>
        <rect x="6" y="100" width="40" height="30" rx="3" fill="#cfe3c8" />
        {/* pin */}
        <g transform="translate(212 92)">
          <ellipse cx="0" cy="28" rx="6" ry="2" fill="rgb(0 0 0 / 0.18)" />
          <path d="M0 28c-1-6-14-14-14-26a14 14 0 0 1 28 0C14 14 1 22 0 28Z" fill="#d62f2f" />
          <circle cx="0" cy="2" r="5" fill="#ffffff" />
        </g>
      </svg>

      <div className={styles.callout}>
        <p className={styles.calloutTitle}>{storeInfo.name}</p>
        {showCoordinates && (
          <p className={styles.coordinates}>
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        )}
        <span className={styles.mapLink}>
          Open in Google Maps <ArrowRight aria-hidden="true" />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </span>
      </div>
    </a>
  );
}
