import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FollowListPopup.module.css';

const FollowListPopup = ({ onClose, title, username, listType }) => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!username || !listType) return;

      setLoading(true);
      setError(null);
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/follow/${username}/${listType}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
          setUserList(data.data);
        } else {
          setError(data.error?.message || `Failed to fetch ${listType}`);
        }
      } catch (err) {
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
        console.error("Error fetching follow list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [username, listType]);

  const handleUserClick = (targetUsername) => {
    onClose();
    console.log(`Navigating to user profile: ${targetUsername}`);
    navigate(`/profile/${targetUsername}`);
  };

  if (loading) return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.div} onClick={(e) => e.stopPropagation()}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.div} onClick={(e) => e.stopPropagation()}>
        <div className={styles.error}>오류: {error}</div>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.div} onClick={(e) => e.stopPropagation()}>
        <img className={styles.vector} src="/public/vector0.svg" alt="Close" onClick={onClose} />
        <div className={styles.frame154}>
          <div className={styles.frame151}>
            <div className={styles.frame107}>
              <div className={styles.frame106}>
                <div className={styles.frame150}>
                  <div className={styles.frame149}>
                    <div className={styles.username}>{title}</div>
                  </div>
                </div>
              </div>
              <div className={styles.frame148}>
                <div className={styles.frame111}></div>
              </div>
            </div>
          </div>
          {userList.length > 0 ? (
            userList.map((user, index) => (
              <div className={styles.frame1072} key={index} onClick={() => handleUserClick(user.username)}>
                <div className={styles.frame1062}>
                  <div className={styles.frame141}>
                    <div className={styles.frame140}>
                      <div className={styles.profile}></div>
                      <div className={styles.username2}>{user.username}</div>
                    </div>
                    <div className={styles.userinfo1}>{user.email}</div>
                  </div>
                </div>
                <img className={styles.riMoreLine} src="/public/ri-more-line0.svg" alt="More" />
              </div>
            ))
          ) : (
            <div className={styles.noUsers}>목록이 비어 있습니다.</div>
          )}
          <div className={styles.frame197}></div>
        </div>
      </div>
    </div>
  );
};

export default FollowListPopup;
