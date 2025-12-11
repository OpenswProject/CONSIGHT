import React, { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import { Header } from "./components/Header/Header";
import ProfilePage from "./pages/ProfilePage";
import { ConsumptionStatus } from "./components/ConsumptionStatus/ConsumptionStatus";
import { VisitHistory } from "./components/VisitHistory/VisitHistory";
import { ShoppingList } from "./components/ShoppingList/ShoppingList";
import { RecommendedReviews } from "./components/RecommendedReviews/RecommendedReviews";
import { ReviewFeedPage } from "./pages/ReviewFeedPage";
import ConsumePlanPage from "./pages/ConsumePlanPage";
import Mypage from "./pages/Mypage";
import ReviewWritePage from "./pages/ReviewWritePage";
import ProfileRedirector from "./components/ProfileRedirector/ProfileRedirector";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyProfileMoreInfoPopup from "./components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup";
import NameChangePopup from "./components/NameChangePopup/NameChangePopup";
import ReviewPopup from "./components/ReviewPopup";
import NotificationItem from "./components/NotificationItem/NotificationItem";

const HomePage = ({ 
  apiMessage, 
  currentUser, 
  monthlyCategories,
  weeklyCurrentConsumption,
  weeklyTargetConsumption,
  monthlyCurrentConsumption,
  monthlyTargetConsumption,
  lastFeedback,
  points,
  handleAttend,
  attendanceHistory,
  isAttendedToday
}) => {
  const navigate = useNavigate();
  const [showMyProfileMoreInfoPopup, setShowMyProfileMoreInfoPopup] = useState(false);
  const [showNameChangePopup, setShowNameChangePopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const moreOptionsRef = useRef(null);

  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const ReviewCard = ({ review, onClick, styles }) => (
    <div className={styles.frame120} onClick={() => onClick(review)}>
      <div className={styles.frame107}>
        <div className={styles.frame138}>
          <div className={styles.frame194}>
            <div className={styles.frame134}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame1072}>
                    <div className={styles.frame106}>
                      <div className={styles.frame243}>
                        <div className={styles.frame1092}>
                          <div className={styles.profile}></div>
                          <div className={styles.username}>{review.author?.username || 'Unknown'}</div>
                        </div>
                        <img className={styles.riMoreLine} src="/More_info.svg" alt="More Options" />
                      </div>
                      <div className={styles.frame251}>
                        <div className={styles.div}>{review.title}</div>
                        {review.receiptImagePath && <img className={styles.maskGroup} src={review.receiptImagePath} alt="Product Image" />}
                      </div>
                      <div className={styles.iconParkSolidCheckOne}></div>
                    </div>
                    <div className={styles.frame108}>
                      <div className={styles._20251116}>{new Date(review.createDate).toLocaleDateString()}</div>
                      <div className={styles.frame91}>
                        <div className={styles.div2}>{review.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div3}>
                      {review.content}
                    </div>
                    {review.productLink && (
                      <div className={styles.frame111}>
                        <div className={styles.frame912}>
                          <a href={review.productLink} target="_blank" rel="noopener noreferrer" className={styles.div4}>제품 링크</a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.frame129}></div>
            </div>
            <div className={styles.frame156}>
              <div className={styles.line5}></div>
              <div className={styles.frame246}>
                <div className={styles.frame248}>
                  <img className={styles.frame131} src="/bookmark_icon.svg" alt="Bookmark" />
                  <div className={styles.frame247}>
                    <div className={styles._10}>{review.bookmarkCount}</div>
                  </div>
                </div>
                <div className={styles.frame249}>
                  <img className={styles.frame132} src="/comment_icon.svg" alt="Comment" />
                  <div className={styles.frame247}>
                    <div className={styles._10}>{review.commentCount}</div>
                  </div>
                </div>
                <div className={styles.frame250}>
                  <img className={styles.frame130} src="/like.svg" alt="Like" />
                  <div className={styles.frame247}>
                    <div className={styles._10}>{review.likeCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMyProfileMoreInfoPopup(false);
      }
    };

    if (showMyProfileMoreInfoPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMyProfileMoreInfoPopup]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        return;
      }
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        return;
      }
      try {
        const response = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setNotifications(data.data);
          } else {
            setNotifications([]);
          }
        } else {
          setNotifications([]);
        }
      } catch (error) {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    const unreadNotificationIds = notifications.filter(notif => !notif.read).map(notif => notif.id);
    for (const id of unreadNotificationIds) {
      try {
        await fetch(`/api/notifications/${id}/read`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
      }
    }
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleNameChangeConfirm = (newUsername) => {
    setShowNameChangePopup(false);
  };

  const openReviewPopup = (review) => {
    setSelectedReview(review);
    setIsReviewPopupOpen(true);
  };

  const closeReviewPopup = () => {
    setSelectedReview(null);
    setIsReviewPopupOpen(false);
  };

  const handleLikeToggle = (reviewId) => {
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1
      }));
    }
  };

  const handleBookmarkToggle = (reviewId) => {
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => ({
        ...prev,
        isBookmarked: !prev.isBookmarked,
        bookmarkCount: prev.isBookmarked ? prev.bookmarkCount - 1 : prev.bookmarkCount + 1
      }));
    }
  };

  const handleAddComment = (reviewId, content) => {
    if (selectedReview && selectedReview.id === reviewId) {
      const newComment = {
        id: new Date().getTime(),
        author: { username: currentUser?.username || 'You' },
        content: content,
      };
      setSelectedReview(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
        commentCount: (prev.commentCount || 0) + 1
      }));
    }
  };

  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);

  // ShoppingList에서 사용할 항목들을 정의합니다.
  const shoppingItems = [
    "겨울 옷 구매",
    "12월 식재료 구매",
    "전기장판 구매",
    "핸드워시 구매"
  ];

  // 현재 선택된 쇼핑 항목 상태
  const [selectedShoppingItem, setSelectedShoppingItem] = useState(
    shoppingItems.length > 0 ? { index: 0, name: shoppingItems[0] } : null
  );

  // 쇼핑 항목 클릭 핸들러
  const handleShoppingItemClick = (index, name) => {
    setSelectedShoppingItem({ index, name });
  };

  // RecommendedReviews에 전달할 선택된 쇼핑 항목을 구성합니다.
  const recommendedReviewItem = selectedShoppingItem 
    ? `${selectedShoppingItem.index + 1}번 ${selectedShoppingItem.name}` 
    : "추천 항목 없음";

  const fetchReviews = async (page) => {
    setLoadingReviews(true);
    setErrorReviews(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(`/api/reviews?page=${page}&sort=createDate,desc`, { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        setReviews(data.data.content);
        setTotalPages(data.data.totalPages);
      } else {
        setErrorReviews(data.error?.message || "Failed to fetch reviews.");
      }
    } catch (error) {
      setErrorReviews("리뷰를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button key={i} onClick={() => setCurrentPage(i)} disabled={i === currentPage}>
          {i + 1}
        </button>
      );
    }
    return <div>{pages}</div>;
  };

  console.log("HomePage rendering, openReviewPopup:", openReviewPopup);

  return (
    <>
      <div className={styles.backgroundRectangle}></div>
      <div className={styles.mainContentArea}>
        <div className={styles.frame193}>
          <div className={styles.frame192}>
            <div className={styles.headerRow}>
              <div className={styles.usernameTitle}>
                
              </div>
              <div className={styles.frame282}>
                <img className={styles.vector} src="/leaf_point_icon.svg" alt="Leaf Point Icon" />
                <div className={styles.frame914}>
                  <div className={styles._4000}>{points}</div>
                </div>
                <div className={styles._6000pt}>승급까지 -6000PT</div>
              </div>
            </div>
            <div className={styles.div2Wrapper}>
              <div className={styles.frame45}>
                <div className={styles.consumptionAndVisitContainer}>
                  <div className={styles.consumptionAndVisitSection}>
                    <ConsumptionStatus 
                      username={currentUser?.username || 'Guest'} 
                      currentUser={currentUser} 
                      monthlyCategories={monthlyCategories}
                      weeklyCurrentConsumption={weeklyCurrentConsumption}
                      weeklyTargetConsumption={weeklyTargetConsumption}
                      monthlyCurrentConsumption={monthlyCurrentConsumption}
                      monthlyTargetConsumption={monthlyTargetConsumption}
                      lastFeedback={lastFeedback}
                    />
                    <VisitHistory onAttend={handleAttend} currentUser={currentUser} attendanceHistory={attendanceHistory} isAttendedToday={isAttendedToday} />
                  </div>
                </div>
              </div>
              <div className={styles.line1}></div>
            </div>
          </div>
          <div className={styles.frame48}>
            <div className={styles.frame207}>
              <div className={styles.userInfo}>
                <div className={styles.frame291}>
                  <div className={styles.frame209}>
                    <div className={styles.profile}></div>
                    <div className={styles.frame225}>
                      <div className={styles.usernameInfo}>
                        <div className={styles.frame224}>
                          <div className={styles.frame223}>
                            <div className={styles.username}>{currentUser?.username ? `${currentUser.username}님` : 'Guest'}</div>
                          </div>
                        </div>
                        <div className={styles.userinfo1}>{currentUser?.email || 'guest@example.com'}</div>
                      </div>
                      <div className={styles.moreOptionsContainer} ref={moreOptionsRef}>
                        <img className={styles.riMoreLine} src="/More_info.svg" alt="More options" onClick={() => setShowMyProfileMoreInfoPopup(!showMyProfileMoreInfoPopup)} />
                        {showMyProfileMoreInfoPopup && <MyProfileMoreInfoPopup onClose={() => setShowMyProfileMoreInfoPopup(false)} onNameChangeClick={() => setShowNameChangePopup(true)} currentUser={currentUser} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${styles.actionButton} ${styles.primary}`} onClick={() => navigate('/review-write')}>
                리뷰 작성
              </div>
              <div className={`${styles.actionButton} ${styles.secondary}`} onClick={() => navigate('/mypage')}>
                내 리뷰
              </div>
              <div className={styles.notificationsCard}>
                <div className={styles.notificationsHeader}>
                  알림
                </div>
                <div className={styles.line5}></div>
                <div className={styles.notificationsList}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))
                  ) : (
                    <div className={styles.noNotifications}>새로운 알림이 없습니다.</div>
                  )}
                </div>
                {notifications.filter(n => !n.read).length > 0 && (
                  <button onClick={handleMarkAllAsRead} className={styles.markAllAsReadButton}>
                    모두 읽음으로 표시
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame142}>
          <div className={styles.line42}></div>
          <div className={styles.frame117}>
            <ShoppingList 
              shoppingItems={shoppingItems} 
              onItemClick={handleShoppingItemClick} 
            />
            <RecommendedReviews shoppingItem={recommendedReviewItem} />
          </div>
        </div>
        <div className={styles.frame145}>
          <div className={styles.line42}></div>
          <div className={styles.frame143}>
            <div className={styles.reviewFeedHeader}>
              <div className={styles.reviewFeedTitle}>리뷰 피드</div>
              {renderPageNumbers()}
            </div>
            {loadingReviews ? (
              <div>리뷰를 불러오는 중...</div>
            ) : errorReviews ? (
              <div>오류: {errorReviews}</div>
            ) : (
              <div className={styles.frame144}>
                {reviews.length > 0 ? (
                  reviews.map(review => {
                    console.log("ReviewCard rendering, onClick prop:", openReviewPopup);
                    return <ReviewCard key={review.id} review={review} onClick={openReviewPopup} styles={styles} />;
                  })
                ) : (
                  <div>리뷰가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isReviewPopupOpen && selectedReview && (
        <ReviewPopup
          review={selectedReview}
          onClose={closeReviewPopup}
          onLikeToggle={handleLikeToggle}
          onBookmarkToggle={handleBookmarkToggle}
          onAddComment={handleAddComment}
          currentUser={currentUser}
        />
      )}
      {showNameChangePopup && (
        <NameChangePopup
          onClose={() => setShowNameChangePopup(false)}
          onConfirm={handleNameChangeConfirm}
          currentUsername={currentUser?.username}
        />
      )}
    </>
  );
};

function App() {
  
  const [apiMessage, setApiMessage] = useState("Loading...");
  const [currentUser, setCurrentUser] = useState(null);
  const [monthlyCategories, setMonthlyCategories] = useState([]);
  const [weeklyCategories, setWeeklyCategories] = useState([]);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [submittedFeedback, setSubmittedFeedback] = useState([]); // submittedFeedback 상태를 빈 배열로 초기화
  const [points, setPoints] = useState(0);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isAttendedToday, setIsAttendedToday] = useState(false);

  const handleFeedbackSubmit = (feedbackData) => {
    setSubmittedFeedback(prevFeedbacks => [...prevFeedbacks, feedbackData]);
    setLastFeedback(feedbackData);
  };

  const handleAttend = async () => {
    if (!currentUser || !currentUser.id) {
      alert("로그인이 필요합니다.");
      return;
    }
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert("출석 체크 완료! " + data.pointsEarned + " 포인트를 획득했습니다.");
          setPoints(prevPoints => prevPoints + data.pointsEarned);
          setAttendanceHistory(prevHistory => [...prevHistory, new Date()]);
          setIsAttendedToday(true);
        } else {
          console.error(data.error?.message || "출석 체크에 실패했습니다.");
        }
      } else {
        console.error("출석 체크 서버 오류.");
      }
    } catch (error) {
      console.error("Error during attendance:", error);
      console.error("출석 체크 중 오류가 발생했습니다.");
    }
  };

  const weeklyCurrentConsumption = useMemo(() => {
    if (!Array.isArray(weeklyCategories)) return 0;
    return weeklyCategories.reduce((sum, category) => sum + category.currentAmount, 0);
  }, [weeklyCategories]);

  const weeklyTargetConsumption = useMemo(() => {
    if (!Array.isArray(weeklyCategories)) return 0;
    return weeklyCategories.reduce((sum, category) => sum + category.targetAmount, 0);
  }, [weeklyCategories]);

  const monthlyCurrentConsumption = useMemo(() => {
    if (!Array.isArray(monthlyCategories)) return 0;
    return monthlyCategories.reduce((sum, category) => sum + category.currentAmount, 0);
  }, [monthlyCategories]);

  const monthlyTargetConsumption = useMemo(() => {
    if (!Array.isArray(monthlyCategories)) return 0;
    return monthlyCategories.reduce((sum, category) => sum + category.targetAmount, 0);
  }, [monthlyCategories]);

  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data;
        }
      }
      return null;
    } catch (error) {
      console.error("Token validation failed:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      if (storedToken) {
        const userDto = await validateToken(storedToken);
        if (userDto) {
          setCurrentUser({ username: userDto.username, email: userDto.email, id: userDto.id });
        } else {
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    initializeUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !currentUser.id) {
        setPoints(0);
        setAttendanceHistory([]);
        setIsAttendedToday(false);
        setMonthlyCategories([]); // Clear categories on logout
        setWeeklyCategories([]); // Clear categories on logout
        return;
      }
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setPoints(0);
        setAttendanceHistory([]);
        setIsAttendedToday(false);
        setMonthlyCategories([]); // Clear categories if no token
        setWeeklyCategories([]); // Clear categories if no token
        return;
      }

      // Fetch user info (including points)
      try {
        const response = await fetch(`/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPoints(data.data.points);
          }
        } else {
          console.error("Failed to fetch user info (points)");
        }
      } catch (error) {
        console.error("Error fetching user info (points):", error);
      }

      // Fetch attendance history
      try {
        const response = await fetch(`/api/attendance/history`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAttendanceHistory(data.map(dateString => new Date(dateString)));
        }
      } catch (error) {
        console.error("Error fetching attendance history:", error);
      }

      // Check if attended today
      try {
        const response = await fetch(`/api/attendance/today`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setIsAttendedToday(data.attended);
        }
      } catch (error) {
        console.error("Error checking today's attendance:", error);
      }

      // Fetch consumption categories
      try {
        const response = await fetch(`/api/consumption/categories`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const fetchedMonthly = data.data.filter(cat => cat.type === 'MONTHLY');
            const fetchedWeekly = data.data.filter(cat => cat.type === 'WEEKLY');
            setMonthlyCategories(fetchedMonthly);
            setWeeklyCategories(fetchedWeekly);
          } else {
            // If fetch is ok but no data or success is false, set to empty
            setMonthlyCategories([]);
            setWeeklyCategories([]);
          }
        } else {
          console.error("Failed to fetch consumption categories:", response.statusText);
          // If fetch fails, set to empty
          setMonthlyCategories([]);
          setWeeklyCategories([]);
        }
      } catch (error) {
        console.error("Error fetching consumption categories:", error);
        // On error, set to empty
        setMonthlyCategories([]);
        setWeeklyCategories([]);
      }
    };
    fetchData();
  }, [currentUser]);

  

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <main className={styles.main}>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  apiMessage={apiMessage}
                  currentUser={currentUser}
                  monthlyCategories={monthlyCategories}
                  weeklyCurrentConsumption={weeklyCurrentConsumption}
                  weeklyTargetConsumption={weeklyTargetConsumption}
                  monthlyCurrentConsumption={monthlyCurrentConsumption}
                  monthlyTargetConsumption={monthlyTargetConsumption}
                  lastFeedback={lastFeedback}
                  points={points}
                  handleAttend={handleAttend}
                  attendanceHistory={attendanceHistory}
                  isAttendedToday={isAttendedToday}
                />
              } 
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/review-feed" element={<ReviewFeedPage />} />
            <Route 
              path="/consume-plan" 
              element={
                <ConsumePlanPage 
                  currentUser={currentUser}
                  monthlyCategories={monthlyCategories}
                  setMonthlyCategories={setMonthlyCategories}
                  weeklyCategories={weeklyCategories}
                  setWeeklyCategories={setWeeklyCategories}
                  submittedFeedback={submittedFeedback}
                  handleFeedbackSubmit={handleFeedbackSubmit}
                  weeklyCurrentConsumption={weeklyCurrentConsumption}
                  weeklyTargetConsumption={weeklyTargetConsumption}
                  monthlyCurrentConsumption={monthlyCurrentConsumption}
                  monthlyTargetConsumption={monthlyTargetConsumption}
                  lastFeedback={lastFeedback}
                  points={points}
                  handleAttend={handleAttend}
                />
              } 
            />
            <Route 
              path="/mypage" 
              element={
                <Mypage 
                  currentUser={currentUser}
                  monthlyCategories={monthlyCategories}
                  setMonthlyCategories={setMonthlyCategories}
                  monthlyCurrentConsumption={monthlyCurrentConsumption}
                  monthlyTargetConsumption={monthlyTargetConsumption}
                  lastFeedback={lastFeedback}
                  weeklyCurrentConsumption={weeklyCurrentConsumption}
                  weeklyTargetConsumption={weeklyTargetConsumption}
                  handleAttend={handleAttend}
                />
              } 
            />
            <Route path="/review-write" element={<ReviewWritePage />} />
            <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user/:username" element={<ProfileRedirector />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;