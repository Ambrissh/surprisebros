import Link from 'next/link';
import { SiteBrandMark } from './site-brand-mark';
import styles from './site-header.module.css';

const links = [
  { label: 'Home', href: '/#home', page: 'home' },
  { label: 'Gallery', href: '/gallery', page: 'gallery' },
  { label: 'Reviews', href: '/reviews', page: 'reviews' },
  { label: 'Reach out', href: '/#reach-out', page: 'contact' },
];

export function SiteHeader({
  page,
  visible = true,
}: {
  page: 'home' | 'gallery' | 'reviews';
  visible?: boolean;
}) {
  return (
    <header
      className={`${styles.header} ${page === 'home' ? styles.home : ''}`}
      data-visible={visible}
    >
      <SiteBrandMark />
      <nav className={styles.nav} aria-label="Primary navigation">
        {links.map((link) => (
          <Link
            className={styles.link}
            key={link.page}
            href={link.href}
            aria-current={page === link.page ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
