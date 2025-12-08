import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './ConsumePlanPage.module.css';
import FeedbackPopup from '../../src/components/FeedbackPopup/FeedbackPopup';
import FollowListPopup from '../../src/components/FollowListPopup';
import InitializePopup from '../components/InitializePopup/InitializePopup';
import MyProfileMoreInfoPopup from '../components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup';
import NameChangePopup from '../components/NameChangePopup/NameChangePopup';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import UpdateConsumptionPopup from '../components/UpdateConsumptionPopup/UpdateConsumptionPopup';

const ConsumePlanPage = (props) => {
  const {
    currentUser,
    monthlyCategories = [], setMonthlyCategories,
    weeklyCategories = [], setWeeklyCategories,
    submittedFeedback, handleFeedbackSubmit,
    lastFeedback,
    points,
    handleAttend
  } = props;

  console.log("ConsumePlanPage props:", props); // Debugging line
  console.log("weeklyCategories:", weeklyCategories); // Debugging line
  console.log("monthlyCategories:", monthlyCategories); // Debugging line

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

  // States for adding new categories are now local to this component
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryTarget, setNewCategoryTarget] = useState(0);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  const [showAllWeeklyCategories, setShowAllWeeklyCategories] = useState(false);
  const [newWeeklyCategoryName, setNewWeeklyCategoryName] = useState('');
  const [newWeeklyCategoryTarget, setNewWeeklyCategoryTarget] = useState(0);
  const [showAddWeeklyCategoryInput, setShowAddWeeklyCategoryInput] = useState(false);

  // Popups for updating consumption are also managed here now
  const [showUpdateMonthlyConsumptionPopup, setShowUpdateMonthlyConsumptionPopup] = useState(false);
  const [showUpdateWeeklyConsumptionPopup, setShowUpdateWeeklyConsumptionPopup] = useState(false);

  // Handler for adding a new monthly category
  const handleAddCategory = async () => {
    if (!currentUser || !currentUser.id) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (newCategoryName && newCategoryTarget > 0) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
      try {
        const response = await fetch('/api/consumption/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: newCategoryName,
            type: 'MONTHLY',
            targetAmount: newCategoryTarget,
            currentAmount: 0,
            color: '#D3D3D3' // Default color
          })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refetch all categories to ensure consistency
            const fetchResponse = await fetch('/api/consumption/categories', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (fetchResponse.ok) {
              const fetchData = await fetchResponse.json();
              if (fetchData.success) {
                setMonthlyCategories(fetchData.data.filter(cat => cat.type === 'MONTHLY'));
              }
            }
            setNewCategoryName('');
            setNewCategoryTarget(0);
            setShowAddCategoryInput(false);
          } else {
            alert(data.message || "카테고리 추가 실패");
          }
        } else {
          alert("카테고리 추가 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Error adding category:", error);
        alert("카테고리 추가 중 오류가 발생했습니다.");
      }
    } else {
      alert('카테고리 이름과 목표 금액을 입력해주세요.');
    }
  };

  // Handler for adding a new weekly category
  const handleAddWeeklyCategory = async () => {
    if (!currentUser || !currentUser.id) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (newWeeklyCategoryName && newWeeklyCategoryTarget > 0) {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }
      try {
        const response = await fetch('/api/consumption/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: newWeeklyCategoryName,
            type: 'WEEKLY',
            targetAmount: newWeeklyCategoryTarget,
            currentAmount: 0,
            color: '#D3D3D3' // Default color
          })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Refetch all categories to ensure consistency
            const fetchResponse = await fetch('/api/consumption/categories', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (fetchResponse.ok) {
              const fetchData = await fetchResponse.json();
              if (fetchData.success) {
                setWeeklyCategories(fetchData.data.filter(cat => cat.type === 'WEEKLY'));
              }
            }
            setNewWeeklyCategoryName('');
            setNewWeeklyCategoryTarget(0);
            setShowAddWeeklyCategoryInput(false);
          } else {
            alert(data.message || "주간 카테고리 추가 실패");
          }
        } else {
          alert("주간 카테고리 추가 중 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("Error adding weekly category:", error);
        alert("주간 카테고리 추가 중 오류가 발생했습니다.");
      }
    } else {
      alert('주간 카테고리 이름과 목표 금액을 입력해주세요.');
    }
  };
  
  const getAssetForLevel = (points) => {
    if (points > 4000) return '/grow_assets/level5.svg';
    if (points > 3000) return '/grow_assets/level4.svg';
    if (points > 2000) return '/grow_assets/level3.svg';
    if (points > 1000) return '/grow_assets/level2.svg';
    return '/leaf_point_icon.svg'; // Default icon
  };

  const handleInitializeConfirm = () => {
    console.log("Initialize confirmed");
    setShowInitializePopup(false);
  };

  const handleFeedbackButtonClick = () => {
    setShowFeedbackPopup(true);
  };

  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // 피드백 팝업 상태
  const [showFollowerPopup, setShowFollowerPopup] = useState(false); // 팔로워 팝업 상태
  const [showFollowingPopup, setShowFollowingPopup] = useState(false); // 팔로잉 팝업 상태
  const [showInitializePopup, setShowInitializePopup] = useState(false); // 초기화 팝업 상태
  const [showMyProfileMoreInfoPopup, setShowMyProfileMoreInfoPopup] = useState(false); // 내 프로필 더보기 팝업 상태
  const [showNameChangePopup, setShowNameChangePopup] = useState(false); // 닉네임 변경 팝업 상태

  const [dDay, setDDay] = useState(0);
  const [monthEndDate, setMonthEndDate] = useState('');

  const [followersCount, setFollowersCount] = useState(123); // 임시 팔로워 수
  const [followingCount, setFollowingCount] = useState(456); // 임시 팔로잉 수

  const moreOptionsRef = useRef(null); // Ref for the more options container

  const usernameToDisplay = currentUser ? currentUser.username : "USERNAME";
  const userInfoToDisplay = currentUser ? currentUser.email : "USERINFO_1";

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
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    const lastDayOfMonth = new Date(year, month + 1, 0);
    setMonthEndDate(`${year}.${month + 1}.${lastDayOfMonth.getDate()}`);

    const diffTime = Math.abs(lastDayOfMonth.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDDay(diffDays);
  }, []);

  const weeklyPercentage = (weeklyTargetConsumption !== undefined && weeklyTargetConsumption > 0) ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;
  const monthlyPercentage = (monthlyTargetConsumption !== undefined && monthlyTargetConsumption > 0) ? Math.round((monthlyCurrentConsumption / monthlyTargetConsumption) * 100) : 0;

  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacksPerPage] = useState(4);

  const indexOfLastFeedback = currentPage * feedbacksPerPage;
  const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
  const currentFeedbacks = submittedFeedback.slice(indexOfFirstFeedback, indexOfFirstFeedback + feedbacksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(submittedFeedback.length / feedbacksPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <div className={styles.pagination}>
        {pageNumbers.map(number => (
          <div key={number} className={`${styles.frame184} ${currentPage === number ? styles.activePage : ''}`} onClick={() => paginate(number)}>
            <div className={styles._1_}>{number}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.div}>
      <div className={styles.ContentArea}>
        <div className={styles.mainContentArea}>
          <div className={styles.mainContentArea2}>
            <div className={styles.leftSidebar}>
              <div className={styles.userInfo}>
                <div className={styles.frame281}>
                  <div className={styles.frame280}>
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
                    <img className={styles.vector} src={getAssetForLevel(points)} alt="Level Icon" />
                    <div className={styles.frame91}>
                      <div className={styles._4000}>{points}</div>
                    </div>
                    <div className={styles._6000Pt}>승급까지 -6000PT</div>
                    <button className={styles.attendButton} onClick={handleAttend}>출석하기</button>
                  </div>
                </div>
                <div className={styles.followInfoContainer}>
                  <div className={styles.followRow}>
                    <div className={styles.followItem} onClick={() => setShowFollowerPopup(true)}>
                      <div className={styles.followLabel}>팔로워</div>
                    </div>
                    <div className={styles.followDivider}></div>
                    <div className={styles.followItem} onClick={() => setShowFollowingPopup(true)}>
                      <div className={styles.followLabel}>팔로잉</div>
                    </div>
                  </div>
                  <div className={styles.followRow}>
                    <div className={styles.followItem} onClick={() => setShowFollowerPopup(true)}>
                      <div className={styles.followCount}>{followersCount}</div>
                    </div>
                    <div className={styles.followDivider}></div>
                    <div className={styles.followItem} onClick={() => setShowFollowingPopup(true)}>
                      <div className={styles.followCount}>{followingCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame284}>
                <div className={styles.frame296}>
                  <div className={styles.line5}></div>
                  <div className={styles.frame283}>
                    <div className={styles.frame37}>
                      <div className={styles.frame36}>
                        <div className={styles._111}>{monthEndDate}</div>
                        <div className={styles.div2}>이번달 피드백까지</div>
                      </div>
                    </div>
                    <div className={styles.d30}>D-{dDay}</div>
                  </div>
                  <div className={styles.line4}></div>
                </div>
                <div className={styles.frame6} onClick={handleFeedbackButtonClick}>
                  <div className={styles.a}>피드백</div>
                </div>
                <div className={styles.frame6} onClick={() => setShowInitializePopup(true)}>
                  <div className={styles.a}>초기화</div>
                </div>
              </div>
            </div>

            <div className={styles.centralContent}>
              <div className={styles.frame8}>
                <div className={styles.frame226}>
                  <div className={styles.frame265}>
                    <div className={styles.div3}>주간 소비계획</div>
                    <div className={styles.line42}></div>
                    <div className={styles.frame276}>
                      <div className={styles.frame43}>
                        <div className={styles.frame41}>
                          <div className={styles.div4}>이번 주의 목표금액</div>
                          <div className={styles.frame19}>
                            <div className={styles.frame37}>
                              <div className={styles.frame36}>
                                <div className={styles.viewAmountWrapper}>
                                  <div className={styles._1420}>{weeklyCurrentConsumption}</div>
                                  <div className={styles._2020}>/{weeklyTargetConsumption} 만원</div>
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
                        <div className={styles.frame2732}>
                          <img className={styles.polygon13} src="/listup_icon.svg" alt="list" />
                          <div className={styles._11}>12월 분야별 소비금액</div>
                          <button onClick={() => setShowUpdateWeeklyConsumptionPopup(true)} className={styles.updateConsumptionButton}>
                            사용금액 갱신
                          </button>
                        </div>
                      </div>
                      <div className={styles.frame262}>
                        <div className={styles.frame261}>
                          <div className={styles.frame34}>
                            <div className={styles.frame252}>
                              <div className={styles.frame258}>
                                {weeklyCategories.slice(0, showAllWeeklyCategories ? weeklyCategories.length : 8).map(category => (
                                  <div className={styles.categoryItem} key={category.id}>
                                    <div className={styles.frame26}>
                                      <div className={styles.ellipseFill} style={{ backgroundColor: category.color }}></div>
                                      <div className={styles.div5}>{category.name}</div>
                                    </div>
                                    <ProgressBar value={category.current} max={category.target} isThick={false} percentageColor={category.color} />
                                    <div className={styles.labelValue2}>{category.current}/{category.target}</div>
                                  </div>
                                ))}
                                {showAddWeeklyCategoryInput && (
                                  <div className={styles.addCategoryInput}>
                                    <input
                                      type="text"
                                      placeholder="카테고리 이름"
                                      value={newWeeklyCategoryName}
                                      onChange={(e) => setNewWeeklyCategoryName(e.target.value)}
                                      className={styles.inputField}
                                    />
                                    <input
                                      type="number"
                                      placeholder="목표 금액"
                                      value={newWeeklyCategoryTarget}
                                      onChange={(e) => setNewWeeklyCategoryTarget(parseInt(e.target.value, 10) || 0)}
                                      className={styles.inputField}
                                    />
                                    <button onClick={handleAddWeeklyCategory} className={styles.saveButton}>저장</button>
                                  </div>
                                )}
                              </div>
                              <div className={styles.frame105}>
                                <div className={styles.frame102} onClick={() => setShowAllWeeklyCategories(!showAllWeeklyCategories)}>
                                  <div className={styles.div6}>{showAllWeeklyCategories ? '줄이기' : '더보기'}</div>
                                </div>
                                <div className={styles.frame103} onClick={() => setShowAddWeeklyCategoryInput(!showAddWeeklyCategoryInput)}>
                                  <div className={styles.div7}>{showAddWeeklyCategoryInput ? '취소' : '추가하기'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame197}>
                    <div className={styles.div3}>월간 소비계획</div>
                    <div className={styles.line43}></div>
                    <div className={styles.frame2622}>
                      <div className={styles.frame2612}>
                        <div className={styles.frame412}>
                          <div className={styles.div8}>이번 달의 목표금액</div>
                          <div className={styles.frame19}>
                            <div className={styles.frame37}>
                              <div className={styles.frame36}>
                                <div className={styles.viewAmountWrapper}>
                                  <div className={styles._1420}>{monthlyCurrentConsumption}</div>
                                  <div className={styles._2020}>/{monthlyTargetConsumption} 만원</div>
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
                        <div className={styles.frame2772}>
                          <div className={styles.frame2732}>
                            <img className={styles.polygon13} src="/listup_icon.svg" alt="list" />
                            <div className={styles._11}>12월 분야별 소비금액</div>
                            <button onClick={() => setShowUpdateMonthlyConsumptionPopup(true)} className={styles.updateConsumptionButton}>
                              사용금액 갱신
                            </button>
                          </div>
                          <div className={styles.frame34}>
                            <div className={styles.frame252}>
                              <div className={styles.frame258}>
                                {monthlyCategories.slice(0, showAllCategories ? monthlyCategories.length : 8).map(category => (
                                  <div className={styles.categoryItem} key={category.id}>
                                    <div className={styles.frame26}>
                                      <div className={styles.ellipseFill} style={{ backgroundColor: category.color }}></div>
                                      <div className={styles.div5}>{category.name}</div>
                                    </div>
                                    <ProgressBar value={category.current} max={category.target} isThick={false} percentageColor={category.color} />
                                    <div className={styles.labelValue2}>{category.current}/{category.target}</div>
                                  </div>
                                ))}
                                {showAddCategoryInput && (
                                  <div className={styles.addCategoryInput}>
                                    <input
                                      type="text"
                                      placeholder="카테고리 이름"
                                      value={newCategoryName}
                                      onChange={(e) => setNewCategoryName(e.target.value)}
                                      className={styles.inputField}
                                    />
                                    <input
                                      type="number"
                                      placeholder="목표 금액"
                                      value={newCategoryTarget}
                                      onChange={(e) => setNewCategoryTarget(parseInt(e.target.value, 10) || 0)}
                                      className={styles.inputField}
                                    />
                                    <button onClick={handleAddCategory} className={styles.saveButton}>저장</button>
                                  </div>
                                )}
                              </div>
                              <div className={styles.frame105}>
                                <div className={styles.frame102} onClick={() => setShowAllCategories(!showAllCategories)}>
                                  <div className={styles.div6}>{showAllCategories ? '줄이기' : '더보기'}</div>
                                </div>
                                <div className={styles.frame103} onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}>
                                  <div className={styles.div7}>{showAddCategoryInput ? '취소' : '추가하기'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.frame263}>
                        <div className={styles.frame268}>
                          <div className={styles.frame2722}>
                            <div className={styles.frame259}>
                              <div className={styles.div9}>지난 달의 피드백</div>
                            </div>
                            {lastFeedback ? (
                              <div className={styles.frame21}>
                                <div className={styles.frame271}>
                                  <div className={styles.frame270}>
                                    <div className={styles.frame373}>
                                    </div>
                                    <div className={styles.frame313}>
                                      <div className={styles.frame363}>
                                        <div className={styles._240}>{lastFeedback.currentConsumption}</div>
                                        <div className={styles._2002}>/{lastFeedback.targetConsumption} 만원</div>
                                      </div>
                                      <ProgressBar
                                        value={lastFeedback.currentConsumption}
                                        max={lastFeedback.targetConsumption}
                                        isThick={true}
                                        percentageColor="#dadee1"
                                        label={`${Math.round((lastFeedback.currentConsumption / lastFeedback.targetConsumption) * 100)}%`}
                                      />
                                    </div>
                                  </div>
                                  <div className={styles.frame2652}>
                                    <div className={styles.frame267}>
                                      <div className={styles.div10}>만족도</div>
                                      <div className={styles.frame269}>
                                        <div className={styles.frame266}>
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                              key={star}
                                              className={star <= lastFeedback.rating ? styles.ellipseFill2 : styles.ellipseFill3}
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
                                <div className={styles.div11}>
                                  <span>
                                    <span className={styles.div11Span}>
                                      {lastFeedback.date} 피드백
                                      <br />
                                    </span>
                                    <span className={styles.div11Span2}>
                                      <br />
                                    </span>
                                    <span className={styles.div11Span3}></span>
                                    <span className={styles.div11Span4}>
                                      {lastFeedback.text}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className={styles.frame21}>
                                <div className={styles.div11}>
                                  <span>
                                    <span className={styles.div11Span}>
                                      지난 달의 피드백이 없습니다.
                                    </span>
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={styles.frame2733}>
                            <div className={styles.frame259}>
                              <div className={styles.div9}>이번 달의 목표 기록</div>
                            </div>
                            <div className={styles.frame212}>
                              {lastFeedback && lastFeedback.nextMonthGoal ? (
                                <div className={styles.div11}>
                                  <span>
                                    <span className={styles.div11Span}>
                                      {lastFeedback.date} 기준 다음 달 목표:
                                      <br />
                                    </span>
                                    <span className={styles.div11Span4}>
                                      {lastFeedback.nextMonthGoal}
                                    </span>
                                  </span>
                                </div>
                              ) : (
                                <div className={styles.div11}>
                                  <span>
                                    <span className={styles.div11Span}>
                                      지난 달의 목표 기록이 없습니다.
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.frame242}>
            <div className={styles.line52}></div>
            <div className={styles.feedbackContainer}>
              <div className={styles.feedbackContainer}>
                <div className={styles.feedbackContentWrapper}>
                  <div className={styles.frame143}>
                    <div className={styles.frame236}>
                      <div className={styles.frame106}>
                        <div className={styles.a2}>피드백</div>
                      </div>
                      <div className={styles._202}>총 {submittedFeedback.length}건</div>
                    </div>
                  </div>
                  <div className={styles.frame201}>
                    <div className={styles.feedbackContentWrapperInner}>
                      <div className={styles.frame237}>
                        {currentFeedbacks.length > 0 ? (
                          currentFeedbacks.map((feedback, index) => (
                            <div key={index} className={styles.div12}>
                              <div className={styles.frame271}>
                                <div className={styles.frame270}>
                                  <div className={styles.frame373}>
                                    <div className={styles.frame363}>
                                      <div className={styles._240}>{feedback.currentConsumption}</div>
                                      <div className={styles._2002}>/{feedback.targetConsumption} 만원</div>
                                    </div>
                                    <div className={styles.frame312}>
                                      <div className={styles.labelValue3}>
                                        {feedback.targetConsumption > 0 ? `${Math.round((feedback.currentConsumption / feedback.targetConsumption) * 100)}%` : '0%'}
                                        {((feedback.currentConsumption / feedback.targetConsumption) > 1) && ' 초과'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.frame313}>
                                    <ProgressBar
                                      value={feedback.currentConsumption}
                                      max={feedback.targetConsumption}
                                      isThick={true}
                                      percentageColor="#dadee1"
                                      label={feedback.targetConsumption > 0 ? `${Math.round((feedback.currentConsumption / feedback.targetConsumption) * 100)}%` : '0%'}
                                    />
                                  </div>
                                </div>
                                <div className={styles.frame2652}>
                                  <div className={styles.frame267}>
                                    <div className={styles.div10}>만족도</div>
                                    <div className={styles.frame269}>
                                      <div className={styles.frame266}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <div
                                            key={star}
                                            className={star <= feedback.rating ? styles.ellipseFill2 : styles.ellipseFill3}
                                          ></div>
                                        ))}
                                      </div>
                                      <div className={styles._35}>
                                        <span>
                                          <span className={styles._35Span}>{feedback.rating}</span>
                                          <span className={styles._35Span}>/5</span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.div11}>
                                <span>
                                  <span className={styles.div11Span}>
                                    {feedback.date} 피드백
                                    <br />
                                  </span>
                                  <span className={styles.div11Span2}>
                                    <br />
                                  </span>
                                  <span className={styles.div11Span3}></span>
                                  <span className={styles.div11Span4}>
                                    {feedback.text}
                                  </span>
                                </span>
                                {feedback.nextMonthGoal && (
                                  <div className={styles.nextMonthGoalDisplay}>
                                    <span>
                                      <span className={styles.div11Span}>
                                        <br />
                                        다음 달 목표:
                                        <br />
                                      </span>
                                      <span className={styles.div11Span4}>
                                        {feedback.nextMonthGoal}
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.div11}>
                            <span>
                              <span className={styles.div11Span}>
                                아직 작성된 피드백이 없습니다.
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={styles.frame2222}>
                        <div className={styles.frame191_}>
                          <img className={styles.group20953} src="/leftleft_icon.svg" alt="<<" />
                          <img className={styles.group20953} src="/left_icon.svg" alt="<" />
                        </div>
                        {renderPageNumbers()}
                        <div className={styles.frame191_}>
                          <img className={styles.group20953} src="/right_icon.svg" alt=">" />
                          <img className={styles.group20953} src="/rightright_icon.svg" alt=">>" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rectangle8}></div>
      <img className={styles.rectangle10} src="/rectangle-100.svg" alt="Rectangle" />
      {showFeedbackPopup && <FeedbackPopup
        onClose={() => setShowFeedbackPopup(false)}
        onSubmit={handleFeedbackSubmit}
        monthEndDate={monthEndDate}
        monthlyCategories={monthlyCategories}
        monthlyCurrentConsumption={monthlyCurrentConsumption}
        monthlyTargetConsumption={monthlyTargetConsumption}
        monthlyPercentage={monthlyPercentage}
      />}
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
      {showInitializePopup && (
        <InitializePopup
          onClose={() => setShowInitializePopup(false)}
          onConfirm={handleInitializeConfirm}
        />
      )}
      {showNameChangePopup && (
        <NameChangePopup
          onClose={() => setShowNameChangePopup(false)}
          onConfirm={(newUsername) => {
            console.log("New username:", newUsername);
            setShowNameChangePopup(false);
          }}
          currentUsername={usernameToDisplay}
        />
      )}
      {showUpdateWeeklyConsumptionPopup && (
        <UpdateConsumptionPopup
          onClose={() => setShowUpdateWeeklyConsumptionPopup(false)}
          title="주간 사용 금액 갱신"
          categories={weeklyCategories}
          setCategories={setWeeklyCategories}
        />
      )}
      {showUpdateMonthlyConsumptionPopup && (
        <UpdateConsumptionPopup
          onClose={() => setShowUpdateMonthlyConsumptionPopup(false)}
          title="월간 사용 금액 갱신"
          categories={monthlyCategories}
          setCategories={setMonthlyCategories}
        />
      )}
    </div>
  );
};

export default ConsumePlanPage;