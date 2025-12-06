import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [isReviewHovered, setIsReviewHovered] = useState(false);

  const handleAccountCogClick = () => {
    navigate("/profile");
  };

  const handleMouseEnterReview = () => {
    setIsReviewHovered(true);
  };

  const handleMouseLeaveReview = () => {
    setIsReviewHovered(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // JWT 토큰 삭제
    localStorage.removeItem('username'); // 사용자 이름도 삭제
    localStorage.removeItem('email'); // 이메일도 삭제
    setCurrentUser(null); // 전역 사용자 상태 초기화
    navigate('/login'); // 로그인 페이지로 리다이렉트
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <Link to="/">
              <img className={styles.logo} src="/CONSIGHT_Logo.svg" alt="CONSIGHT Logo" />
            </Link>
          </div>
          <nav className={styles.nav}>
            <Link to="/consume-plan" className={styles.navItem}>소비계획</Link>
            <div
              className={styles.reviewNavItemWrapper}
              onMouseEnter={handleMouseEnterReview}
              onMouseLeave={handleMouseLeaveReview}
            >
              <Link to="/review-feed" className={styles.navItem}>리뷰</Link>
              {isReviewHovered && (
                <div className={styles.reviewPopup}>
                  <div className={styles.reviewPopupContent}>
                    <Link to="/review-write" className={styles.reviewPopupItem}>리뷰 작성</Link>
                    <div className={styles.reviewPopupLine}></div>
                    <Link to="/review-feed" className={styles.reviewPopupItem}>리뷰 피드</Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/mypage" className={styles.navItem}>마이페이지</Link>
          </nav>
        </div>
        <div className={styles.userActions}>
          {currentUser ? (
            <>
              <span className={styles.usernameDisplay}>{currentUser.username}님</span>
              <img
                className={styles.accountCogIcon}
                src="/account_setting_icon.svg"
                alt="Account Settings"
                onClick={handleAccountCogClick}
              />
              <img
                className={styles.logoutLineIcon}
                src="/logout_icon.svg"
                alt="Logout"
                onClick={handleLogout}
              />
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navItem}>로그인</Link>
              <Link to="/signup" className={styles.navItem}>회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};