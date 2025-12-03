import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './ConsumePlanPage.module.css';
import FeedbackPopup from '../../src/components/FeedbackPopup/FeedbackPopup'; // FeedbackPopup import
import FollowListPopup from '../../src/components/FollowListPopup'; // FollowListPopup import
import InitializePopup from '../components/InitializePopup/InitializePopup'; // InitializePopup import
import MyProfileMoreInfoPopup from '../components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup'; // MyProfileMoreInfoPopup import
import NameChangePopup from '../components/NameChangePopup/NameChangePopup'; // NameChangePopup import
import { ProgressBar } from '../components/ProgressBar/ProgressBar';

import UpdateConsumptionPopup from '../components/UpdateConsumptionPopup/UpdateConsumptionPopup'; // UpdateConsumptionPopup import

const ConsumePlanPage = ({ currentUser }) => {
  const [targetAmount, setTargetAmount] = useState(20); // 초기 목표 금액
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // 피드백 팝업 상태
  const [showFollowerPopup, setShowFollowerPopup] = useState(false); // 팔로워 팝업 상태
  const [showFollowingPopup, setShowFollowingPopup] = useState(false); // 팔로잉 팝업 상태
  const [showInitializePopup, setShowInitializePopup] = useState(false); // 초기화 팝업 상태
  const [showMyProfileMoreInfoPopup, setShowMyProfileMoreInfoPopup] = useState(false); // 내 프로필 더보기 팝업 상태
  const [showNameChangePopup, setShowNameChangePopup] = useState(false); // 닉네임 변경 팝업 상태


// 사용자 레벨 및 포인트 상태
const [level, setLevel] = useState(1);
const [points, setPoints] = useState(0);

// 포인트에 따라 레벨 에셋을 결정하는 함수
const getAssetForLevel = (currentPoints) => {
  if (currentPoints >= 100000) {
    return "/grow_assets/level5.svg";
  } else if (currentPoints >= 50000) {
    return "/grow_assets/level4.svg";
  } else if (currentPoints >= 30000) {
    return "/grow_assets/level3.svg";
  } else if (currentPoints >= 10000) {
    return "/grow_assets/level2.svg";
  } else {
    return "/leaf_point_icon.svg"; // Level 1
  }
};

// 출석하기 버튼 클릭 핸들러
const handleAttend = () => {
  setPoints((prevPoints) => {
    const newPoints = prevPoints + 10;

    // 레벨 업데이트 로직 (필요시)
    // setLevel(calculateLevel(newPoints)); // calculateLevel 함수가 있다면

    alert(`출석이 기록되었습니다! ${newPoints} 포인트 획득!`);
    return newPoints;
  });
};



  const [followersCount, setFollowersCount] = useState(123); // 임시 팔로워 수
  const [followingCount, setFollowingCount] = useState(456); // 임시 팔로잉 수
  const [followersList, setFollowersList] = useState([ // 임시 팔로워 목록
    { username: "followerA", email: "followerA@example.com" },
    { username: "followerB", email: "followerB@example.com" },
  ]);
  const [followingList, setFollowingList] = useState([ // 임시 팔로잉 목록
    { username: "followingX", email: "followingX@example.com" },
    { username: "followingY", email: "followingY@example.com" },
    { username: "followingZ", email: "followingZ@example.com" },
  ]);

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

  const [isMonthlyEditing, setIsMonthlyEditing] = useState(false); // 월간 수정 모드 여부

  const [weeklyCategories, setWeeklyCategories] = useState([
    { id: 1, name: '식비', current: 30, target: 100, color: '#dbe4e1' },
    { id: 2, name: '교통비', current: 30, target: 100, color: '#e6e9eb' },
    { id: 3, name: '주거비', current: 50, target: 150, color: '#c8d9d2' },
    { id: 4, name: '문화생활', current: 20, target: 80, color: '#a8c9b9' },
    { id: 5, name: '의류', current: 10, target: 50, color: '#7daab3' },
    { id: 6, name: '통신비', current: 10, target: 50, color: '#dbe4e1' },
    { id: 7, name: '교육', current: 10, target: 50, color: '#e6e9eb' },
    { id: 8, name: '기타', current: 10, target: 50, color: '#c8d9d2' },
  ]);
  const [showAllWeeklyCategories, setShowAllWeeklyCategories] = useState(false); // "더보기" 상태
  const [newWeeklyCategoryName, setNewWeeklyCategoryName] = useState('');
  const [newWeeklyCategoryTarget, setNewWeeklyCategoryTarget] = useState(0);
  const [showAddWeeklyCategoryInput, setShowAddWeeklyCategoryInput] = useState(false); // "추가하기" 입력 필드 표시 여부
  const [showUpdateWeeklyConsumptionPopup, setShowUpdateWeeklyConsumptionPopup] = useState(false); // 주간 사용금액 갱신 팝업 상태

  const [monthlyCategories, setMonthlyCategories] = useState([
    { id: 1, name: '식비', current: 30, target: 100, color: '#dbe4e1' },
    { id: 2, name: '교통비', current: 30, target: 100, color: '#e6e9eb' },
    { id: 3, name: '주거비', current: 50, target: 150, color: '#c8d9d2' },
    { id: 4, name: '문화생활', current: 20, target: 80, color: '#a8c9b9' },
    { id: 6, name: '의류', current: 10, target: 50, color: '#dbe4e1' },
    { id: 7, name: '통신비', current: 10, target: 50, color: '#e6e9eb' },
    { id: 8, name: '교육', current: 10, target: 50, color: '#c8d9d2' },
  ]);
  const [showAllCategories, setShowAllCategories] = useState(false); // "더보기" 상태
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryTarget, setNewCategoryTarget] = useState(0);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false); // "추가하기" 입력 필드 표시 여부

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryTarget > 0) {
      setMonthlyCategories(prevCategories => [
        ...prevCategories,
        { id: prevCategories.length + 1, name: newCategoryName, current: 0, target: newCategoryTarget, color: '#cccccc' } // 기본 색상
      ]);
      setNewCategoryName('');
      setNewCategoryTarget(0);
      setShowAddCategoryInput(false);
    } else {
      alert('카테고리 이름과 목표 금액을 올바르게 입력해주세요.');
    }
  };

  const handleAddWeeklyCategory = () => {
    if (newWeeklyCategoryName && newWeeklyCategoryTarget > 0) {
      setWeeklyCategories(prevCategories => [
        ...prevCategories,
        { id: prevCategories.length + 1, name: newWeeklyCategoryName, current: 0, target: newWeeklyCategoryTarget, color: '#cccccc' } // 기본 색상
      ]);
      setNewWeeklyCategoryName('');
      setNewWeeklyCategoryTarget(0);
      setShowAddWeeklyCategoryInput(false);
    } else {
      alert('카테고리 이름과 목표 금액을 올바르게 입력해주세요.');
    }
  };

  const handleUpdateWeeklyConsumption = () => {
    setShowUpdateWeeklyConsumptionPopup(true);
  };

  const handleInitializeConfirm = () => {
    // 초기화 로직을 여기에 추가하세요.
    console.log("소비 계획을 초기화합니다.");
    setShowInitializePopup(false);
  };

  const weeklyCurrentConsumption = useMemo(() => {
    return weeklyCategories.reduce((sum, category) => sum + category.current, 0);
  }, [weeklyCategories]);

  const weeklyTargetConsumption = useMemo(() => {
    return weeklyCategories.reduce((sum, category) => sum + category.target, 0);
  }, [weeklyCategories]);

 
  const monthlyCurrentConsumption = useMemo(() => {
    return monthlyCategories.reduce((sum, category) => sum + category.current, 0);
  }, [monthlyCategories]);

  const monthlyTargetConsumption = useMemo(() => {
    return monthlyCategories.reduce((sum, category) => sum + category.target, 0);
  }, [monthlyCategories]);

  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;
  const monthlyPercentage = monthlyTargetConsumption > 0 ? Math.round((monthlyCurrentConsumption / monthlyTargetConsumption) * 100) : 0;

  return (
    <div className={styles.div}> {/* 전체 Grid 컨테이너 */}
      
    <div className={styles.ContentArea}>
      <div className={styles.mainContentArea}> {/* 메인 콘텐츠 영역 */}
        <div className={styles.mainContentArea2}>
        <div className={styles.leftSidebar}> {/* 좌측 사이드바 */}
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
                <button className={styles.attendButton} onClick={handleAttend}>출석하기</button> {/* 출석하기 버튼 추가 */}
              </div>
            </div>
            {/* 팔로우/팔로워 버튼 추가 */}
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
                    <div className={styles._111}>11.1</div>
                    <div className={styles.div2}>이번달 피드백까지</div>
                  </div>
                </div>
                <div className={styles.d30}>D-30</div>
              </div>
              <div className={styles.line4}></div>
            </div>
            <div className={styles.frame6} onClick={() => setShowFeedbackPopup(true)}> {/* 피드백 버튼 클릭 이벤트 추가 */}
              <div className={styles.a}>피드백</div>
            </div>
            <div className={styles.frame6} onClick={() => setShowInitializePopup(true)}>
              <div className={styles.a}>초기화</div>
            </div>
          </div>
        </div>

        <div className={styles.centralContent}> {/* 중앙 콘텐츠 */}
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
                <button onClick={handleUpdateWeeklyConsumption} className={styles.updateConsumptionButton}>
                  사용금액 갱신
                </button>
                    </div>
                
                 <div className={styles.frame2732}>
                        <img className={styles.polygon13} src="/listup_icon.svg" alt="list" />
                        <div className={styles._11}>11월 목표 소비금액</div>
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
                        <div className={styles._11}>11월 목표 소비금액</div>
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
                        <div className={styles.frame21}>
                          <div className={styles.frame271}>
                            <div className={styles.frame270}>
                              <div className={styles.frame373}>
                                
                                
                              </div>
                              <div className={styles.frame313}>
                                <div className={styles.frame363}>
                                  <div className={styles._240}>240</div>
                                  <div className={styles._2002}>/200 만원</div>
                                </div>
                                <ProgressBar
                                  value={240}
                                  max={200}
                                  isThick={true}
                                  percentageColor="#dadee1"
                                  label="120% 초과"
                                />
                              </div>
                            </div>
                            <div className={styles.frame2652}>
                              <div className={styles.frame267}>
                                <div className={styles.div10}>만족도</div>
                                <div className={styles.frame269}>
                                  <div className={styles.frame266}>
                                    <div className={styles.ellipseFill2}></div>
                                    <div className={styles.ellipseFill2}></div>
                                    <div className={styles.ellipseFill2}></div>
                                    <div className={styles.ellipseFill3}></div>
                                    <div className={styles.ellipseFill3}></div>
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
                          <div className={styles.div11}>
                            <span>
                              <span className={styles.div11Span}>
                                사용자 피드백
                                <br />
                              </span>
                              <span className={styles.div11Span2}>
                                <br />
                              </span>
                              <span className={styles.div11Span3}></span>
                                <span className={styles.div11Span4}>
                                  이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                                  특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문
                                  횟수가 늘었고, 가을 신상 의류를 충동적으로 구매한 것이
                                  큰 원인입니다. 소비 알림을 받았지만, &#039;이번 한
                                  번만&#039;이라는 생각으로 자제를 못 했습니다.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      <div className={styles.frame2733}>
                        <div className={styles.frame259}>
                          <div className={styles.div9}>이번 달의 목표 기록</div>
                        </div>
                        <div className={styles.frame212}>
                          <div className={styles.div11}>
                            <span>
                              <span className={styles.div11Span}>
                                제목
                                <br />
                              </span>
                              <span className={styles.div11Span2}>
                                <br />
                              </span>
                              <span className={styles.div11Span3}></span>
                              <span className={styles.div11Span4}>
                                이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                                특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문
                                횟수가 늘었고, 가을 신상 의류를 충동적으로 구매한 것이
                                큰 원인입니다. 소비 알림을 받았지만, &#039;이번 한
                                번만&#039;이라는 생각으로 자제를 못 했습니다.
                              </span>
                            </span>
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
        </div>

              <div className={styles.frame242}>
        <div className={styles.line52}></div>
        <div className={styles.feedbackContainer}> {/* 새로운 div 추가 */}
          <div className={styles.feedbackContainer}> {/* 새로운 div 추가 */}
            <div className={styles.feedbackContentWrapper}> {/* 새로운 div 추가 */}
              <div className={styles.frame143}>
                <div className={styles.frame236}>
                  <div className={styles.frame106}>
                    <div className={styles.a2}>피드백</div>
                  </div>
                  <div className={styles._202}>총 20건</div>
                </div>
              </div>
              <div className={styles.frame201}>
                <div className={styles.feedbackContentWrapperInner}> {/* 새로운 div 추가 */}
                  <div className={styles.frame237}>
                    <div className={styles.frame286}>
                      <div className={styles.frame240}>
                        <div className={styles.frame287}>
                          <div className={styles.frame239}>
                            <div className={styles.frame232}>
                              <div className={styles.frame106}>
                                <div className={styles.a3}>2025년 11월</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.div12}>
                            <div className={styles.frame271}>
                              <div className={styles.frame270}>
                                <div className={styles.frame373}>
                                  <div className={styles.frame363}>
                                    <div className={styles._240}>240</div>
                                    <div className={styles._2002}>/200 만원</div>
                                  </div>
                                  <div className={styles.frame312}>
                                    <div className={styles.labelValue3}>120% 초과</div>
                                  </div>
                                </div>
                                <div className={styles.frame313}>
                                  <ProgressBar
                                    value={240}
                                    max={200}
                                    isThick={true}
                                    percentageColor="#dadee1"
                                    label="120% 초과"
                                  />
                                </div>
                              </div>
                              <div className={styles.frame2652}>
                                <div className={styles.frame267}>
                                  <div className={styles.div10}>만족도</div>
                                  <div className={styles.frame269}>
                                    <div className={styles.frame266}>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill3}></div>
                                      <div className={styles.ellipseFill3}></div>
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
                            <div className={styles.div11}>
                              <span>
                                <span className={styles.div11Span}>
                                  사용자 피드백
                                  <br />
                                </span>
                                <span className={styles.div11Span2}>
                                  <br />
                                </span>
                                <span className={styles.div11Span3}></span>
                                <span className={styles.div11Span4}>
                                  이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                                  특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문
                                  횟수가 늘었고, 가을 신상 의류를 충동적으로 구매한 것이
                                  큰 원인입니다. 소비 알림을 받았지만, &#039;이번 한
                                  번만&#039;이라는 생각으로 자제를 못 했습니다.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame288}>
                          <div className={styles.frame239}>
                            <div className={styles.frame232}>
                              <div className={styles.frame106}>
                                <div className={styles.a3}>2025년 10월</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.div12}>
                            <div className={styles.frame271}>
                              <div className={styles.frame270}>
                                <div className={styles.frame373}>
                                  <div className={styles.frame363}>
                                    <div className={styles._240}>240</div>
                                    <div className={styles._2002}>/200 만원</div>
                                  </div>
                                  <div className={styles.frame312}>
                                    <div className={styles.labelValue3}>120% 초과</div>
                                  </div>
                                </div>
                                <div className={styles.frame313}>
                                  <ProgressBar
                                    value={240}
                                    max={200}
                                    isThick={true}
                                    percentageColor="#dadee1"
                                    label="120% 초과"
                                  />
                                </div>
                              </div>
                              <div className={styles.frame2652}>
                                <div className={styles.frame267}>
                                  <div className={styles.div10}>만족도</div>
                                  <div className={styles.frame269}>
                                    <div className={styles.frame266}>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill3}></div>
                                      <div className={styles.ellipseFill3}></div>
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
                            <div className={styles.div11}>
                              <span>
                                <span className={styles.div11Span}>
                                  사용자 피드백
                                  <br />
                                </span>
                                <span className={styles.div11Span2}>
                                  <br />
                                </span>
                                <span className={styles.div11Span3}></span>
                                <span className={styles.div11Span4}>
                                  이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                                  특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문
                                  횟수가 늘었고, 가을 신상 의류를 충동적으로 구매한 것이
                                  큰 원인입니다. 소비 알림을 받았지만, &#039;이번 한
                                  번만&#039;이라는 생각으로 자제를 못 했습니다.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame289}>
                          <div className={styles.frame239}>
                            <div className={styles.frame232}>
                              <div className={styles.frame106}>
                                <div className={styles.a3}>2025년 09월</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.div12}>
                            <div className={styles.frame271}>
                              <div className={styles.frame270}>
                                <div className={styles.frame373}>
                                  <div className={styles.frame363}>
                                    <div className={styles._240}>240</div>
                                    <div className={styles._2002}>/200 만원</div>
                                  </div>
                                  <div className={styles.frame312}>
                                    <div className={styles.labelValue3}>120% 초과</div>
                                  </div>
                                </div>
                                <div className={styles.frame313}>
                                  <ProgressBar
                                    value={240}
                                    max={200}
                                    isThick={true}
                                    percentageColor="#dadee1"
                                    label="120% 초과"
                                  />
                                </div>
                              </div>
                              <div className={styles.frame2652}>
                                <div className={styles.frame267}>
                                  <div className={styles.div10}>만족도</div>
                                  <div className={styles.frame269}>
                                    <div className={styles.frame266}>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill3}></div>
                                      <div className={styles.ellipseFill3}></div>
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
                            <div className={styles.div11}>
                              <span>
                                <span className={styles.div11Span}>
                                  사용자 피드백
                                  <br />
                                </span>
                                <span className={styles.div11Span2}>
                                  <br />
                                </span>
                                <span className={styles.div11Span3}></span>
                                <span className={styles.div11Span4}>
                                  이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                                  특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문
                                  횟수가 늘었고, 가을 신상 의류를 충동적으로 구매한 것이
                                  큰 원인입니다. 소비 알림을 받았지만, &#039;이번 한
                                  번만&#039;이라는 생각으로 자제를 못 했습니다.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame290}>
                          <div className={styles.frame239}>
                            <div className={styles.frame232}>
                              <div className={styles.frame106}>
                                <div className={styles.a3}>2025년 08월</div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.div12}>
                            <div className={styles.frame271}>
                              <div className={styles.frame270}>
                                <div className={styles.frame373}>
                                  <div className={styles.frame363}>
                                    <div className={styles._240}>240</div>
                                    <div className={styles._2002}>/200 만원</div>
                                  </div>
                                  <div className={styles.frame312}>
                                    <div className={styles.labelValue3}>120% 초과</div>
                                  </div>
                                </div>
                                <div className={styles.frame313}>
                                  <ProgressBar
                                    value={240}
                                    max={200}
                                    isThick={true}
                                    percentageColor="#dadee1"
                                    label="120% 초과"
                                  />
                                </div>
                              </div>
                              <div className={styles.frame2652}>
                                <div className={styles.frame267}>
                                  <div className={styles.div10}>만족도</div>
                                  <div className={styles.frame269}>
                                    <div className={styles.frame266}>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill2}></div>
                                      <div className={styles.ellipseFill3}></div>
                                      <div className={styles.ellipseFill3}></div>
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
                            <div className={styles.div11}>
                              <span>
                                <span className={styles.div11Span}>
                                  사용자 피드백
                                  <br />
                                </span>
                                <span className={styles.div11Span2}>
                                  <br />
                                </span>
                                <span className={styles.div11Span3}></span>
                                <span className={styles.div11Span4}>
                                  이번 달은 외식과 의류 구매에서 계획을 크게 초과했습니다.
                                  특히 친구들과의 모임이 잦아지면서 고급 레스토랑 방문
                                  횟수가 늘었고, 가을 신상 의류를 충동적으로 구매한 것이
                                  큰 원인입니다. 소비 알림을 받았지만, &#039;이번 한
                                  번만&#039;이라는 생각으로 자제를 못 했습니다.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.frame2222}> {/* Corresponds to frame-183 */}
                                <div className={styles.frame191_}> {/* Corresponds to frame-191 */}
                                  <img className={styles.group20953} src="/leftleft_icon.svg" alt="<<" />
                                  <img className={styles.group20953} src="/left_icon.svg" alt="<" />
                                </div>
                      
                                  <div className={styles.frame184}> 
                                    <div className={styles._1_}>1</div>
                                  </div>
                                
                                  <div className={styles.frame184}> {/* Corresponds to frame-185 */}
                      
                                      <div className={styles._1_}>2</div>
                                  
                                  </div>
                                  <div className={styles.frame184}> {/* Corresponds to frame-186 */}
                                
                                      <div className={styles._1_}>3</div>
                                  
                                  </div>
                                  <div className={styles.frame184}> {/* Corresponds to frame-1872 */}
                        
                                      <div className={styles._1_}>4</div>
                          
                                  </div>
                                  <div className={styles.frame184}> {/* Corresponds to frame-1882 */}
                                  
                                      <div className={styles._1_}>5</div>
                                
                                  </div>
                              
                  
                                  <div className={styles.frame191_}> {/* Corresponds to frame-191 */}
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

      {/* 배경 요소들은 필요에 따라 grid-area로 배치하거나 CSS 배경으로 처리 */}
      <div className={styles.rectangle8}></div>
      <img className={styles.rectangle10} src="/rectangle-100.svg" alt="Rectangle" />

      {showFeedbackPopup && <FeedbackPopup onClose={() => setShowFeedbackPopup(false)} />} {/* 팝업 조건부 렌더링 */}
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
          currentUsername={usernameToDisplay} // Replace with actual username state
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
    </div>
  );
};

export default ConsumePlanPage;
