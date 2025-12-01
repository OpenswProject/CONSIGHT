import React from 'react';
import styles from './UserInfo.module.css';

function UserInfo() {
  return (
    <div className={styles.userInfo}>
      <div className={styles.frame281}>
        <div className={styles.frame280}>
          <div className={styles.profile}></div>
          <div className={styles.frame225}>
            <div className={styles.usernameInfo}>
              <div className={styles.frame224}>
                <div className={styles.frame223}>
                  <div className={styles.username}>USERNAME</div>
                </div>
              </div>
              <div className={styles.userinfo1}>USERINFO_1</div>
            </div>
            <img className={styles.riMoreLine} src="/ri-more-line0.svg" alt="more" />
          </div>
        </div>
        <div className={styles.frame282}>
          <img className={styles.vector} src="/vector0.svg" alt="vector" />
          <div className={styles.frame91}>
            <div className={styles._4000}>4000</div>
          </div>
          <div className={styles._6000Pt}>승급까지 -6000PT</div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
