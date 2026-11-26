import { storeInfo } from '@/features/store-info/data';
import styles from './AnnouncementBar.module.css';

export function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      <p className={styles.text}>
        <span>{storeInfo.openTodayLabel}</span>
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.secondary}>Visit us at {storeInfo.name} for In-Store Testing</span>
      </p>
    </div>
  );
}
