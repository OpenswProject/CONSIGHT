import React, { useState, useEffect } from "react";
import styles from "./RecommendedReviews.module.css";
import ReviewPopup from "../ReviewPopup";
export const RecommendedReviews = ({ openReviewPopup }) => {
  const [dynamicRecommendedReviews, setDynamicRecommendedReviews] = useState([]);

  useEffect(() => {
    const fetchRecommendedReviews = async () => {
      try {
        const response = await fetch('/api/reviews/recommended'); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          setDynamicRecommendedReviews(data.data);
        } else {
          console.error("Failed to fetch recommended reviews:", data.error || "Invalid data structure");
        }
      } catch (error) {
        console.error("Error fetching recommended reviews:", error);
      }
    };

    fetchRecommendedReviews();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
      <div className={styles.card}> {/* Corresponds to .frame-60 */}
        <div className={styles.headerAndSearchBar}> {/* New wrapper */}
          <div className={styles.titleWrapper}> {/* Corresponds to .frame-123, .frame-1222, .frame-124 */}
            <h2 className={styles.title}>추천 리뷰</h2>
          </div>
          {/* Search bar from mainpage reference */}
          <div className={styles.frame147}>
          <div className={styles.frame146}>
            <img className={styles.group1} src="/search_icon.svg" alt="Search icon" />
            <div className={styles.line54}></div>
            <input type="text" placeholder="검색..." className={styles.searchInput} />
          </div>
        </div>
        </div>
        <div className={styles.reviewList}> {/* Corresponds to .frame-116 */}
          <div className={styles.reviewColumn}> {/* Corresponds to .frame-114 */}
            {dynamicRecommendedReviews.slice(0, 3).map((review) => (
              <div key={review.id} className={styles.reviewItem} onClick={() => openReviewPopup(review)}> {/* Corresponds to .frame-832, .frame-1053 */}
                <div className={styles.reviewContentWrapper}> {/* Corresponds to .frame-1133 */}
                  <div className={styles.reviewHeader}> {/* Corresponds to .frame-1076 */}
                    <div className={styles.userInfo}> {/* Corresponds to .frame-1065 */}
                      <div className={styles.avatar}></div> {/* Corresponds to .profile3 */}
                      <div className={styles.usernameAndMore}> {/* New wrapper */}
                        <span className={styles.username}>{review.author?.username || 'Unknown'}</span>
                        <img className={styles.moreIcon} src="/More_info.svg" alt="More options" />
                      </div>
                      <span className={styles.reviewTitle}>{review.title}</span>
                    </div>
                    <div className={styles.reviewMeta}> {/* Corresponds to .frame-108 */}
                      <span className={styles.date}>{new Date(review.createDate).toLocaleDateString()}</span>
                      <div className={styles.categoryTagWrapper}> {/* Corresponds to .frame-91 */}
                        <span className={styles.categoryTag}>{review.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewTextWrapper}> {/* Corresponds to .frame-1103 */}
                    <p className={styles.reviewText}>{review.content}</p>
                    <div className={styles.productLinkWrapper}> {/* Corresponds to .frame-111 */}
                      <button className={styles.productLinkButton}>제품 링크</button> {/* Corresponds to .frame-912, .div12 */}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewActions}> {/* Corresponds to .frame-155 */}
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
            ))}
          </div>
          <div className={styles.reviewColumn}> {/* Corresponds to .frame-115 */}
            {dynamicRecommendedReviews.slice(3, 6).map((review) => (
              <div key={review.id} className={styles.reviewItem} onClick={() => openReviewPopup(review)}> {/* Corresponds to .frame-832, .frame-1053 */}
                <div className={styles.reviewContentWrapper}> {/* Corresponds to .frame-1133 */}
                  <div className={styles.reviewHeader}> {/* Corresponds to .frame-1076 */}
                    <div className={styles.userInfo}> {/* Corresponds to .frame-1065 */}
                      <div className={styles.avatar}></div> {/* Corresponds to .profile3 */}
                      <div className={styles.usernameAndMore}> {/* New wrapper */}
                        <span className={styles.username}>{review.author?.username || 'Unknown'}</span>
                        <img className={styles.moreIcon} src="/More_info.svg" alt="More options" />
                      </div>
                      <span className={styles.reviewTitle}>{review.title}</span>
                    </div>
                    <div className={styles.reviewMeta}> {/* Corresponds to .frame-108 */}
                      <span className={styles.date}>{new Date(review.createDate).toLocaleDateString()}</span>
                      <div className={styles.categoryTagWrapper}> {/* Corresponds to .frame-91 */}
                        <span className={styles.categoryTag}>{review.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewTextWrapper}> {/* Corresponds to .frame-1103 */}
                    <p className={styles.reviewText}>{review.content}</p>
                    <div className={styles.productLinkWrapper}> {/* Corresponds to .frame-111 */}
                      <button className={styles.productLinkButton}>제품 링크</button> {/* Corresponds to .frame-912, .div12 */}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewActions}> {/* Corresponds to .frame-155 */}
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
            ))}
          </div>
        </div>
      </div>
      </>
  );
};