import React from 'react';
import styles from './MyProfileMoreInfoPopup.module.css';

const MyProfileMoreInfoPopup = ({ onClose, onNameChangeClick, currentUser }) => {
  const handleNameChangeClick = () => {
    onClose(); // Close the more info popup
    onNameChangeClick(); // Open the name change popup
  };

  return (
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
      <div className={styles.userInfo}>
        <div className={styles.div2} onClick={handleNameChangeClick}>닉네임 바꾸기</div>
        <div className={styles.line5}></div>
        <div className={styles.div3}>다시 로그인하기</div>
        <div className={styles.line4}></div>
        <div className={styles.username}>{currentUser ? currentUser.username : "USERNAME"} 계정에서 로그아웃</div>
      </div>
    </div>
  );
};

export default MyProfileMoreInfoPopup;
