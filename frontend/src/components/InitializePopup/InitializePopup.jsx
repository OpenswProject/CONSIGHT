import React from 'react';
import styles from './InitializePopup.module.css';

const InitializePopup = ({ onClose, onConfirm }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.frame304}>
          <div className={styles.div2}>소비계획을 초기화하시겠습니까?</div>
          <div className={styles.line5}></div>
          <div className={styles.frame303}>
            <div className={styles.div3} onClick={onConfirm}>네</div>
            <div className={styles.line6}></div>
            <div className={styles.div4} onClick={onClose}>아니오</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitializePopup;
