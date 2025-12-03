import React from 'react';
import styles from './MoreOptionsPopup.module.css';

const MoreOptionsPopup = ({ username, onFollow, onBlock, onReport, onClose }) => {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onFollow(username)} className={styles.optionButton}>
          Follow {username}
        </button>
        <button onClick={() => onBlock(username)} className={`${styles.optionButton} ${styles.destructive}`}>
          Block
        </button>
        <button onClick={() => onReport(username)} className={`${styles.optionButton} ${styles.destructive}`}>
          Report
        </button>
        <button onClick={onClose} className={styles.optionButton}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MoreOptionsPopup;
