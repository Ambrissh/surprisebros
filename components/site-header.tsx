import { SiteBrandMark } from './site-brand-mark';
import styles from './site-header.module.css';

const links = [
  { label: 'Home', href: '/#home', page: 'home' },
  { label: 'Gallery', href: '/gallery', page: 'gallery' },
  { label: 'Reviews', href: '/reviews', page: 'reviews' },
  { label: 'Reach out', href: '/#reach-out', page: 'contact' },
];

// Use native links: vinext's client router fails in the deployed Nitro bundle.
// Browser navigation also keeps hash links, history, and new-tab actions intact.

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
          <a
            className={styles.link}
            key={link.page}
            href={link.href}
            aria-current={page === link.page ? 'page' : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
