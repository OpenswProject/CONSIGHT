import React, { useState, useEffect, useRef } from 'react';
import styles from './ConsumePlanPage.module.css';
import FeedbackPopup from '../../src/components/FeedbackPopup/FeedbackPopup'; // FeedbackPopup import
import FollowListPopup from '../../src/components/FollowListPopup'; // FollowListPopup import
import InitializePopup from '../components/InitializePopup/InitializePopup'; // InitializePopup import
import MyProfileMoreInfoPopup from '../components/MyProfileMoreInfoPopup/MyProfileMoreInfoPopup'; // MyProfileMoreInfoPopup import
import NameChangePopup from '../components/NameChangePopup/NameChangePopup'; // NameChangePopup import
import { ProgressBar } from '../components/ProgressBar/ProgressBar';

const ConsumePlanPage = ({ currentUser }) => {
  const [targetAmount, setTargetAmount] = useState(20); // 초기 목표 금액
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false); // 피드백 팝업 상태
  const [showFollowerPopup, setShowFollowerPopup] = useState(false); // 팔로워 팝업 상태
  const [showFollowingPopup, setShowFollowingPopup] = useState(false); // 팔로잉 팝업 상태
  const [showInitializePopup, setShowInitializePopup] = useState(false); // 초기화 팝업 상태
  const [showMyProfileMoreInfoPopup, setShowMyProfileMoreInfoPopup] = useState(false); // 내 프로필 더보기 팝업 상태
  const [showNameChangePopup, setShowNameChangePopup] = useState(false); // 닉네임 변경 팝업 상태

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

  const handleInitializeConfirm = () => {
    // 초기화 로직을 여기에 추가하세요.
    console.log("소비 계획을 초기화합니다.");
    setShowInitializePopup(false);
  };

  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;

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
                <img className={styles.vector} src="/leaf_point_icon.svg" alt="Vector" />
                <div className={styles.frame91}>
                  <div className={styles._4000}>4000</div> 
                </div>
                <div className={styles._6000Pt}>승급까지 -6000PT</div>
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
                                           {isWeeklyEditing ? (
                                               <div className={styles.editAmountWrapper}>
                                                   <input type="number" value={weeklyCurrentConsumption} onChange={handleWeeklyCurrentChange} className={styles.inputField} />
                                                   <span className={styles.amountSeparator}>/</span>
                                                   <input type="number" value={weeklyTargetConsumption} onChange={handleWeeklyTargetChange} className={`${styles.inputField} ${styles.targetInput}`} />
                                                   <span className={styles.amountUnit}>&nbsp;만원</span>
                                               </div>
                                           ) : (
                                               <div className={styles.viewAmountWrapper}>
                                                   <div className={styles._1420}>{weeklyCurrentConsumption}</div>
                                                   <div className={styles._2020}>/{weeklyTargetConsumption} 만원</div>
                                               </div>
                                           )}
                                           <button onClick={handleWeeklyEditToggle} className={styles.editButton}>
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
                            <div className={styles.frame40}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame44}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame45}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame46}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame47}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame42}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>교통비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame48}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>교통비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame49}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>교통비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                          </div>
                          <div className={styles.frame105}>
                            <div className={styles.frame102}>
                              <div className={styles.div6}>더보기</div>
                            </div>
                            <div className={styles.frame103}>
                              <div className={styles.frame158}>
                                <div className={styles.div7}>추가하기</div>
                              </div>
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
                                           {isWeeklyEditing ? (
                                               <div className={styles.editAmountWrapper}>
                                                   <input type="number" value={weeklyCurrentConsumption} onChange={handleWeeklyCurrentChange} className={styles.inputField} />
                                                   <span className={styles.amountSeparator}>/</span>
                                                   <input type="number" value={weeklyTargetConsumption} onChange={handleWeeklyTargetChange} className={`${styles.inputField} ${styles.targetInput}`} />
                                                   <span className={styles.amountUnit}>&nbsp;만원</span>
                                               </div>
                                           ) : (
                                               <div className={styles.viewAmountWrapper}>
                                                   <div className={styles._1420}>{weeklyCurrentConsumption}</div>
                                                   <div className={styles._2020}>/{weeklyTargetConsumption} 만원</div>
                                               </div>
                                           )}
                                           <button onClick={handleWeeklyEditToggle} className={styles.editButton}>
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
                    <div className={styles.frame2772}>
                      <div className={styles.frame2732}>
                        <img className={styles.polygon13} src="/listup_icon.svg" alt="list" />
                        <div className={styles._11}>11월 목표 소비금액</div>
                      </div>
                      <div className={styles.frame34}>
                        <div className={styles.frame252}>
                          <div className={styles.frame258}>
                            <div className={styles.frame40}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame44}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame45}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame46}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame47}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>식비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#c9d3d0" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame42}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>교통비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame48}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>교통비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                            <div className={styles.frame49}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill}></div>
                                <div className={styles.div5}>교통비</div>
                              </div>
                              <ProgressBar value={30} max={100} isThick={false} percentageColor="#d9dddf" />
                              <div className={styles.labelValue2}>30/100</div>
                            </div>
                          </div>
                          <div className={styles.frame105}>
                            <div className={styles.frame102}>
                              <div className={styles.div6}>더보기</div>
                            </div>
                            <div className={styles.frame103}>
                              <div className={styles.frame158}>
                                <div className={styles.div7}>추가하기</div>
                              </div>
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
    </div>
  );
};

export default ConsumePlanPage;
