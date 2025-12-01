import React, { useState } from 'react';
import styles from './NameChangePopup.module.css';

const NameChangePopup = ({ onClose, onConfirm, currentUsername }) => {
  const [newUsername, setNewUsername] = useState('');

  const handleConfirm = () => {
    if (newUsername.trim() !== '') {
      onConfirm(newUsername);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.userInfo}>
          <div className={styles.username}>변경 전 닉네임: {currentUsername}</div>
          <div className={styles.line5}></div>
          <input
            type="text"
            className={styles.div2}
            placeholder="이름을 입력하세요..."
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.confirmButton} onClick={handleConfirm}>확인</button>
            <button className={styles.cancelButton} onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameChangePopup;
