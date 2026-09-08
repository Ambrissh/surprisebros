import Image from "next/image";
import styles from './site-header.module.css';

export function SiteBrandMark() {
  return (
    <a className={styles.brand} href="/#home" aria-label="Surprise Bro's home">
      <Image
        src="/assets/optimized/surprise-bros-logo.webp"
        alt="Surprise Bro's"
        width={1636}
        height={1473}
        priority
        sizes="(max-width: 600px) 64px, (max-width: 900px) 72px, 88px"
      />
    </a>
  );
}
