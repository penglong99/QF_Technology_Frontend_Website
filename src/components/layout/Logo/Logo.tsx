import { Link } from 'react-router';
import logo from '@/assets/brand/qf-logo.png';
import logoWhite from '@/assets/brand/qf-logo-white.png';
import { classNames } from '@/lib/classNames';
import { paths } from '@/app/paths';
import styles from './Logo.module.css';

export interface LogoProps {
  tone?: 'brand' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ tone = 'brand', size = 'md', className }: LogoProps) {
  return (
    <Link to={paths.home} className={classNames(styles.logo, styles[size], className)}>
      <img
        src={tone === 'inverse' ? logoWhite : logo}
        alt="QF Technology — home"
        className={styles.image}
        width={800}
        height={545}
      />
    </Link>
  );
}
