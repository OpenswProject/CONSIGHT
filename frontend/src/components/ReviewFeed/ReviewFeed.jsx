import React, { useState, useEffect, useRef } from "react";
import styles from "./ReviewFeed.module.css";
import { ShoppingList } from "../ShoppingList/ShoppingList";
import MoreOptionsPopup from "../MoreOptionsPopup/MoreOptionsPopup";

export const ReviewFeed = () => {
  // State for review data and pagination
  const [reviewList, setReviewList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [popupConfig, setPopupConfig] = useState({ show: false, username: '' });
  const commentInputRefs = useRef({});
  const [sortBy, setSortBy] = useState('createDate');
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' or 'asc'
  const [selectedCategory, setSelectedCategory] = useState('전체'); // New state for selected category, default to '전체'
  const [selectedFilter, setSelectedFilter] = useState(''); // New state for selected filter ('추천', '비추천', or '')

  const categories = ['전체', '뷰티', '식품', '의류', '주방', '생활·가전', '청소·욕실', '가구', '문구', '인테리어', '취미·레저', '기타'];

  // Fetch reviews from the API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token'); // 토큰 가져오기
        let url = `/api/reviews?page=${currentPage}&sort=${sortBy},${sortDirection}`;
        if (selectedCategory && selectedCategory !== '전체') { // '전체'가 아닐 때만 필터 적용
          url += `&searchType=category&kw=${selectedCategory}`;
        }
        if (selectedFilter) { // 필터가 선택되었을 때만 필터 적용
          url += `&searchType=filter&kw=${selectedFilter}`; // 백엔드에서 searchType=filter를 처리한다고 가정
        }
        const response = await fetch(url, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {} // 토큰이 있으면 헤더에 추가
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          setReviewList(await Promise.all(data.data.content.map(async review => {
            const token = localStorage.getItem('token'); // 토큰 가져오기
            const commentsResponse = await fetch(`/api/reviews/${review.id}/comments`, {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {} // 토큰이 있으면 헤더에 추가
            });
            const commentsData = await commentsResponse.json();
            console.log(`Fetched comments for review ${review.id}:`, commentsData); // 로그 추가
            return {
              ...review,
              isLiked: review.isLikedByCurrentUser,
              isBookmarked: review.isBookmarkedByCurrentUser,
              comments: commentsData.success ? commentsData.data : [], // 답글 불러오기
              newCommentContent: '' // 새로운 댓글 작성 내용
            };
          })));
          console.log("Final reviewList after fetching comments:", reviewList); // 로그 추가
          setTotalPages(data.data.totalPages);
          setTotalElements(data.data.totalElements);
        } else {
          throw new Error(data.error ? data.error.message : "Invalid data structure");
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
  }, [currentPage, sortBy, sortDirection, selectedCategory, selectedFilter]); // selectedFilter를 의존성 배열에 추가

  // Static data for recommended reviews (as per original file)
  const recommendedReviews = [
    { id: 1, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 2, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 3, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 4, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 5, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
  ];

  // Pagination logic
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.floor(currentPage / 4) * 4;
    const endPage = Math.min(startPage + 4, totalPages);

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <div key={i} className={styles.frame1804} onClick={() => handlePageChange(i)}>
          <div className={i === currentPage ? styles.currentPage : styles._10}>{i + 1}</div>
        </div>
      );
    }
    return pageNumbers;
  };

  // Popup handlers
  const openPopup = (username) => {
    setPopupConfig({ show: true, username: username });
  };

  const closePopup = () => {
    setPopupConfig({ show: false, username: '' });
  };

  const handleFollow = async (username) => {
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
        alert(`${username}님을 팔로우했습니다.`);
        closePopup();
      } else {
        throw new Error(data.error?.message || 'Follow failed');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBlock = (username) => {
    alert(`Blocked ${username}`);
    closePopup();
  };

  const handleReport = (username) => {
    alert(`Reported ${username}`);
    closePopup();
  };

  const handleReviewClick = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/view`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 조회수 업데이트 성공 시, 프론트엔드 상태도 업데이트
      setReviewList(prevReviewList => prevReviewList.map(review =>
        review.id === reviewId ? { ...review, viewCount: review.viewCount + 1 } : review
      ));
    } catch (error) {
      console.error("조회수 업데이트 실패:", error);
    }
  };

  const handleLikeToggle = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviewList(prevReviewList => prevReviewList.map(review =>
          review.id === reviewId ? { ...review, isLiked: !review.isLiked, likeCount: review.isLiked ? review.likeCount - 1 : review.likeCount + 1 } : review
        ));
      } else {
        throw new Error(data.error?.message || '좋아요 처리 실패');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBookmarkToggle = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const response = await fetch(`/api/reviews/${reviewId}/bookmark`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setReviewList(prevReviewList => prevReviewList.map(review =>
          review.id === reviewId ? { ...review, isBookmarked: !review.isBookmarked, bookmarkCount: review.isBookmarked ? review.bookmarkCount - 1 : review.bookmarkCount + 1 } : review
        ));
      } else {
        throw new Error(data.error?.message || '북마크 처리 실패');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchCommentsForReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      const commentsResponse = await fetch(`/api/reviews/${reviewId}/comments`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const commentsData = await commentsResponse.json();
      if (commentsData.success) {
        setReviewList(prevReviewList => prevReviewList.map(review =>
          review.id === reviewId ? { ...review, comments: commentsData.data } : review
        ));
      } else {
        console.error(`Failed to fetch comments for review ${reviewId}:`, commentsData.error);
      }
    } catch (error) {
      console.error(`Error fetching comments for review ${reviewId}:`, error);
    }
  };

  const handleAddComment = async (reviewId, content) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!content.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await response.json();
      if (data.success) {
        // 댓글 추가 후 댓글 목록 새로고침
        await fetchCommentsForReview(reviewId); // 정의된 함수 호출
        // 댓글 수 업데이트
        setReviewList(prevReviewList => prevReviewList.map(review =>
          review.id === reviewId ? { ...review, commentCount: review.commentCount + 1, newCommentContent: '' } : review
        ));
      } else {
        throw new Error(data.error?.message || '댓글 추가 실패');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setSortDirection('desc'); // 새로운 정렬 기준 선택 시 기본적으로 내림차순
    setCurrentPage(0); // 정렬 기준 변경 시 첫 페이지로 이동
  };

  const handleSortDirectionToggle = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(0); // 정렬 방향 변경 시 첫 페이지로 이동
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0); // 카테고리 변경 시 첫 페이지로 이동
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  };

  return (
    <>
      <div className={styles.reviewFeedMainContainer}>
        <div className={styles.backgroundGradient}></div>
        <div className={styles.contentWrapper}>

        <div className={styles.filterSortCategoryWrapper}>

          {/* Category Section */}
          <div className={styles.frame51}>
            <div className={styles.div2}>카테고리</div>
            <div className={styles.frame96}>
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category;
                const categoryValue = category === '전체' ? '' : category; // '전체' 버튼 클릭 시 빈 문자열 전달

                return (
                  <div
                    key={index}
                    className={styles.frame95} // 기존 frame95 클래스를 기본 스타일로 사용
                    onClick={() => handleCategoryChange(categoryValue)}
                    style={{
                      backgroundColor: isSelected ? 'var(--green-d6)' : 'var(--gray-f3)',
                      borderColor: isSelected ? 'var(--green-8b)' : 'var(--gray-c5)',
                      color: isSelected ? 'var(--green-8b)' : 'var(--gray-57)', // 텍스트 색상도 변경
                      cursor: 'pointer'
                    }}
                  >
                    <div className={styles.div3} style={{ color: isSelected ? 'var(--green-8b)' : 'var(--gray-57)' }}>{category}</div>
                  </div>
                );
              })}
            </div>
          </div>

                  {/* Filtering Section */}
          <div className={styles.frame58}>
            <div className={styles.div2}>필터링</div>
            <div className={styles.frame96}>
              <div
                className={styles.frame95}
                onClick={() => handleFilterChange('추천')}
                style={{
                  backgroundColor: selectedFilter === '추천' ? 'var(--green-d6)' : 'var(--gray-f3)',
                  borderColor: selectedFilter === '추천' ? 'var(--green-8b)' : 'var(--gray-c5)',
                  cursor: 'pointer'
                }}
              >
                <div className={styles.div3} style={{ color: selectedFilter === '추천' ? 'var(--green-8b)' : 'var(--gray-57)' }}>추천</div>
              </div>
            </div>
            <div className={styles.frame97}>
              <div
                className={styles.frame95}
                onClick={() => handleFilterChange('비추천')}
                style={{
                  backgroundColor: selectedFilter === '비추천' ? 'var(--green-d6)' : 'var(--gray-f3)',
                  borderColor: selectedFilter === '비추천' ? 'var(--green-8b)' : 'var(--gray-c5)',
                  cursor: 'pointer'
                }}
              >
                <div className={styles.div3} style={{ color: selectedFilter === '비추천' ? 'var(--green-8b)' : 'var(--gray-57)' }}>비추천</div>
              </div>
            </div>

                  {/* Sorting Section */}
          <div className={styles.frame59}>
            <div className={styles.frame112}>
              <div className={styles.div4}>정렬</div>
              <img
                className={styles.polygon1}
                src="/listup_icon.svg"
                alt="sort icon"
                onClick={handleSortDirectionToggle}
                style={{
                  cursor: 'pointer',
                  transform: sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease-in-out' // 부드러운 전환 효과
                }}
              />
            </div>
            <div className={styles.frame113}>
              <div
                className={styles.frame95}
                onClick={() => handleSortChange('createDate')}
                style={{
                  backgroundColor: sortBy === 'createDate' ? 'var(--green-d6)' : 'var(--gray-f3)',
                  borderColor: sortBy === 'createDate' ? 'var(--green-8b)' : 'var(--gray-c5)',
                  cursor: 'pointer'
                }}
              >
                <div className={styles.div3} style={{ color: sortBy === 'createDate' ? 'var(--green-8b)' : 'var(--gray-57)' }}>최신순</div>
              </div>
            </div>
            <div className={styles.frame96}>
              <div
                className={styles.frame95}
                onClick={() => handleSortChange('viewCount')}
                style={{
                  backgroundColor: sortBy === 'viewCount' ? 'var(--green-d6)' : 'var(--gray-f3)',
                  borderColor: sortBy === 'viewCount' ? 'var(--green-8b)' : 'var(--gray-c5)',
                  cursor: 'pointer'
                }}
              >
                <div className={styles.div3} style={{ color: sortBy === 'viewCount' ? 'var(--green-8b)' : 'var(--gray-57)' }}>조회수순</div>
              </div>
            </div>
            <div className={styles.frame97}>
              <div
                className={styles.frame95}
                onClick={() => handleSortChange('likeCount')}
                style={{
                  backgroundColor: sortBy === 'likeCount' ? 'var(--green-d6)' : 'var(--gray-f3)',
                  borderColor: sortBy === 'likeCount' ? 'var(--green-8b)' : 'var(--gray-c5)',
                  cursor: 'pointer'
                }}
              >
                <div className={styles.div3} style={{ color: sortBy === 'likeCount' ? 'var(--green-8b)' : 'var(--gray-57)' }}>좋아요순</div>
              </div>
            </div>

          </div>

        </div>

        {/* Main Content Area */}
        <div className={styles.frame182}>
          <div className={styles.frame181}>
            <div className={styles.frame180}>
              <div className={styles.frame245}>
                <div className={styles.frame236}>
                  <div className={styles.frame106}>
                    <div className={styles.a}>검색된 리뷰</div>
                  </div>
                  <div className={styles._30}>총 {totalElements}건</div>
                </div>
                {/* Pagination (Top) */}
                <div className={styles.frame2222}>
                  <div className={styles.frame1901}>
                    <img className={styles.group20953} src="/leftleft_icon.svg" alt="<<" onClick={() => handlePageChange(0)} />
                    <img className={styles.group20953} src="/left_icon.svg" alt="<" onClick={() => handlePageChange(currentPage - 1)} />
                  </div>
                  {renderPageNumbers()}
                  <div className={styles.frame1901}>
                    <img className={styles.group20953} src="/right_icon.svg" alt=">" onClick={() => handlePageChange(currentPage + 1)} />
                    <img className={styles.group20953} src="/rightright_icon.svg" alt=">>" onClick={() => handlePageChange(totalPages - 1)} />
                  </div>
                </div>
              </div>
              <div className={styles.frame244}>
                <div className={styles.frame1407}>
                  <img className={styles.group1} src="/search_icon.svg" alt="Search icon" />
                  <div className={styles.line54}></div>
                  <input type="text" placeholder="검색..." className={styles.searchInput} />
                </div>
              </div>
            </div>

            {/* Review Cards Container */}
            <div className={styles.frame119}>
              {reviewList.map((review) => (
                <React.Fragment key={review.id}>
                  <div key={review.id} className={styles.frame50} onClick={() => handleReviewClick(review.id)}>
                    <div className={styles.frame1222}>
                      <div className={styles.reviewContentWrapper}>
                        <div className={styles.section01}>
                          <div className={styles.frame1072}>
                            <div className={styles.frame1062}>
                              <div className={styles.frame150}>
                                <div className={styles.frame243}>
                                  <div className={styles.frame109}>
                                    <div className={styles.profile}></div>
                                    <div className={styles.username}>{review.author?.username || '사용자'}</div>
                                  </div>
                                  <img 
                                    className={styles.riMoreLine} 
                                    src="/More_info.svg" 
                                    alt="moreoptions" 
                                    onClick={() => openPopup(review.author?.username)}
                                    style={{cursor: 'pointer'}}
                                  />
                                </div>
                                <div className={styles.frame149}>
                                  <div className={styles.div5}>{review.title}</div>
                                </div>
                                {/* 조회수와 날짜를 함께 표시하는 div */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <img className={styles.viewIcon} src="/public2/More_info.svg" alt="View" style={{ width: '16px', height: '16px' }} /> {/* 임시 아이콘 */}
                                  <div className={styles.viewCount}>{review.viewCount || 0}</div>
                                  <div className={styles._20251116}>{new Date(review.createDate).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.frame148}>
                              <div className={styles.frame912}>
                                <div className={styles.div6}>{review.category}</div>
                              </div>
                              <div className={styles.frame111}>
                                <div className={styles.div6}>{review.productLink}</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.frame153}>
                            <div className={styles.div7}>{review.content}</div>
                            {review.receiptImagePath && <img src={review.receiptImagePath} alt="Receipt" className={styles.receiptImage} />}
                            <div className={styles.frame129}>
                              <div className={styles.frame246}>
                                <div className={styles.frame248}>
                                  <img
                                    className={styles.frame131}
                                    src={review.isLiked ? "/like_fill.svg" : "/like.svg"}
                                    alt="like"
                                    onClick={() => handleLikeToggle(review.id)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <div className={styles.frame247}>
                                    <div className={styles._10}>{review.likeCount}</div>
                                  </div>
                                </div>
                                <div className={styles.frame249}>
                                  <img
                                    className={styles.frame132}
                                    src="/comment_icon.svg" // 클릭 시 토글되므로 fill 아이콘은 나중에 고려
                                    alt="comment"
                                    onClick={() => commentInputRefs.current[review.id]?.focus()} // 댓글 입력 필드에 포커스
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <div className={styles.frame247}>
                                    <div className={styles._10}>{review.commentCount}</div>
                                  </div>
                                </div>
                                <div className={styles.frame250}>
                                  <img
                                    className={styles.frame130}
                                    src={review.isBookmarked ? "/bookmark_fill.svg" : "/bookmark_icon.svg"}
                                    alt="bookmark"
                                    onClick={() => handleBookmarkToggle(review.id)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <div className={styles.frame247}>
                                    <div className={styles._10}>{review.bookmarkCount}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame179}>
                          <div className={styles.frame176}>
                            {/* Comments are not fetched from this endpoint, so this section will be empty */}
                            <div className={styles.frame197}>
                              <div className={styles.line53}></div>
                              <div className={styles.div9}>더보기</div>
                              <div className={styles.commentSection}> {/* 조건부 렌더링 제거 */}
                                <div className={styles.commentList}>
                                  {review.comments.map(comment => (
                                    <div key={comment.id} className={styles.frame174}>
                                      <div className={styles.line7}></div>
                                      <div className={styles.frame1063}>
                                        <div className={styles.frame141}>
                                          <div className={styles.frame140}>
                                            <div className={styles.profile2}></div>
                                            <div className={styles.username2}>{comment.author.username}</div>
                                          </div>
                                          <div className={styles.frame139}>
                                            <div className={styles.div8}>{comment.content}</div>
                                          </div>
                                        </div>
                                        <img className={styles.group1} src="/More_info.svg" alt="more options" />
                                      </div>
                                      <div className={styles.line6}></div>
                                    </div>
                                  ))}
                                </div>
                                <div className={styles.commentInputContainer}>
                                  <input
                                    type="text"
                                    placeholder="댓글을 입력하세요..."
                                    value={review.newCommentContent}
                                    onChange={(e) => setReviewList(prevReviewList => prevReviewList.map(r =>
                                      r.id === review.id ? { ...r, newCommentContent: e.target.value } : r
                                    ))}
                                    className={styles.commentInputField}
                                    ref={el => commentInputRefs.current[review.id] = el} // ref 추가
                                  />
                                  <button onClick={() => handleAddComment(review.id, review.newCommentContent)} className={styles.commentSubmitButton}>등록</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            
            </div>
          </div>

          {/* Sidebars */}
          <div className={styles.frame172}>
            {/* Shopping List Section */}
            <ShoppingList />

            {/* Recommended Reviews Section */}
            <div className={styles.frame168}>
              <div className={styles.div14}>추천 리뷰</div>
              {recommendedReviews.map((review) => (
                <div key={review.id} className={styles.frame167}>
                  <div className={styles.frame162}>
                    <div className={styles.frame161}>
                      <div className={styles.frame160}>
                        <div className={styles.profile}></div>
                        <div className={styles.username3}>{review.username}</div>
                      </div>
                      <div className={styles.div15}>{review.title}</div>
                    </div>
                    <div className={styles.frame108}>
                      <div className={styles._202511162}>{review.date}</div>
                      <div className={styles.frame91}>
                        <div className={styles.div3}>{review.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {popupConfig.show && (
        <MoreOptionsPopup 
          username={popupConfig.username}
          onFollow={handleFollow}
          onBlock={handleBlock}
          onReport={handleReport}
          onClose={closePopup}
        />
      )}
      </div>
      </div>
    </>
  );
};
