import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import FollowListPopup from '../components/FollowListPopup/FollowListPopup';

const ProfilePage = ({ currentUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [counts, setCounts] = useState({ followerCount: 0, followingCount: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupConfig, setPopupConfig] = useState({ show: false, type: '', username: '' });

  // A simple check to see if the logged-in user is viewing their own profile
  const loggedInUser = currentUser ? currentUser.username : null; // Assuming username is stored in localStorage
  const isOwnProfile = loggedInUser === username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assuming token is in localStorage

        const [profileRes, countsRes, statusRes, reviewsRes] = await Promise.all([
          fetch(`/api/users/${username}`),
          fetch(`/api/follow/${username}/counts`),
          fetch(`/api/follow/${username}/status`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          }),
          fetch(`/api/reviews/by-author/${username}`)
        ]);

        const profileData = await profileRes.json();
        const countsData = await countsRes.json();
        const statusData = await statusRes.json();
        const reviewsData = await reviewsRes.json();

        if (profileData.success) setProfile(profileData.data);
        else throw new Error(profileData.error?.message || 'Failed to fetch profile');

        if (countsData.success) setCounts(countsData.data);
        else throw new Error(countsData.error?.message || 'Failed to fetch follow counts');
        
        if (statusData.success) setIsFollowing(statusData.data.isFollowing);
        else throw new Error(statusData.error?.message || 'Failed to fetch follow status');

        if (reviewsData.success) setReviews(reviewsData.data.content);
        else throw new Error(reviewsData.error?.message || 'Failed to fetch reviews');

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const res = await fetch(`/api/follow/${username}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(true);
        setCounts(prev => ({ ...prev, followerCount: prev.followerCount + 1 }));
      } else {
        const errorMessage = data.error?.message || 'Follow failed';
        if (errorMessage.includes("Already following this user.")) {
          throw new Error("이미 팔로우한 사용자입니다.");
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const res = await fetch(`/api/follow/${username}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIsFollowing(false);
        setCounts(prev => ({ ...prev, followerCount: prev.followerCount - 1 }));
      } else {
        throw new Error(data.error?.message || 'Unfollow failed');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openPopup = (type) => {
    setPopupConfig({ show: true, type: type, username: username });
  };

  const closePopup = () => {
    setPopupConfig({ show: false, type: '', username: '' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <>
      <div className={styles.profileContainer}>
        <header className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.profileImage}></div>
            <h1>{profile.username}</h1>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.stat}>
              <strong>{reviews.length}</strong>
              <span>posts</span>
            </div>
            <div className={styles.stat} onClick={() => openPopup('followers')} style={{cursor: 'pointer'}}>
              <strong>{counts.followerCount}</strong>
              <span>followers</span>
            </div>
            <div className={styles.stat} onClick={() => openPopup('following')} style={{cursor: 'pointer'}}>
              <strong>{counts.followingCount}</strong>
              <span>following</span>
            </div>
          </div>
          <div className={styles.profileActions}>
            {!isOwnProfile && (
              isFollowing ? (
                <button onClick={handleUnfollow} className={`${styles.btn} ${styles.unfollowBtn}`}>Unfollow</button>
              ) : (
                <button onClick={handleFollow} className={`${styles.btn} ${styles.followBtn}`}>Follow</button>
              )
            )}
          </div>
        </header>

        <main className={styles.reviewsGrid}>
          {reviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <h3>{review.title}</h3>
              <p>{review.content.substring(0, 100)}...</p>
            </div>
          ))}
        </main>
      </div>
      {popupConfig.show && (
        <FollowListPopup 
          username={popupConfig.username} 
          listType={popupConfig.type} 
          onClose={closePopup} 
        />
      )}
    </>
  );
};

export default ProfilePage;
