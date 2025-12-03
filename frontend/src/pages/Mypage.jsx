import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Mypage.module.css';
import ReviewPopup from '../components/ReviewPopup';
import FollowListPopup from '../components/FollowListPopup';
import MyProfileMoreInfoPopup from '../components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup';
import NameChangePopup from '../components/NameChangePopup/NameChangePopup';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';

const Mypage = ({ currentUser }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [showFollowerPopup, setShowFollowerPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [showMyProfileMoreInfoPopup, setShowMyProfileMoreInfoPopup] = useState(false);
  const [showNameChangePopup, setShowNameChangePopup] = useState(false);
  const [myReviewData, setMyReviewData] = useState(null);
  const [activeTab, setActiveTab] = useState('written');
  const [likedReviewData, setLikedReviewData] = useState(null);
  const [bookmarkedReviewData, setBookmarkedReviewData] = useState(null);
  const [commentedReviewData, setCommentedReviewData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed page
  const [selectedReview, setSelectedReview] = useState(null); // State to store the selected review for popup

  // Helper to update review data in all relevant states
  const updateReviewInStates = (reviewId, updateFn) => {
    setMyReviewData(prev => prev ? prev.map(r => r.id === reviewId ? updateFn(r) : r) : prev);
    setLikedReviewData(prev => prev ? prev.map(r => r.id === reviewId ? updateFn(r) : r) : prev);
    setBookmarkedReviewData(prev => prev ? prev.map(r => r.id === reviewId ? updateFn(r) : r) : prev);
    setCommentedReviewData(prev => prev ? prev.map(r => r.id === reviewId ? updateFn(r) : r) : prev);
    // Also update selectedReview if it's the one being modified
    setSelectedReview(prev => prev && prev.id === reviewId ? updateFn(prev) : prev);
  };

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const moreOptionsRef = useRef(null);

  const usernameToDisplay = currentUser ? currentUser.username : "USERNAME";
  const userInfoToDisplay = currentUser ? currentUser.email : "USERINFO_1";

  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn("No JWT token found, cannot fetch follow data.");
      return;
    }

    const fetchFollowData = async () => {
      try {
        const countsResponse = await fetch(`/api/follow/${currentUser.username}/counts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (countsResponse.ok) {
          const countsData = await countsResponse.json();
          setFollowersCount(countsData.data.followerCount);
          setFollowingCount(countsData.data.followingCount);
        } else {
          console.error("Failed to fetch follow counts:", countsResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching follow data:", error);
      }
    };
    fetchFollowData();
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMyProfileMoreInfoPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOptionsRef]);

  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn("No JWT token found, cannot fetch my page data.");
      return;
    }

    const fetchMyPageData = async () => {
      try {
        const response = await fetch('/api/reviews/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const apiResponse = await response.json();
        if (apiResponse.success && apiResponse.data) {
          const { written, liked, bookmarked, comments } = apiResponse.data;
          setMyReviewData(written || []);
          setLikedReviewData(liked || []);
          setBookmarkedReviewData(bookmarked || []);
          if (comments) {
            const reviewsFromComments = comments.map(comment => comment.review).filter(Boolean);
            const uniqueReviews = Array.from(new Map(reviewsFromComments.map(review => [review.id, review])).values());
            setCommentedReviewData(uniqueReviews);
          } else {
            setCommentedReviewData([]);
          }
        } else {
          throw new Error(apiResponse.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error(`Failed to fetch my page data:`, error);
        setMyReviewData([]);
        setLikedReviewData([]);
        setBookmarkedReviewData([]);
        setCommentedReviewData([]);
      }
    };
    fetchMyPageData();
  }, [currentUser]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when activeTab changes
  }, [activeTab]);

  const openPopup = (review) => {
    setSelectedReview(review);
    setPopupOpen(true);
  };
  const closePopup = () => {
    setSelectedReview(null);
    setPopupOpen(false);
  };
  const openFollowerPopup = () => setShowFollowerPopup(true);
  const closeFollowerPopup = () => setShowFollowerPopup(false);
  const openFollowingPopup = () => setShowFollowingPopup(true);
  const closeFollowingPopup = () => setShowFollowingPopup(false);

  const handleLikeToggle = async (reviewId) => {
    const token = localStorage.getItem('jwtToken');
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
        updateReviewInStates(reviewId, (review) => ({
          ...review,
          isLiked: !review.isLiked,
          likeCount: review.isLiked ? review.likeCount - 1 : review.likeCount + 1
        }));
      } else {
        throw new Error(data.error?.message || '좋아요 처리 실패');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBookmarkToggle = async (reviewId) => {
    const token = localStorage.getItem('jwtToken');
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
        updateReviewInStates(reviewId, (review) => ({
          ...review,
          isBookmarked: !review.isBookmarked,
          bookmarkCount: review.isBookmarked ? review.bookmarkCount - 1 : review.bookmarkCount + 1
        }));
      } else {
        throw new Error(data.error?.message || '북마크 처리 실패');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddComment = async (reviewId, content) => {
    const token = localStorage.getItem('jwtToken');
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
        const commentsResponse = await fetch(`/api/reviews/${reviewId}/comments`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const commentsData = await commentsResponse.json();
        if (commentsData.success) {
            updateReviewInStates(reviewId, (review) => ({
                ...review,
                comments: commentsData.data,
                commentCount: review.commentCount + 1
            }));
        }
      } else {
        throw new Error(data.error?.message || '댓글 추가 실패');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [weeklyCurrentConsumption, setWeeklyCurrentConsumption] = useState(140);
  const [weeklyTargetConsumption, setWeeklyTargetConsumption] = useState(200);
  const [isWeeklyEditing, setIsWeeklyEditing] = useState(false);

  const handleWeeklyEditToggle = () => setIsWeeklyEditing(!isWeeklyEditing);
  const handleWeeklyCurrentChange = (e) => setWeeklyCurrentConsumption(parseInt(e.target.value, 10) || 0);
  const handleWeeklyTargetChange = (e) => setWeeklyTargetConsumption(parseInt(e.target.value, 10) || 0);
  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;

  const getActiveData = () => {
    switch (activeTab) {
      case 'written': return myReviewData;
      case 'liked': return likedReviewData;
      case 'bookmarked': return bookmarkedReviewData;
      case 'commented': return commentedReviewData;
      default: return null;
    }
  };

  const getActiveDataInfo = () => {
    const data = getActiveData();
    const count = data ? data.length : 0;
    switch (activeTab) {
      case 'written': return { title: '작성한 리뷰', count };
      case 'liked': return { title: '좋아요한 리뷰', count };
      case 'bookmarked': return { title: '북마크한 리뷰', count };
      case 'commented': return { title: '댓글단 리뷰', count };
      default: return { title: '', count: 0 };
    }
  };

  // Pagination logic for Mypage
  const itemsPerPage = 6; // 3 rows * 2 columns

  const handlePageChange = (pageNumber) => {
    const reviews = getActiveData();
    const totalPages = Math.ceil((reviews ? reviews.length : 0) / itemsPerPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const reviews = getActiveData();
    const totalPages = Math.ceil((reviews ? reviews.length : 0) / itemsPerPage);
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 4) * 4 + 1; // 1-indexed
    const endPage = Math.min(startPage + 3, totalPages); // Show up to 4 page numbers

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <div key={i} className={styles.frame1804} onClick={() => handlePageChange(i)}>
          <div className={i === currentPage ? styles.currentPage : styles._10}>{i}</div>
        </div>
      );
    }
    return pageNumbers;
  };


  const renderReviewGrid = () => {
    const reviews = getActiveData();

    if (reviews === null) {
      return <div className={styles.reviewsWrapper}><p>리뷰를 불러오는 중입니다...</p></div>;
    }

    const itemsPerPage = 6; // 3 rows * 2 columns
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = reviews.slice(startIndex, endIndex);
    
    const placeholders = Array(itemsPerPage - currentItems.length).fill(null);
    const displayItems = [...currentItems, ...placeholders];

    const column1 = displayItems.slice(0, 3);
    const column2 = displayItems.slice(3, 6);

    const renderBlock = (review, index) => {
      if (!review) {
        return <div key={`placeholder-${index}`} className={`${styles.frame83} ${styles.placeholderReviewBlock}`} />;
      }
      return (
        <div className={styles.frame83} key={review.id} onClick={() => openPopup(review)}>
          <div className={styles.frame105}>
            <div className={styles.frame109}>
              <div className={styles.frame113}>
                <div className={styles.frame107}>
                  <div className={styles.frame1063}>
                    <div className={styles.profile3}></div>
                    <div className={styles.username3}>{review.author.username}</div>
                    <div className={styles.div13}>{review.title}</div>
                    <div className={styles.frame108}>
                      <div className={styles.date20251116}>{new Date(review.createDate).toLocaleDateString()}</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>{review.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame110}>
                  <div className={styles.div14}>{review.content.substring(0, 100)}...</div>
                  <div className={styles.frame111}>
                    <div className={styles.div15}>제품 링크</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frame155}>
              <img className={styles.iconframe} src="/like.svg" alt="Like" />
              <img className={styles.frame1325} src="/bookmark_icon.svg" alt="Bookmark" />
              <img className={styles.frame1304} src="/comment_icon.svg" alt="Comment" />
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className={styles.reviewsWrapper}>
        <div className={styles.reviewBlocksWrapper}>
          {column1.map((review, index) => renderBlock(review, index))}
        </div>
        <div className={styles.reviewBlocksWrapper}>
          {column2.map((review, index) => renderBlock(review, index + 3))}
        </div>
      </div>
    );
  };

  const Pagination = () => {
    const reviews = getActiveData();
    if (!reviews || reviews.length <= itemsPerPage) return null; // Only show pagination if more than 6 items

    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    return (
      <div className={styles.pagination}>
        <img className={styles.group20953} src="/leftleft_icon.svg" alt="<<" onClick={() => handlePageChange(1)} style={{cursor: 'pointer'}} />
        <img className={styles.group20953} src="/left_icon.svg" alt="<" onClick={() => handlePageChange(currentPage - 1)} style={{cursor: 'pointer'}} />
        {renderPageNumbers()}
        <img className={styles.group20953} src="/right_icon.svg" alt=">" onClick={() => handlePageChange(currentPage + 1)} style={{cursor: 'pointer'}} />
        <img className={styles.group20953} src="/rightright_icon.svg" alt=">>" onClick={() => handlePageChange(totalPages)} style={{cursor: 'pointer'}} />
      </div>
    );
  };

  
  const activeDataInfo = getActiveDataInfo();
  const reviewsForPagination = getActiveData();
  const totalPages = Math.ceil((reviewsForPagination ? reviewsForPagination.length : 0) / itemsPerPage);

  return (
    <>
      <div className={styles.div}>
        <div className={styles.rectangle8}></div>
        <div className={styles.rectangle12}></div>
        <div className={styles.dashbox_row}>
        <div className={styles.dashbox}>
        <div className={styles.frame48}>
          <div className={styles.frame207}>
            <div className={styles.frame15}>
              <div className={styles.userInfo}>
                <div className={styles.frame291}>
                  <div className={styles.frame209}>
                    <div className={styles.profile}></div>
                    <div className={styles.frame225}>
                      <div className={styles.usernameInfo}>
                        <div className={styles.frame224}>
                          <div className={styles.frame223}>
                            <div className={styles.username}>{usernameToDisplay}</div>
                          </div>
                        </div>
                        <div className={styles.userinfo1}>{userInfoToDisplay}</div>
                      </div>
                      <div className={styles.moreOptionsContainer} ref={moreOptionsRef}>
                        <img className={styles.riMoreLine} src="/More_info.svg" alt="More options" onClick={() => setShowMyProfileMoreInfoPopup(!showMyProfileMoreInfoPopup)} />
                        {showMyProfileMoreInfoPopup && <MyProfileMoreInfoPopup onClose={() => setShowMyProfileMoreInfoPopup(false)} onNameChangeClick={() => setShowNameChangePopup(true)} currentUser={currentUser} />}
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame282}>
                    <img className={styles.vector} src="/leaf_point_icon.svg" alt="Vector" />
                    <div className={styles.frame91}>
                      <div className={styles._4000}>4000</div>
                    </div>
                    <div className={styles._6000Pt}>승급까지 -6000PT</div>
                  </div>
                  <div className={styles.line4}></div>
                  <div className={styles.frame241}>
                    <div className={styles.frame210}>
                      <div className={styles.frame212}>
                        <div className={styles.div2} onClick={openFollowingPopup}>팔로우</div>
                      </div>
                      <div className={styles.line42}></div>
                      <div className={styles.frame211}>
                        <div className={styles.div2} onClick={openFollowerPopup}>팔로워</div>
                      </div>
                    </div>
                    <div className={styles.frame2112}>
                      <div className={styles.frame212}>
                        <div className={styles._100}>{followingCount}</div>
                      </div>
                      <div className={styles.line43}></div> {/* 구분선 다시 추가 */}
                      <div className={styles.frame211}>
                        <div className={styles._200}>{followersCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame5}>
                <div className={styles.div3}>리뷰 작성</div>
              </div>
              <div className={styles.frame6}>
                <div className={styles.a}>소비 계획</div>
              </div>
            </div>
          </div>
          <div className={styles.frame199}>
            <div className={styles.frame204}>
              <div className={styles.frame198}>
                <div className={styles.a2}>알림</div>
                <div className={styles.line5}></div>
              </div>
              <div className={styles.frame205}>
                <div className={styles.frame203}>
                  <div className={styles.frame174}>
                    <div className={styles.frame106}>
                      <div className={styles.frame141}>
                        <div className={styles.frame140}>
                          <div className={styles.profile2}></div>
                          <div className={styles.username2}>
                            <span>
                              <span className={styles.username2Span}>팔로우중인</span>
                              <span className={styles.username2Span2}>USERNAME</span>
                              <span className={styles.username2Span}>
                                님의
                                <br />
                                새로운 글 업로드
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.line6}></div>
                  </div>
                </div>
                <div className={styles.frame174}>
                  <div className={styles.frame106}>
                    <div className={styles.frame141}>
                      <div className={styles.frame140}>
                        <div className={styles.profile2}></div>
                        <div className={styles.username2}>
                          <span>
                            <span className={styles.username2Span}>팔로우중인</span>
                            <span className={styles.username2Span2}>USERNAME</span>
                            <span className={styles.username2Span}>
                              님의
                              <br />
                              새로운 글 업로드
                            </span>
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.line6}></div>
                </div>
                <div className={styles.frame2052}>
                  <div className={styles.frame106}>
                    <div className={styles.frame141}>
                      <div className={styles.frame140}>
                        <div className={styles.profile2}></div>
                        <div className={styles.username2}>
                          <span>
                            <span className={styles.username2Span}>팔로우중인</span>
                            <span className={styles.username2Span2}>USERNAME</span>
                            <span className={styles.username2Span}>
                              님의
                              <br />
                              새로운 글 업로드
                            </span>
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.line6}></div>
                </div>
                <div className={styles.frame2042}>
                  <div className={styles.frame106}>
                    <div className={styles.frame141}>
                      <div className={styles.frame140}>
                        <div className={styles.profile2}></div>
                        <div className={styles.username2}>
                          <span>
                            <span className={styles.username2Span}>팔로우중인</span>
                            <span className={styles.username2Span2}>USERNAME</span>
                            <span className={styles.username2Span}>
                              님의
                              <br />
                              새로운 글 업로드
                            </span>
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.line6}></div>
                </div>
              </div>
            </div>
            <div className={styles.frame220}>
              <div className={styles.frame2053}>
                <img className={styles.group2095} src="/left_icon.svg" alt="Group 2095" />
              </div>
              <div className={styles.frame188}>
                <img className={styles.group20952} src="/rigth_icon.svg" alt="Group 20952" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame8}>  
          <div className={styles.frame226}>
            <div className={styles.frame254}>
              <div className={styles.frame25}>
                <div className={styles.frame196}>
                  <div className={styles._11}>11월 분야별 소비현황</div>
                  <div className={styles.line44}></div>
                </div>
                <div className={styles._112}>11월 소비현황</div>
              </div>
              <div className={styles.frame253}>
                <div className={styles.frame45}>
                  <div className={styles.legends}>
                    <div className={styles.frame35}>
                      <div className={styles.legend}>
                        <div className={styles.frame27}>
                          <div className={styles.ellipseFill}></div>
                          <div className={styles.div4}>주거비</div>
                        </div>
                      </div>
                      <div className={styles.legend}>
                        <div className={styles.legendNode}>
                          <div className={styles.basicNode}>
                            <div className={styles.ellipseFill2}></div>
                          </div>
                        </div>
                        <div className={styles.div4}>식비</div>
                      </div>
                      <div className={styles.legend}>
                        <div className={styles.legendNode}>
                          <div className={styles.basicNode}>
                            <div className={styles.ellipseFill3}></div>
                          </div>
                        </div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.mainChart}>
                    <div className={styles.pieLayer}>
                      <div className={styles.pie3}></div>
                      <div className={styles.pie2}></div>
                      <div className={styles.pie1}></div>
                      <div className={styles.labelContent}>
                        <div className={styles.labelName}>교통비</div>
                        <div className={styles.labelValue}>31.23</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame34}>
                  <div className={styles.frame252}>
                    <div className={styles.frame40}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame44}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame452}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame46}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame47}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame42}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>교통비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame482}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>교통비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                  </div>
                  <div className={styles.frame62}>
                    <div className={styles.a}>소비계획 수정하기</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frame22}>
              <div className={styles.frame1962}>
                <div className={styles._11}>11월 목표 소비금액</div>
                <div className={styles.line44}></div>
              </div>
              <div className={styles.frame278}>
                <div className={styles.frame422}>
                  <div className={styles.frame41}>
                    <div className={styles.div6}>이번 달의 목표금액</div>
                                      <div className={styles.frame19_}>
                     <div className={styles.frame37_}>
                        <div className={styles.frame36__}>
                                           {isWeeklyEditing ? (
                                               <div className={styles.editAmountWrapper_}>
                                                   <input type="number" value={weeklyCurrentConsumption} onChange={handleWeeklyCurrentChange} className={styles.inputField_} />
                                                   <span className={styles.amountSeparator_}>/</span>
                                                   <input type="number" value={weeklyTargetConsumption} onChange={handleWeeklyTargetChange} className={`${styles.inputField_} ${styles.targetInput_}`} />
                                                   <span className={styles.amountUnit_}>&nbsp;만원</span>
                                               </div>
                                           ) : (
                                               <div className={styles.viewAmountWrapper_}>
                                                   <div className={styles._1420_}>{weeklyCurrentConsumption}</div>
                                                   <div className={styles._2020_}>/{weeklyTargetConsumption} 만원</div>
                                               </div>
                                           )}
                                           <button onClick={handleWeeklyEditToggle} className={styles.editButton_}>
                                               {isWeeklyEditing ? '저장' : '수정'}
                                           </button>
                                         </div>
                                         <ProgressBar
                                           value={weeklyCurrentConsumption}
                                           max={weeklyTargetConsumption}
                                           label={`${weeklyPercentage}%`}
                                           percentageColor="#9BC4B0"
                                           isThick={true}
                                         />
                      </div>
                </div>
                    </div>
                  </div>
                <div className={styles.frame2732}>
                  <div className={styles.frame259}>
                    <div className={styles.div7}>이번 달의 목표 기록</div>
                  </div>
                  <div className={styles.frame21}>
                    <div className={styles.div8}>
                      <span>
                        <span className={styles.div8Span}>
                          제목
                          <br />
                        </span>
                        <span className={styles.div8Span2}>
                          <br />
                        </span>
                        <span className={styles.div8Span3}></span>
                        <span className={styles.div8Span4}>
                          이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                          특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문 횟수가
                          늘었고, 가을 신상 의류를 충동적으로 구매한 것이 큰
                          원인입니다. 소비 알림을 받았지만, &#039;이번 한
                          번만&#039;이라는 생각으로 자제를 못 했습니다.
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.frame279}>
                  <div className={styles.div9}>지난 달의 피드백</div>
                  <div className={styles.frame213}>
                    <div className={styles.frame271}>
                      <div className={styles.frame270}>
                        <div className={styles.frame372}>
                          <div className={styles.frame362}>
                            <div className={styles._240}>240</div>
                            <div className={styles._2003}>/200 만원</div>
                          </div>
                          <div className={styles.frame312}>
                            <div className={styles.labelValue4}>120% 초과</div>
                          </div>
                        </div>
                        <div className={styles.frame313}>
                          <ProgressBar value={120} max={100} isThick={false} percentageColor="#dadee1" />
                          <div className={styles.labelValue5}>120% 초과</div>
                        </div>
                      </div>
                      <div className={styles.frame265}>
                        <div className={styles.frame267}>
                          <div className={styles.div10}>만족도</div>
                          <div className={styles.frame269}>
                            <div className={styles.frame266}>
                              <div className={styles.ellipseFill5}></div>
                              <div className={styles.ellipseFill5}></div>
                              <div className={styles.ellipseFill5}></div>
                              <div className={styles.ellipseFill6}></div>
                              <div className={styles.ellipseFill6}></div>
                            </div>
                            <div className={styles._35}>
                              <span>
                                <span className={styles._35Span}>3</span>
                                <span className={styles._35Span}>/5</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.frame62}>
                      <div className={styles.a}>더보기</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frame219}>
              <div className={styles.frame18}>
                <div className={styles.frame196}>
                  <div className={styles.div11}>오늘의 소비현황</div>
                  <div className={styles.line44}></div>
                </div>
                <div className={styles.frame195}>
                  <div className={styles.frame43}>
                    <div className={styles.frame41}>
                      <div className={styles.div7}>이번 주의 목표금액</div>
                                      <div className={styles.frame19_}>
                     <div className={styles.frame37_}>
                        <div className={styles.frame36__}>
                                           {isWeeklyEditing ? (
                                               <div className={styles.editAmountWrapper_}>
                                                   <input type="number" value={weeklyCurrentConsumption} onChange={handleWeeklyCurrentChange} className={styles.inputField_} />
                                                   <span className={styles.amountSeparator_}>/</span>
                                                   <input type="number" value={weeklyTargetConsumption} onChange={handleWeeklyTargetChange} className={`${styles.inputField_} ${styles.targetInput_}`} />
                                                   <span className={styles.amountUnit_}>&nbsp;만원</span>
                                               </div>
                                           ) : (
                                               <div className={styles.viewAmountWrapper_}>
                                                   <div className={styles._1420_}>{weeklyCurrentConsumption}</div>
                                                   <div className={styles._2020_}>/{weeklyTargetConsumption} 만원</div>
                                               </div>
                                           )}
                                           <button onClick={handleWeeklyEditToggle} className={styles.editButton_}>
                                               {isWeeklyEditing ? '저장' : '수정'}
                                           </button>
                                         </div>
                                         <ProgressBar
                                           value={weeklyCurrentConsumption}
                                           max={weeklyTargetConsumption}
                                           label={`${weeklyPercentage}%`}
                                           percentageColor="#9BC4B0"
                                           isThick={true}
                                         />
                      </div>
                </div>
                    </div>
                  </div>
                  <div className={styles.frame342}>
                    <div className={styles.frame314}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div4}>식비</div>
                      </div>
                      <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame325}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <ProgressBar value={30} max={40} isThick={false} percentageColor="#e0e4e6" />
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                    <div className={styles.frame33}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <ProgressBar value={30} max={40} isThick={false} percentageColor="#e0e4e6" />
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                    <div className={styles.frame343}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <ProgressBar value={30} max={40} isThick={false} percentageColor="#e0e4e6" />
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                    <div className={styles.frame352}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <ProgressBar value={30} max={40} isThick={false} percentageColor="#e0e4e6" />
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame52}>
                <div className={styles.frame293}>
                  <div className={styles.frame2132}>
                    <div className={styles.frame216}>
                      <div className={styles.frame92}>
                        <div className={styles.frame26}>
                          <div className={styles.ellipseFill7}></div>
                          <div className={styles.div4}>교통비</div>
                        </div>
                      </div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>추가</div>
                      </div>
                    </div>
                    <div className={styles.frame218}>
                      <div className={styles.a3}>
                        <span>
                          <span className={styles.a3Span}>+</span>
                          <span className={styles.a3Span2}>15</span>
                          <span className={styles.a3Span}>만 원</span>
                        </span>
                      </div>
                      <div className={styles.line45}></div>
                    </div>
                  </div>
                  <div className={styles.frame217}>
                    <div className={styles.frame214}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div4}>갱신 전</div>
                      </div>
                      <ProgressBar value={20} max={40} isThick={false} percentageColor="#c9d3d0" />
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>20/40</div>
                      </div>
                    </div>
                    <div className={styles.frame215}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill8}></div>
                        <div className={styles.div4}>갱신 후</div>
                      </div>
                      <ProgressBar value={35} max={40} isThick={false} percentageColor="#abcebe" />
                      <div className={styles.frame49}>
                        <div className={styles.labelValue6}>35/40</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame62}>
                  <div className={styles.a}>소비 기록하기</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
      </div>


    <div className={styles.dashbox_}>
      <div className={styles.frame143}>
        <div className={styles.frame236}>
            <div className={styles.a4}>{activeDataInfo.title}</div>
            <div className={styles._30}>총 {activeDataInfo.count}건</div>
        </div>
        <div className={styles.line53}></div>
      </div>


      
        <div className={styles.completeWrapper}>
          <div className={styles.frame231_tab_container}>
            <div className={`${styles.frame2092} ${activeTab === 'written' ? styles.activeTab : ''}`} onClick={() => setActiveTab('written')}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>작성한 리뷰</div>
                </div>
              </div>
            </div>

            <div className={`${styles.frame2092} ${activeTab === 'liked' ? styles.activeTab : ''}`} onClick={() => setActiveTab('liked')}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>좋아요한 리뷰</div>             
                  <img className={styles.vector2} src="/like.svg" alt="vector" />
                </div>
              </div>
            </div>


            <div className={`${styles.frame2092} ${activeTab === 'bookmarked' ? styles.activeTab : ''}`} onClick={() => setActiveTab('bookmarked')}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>북마크한 리뷰</div>             
                  <img className={styles.frame131} src="/bookmark_icon.svg" alt="bookmark" />
                </div>
              </div>
            </div>
      

          <div className={`${styles.frame2092} ${activeTab === 'commented' ? styles.activeTab : ''}`} onClick={() => setActiveTab('commented')}>
            <div className={styles.frame232}>
              <div className={styles.frame1062}>
                <div className={styles.a5}>댓글단 리뷰</div>             
                  <img className={styles.frame132} src="/comment_icon.svg" alt="comment" />
              </div>
            </div>
          </div>
          
        </div>
        
        {renderReviewGrid()}
        {totalPages > 1 && <Pagination />}

    </div>
    

        </div>
      </div>
      <ReviewPopup 
        show={isPopupOpen} 
        onClose={closePopup} 
        review={selectedReview} 
        onLikeToggle={handleLikeToggle}
        onBookmarkToggle={handleBookmarkToggle}
        onAddComment={handleAddComment}
        currentUser={currentUser}
      />
      {showFollowerPopup && (
        <FollowListPopup 
          onClose={closeFollowerPopup} 
          title={`${usernameToDisplay}님의 팔로워 목록`} 
          username={usernameToDisplay} 
          listType="followers" 
        />
      )}
      {showFollowingPopup && (
        <FollowListPopup 
          onClose={closeFollowingPopup} 
          title={`${usernameToDisplay}님의 팔로우 목록`} 
          username={usernameToDisplay} 
          listType="following" 
        />
      )}
      {showNameChangePopup && (
        <NameChangePopup
          onClose={() => setShowNameChangePopup(false)}
          onConfirm={(newUsername) => {
            console.log("New username:", newUsername);
            setShowNameChangePopup(false);
          }}
          currentUsername={usernameToDisplay} // Replace with actual username state
        />
      )}
    </>
  );
};
export default Mypage;
