import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

export const Header = () => {
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

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <Link to="/">
              <img className={styles.logo} src="/public2/CONSIGHT_Logo.svg" alt="CONSIGHT Logo" />
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
          <img
            className={styles.accountCogIcon}
            src="/public2/account_setting_icon.svg"
            alt="Account Settings"
            onClick={handleAccountCogClick}
          />
          <img className={styles.logoutLineIcon} src="/public2/logout_icon.svg" alt="Logout" />
        </div>
      </div>
    </header>
  );
};