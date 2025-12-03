import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './FollowListPopup.module.css';

const FollowListPopup = ({ username, listType, onClose }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/follow/${username}/${listType}`);
        const data = await response.json();
        if (data.success) {
          setList(data.data);
        } else {
          throw new Error(data.error?.message || `Failed to fetch ${listType}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [username, listType]);

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupHeader}>
          <h3>{listType === 'followers' ? 'Followers' : 'Following'}</h3>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.popupBody}>
          {loading ? (
            <p>Loading...</p>
          ) : list.length === 0 ? (
            <p>No users found.</p>
          ) : (
            list.map(user => (
              <div key={user.username} className={styles.userItem}>
                <Link to={`/profile/${user.username}`} onClick={onClose}>
                  {user.username}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListPopup;
