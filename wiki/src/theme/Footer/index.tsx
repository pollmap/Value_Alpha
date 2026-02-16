import React from 'react';
import styles from './styles.module.css';

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>CUFA</h2>
            <p className={styles.tagline}>충북대학교 가치투자학회</p>
          </div>

          <div className={styles.contact}>
            <h3 className={styles.contactTitle}>CONTACT US</h3>
            <p className={styles.contactName}>회장 이찬희</p>
            <a href="mailto:lch6817556@gmail.com" className={styles.contactEmail}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 6L12 13L2 6" />
              </svg>
              lch6817556@gmail.com
            </a>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2026 CUFA. All rights reserved.</p>
          <p className={styles.credit}>Designed & Built by 이찬희</p>
        </div>
      </div>
    </footer>
  );
}
