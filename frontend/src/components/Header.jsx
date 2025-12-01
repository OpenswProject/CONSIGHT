import React from 'react';
import styles from './Header.module.css';

function Header() {
  return (
    <div className={styles.frame18}>
      <div className={styles.bar}>
        <div className={styles.frame38}>
          <div className={styles.frame17}>
            <img className={styles.logo} src="/logo0.svg" alt="logo" />
            <div className={styles.div13}>
              <div className={styles.consight}>CONSIGHT</div>
            </div>
          </div>
          <div className={styles.div14}>
            <div className={styles.frame2}>
              <div className={styles.div15}>소비계획</div>
            </div>
            <div className={styles.frame5}>
              <div className={styles.div16}>리뷰</div>
            </div>
            <div className={styles.frame4}>
              <div className={styles.div16}>마이페이지</div>
            </div>
            <div className={styles.frame1}>
              <div className={styles.div16}>문의</div>
            </div>
          </div>
        </div>
        <div className={styles.frame192}>
          <img className={styles.mdiAccountCog} src="/mdi-account-cog0.svg" alt="account settings" />
          <img
            className={styles.majesticonsLogoutLine}
            src="/majesticons-logout-line0.svg"
            alt="logout"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;