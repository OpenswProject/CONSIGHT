import React, { useState, useEffect, useMemo } from "react";
import styles from "./RecommendedReviews.module.css";
import ReviewPopup from "../ReviewPopup";

export const RecommendedReviews = ({ shoppingItems, openReviewPopup }) => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Get unique categories from shopping list
  const recommendationCategories = useMemo(() => {
    if (!shoppingItems || shoppingItems.length === 0) return [];
    const categories = shoppingItems.map(item => item.category);
    return [...new Set(categories)];
  }, [shoppingItems]);

  // 2. Fetch reviews when categories change
  useEffect(() => {
    const fetchReviews = async () => {
      // If there are no categories, fetch general recommendations
      let url = '/api/reviews/recommended';
      if (recommendationCategories.length > 0) {
                const url = `${import.meta.env.VITE_API_URL}/api/reviews/most-liked-by-categories?categories=${recommendationCategories.join(',')}`;
      }
      
      try {
        const response = await fetch(`${apiUrl}/api/reviews/recommended`, {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setReviews(data.data);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [recommendationCategories]);

  // 3. Helper function to generate label for a review
  const getLabelForReview = (review) => {
    if (!shoppingItems || shoppingItems.length === 0) {
      return null;
    }

    const matchingIndices = [];
    shoppingItems.forEach((item, index) => {
      if (item.category === review.category) {
        matchingIndices.push(index + 1);
      }
    });

    if (matchingIndices.length > 0) {
      return `추천리뷰: ${matchingIndices.join(', ')}번`;
    }

    return null; // Or a generic label like "추천리뷰" if needed
  };
  
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter final display reviews based on search term
  const filteredReviews = useMemo(() => {
    if (!searchTerm) {
      return reviews;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return reviews.filter(review => 
      review.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm, reviews]);


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Search is now handled by the useMemo hook as user types
    }
  };

  const renderReviewItem = (review) => {
    const label = getLabelForReview(review);
    return (
      <div key={review.id} className={styles.reviewItem} onClick={() => openReviewPopup(review)}>
        <div className={styles.reviewContentWrapper}>
          <div className={styles.reviewHeader}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}></div>
              <div className={styles.usernameAndMore}>
                <span className={styles.username}>{review.author?.username || 'Unknown'}</span>
                <img className={styles.moreIcon} src="/More_info.svg" alt="More options" />
              </div>
              <div className={styles.titleContainer}>
                {label && <span className={styles.recommendationContext}>{label}</span>}
                <span className={styles.reviewTitle}>{review.title}</span>
              </div>
            </div>
            <div className={styles.reviewMeta}>
              <span className={styles.date}>{new Date(review.createDate).toLocaleDateString()}</span>
              <div className={styles.categoryTagWrapper}>
                <span className={styles.categoryTag}>{review.category}</span>
              </div>
            </div>
          </div>
          <div className={styles.reviewTextWrapper}>
            <p className={styles.reviewText}>{review.content}</p>
            <div className={styles.productLinkWrapper}>
              <button className={styles.productLinkButton}>제품 링크</button>
            </div>
          </div>
        </div>
        <div className={styles.reviewActions}>
          <div className={styles.actionItemGroup}>
            <div className={styles.actionItem}>
              <img src="/bookmark_icon.svg" alt="Bookmark" className={styles.actionIcon} />
              <span className={styles.actionCount}>{review.bookmarkCount}</span>
            </div>
            <div className={styles.actionItem}>
              <img src="/comment_icon.svg" alt="Comment" className={styles.actionIcon} />
              <span className={styles.actionCount}>{review.commentCount}</span>
            </div>
            <div className={styles.actionItem}>
              <img src="/like.svg" alt="Like" className={`${styles.actionIcon} ${styles.likeIcon}`} />
              <span className={styles.actionCount}>{review.likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.headerAndSearchBar}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>추천 리뷰</h2>
          </div>
          <div className={styles.frame147}>
            <div className={styles.frame146}>
              <img className={styles.group1} src="/search_icon.svg" alt="Search icon" />
              <div className={styles.line54}></div>
              <input
                type="text"
                placeholder="검색..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <div className={styles.reviewList}>
          {filteredReviews.length > 0 ? (
            <>
              <div className={styles.reviewColumn}>
                {filteredReviews.slice(0, 3).map(renderReviewItem)}
              </div>
              <div className={styles.reviewColumn}>
                {filteredReviews.slice(3, 6).map(renderReviewItem)}
              </div>
            </>
          ) : (
            <div className={`${styles.reviewColumn} ${styles.noReviewsPlaceholder}`}>
              <p>추천 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

