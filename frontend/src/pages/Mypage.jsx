import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Mypage.module.css';
import ReviewPopup from '../components/ReviewPopup';
import FollowListPopup from '../components/FollowListPopup';
import MyProfileMoreInfoPopup from '../components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup';
import NameChangePopup from '../components/NameChangePopup/NameChangePopup';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import NotificationItem from '../components/NotificationItem/NotificationItem';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Mypage = ({ 
  currentUser,
  monthlyCategories,
  lastFeedback,
  weeklyCurrentConsumption,
  weeklyTargetConsumption,
  weeklyCategories, // 추가된 prop
  setWeeklyCategories // 추가된 prop
}) => {
  const navigate = useNavigate();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  
  // 소비 기록하기 관련 상태
  const [selectedWeeklyCategoryIndex, setSelectedWeeklyCategoryIndex] = useState(0);
  const [inputAmount, setInputAmount] = useState('');
  const [updateType, setUpdateType] = useState('add'); // 'add' 또는 'set'

  const moreOptionsRef = useRef(null);
  const currentMonth = new Date().getMonth() + 1;

  const usernameToDisplay = currentUser ? currentUser.username : "USERNAME";
  const userInfoToDisplay = currentUser ? currentUser.email : "USERINFO_1";

  // --- Notification Logic from App.jsx ---
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) {
        setNotifications([]);
        return;
      }
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setNotifications([]);
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
  // --- End of Notification Logic ---

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
          const processedComments = comments ? comments.map(comment => comment.review).filter(Boolean) : [];
          const uniqueCommentedReviews = Array.from(new Map(processedComments.map(review => [review.id, review])).values());

          setMyReviewData(written || []);
          setLikedReviewData(liked || []);
          setBookmarkedReviewData(bookmarked || []);
          setCommentedReviewData(uniqueCommentedReviews);
          setFilteredReviews(written || []);
        } else {
          throw new Error(apiResponse.message || "Failed to fetch data");
        }
      } catch (error) {
        console.error(`Failed to fetch my page data:`, error);
        setMyReviewData([]);
        setLikedReviewData([]);
        setBookmarkedReviewData([]);
        setCommentedReviewData([]);
        setFilteredReviews([]);
      }
    };
    fetchMyPageData();
  }, [currentUser]);

  const getActiveDataForSearch = useCallback(() => {
    switch (activeTab) {
      case 'written': return myReviewData || [];
      case 'liked': return likedReviewData || [];
      case 'bookmarked': return bookmarkedReviewData || [];
      case 'commented': return commentedReviewData || [];
      default: return [];
    }
  }, [activeTab, myReviewData, likedReviewData, bookmarkedReviewData, commentedReviewData]);

  useEffect(() => {
    setSearchTerm("");
    setFilteredReviews(getActiveDataForSearch());
    setCurrentPage(1);
  }, [getActiveDataForSearch]);

  const handleSearchTermChange = (event) => setSearchTerm(event.target.value);

  const handleSearch = () => {
    const reviewsToFilter = getActiveDataForSearch();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const newFilteredReviews = reviewsToFilter.filter(review =>
      review.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredReviews(newFilteredReviews);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleSearch();
  };

  const updateReviewInStates = (reviewId, updateFn) => {
    const updater = (prev) => prev ? prev.map(r => r.id === reviewId ? updateFn(r) : r) : prev;
    setMyReviewData(updater);
    setLikedReviewData(updater);
    setBookmarkedReviewData(updater);
    setCommentedReviewData(updater);
    setSelectedReview(prev => prev && prev.id === reviewId ? updateFn(prev) : prev);
  };

  const openPopup = (review) => {
    setSelectedReview(review);
    setPopupOpen(true);
  };
  const closePopup = () => {
    setSelectedReview(null);
    setPopupOpen(false);
  };

  const handleLikeToggle = async (reviewId) => {
    // ... (existing implementation)
  };

  const handleBookmarkToggle = async (reviewId) => {
    // ... (existing implementation)
  };

  const handleAddComment = async (reviewId, content) => {
    // ... (existing implementation)
  };

  const monthlyCurrentConsumption = useMemo(() => {
    if (!Array.isArray(monthlyCategories)) return 0;
    return monthlyCategories.reduce((sum, category) => sum + (category.currentAmount || 0), 0);
  }, [monthlyCategories]);

  const monthlyTargetConsumption = useMemo(() => {
    if (!Array.isArray(monthlyCategories)) return 0;
    return monthlyCategories.reduce((sum, category) => sum + (category.targetAmount || 0), 0);
  }, [monthlyCategories]);

  const monthlyPercentage = monthlyTargetConsumption > 0 ? Math.round((monthlyCurrentConsumption / monthlyTargetConsumption) * 100) : 0;
  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;

  const getActiveData = useMemo(() => filteredReviews, [filteredReviews]);

  const getActiveDataInfo = () => {
    const data = getActiveData;
    const count = data ? data.length : 0;
    switch (activeTab) {
      case 'written': return { title: '작성한 리뷰', count };
      case 'liked': return { title: '좋아요한 리뷰', count };
      case 'bookmarked': return { title: '북마크한 리뷰', count };
      case 'commented': return { title: '댓글단 리뷰', count };
      default: return { title: '', count: 0 };
    }
  };

  // --- Pie Chart Data & Config ---
  const pieChartData = useMemo(() => {
    if (!monthlyCategories || monthlyCategories.filter(cat => cat.currentAmount > 0).length === 0) {
      return [{ name: '데이터 없음', value: 1, fill: '#E0E0E0' }];
    }
    return monthlyCategories
      .filter(cat => cat.currentAmount > 0)
      .map(cat => ({
        name: cat.name,
        value: cat.currentAmount
      }));
  }, [monthlyCategories]);

  const COLORS = ['#9BC4B0', '#AEC6CF', '#D3D3D3', '#F0F0F0', '#BDBBB6', '#C3CDE6'];

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className="label">{`${payload[0].name} : ${payload[0].value.toLocaleString()}원`}</p>
        </div>
      );
    }
    return null;
  };

  // --- Pagination Logic ---
  const itemsPerPage = 6;
  const totalPages = Math.ceil((getActiveData ? getActiveData.length : 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 4) * 4 + 1;
    const endPage = Math.min(startPage + 3, totalPages);

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
    const reviews = getActiveData;

    if (reviews === null) {
      return <div className={styles.reviewsWrapper}><p>리뷰를 불러오는 중입니다...</p></div>;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = reviews.slice(startIndex, startIndex + itemsPerPage);
    
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
    if (!getActiveData || getActiveData.length <= itemsPerPage) return null;
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

  // 소비 기록하기 관련 로직
  const handleCategoryChange = (e) => {
    setSelectedWeeklyCategoryIndex(parseInt(e.target.value, 10));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // 정수만 허용 (음수 포함)
    if (/^-?\d*$/.test(value) || value === '-') { // 음수 입력 시작을 위해 '-' 허용
      setInputAmount(value);
    }
  };

  const handleUpdateTypeChange = (e) => {
    setUpdateType(e.target.value);
  };

  const handleRecordConsumption = async () => {
    if (!currentUser || !currentUser.id) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (inputAmount === '' || inputAmount === '-' || isNaN(parseInt(inputAmount, 10))) {
      alert("유효한 금액을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const amount = parseInt(inputAmount, 10);
    const selectedCategory = weeklyCategories[selectedWeeklyCategoryIndex];

    if (!selectedCategory) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    let newCurrentAmount = selectedCategory.currentAmount;
    if (updateType === 'add') {
      newCurrentAmount += amount;
    } else { // updateType === 'set'
      newCurrentAmount = amount;
    }

    // 목표 금액을 초과하지 않도록 (음수 값은 허용)
    // 현재 금액이 0 미만이 되는 것을 방지
    if (newCurrentAmount < 0) {
        newCurrentAmount = 0;
    }
    // 목표 금액을 초과하는 경우 경고 (단, 음수 입력으로 인해 목표 금액이 초과되는 경우는 제외)
    if (newCurrentAmount > selectedCategory.targetAmount && amount > 0) {
      alert("현재 금액이 목표 금액을 초과할 수 없습니다.");
      return;
    }

    const updatedCategory = {
      ...selectedCategory,
      currentAmount: newCurrentAmount
    };

    try {
      const response = await fetch(`/api/consumption/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCategory)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWeeklyCategories(prev =>
            prev.map((cat, idx) =>
              idx === selectedWeeklyCategoryIndex ? updatedCategory : cat
            )
          );
          alert("소비 기록이 성공적으로 갱신되었습니다.");
          setInputAmount(''); // 입력 필드 초기화
        } else {
          alert(`소비 기록 갱신 실패: ${data.error?.message || '알 수 없는 오류'}`);
        }
      } else {
        const errorData = await response.json();
        alert(`소비 기록 갱신 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating consumption:", error);
      alert("소비 기록 갱신 중 오류가 발생했습니다.");
    }
  };

  // 현재 선택된 카테고리 정보
  const currentSelectedCategory = weeklyCategories[selectedWeeklyCategoryIndex];
  const beforeUpdateAmount = currentSelectedCategory ? currentSelectedCategory.currentAmount : 0;
  let afterUpdateAmount = beforeUpdateAmount;

  if (inputAmount !== '' && inputAmount !== '-' && !isNaN(parseInt(inputAmount, 10))) {
    const amountValue = parseInt(inputAmount, 10);
    if (updateType === 'add') {
      afterUpdateAmount = beforeUpdateAmount + amountValue;
    } else {
      afterUpdateAmount = amountValue;
    }
    if (afterUpdateAmount < 0) afterUpdateAmount = 0; // 0 미만 방지
  }

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
                                <div className={styles.username}>{usernameToDisplay}님</div>
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
                        <div className={styles.frame91}><div className={styles._4000}>4000</div></div>
                        <div className={styles._6000Pt}>승급까지 -6000PT</div>
                      </div>
                      <div className={styles.line4}></div>
                      <div className={styles.frame241}>
                        <div className={styles.frame210}>
                          <div className={styles.frame212} onClick={() => setShowFollowingPopup(true)}><div className={styles.div2}>팔로우</div></div>
                          <div className={styles.line42}></div>
                          <div className={styles.frame211} onClick={() => setShowFollowerPopup(true)}><div className={styles.div2}>팔로워</div></div>
                        </div>
                        <div className={styles.frame2112}>
                          <div className={styles.frame212}><div className={styles._100}>{followingCount}</div></div>
                          <div className={styles.line43}></div>
                          <div className={styles.frame211}><div className={styles._200}>{followersCount}</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame5} onClick={() => navigate('/review-write')}>
                    <div className={styles.a}>리뷰 작성</div>
                  </div>
                  <div className={styles.frame6} onClick={() => navigate('/consume-plan')}>
                    <div className={styles.a}>소비 계획</div>
                  </div>
                </div>
              </div>
              <div className={styles.notificationsCard}>
                <div className={styles.notificationsHeader}>알림</div>
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
          <div className={styles.frame8}>  
            <div className={styles.frame226}>
              <div className={styles.frame254}>
                <div className={styles.frame25}>
                  <div className={styles.frame196}>
                    <div className={styles._11}>{currentMonth}월 분야별 소비현황</div>
                    <div className={styles.line44}></div>
                  </div>
                  <div className={styles._112}>{currentMonth}월 소비현황</div>
                </div>
                <div className={styles.frame253}>
                   <div className={styles.mainChart}>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={styles.frame34}>
                    <div className={styles.frame252}>
                      {monthlyCategories && monthlyCategories.map((category, index) => (
                        <div className={styles.frame44} key={category.id}>
                          <div className={styles.frame26}>
                            <div className={styles.ellipseFill4} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <div className={styles.div5}>{category.name}</div>
                          </div>
                          <ProgressBar value={category.currentAmount} max={category.targetAmount} isThick={false} percentageColor={COLORS[index % COLORS.length]} />
                          <div className={styles.labelValue2}>{category.currentAmount}/{category.targetAmount}</div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.frame62} onClick={() => navigate('/consume-plan')}>
                      <div className={styles.a}>소비계획 수정하기</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame22}>
                <div className={styles.frame1962}>
                  <div className={styles._11}>{currentMonth}월 목표 소비금액</div>
                  <div className={styles.line44}></div>
                </div>
                <div className={styles.frame278}>
                  <div className={styles.frame422}>
                    <div className={styles.frame41}>
                      <div className={styles.div6}>이번 달의 목표금액</div>
                      <div className={styles.frame19_}>
                        <div className={styles.frame37_}>
                          <div className={styles.frame36__}>
                            <div className={styles.viewAmountWrapper_}>
                              <div className={styles._1420_}>{monthlyCurrentConsumption}</div>
                              <div className={styles._2020_}>/{monthlyTargetConsumption} 만원</div>
                            </div>
                          </div>
                          <ProgressBar
                            value={monthlyCurrentConsumption}
                            max={monthlyTargetConsumption}
                            label={`${monthlyPercentage}%`}
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
                      {lastFeedback && lastFeedback.nextMonthGoal ? (
                        <div className={styles.div8}>
                          <span>
                            <span className={styles.div8Span}>
                              {lastFeedback.date} 기준 다음 달 목표:
                              <br />
                            </span>
                            <span className={styles.div8Span4}>
                              {lastFeedback.nextMonthGoal}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className={styles.div8}>
                          <span>
                            <span className={styles.div8Span}>
                              지난 달의 목표 기록이 없습니다.
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.frame279}>
                    <div className={styles.div9}>지난 달의 피드백</div>
                    {lastFeedback ? (
                      <div className={styles.frame213}>
                        <div className={styles.frame271}>
                          <div className={styles.frame270}>
                            <div className={styles.frame372}>
                              <div className={styles.frame362}>
                                <div className={styles._240}>{lastFeedback.currentConsumption}</div>
                                <div className={styles._2003}>/{lastFeedback.targetConsumption} 만원</div>
                              </div>
                            </div>
                            <ProgressBar
                              value={lastFeedback.currentConsumption}
                              max={lastFeedback.targetConsumption}
                              isThick={false}
                              percentageColor="#dadee1"
                              label={`${Math.round((lastFeedback.currentConsumption / lastFeedback.targetConsumption) * 100)}%`}
                            />
                          </div>
                          <div className={styles.frame265}>
                            <div className={styles.frame267}>
                              <div className={styles.div10}>만족도</div>
                              <div className={styles.frame269}>
                                <div className={styles.frame266}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <div
                                      key={star}
                                      className={star <= lastFeedback.rating ? styles.ellipseFill5 : styles.ellipseFill6}
                                    ></div>
                                  ))}
                                </div>
                                <div className={styles._35}>
                                  <span>
                                    <span className={styles._35Span}>{lastFeedback.rating}</span>
                                    <span className={styles._35Span}>/5</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.feedbackText}>
                          {lastFeedback.text}
                        </div>
                      </div>
                    ) : (
                      <div className={styles.frame213}>
                        <p>지난 달의 피드백이 없습니다.</p>
                      </div>
                    )}
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
                              <div className={styles.viewAmountWrapper_}>
                                <div className={styles._1420_}>{weeklyCurrentConsumption}</div>
                                <div className={styles._2020_}>/{weeklyTargetConsumption} 만원</div>
                              </div>
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
                      {/* 기존 하드코딩된 주간 카테고리 목록 삭제 */}
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
                            {/* 카테고리 선택 드롭다운 */}
                            <select 
                              className={styles.categorySelect} 
                              value={selectedWeeklyCategoryIndex} 
                              onChange={handleCategoryChange}
                            >
                              {weeklyCategories.map((category, index) => (
                                <option key={category.id} value={index}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* 추가/갱신 라디오 버튼 */}
                        <div className={styles.updateTypeToggle}>
                          <label>
                            <input 
                              type="radio" 
                              value="add" 
                              checked={updateType === 'add'} 
                              onChange={handleUpdateTypeChange} 
                            /> 추가
                          </label>
                          <label>
                            <input 
                              type="radio" 
                              value="set" 
                              checked={updateType === 'set'} 
                              onChange={handleUpdateTypeChange} 
                            /> 갱신
                          </label>
                        </div>
                      </div>
                      <div className={styles.frame218}>
                        <div className={styles.amountInputWrapper}> {/* 새로운 div 추가 */}
                          {updateType === 'add' && <span className={styles.a3Span}>+</span>}
                          {/* 금액 입력 필드 */}
                          <input 
                            type="text" 
                            className={styles.amountInput} 
                            value={inputAmount} 
                            onChange={handleAmountChange} 
                            placeholder="0"
                          />
                          <span className={styles.a3Span}>만 원</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.frame217}>
                      <div className={styles.frame214}>
                        <div className={styles.frame26}>
                          <div className={styles.ellipseFill4}></div>
                          <div className={styles.div4}>갱신 전</div>
                        </div>
                        <ProgressBar 
                          value={beforeUpdateAmount} 
                          max={currentSelectedCategory ? currentSelectedCategory.targetAmount : 0} 
                          isThick={false} 
                          percentageColor="#c9d3d0" 
                        />
                        <div className={styles.frame49}>
                          <div className={styles.labelValue2}>{beforeUpdateAmount}/{currentSelectedCategory ? currentSelectedCategory.targetAmount : 0}</div>
                        </div>
                      </div>
                      <div className={styles.frame215}>
                        <div className={styles.frame26}>
                          <div className={styles.ellipseFill8}></div>
                          <div className={styles.div4}>갱신 후</div>
                        </div>
                        <ProgressBar 
                          value={afterUpdateAmount} 
                          max={currentSelectedCategory ? currentSelectedCategory.targetAmount : 0} 
                          isThick={false} 
                          percentageColor="#abcebe" 
                        />
                        <div className={styles.frame49}>
                          <div className={styles.labelValue6}>{afterUpdateAmount}/{currentSelectedCategory ? currentSelectedCategory.targetAmount : 0}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame62} onClick={handleRecordConsumption}>
                    <div className={styles.a}>소비 기록하기</div>
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
    
          {/* Search bar for Mypage */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="검색"
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchTermChange}
              onKeyDown={handleKeyDown}
            />
            <img src="/search_icon.svg" alt="Search" className={styles.searchIcon} onClick={handleSearch} />
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
          onClose={() => setShowFollowerPopup(false)} 
          title={`${usernameToDisplay}님의 팔로워 목록`} 
          username={usernameToDisplay} 
          listType="followers" 
        />
      )}
      {showFollowingPopup && (
        <FollowListPopup 
          onClose={() => setShowFollowingPopup(false)} 
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