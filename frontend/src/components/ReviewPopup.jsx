import React, { useState } from "react";
import styles from "./ReviewPopup.module.css";

const ReviewPopup = ({ show, onClose, review, onLikeToggle, onBookmarkToggle, onAddComment, currentUser }) => {
  const [newCommentContent, setNewCommentContent] = useState('');

  const handleAddCommentClick = () => {
    if (onAddComment && review.id) {
      onAddComment(review.id, newCommentContent);
      setNewCommentContent(''); // Clear input after adding comment
    }
  };
  if (!show || !review) {
    return null;
  }

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <img
          className={styles.vector}
          src="/More_info.svg" // Assuming this is the close icon
          alt="Close"
          onClick={onClose}
        />
        <div className={styles["frame-154"]}>
          <div className={styles["frame-151"]}>
            <div className={styles["frame-107"]}>
              <div className={styles["frame-106"]}>
                <div className={styles["frame-150"]}>
                  <div className={styles["frame-243"]}>
                    <div className={styles["frame-109"]}>
                      <div className={styles.profile}></div>
                      <div className={styles.username}>{review.author?.username || 'Unknown'}</div>
                    </div>
                    <img
                      className={styles["ri-more-line"]}
                      src="/More_info.svg" // Assuming this is the more options icon
                      alt="More options"
                    />
                  </div>
                  <div className={styles["frame-149"]}>
                    <div className={styles.div2}>{review.title}</div>
                  </div>
                  <div className={styles["_2025-11-16"]}>{new Date(review.createDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className={styles["frame-148"]}>
                <div className={styles["frame-91"]}>
                  <div className={styles.div3}>{review.category}</div>
                </div>
                <div className={styles["frame-111"]}>
                  <div className={styles["frame-912"]}>
                    <div className={styles.div3}>제품 링크</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["frame-153"]}>
              <div className={styles.div4}>
                {review.content}
              </div>
              <div className={styles["frame-129"]}>
                <div className={styles["frame-246"]}>
                  <div className={styles["frame-248"]}>
                    <img
                      className={styles["frame-1312"]}
                      src={review.isLiked ? "/like_fill.svg" : "/like.svg"} // Dynamic like icon
                      alt="Like"
                      onClick={() => onLikeToggle && onLikeToggle(review.id)}
                    />
                    <div className={styles["frame-247"]}>
                      <div className={styles._10}>{review.likeCount}</div>
                    </div>
                  </div>
                  <div className={styles["frame-249"]}>
                    <img
                      className={styles["frame-1322"]}
                      src="/comment_icon.svg" // Comment icon
                    />
                    <div className={styles["frame-247"]}>
                      <div className={styles._10}>{review.commentCount}</div>
                    </div>
                  </div>
                  <div className={styles["frame-250"]}>
                    <img
                      className={styles["frame-1302"]}
                      src={review.isBookmarked ? "/bookmark_fill.svg" : "/bookmark_icon.svg"} // Dynamic bookmark icon
                      alt="Bookmark"
                      onClick={() => onBookmarkToggle && onBookmarkToggle(review.id)}
                    />
                    <div className={styles["frame-247"]}>
                      <div className={styles._10}>{review.bookmarkCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["frame-152"]}>
            {/* Comment Input */}
            <div className={styles.commentInputContainer}>
              <input
                type="text"
                placeholder="댓글을 입력하세요..."
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                className={styles.commentInputField}
              />
              <button onClick={handleAddCommentClick} className={styles.commentSubmitButton}>등록</button>
            </div>

            {/* Existing Comments */}
            {review.comments && review.comments.map(comment => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <div className={styles.profile2}></div>
                  <div className={styles.username2}>{comment.author?.username || 'Unknown'}</div>
                </div>
                <div className={styles.commentContent}>{comment.content}</div>
              </div>
            ))}
          </div>
          <div className={styles["frame-197"]}>
            <div className={styles["line-5"]}></div>
            <div className={styles.div7}>더보기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;
