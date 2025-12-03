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
  const [myReviewData, setMyReviewData] = useState(null); // State to store fetched review data

  const [followersCount, setFollowersCount] = useState(0); // 초기 팔로워 수 0
  const [followingCount, setFollowingCount] = useState(0); // 초기 팔로잉 수 0
  const [followersList, setFollowersList] = useState([]); // 초기 팔로워 목록 비어있음
  const [followingList, setFollowingList] = useState([]); // 초기 팔로잉 목록 비어있음

  const moreOptionsRef = useRef(null); // Ref for the more options container

  const usernameToDisplay = currentUser ? currentUser.username : "USERNAME";
  const userInfoToDisplay = currentUser ? currentUser.email : "USERINFO_1";

  // 팔로우/팔로워 수 및 목록을 가져오는 useEffect
  useEffect(() => {
    if (!currentUser) {
      setFollowersCount(0);
      setFollowingCount(0);
      setFollowersList([]);
      setFollowingList([]);
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn("No JWT token found, cannot fetch follow data.");
      return;
    }

    const fetchFollowData = async () => {
      try {
        // 팔로우/팔로워 수 가져오기
        const countsResponse = await fetch(`/api/follow/${currentUser.username}/counts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (countsResponse.ok) {
          const countsData = await countsResponse.json();
          setFollowersCount(countsData.data.followersCount);
          setFollowingCount(countsData.data.followingCount);
        } else {
          console.error("Failed to fetch follow counts:", countsResponse.statusText);
        }

        // 팔로워 목록 가져오기
        const followersResponse = await fetch(`/api/follow/${currentUser.username}/followers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (followersResponse.ok) {
          const followersData = await followersResponse.json();
          setFollowersList(followersData.data);
        } else {
          console.error("Failed to fetch followers list:", followersResponse.statusText);
        }

        // 팔로잉 목록 가져오기
        const followingResponse = await fetch(`/api/follow/${currentUser.username}/following`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (followingResponse.ok) {
          const followingData = await followingResponse.json();
          setFollowingList(followingData.data);
        } else {
          console.error("Failed to fetch following list:", followingResponse.statusText);
        }

      } catch (error) {
        console.error("Error fetching follow data:", error);
      }
    };

    fetchFollowData();
  }, [currentUser]); // currentUser가 변경될 때마다 다시 가져옴

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
    const fetchMyReviewData = async () => {
      if (!currentUser) {
        setMyReviewData(null);
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.warn("No JWT token found, cannot fetch my review data.");
        setMyReviewData(null);
        return;
      }

      try {
        const response = await fetch('/api/reviews/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMyReviewData(data.data); // Assuming APIResponse wraps the actual data in a 'data' field
      } catch (error) {
        console.error("Failed to fetch my review data:", error);
        setMyReviewData(null);
      }
    };

    fetchMyReviewData();
  }, [currentUser]); // Refetch when currentUser changes

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);
  const openFollowerPopup = () => setShowFollowerPopup(true);
  const closeFollowerPopup = () => setShowFollowerPopup(false);
  const openFollowingPopup = () => setShowFollowingPopup(true);
  const closeFollowingPopup = () => setShowFollowingPopup(false);

  const [weeklyCurrentConsumption, setWeeklyCurrentConsumption] = useState(140);
  const [weeklyTargetConsumption, setWeeklyTargetConsumption] = useState(200);
  const [isWeeklyEditing, setIsWeeklyEditing] = useState(false);

  const handleWeeklyEditToggle = () => {
    setIsWeeklyEditing(!isWeeklyEditing);
  };

  const handleWeeklyCurrentChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setWeeklyCurrentConsumption(value);
    } else if (e.target.value === '') {
      setWeeklyCurrentConsumption(0);
    }
  };

  const handleWeeklyTargetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setWeeklyTargetConsumption(value);
    } else if (e.target.value === '') {
      setWeeklyTargetConsumption(0);
    }
  };

  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;

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
                    <img className={styles.vector} src="/vector0.svg" alt="Vector" />
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
                      <div className={styles.line43}></div>
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
                <img className={styles.group2095} src="/group-20950.svg" alt="Group 2095" />
              </div>
              <div className={styles.frame188}>
                <img className={styles.group20952} src="/group-20951.svg" alt="Group 20952" />
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
      
            <div className={styles.a4}>작성한 리뷰</div>
            <div className={styles._30}>총 30건</div>
        </div>
        <div className={styles.line53}></div>
      </div>


      
        <div className={styles.completeWrapper}>
          <div className={styles.frame231_tab_container}>
            <div className={styles.frame2092}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>작성한 리뷰</div>
                </div>
              </div>
            </div>

            <div className={styles.frame2092}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>좋아요한 리뷰</div>             
                  <img className={styles.vector2} src="/like.svg" alt="vector" />
                </div>
              </div>
            </div>


            <div className={styles.frame2092}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>북마크한 리뷰</div>             
                  <img className={styles.frame131} src="/bookmark_icon.svg" alt="bookmark" />
                </div>
              </div>
            </div>
      

          <div className={styles.frame2092}>
            <div className={styles.frame232}>
              <div className={styles.frame1062}>
                <div className={styles.a5}>댓글단 리뷰</div>             
                  <img className={styles.frame132} src="/comment_icon.svg" alt="comment" />
              </div>
            </div>
          </div>
          
        </div>
        

        <div className={styles.reviewsWrapper}>
            {myReviewData && myReviewData.written ? (
              <>
                {myReviewData.written.map((review) => (
                  <div className={styles.frame83} key={review.id} onClick={openPopup}>
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
                            <div className={styles.div14}>
                              {review.content.substring(0, 100)}... {/* Truncate content */}
                            </div>
                            <div className={styles.frame111}>
                              <div className={styles.div15}>제품 링크</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.frame155}>
                        <img className={styles.iconframe} src="like.svg" alt="Like" />
                        <img className={styles.frame1325} src="bookmark_icon.svg" alt="Bookmark" />
                        <img className={styles.frame1304} src="comment_icon.svg" alt="Comment" />
                      </div>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 6 - myReviewData.written.length) }).map((_, index) => (
                  <div key={`placeholder-${index}`} className={`${styles.frame83} ${styles.placeholderReviewBlock}`}>
                    {/* Placeholder content, e.g., empty div or transparent content */}
                  </div>
                ))}
              </>
            ) : (
              <>
                <p>작성한 리뷰가 없습니다.</p>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`placeholder-${index}`} className={`${styles.frame83} ${styles.placeholderReviewBlock}`}>
                    {/* Placeholder content */}
                  </div>
                ))}
              </>
            )}
          </div>




        </div>
    

        </div>
      </div>
      <ReviewPopup show={isPopupOpen} onClose={closePopup} />
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
