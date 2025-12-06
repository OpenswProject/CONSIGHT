import React from 'react';
import styles from './NotificationItem.module.css';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    // Optionally navigate to the link
    if (notification.link) {
      // window.location.href = notification.link; // Or use navigate from react-router-dom
    }
  };

  return (
    <div className={`${styles.notificationItem} ${notification.read ? styles.read : styles.unread}`} onClick={handleClick}>
      <div className={styles.message}>{notification.message}</div>
      <div className={styles.timestamp}>{new Date(notification.createdDate).toLocaleString()}</div>
      {!notification.read && <div className={styles.unreadIndicator}></div>}
    </div>
  );
};

export default NotificationItem;
