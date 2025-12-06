import React, { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import styles from "./App.module.css";
import { Header } from "./components/Header/Header";
import ProfilePage from "./pages/ProfilePage"; // Import the new ProfilePage
import { ConsumptionStatus } from "./components/ConsumptionStatus/ConsumptionStatus";
import { VisitHistory } from "./components/VisitHistory/VisitHistory"; // Import VisitHistory
import { ShoppingList } from "./components/ShoppingList/ShoppingList";
import { RecommendedReviews } from "./components/RecommendedReviews/RecommendedReviews";
import { ReviewFeedPage } from "./pages/ReviewFeedPage"; // Import the new page
import ConsumePlanPage from "./pages/ConsumePlanPage"; // Import ConsumePlanPage
import Mypage from "./pages/Mypage"; // Import Mypage
import ReviewWritePage from "./pages/ReviewWritePage"; // Import ReviewWritePage
import ProfileRedirector from "./components/ProfileRedirector/ProfileRedirector"; // Import ProfileRedirector
import LoginPage from "./pages/LoginPage"; // Import LoginPage
import SignupPage from "./pages/SignupPage"; // Import SignupPage

import MyProfileMoreInfoPopup from "./components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup"; // Import MyProfileMoreInfoPopup
import NameChangePopup from "./components/NameChangePopup/NameChangePopup"; // Import NameChangePopup
import ReviewPopup from "./components/ReviewPopup"; // Import ReviewPopup
import NotificationItem from "./components/NotificationItem/NotificationItem"; // Import NotificationItem

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
  handleAttend
}) => { // Remove notifications prop
  const navigate = useNavigate(); // useNavigate 훅 초기화
  const [showMyProfileMoreInfoPopup, setShowMyProfileMoreInfoPopup] = useState(false);
  const [showNameChangePopup, setShowNameChangePopup] = useState(false);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const moreOptionsRef = useRef(null);

  // State for ReviewPopup
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

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

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;

      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setNotifications(data.data);
          }
        } else {
          console.error("Failed to fetch notifications:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    // Optionally, set up an interval to refetch notifications periodically
    // const intervalId = setInterval(fetchNotifications, 60000); // Fetch every minute
    // return () => clearInterval(intervalId);
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
      } else {
        console.error("Failed to mark notification as read:", response.statusText);
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
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          console.error(`Failed to mark notification ${id} as read:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
      }
    }

    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleNameChangeConfirm = (newUsername) => {
    console.log("New username from HomePage:", newUsername);
    // Here you would typically dispatch an action to update the username in the backend
    // and then update the currentUser state in App.jsx
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
        id: new Date().getTime(), // dummy id
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

  // State for Review Feed
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-indexed pages
  const [totalPages, setTotalPages] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);

  const fetchReviews = async (page) => {
    setLoadingReviews(true);
    setErrorReviews(null);
    try {
      const token = localStorage.getItem('jwtToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(`/api/reviews?page=${page}&sort=createDate,desc`, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setReviews(data.data.content);
        setTotalPages(data.data.totalPages);
      } else {
        setErrorReviews(data.error?.message || "Failed to fetch reviews.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
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

  // Dummy review data for HomePage's hardcoded blocks
  const dummyReview = {
    id: 1, // Unique ID
    author: { username: "USERNAME" },
    title: "스노우쉴드 롱패딩",
    createDate: new Date(),
    category: "의류",
    content: "패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만 입어도 충분히 한겨울 기온을 버틸 정도라서 요즘 거의 매일 입고 다닙니다. 지퍼도 부드럽게 잘 올라가고 주머니 털 안감도 포근해서 만족스러워요. 전체적으로 착용감이 편안해서 오래 입고 있어도 부담이 없고, 바람 부는 날에도 체온을 잘 유지해줘서 외출할 때마다 든든합니다. 디자인도 깔끔해서 어떤 옷과 매치해도 잘 어울려 데일리 아우터로 손색이 없어요. 개인적으로 이번 시즌에 산 옷 중 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다",
    productLink: "제품 링크",
    likeCount: 10,
    commentCount: 10,
    bookmarkCount: 10,
    isLiked: false,
    isBookmarked: false,
    comments: []
  };

  return (
    <>
      <strong>Backend-API-Test:</strong> {apiMessage}
    
    <div className={styles.backgroundRectangle}></div> {/* 새로 추가 */}
    {/* Corresponds to rectangle-11 */}
    <div className={styles.mainContentArea}>
      {/* Corresponds to frame-193 */}
      <div className={styles.frame193}>
        <div className={styles.frame192}> {/* Corresponds to frame-192 */}
          <div className={styles.headerRow}> {/* 새로운 div */}
            <div className={styles.usernameTitle}>
              {currentUser?.username ? `${currentUser.username}님` : 'Guest'}의 소비현황
            </div>
            <div className={styles.frame282}>
              <img className={styles.vector} src="/leaf_point_icon.svg" alt="Leaf Point Icon" />
              <div className={styles.frame914}>
                <div className={styles._4000}>{points}</div>
              </div>
              <div className={styles._6000pt}>승급까지 -6000PT</div>
            </div>
          </div>
          <div className={styles.div2Wrapper}> {/* Corresponds to div2 */}
            <div className={styles.frame45}> {/* Corresponds to frame-45 */}
              <div className={styles.frame6}> {/* Corresponds to frame-6 */}
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
              </div>
              {/* New container for VisitHistory and Attend button */}
              <VisitHistory onAttend={handleAttend} currentUser={currentUser} /> {/* Render VisitHistory here */}
              {/* Other elements from frame-45 if any */}
            </div>
            <div className={styles.line1}></div> {/* Corresponds to line-1 */}
          </div>
        </div>
        <div className={styles.frame48}> {/* Corresponds to frame-48 */}
          <div className={styles.frame207}> {/* Corresponds to frame-207 */}
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
              <div className={styles.notificationsList}> {/* New div for scrollable list */}
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

      {/* Corresponds to frame-142 */}
      <div className={styles.frame142}>
        <div className={styles.line42}></div> {/* Corresponds to line-42 */}
        <div className={styles.frame117}> {/* Corresponds to frame-117 */}
          <ShoppingList />
          <RecommendedReviews openReviewPopup={openReviewPopup} />
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
                reviews.map(review => (
                  <ReviewCard key={review.id} review={review} onClick={openReviewPopup} styles={styles} />
                ))
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
  const [user, setUser] = useState({ username: 'Consight', userInfo: '콘사이트에 오신 것을 환영합니다!' });
  const [apiMessage, setApiMessage] = useState("Loading...");
  const [currentUser, setCurrentUser] = useState(null); // Initialize to null
  const [monthlyCategories, setMonthlyCategories] = useState([]);
  const [weeklyCategories, setWeeklyCategories] = useState([
    { id: 1, name: '식비', current: 5, target: 10, color: '#A7C7E7' }, // Desaturated Blue
    { id: 2, name: '교통', current: 2, target: 3, color: '#B0E0E6' }, // Desaturated Green
    { id: 3, name: '쇼핑', current: 7, target: 8, color: '#D8F2D0' }, // Desaturated Light Green
    { id: 4, name: '문화생활', current: 1, target: 4, color: '#FFFACD' }, // Desaturated Yellow
  ]);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [points, setPoints] = useState(4000); // 포인트 상태 추가

  // Function to validate token with backend
  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/reviews/me', { // Using /api/reviews/me as an authenticated endpoint
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok; // True if 200 OK, false otherwise (e.g., 401)
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };

  // Effect to initialize currentUser from localStorage and validate token
  useEffect(() => {
    const initializeUser = async () => {
      const storedToken = localStorage.getItem('jwtToken');
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');

      if (storedToken && storedUsername && storedEmail) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setCurrentUser({ username: storedUsername, email: storedEmail, id: 1 });
        } else {
          // Token is invalid, clear localStorage
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null); // No stored token, ensure currentUser is null
      }
    };
    initializeUser();
  }, []); // Run only once on mount

  const fetchPoints = async () => {
    if (!currentUser || !currentUser.id) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/attendance/info?userId=${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPoints(data.points);
      } else {
        console.error("Failed to fetch points");
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [currentUser]);

  const handleAttend = async () => {
    if (!currentUser || !currentUser.id) {
      alert("로그인이 필요합니다.");
      return false;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return false;
    }

    try {
      const response = await fetch(`/api/attendance/check?userId=${currentUser.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const resultMessage = await response.text();
      alert(resultMessage);

      if (response.ok) {
        fetchPoints();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error during attendance check:", error);
      alert("출석 체크 중 오류가 발생했습니다.");
      return false;
    }
  };

  // ConsumePlanPage related states and handlers
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const handleFeedbackSubmit = (feedbackData) => {
    setSubmittedFeedback(prev => [...prev, feedbackData]);
    setLastFeedback(feedbackData); // Update lastFeedback with the newly submitted feedback
  };

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryTarget, setNewCategoryTarget] = useState(0);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryTarget > 0) {
      setMonthlyCategories(prev => [...prev, { id: prev.length + 1, name: newCategoryName, current: 0, target: newCategoryTarget, color: '#D3D3D3' }]); // Desaturated Gray
      setNewCategoryName('');
      setNewCategoryTarget(0);
      setShowAddCategoryInput(false);
    } else {
      alert('카테고리 이름과 목표 금액을 입력해주세요.');
    }
  };

  const [showUpdateMonthlyConsumptionPopup, setShowUpdateMonthlyConsumptionPopup] = useState(false);

  const [showAllWeeklyCategories, setShowAllWeeklyCategories] = useState(false);
  const [newWeeklyCategoryName, setNewWeeklyCategoryName] = useState('');
  const [newWeeklyCategoryTarget, setNewWeeklyCategoryTarget] = useState(0);
  const [showAddWeeklyCategoryInput, setShowAddWeeklyCategoryInput] = useState(false);

  const handleAddWeeklyCategory = () => {
    if (newWeeklyCategoryName && newWeeklyCategoryTarget > 0) {
      setWeeklyCategories(prev => [...prev, { id: prev.length + 1, name: newWeeklyCategoryName, current: 0, target: newWeeklyCategoryTarget, color: '#D3D3D3' }]); // Desaturated Gray
      setNewWeeklyCategoryName('');
      setNewWeeklyCategoryTarget(0);
      setShowAddWeeklyCategoryInput(false);
    } else {
      alert('주간 카테고리 이름과 목표 금액을 입력해주세요.');
    }
  };

  const [showUpdateWeeklyConsumptionPopup, setShowUpdateWeeklyConsumptionPopup] = useState(false);

  // Calculate total weekly consumption and target
  const weeklyCurrentConsumption = useMemo(() => {
    return weeklyCategories.reduce((sum, category) => sum + category.current, 0);
  }, [weeklyCategories]);

  const weeklyTargetConsumption = useMemo(() => {
    return weeklyCategories.reduce((sum, category) => sum + category.target, 0);
  }, [weeklyCategories]);

  // Calculate total monthly consumption and target
  const monthlyCurrentConsumption = useMemo(() => {
    return monthlyCategories.reduce((sum, category) => sum + category.current, 0);
  }, [monthlyCategories]);

  const monthlyTargetConsumption = useMemo(() => {
    return monthlyCategories.reduce((sum, category) => sum + category.target, 0);
  }, [monthlyCategories]);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.text())
      .then(setApiMessage)
      .catch(err => console.error("Failed to fetch API message:", err));
  }, []);

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
                  showAllCategories={showAllCategories}
                  setShowAllCategories={setShowAllCategories}
                  newCategoryName={newCategoryName}
                  setNewCategoryName={setNewCategoryName}
                  newCategoryTarget={newCategoryTarget}
                  setNewCategoryTarget={setNewCategoryTarget}
                  showAddCategoryInput={showAddCategoryInput}
                  setShowAddCategoryInput={setShowAddCategoryInput}
                  handleAddCategory={handleAddCategory}
                  showUpdateMonthlyConsumptionPopup={showUpdateMonthlyConsumptionPopup}
                  setShowUpdateMonthlyConsumptionPopup={setShowUpdateMonthlyConsumptionPopup}
                  weeklyCategories={weeklyCategories}
                  setWeeklyCategories={setWeeklyCategories}
                  showAllWeeklyCategories={showAllWeeklyCategories}
                  setShowAllWeeklyCategories={setShowAllWeeklyCategories}
                  newWeeklyCategoryName={newWeeklyCategoryName}
                  setNewWeeklyCategoryName={setNewWeeklyCategoryName}
                  newWeeklyCategoryTarget={newWeeklyCategoryTarget}
                  setNewWeeklyCategoryTarget={newWeeklyCategoryTarget}
                  showAddWeeklyCategoryInput={showAddWeeklyCategoryInput}
                  setShowAddWeeklyCategoryInput={setShowAddWeeklyCategoryInput}
                  handleAddWeeklyCategory={handleAddWeeklyCategory}
                  showUpdateWeeklyConsumptionPopup={showUpdateWeeklyConsumptionPopup}
                  setShowUpdateWeeklyConsumptionPopup={setShowUpdateWeeklyConsumptionPopup}
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
                  monthlyCurrentConsumption={monthlyCurrentConsumption}
                  monthlyTargetConsumption={monthlyTargetConsumption}
                  lastFeedback={lastFeedback}
                  weeklyCurrentConsumption={weeklyCurrentConsumption}
                  weeklyTargetConsumption={weeklyTargetConsumption}
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
