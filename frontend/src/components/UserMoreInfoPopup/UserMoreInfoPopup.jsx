import React from 'react';
import styles from './UserMoreInfoPopup.module.css';

const UserMoreInfoPopup = ({ onClose }) => {
  return (
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <div className={styles.userInfo}>
        <div className={styles.div2}>차단</div>
        <div className={styles.line5}></div>
        <div className={styles.div3}>신고</div>
        <div className={styles.line4}></div>
        <div className={styles.div4}>팔로우</div>
      </div>
    </div>
  );
};

export default UserMoreInfoPopup;
