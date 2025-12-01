import React from "react";
import styles from "./UserProfile.module.css";

export const UserProfile = ({ username, userInfo }) => {
  return (
    <div className={styles.card}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}></div>
        <div className={styles.textInfo}>
          <div className={styles.username}>{username}</div>
          <div className={styles.userInfoText}>{userInfo}</div>
        </div>
        <img className={styles.moreIcon} src="/public2/More_info.svg" alt="More options" />
      </div>
    </div>
  );
};
