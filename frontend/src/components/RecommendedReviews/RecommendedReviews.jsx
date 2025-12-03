import React, { useState } from "react";
import styles from "./RecommendedReviews.module.css";
import ReviewPopup from "../ReviewPopup";
export const RecommendedReviews = ({ openReviewPopup }) => {
  const recommendedReviews = [
    {
      id: 1,
      username: "USERNAME",
      title: "소프트 터치 라운드 니트",
      text: "니트가 생각보다 훨씬 촉감이 부드럽고 까슬거림이 전혀 없어요. 하루 종일 입고 있어도 불편함이 없고..",
      date: "2025.11.16",
      category: "의류",
      likes: 2,
      comments: 5,
      bookmarks: 10,
      moreIcon: "/ri-more-line10.svg",
      likeIcon: "/frame-1317.svg",
      commentIcon: "/frame-1327.svg",
      bookmarkIcon: "/frame-1307.svg",
    },
    {
      id: 2,
      username: "USERNAME",
      title: "스노우쉴드 롱패딩",
      text: "패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만 입어도 충분히 한겨울 기온..",
      date: "2025.11.16",
      category: "의류",
      likes: 8,
      comments: 3,
      bookmarks: 1,
      moreIcon: "/ri-more-line11.svg",
      likeIcon: "/frame-1318.svg",
      commentIcon: "/frame-1328.svg",
      bookmarkIcon: "/frame-1308.svg",
    },
    {
      id: 3,
      username: "USERNAME",
      title: "어반소프트 니트가디건",
      text: "가디건이 생각보다 훨씬 부드럽고 가벼워서 처음 입자마자 만족했어요. 안에 기본 반팔 하나만 입어..",
      date: "2025.11.16",
      category: "의류",
      likes: 12,
      comments: 7,
      bookmarks: 3,
      moreIcon: "/ri-more-line12.svg",
      likeIcon: "/frame-1319.svg",
      commentIcon: "/frame-1329.svg",
      bookmarkIcon: "/frame-1309.svg",
    },
    {
      id: 4,
      username: "USERNAME",
      title: "코지웜 듀얼히팅 전기장판",
      text: "생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말 편해요. 온도 단계가 세밀하게 조절돼..",
      date: "2025.11.16",
      category: "생활·가전",
      likes: 15,
      comments: 9,
      bookmarks: 4,
      moreIcon: "/ri-more-line13.svg",
      likeIcon: "/frame-13110.svg",
      commentIcon: "/frame-13210.svg",
      bookmarkIcon: "/frame-13010.svg",
    },
    {
      id: 5,
      username: "USERNAME",
      title: "스마트체온 프리미엄 전기요",
      text: "온열 분포가 고르게 퍼져서 몸 전체가 편안하게 따뜻해지는 느낌이에요. 특히 자동 타이머..",
      date: "2025.11.16",
      category: "생활·가전",
      likes: 11,
      comments: 6,
      bookmarks: 2,
      moreIcon: "/ri-more-line14.svg",
      likeIcon: "/frame-13111.svg",
      commentIcon: "/frame-13211.svg",
      bookmarkIcon: "/frame-13011.svg",
    },
    {
      id: 6,
      username: "USERNAME",
      title: "에어플러스 라이트다운 조끼",
      text: "조끼가 정말 가볍고 편해서 처음 착용했을 때 기분이 좋았어요. 안에 얇은 티셔츠만 입어도 충분..",
      date: "2025.11.16",
      category: "의류",
      likes: 9,
      comments: 4,
      bookmarks: 1,
      moreIcon: "/ri-more-line15.svg",
      likeIcon: "/frame-13112.svg",
      commentIcon: "/frame-13212.svg",
      bookmarkIcon: "/frame-13012.svg",
    },
  ];

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
            {recommendedReviews.slice(0, 3).map((review) => (
              <div key={review.id} className={styles.reviewItem} onClick={() => openReviewPopup(review)}> {/* Corresponds to .frame-832, .frame-1053 */}
                <div className={styles.reviewContentWrapper}> {/* Corresponds to .frame-1133 */}
                  <div className={styles.reviewHeader}> {/* Corresponds to .frame-1076 */}
                    <div className={styles.userInfo}> {/* Corresponds to .frame-1065 */}
                      <div className={styles.avatar}></div> {/* Corresponds to .profile3 */}
                      <div className={styles.usernameAndMore}> {/* New wrapper */}
                        <span className={styles.username}>{review.username}</span>
                        <img className={styles.moreIcon} src="/More_info.svg" alt="More options" />
                      </div>
                      <span className={styles.reviewTitle}>{review.title}</span>
                    </div>
                    <div className={styles.reviewMeta}> {/* Corresponds to .frame-108 */}
                      <span className={styles.date}>{review.date}</span>
                      <div className={styles.categoryTagWrapper}> {/* Corresponds to .frame-91 */}
                        <span className={styles.categoryTag}>{review.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewTextWrapper}> {/* Corresponds to .frame-1103 */}
                    <p className={styles.reviewText}>{review.text}</p>
                    <div className={styles.productLinkWrapper}> {/* Corresponds to .frame-111 */}
                      <button className={styles.productLinkButton}>제품 링크</button> {/* Corresponds to .frame-912, .div12 */}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewActions}> {/* Corresponds to .frame-155 */}
                  <div className={styles.actionItemGroup}>
                    <div className={styles.actionItem}>
                      <img src="/bookmark_icon.svg" alt="Bookmark" className={styles.actionIcon} />
                      <span className={styles.actionCount}>{review.bookmarks}</span>
                    </div>
                    <div className={styles.actionItem}>
                      <img src="/comment_icon.svg" alt="Comment" className={styles.actionIcon} />
                      <span className={styles.actionCount}>{review.comments}</span>
                    </div>
                    <div className={styles.actionItem}>
                      <img src="/like.svg" alt="Like" className={`${styles.actionIcon} ${styles.likeIcon}`} />
                      <span className={styles.actionCount}>{review.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.reviewColumn}> {/* Corresponds to .frame-115 */}
            {recommendedReviews.slice(3, 6).map((review) => (
              <div key={review.id} className={styles.reviewItem} onClick={() => openReviewPopup(review)}> {/* Corresponds to .frame-832, .frame-1053 */}
                <div className={styles.reviewContentWrapper}> {/* Corresponds to .frame-1133 */}
                  <div className={styles.reviewHeader}> {/* Corresponds to .frame-1076 */}
                    <div className={styles.userInfo}> {/* Corresponds to .frame-1065 */}
                      <div className={styles.avatar}></div> {/* Corresponds to .profile3 */}
                      <div className={styles.usernameAndMore}> {/* New wrapper */}
                        <span className={styles.username}>{review.username}</span>
                        <img className={styles.moreIcon} src="/More_info.svg" alt="More options" />
                      </div>
                      <span className={styles.reviewTitle}>{review.title}</span>
                    </div>
                    <div className={styles.reviewMeta}> {/* Corresponds to .frame-108 */}
                      <span className={styles.date}>{review.date}</span>
                      <div className={styles.categoryTagWrapper}> {/* Corresponds to .frame-91 */}
                        <span className={styles.categoryTag}>{review.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewTextWrapper}> {/* Corresponds to .frame-1103 */}
                    <p className={styles.reviewText}>{review.text}</p>
                    <div className={styles.productLinkWrapper}> {/* Corresponds to .frame-111 */}
                      <button className={styles.productLinkButton}>제품 링크</button> {/* Corresponds to .frame-912, .div12 */}
                    </div>
                  </div>
                </div>
                <div className={styles.reviewActions}> {/* Corresponds to .frame-155 */}
                  <div className={styles.actionItemGroup}>
                    <div className={styles.actionItem}>
                      <img src="/bookmark_icon.svg" alt="Bookmark" className={styles.actionIcon} />
                      <span className={styles.actionCount}>{review.bookmarks}</span>
                    </div>
                    <div className={styles.actionItem}>
                      <img src="/comment_icon.svg" alt="Comment" className={styles.actionIcon} />
                      <span className={styles.actionCount}>{review.comments}</span>
                    </div>
                    <div className={styles.actionItem}>
                      <img src="/like.svg" alt="Like" className={`${styles.actionIcon} ${styles.likeIcon}`} />
                      <span className={styles.actionCount}>{review.likes}</span>
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