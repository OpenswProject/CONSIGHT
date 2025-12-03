import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/UserProfile.module.css'; // Mypage.module.css 대신 Userprofile.module.css를 import
import ReviewPopup from '../components/ReviewPopup';
import FollowListPopup from '../components/FollowListPopup';
import UserMoreInfoPopup from '../components/UserMoreInfoPopup/UserMoreInfoPopup';

const Userprofile = ({ currentUser }) => { // Mypage 대신 Userprofile
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [showFollowerPopup, setShowFollowerPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const [showUserMoreInfoPopup, setShowUserMoreInfoPopup] = useState(false);

  const moreOptionsRef = useRef(null); // Ref for the more options container

  const usernameToDisplay = currentUser ? currentUser.username : "USERNAME";
  const userInfoToDisplay = currentUser ? currentUser.email : "USERINFO_1";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowUserMoreInfoPopup(false);
      }
    };

    if (showUserMoreInfoPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMoreInfoPopup]);

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);
  const openFollowerPopup = () => setShowFollowerPopup(true);
  const closeFollowerPopup = () => setShowFollowerPopup(false);
  const openFollowingPopup = () => setShowFollowingPopup(true);
  const closeFollowingPopup = () => setShowFollowingPopup(false);

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
                        <div className={styles.username}>{usernameToDisplay}</div>
                        <div className={styles.userinfo1}>{userInfoToDisplay}</div>
                      </div>
                      <div className={styles.moreOptionsContainer} ref={moreOptionsRef}>
                        <img className={styles.riMoreLine} src="/More_info.svg" alt="More options" onClick={() => setShowUserMoreInfoPopup(!showUserMoreInfoPopup)} />
                        {showUserMoreInfoPopup && <UserMoreInfoPopup onClose={() => setShowUserMoreInfoPopup(false)} />}
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
                        <div className={styles._100}>100</div>
                      </div>
                      <div className={styles.line43}></div>
                      <div className={styles.frame211}>
                        <div className={styles._200}>200</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame5}>
                <div className={styles.div3}>팔로우</div>
              </div>
              <div className={styles.frame6_split}>
                <div className={styles.planButton}>차단</div>
                <div className={styles.planButton}>신고</div>
              </div>
            </div>
          </div>
          <div className={styles.frame199}>
     
            
          </div>
        </div>
        <div className={styles.frame8}>  
          <div className={styles.frame226}>
            <div className={styles.frame254}>
              <div className={styles.frame25}>
                <div className={styles.frame196}>
                  <div className={styles._11}>11월22 분야별 소비현황</div>
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
                      <div className={styles.frame32}>
                        <div className={styles.frame272}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame44}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <div className={styles.frame32}>
                        <div className={styles.frame272}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame452}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <div className={styles.frame32}>
                        <div className={styles.frame272}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame46}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <div className={styles.frame32}>
                        <div className={styles.frame272}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame47}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>식비</div>
                      </div>
                      <div className={styles.frame32}>
                        <div className={styles.frame272}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame42}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>교통비</div>
                      </div>
                      <div className={styles.frame32}>
                        <div className={styles.frame273}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame482}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill4}></div>
                        <div className={styles.div5}>교통비</div>
                      </div>
                      <div className={styles.frame32}>
                        <div className={styles.frame273}></div>
                      </div>
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
                    <div className={styles.frame20}>
                      <div className={styles.frame37}>
                        <div className={styles.frame36}>
                          <div className={styles._140}>140</div>
                          <div className={styles._2002}>/200 만원</div>
                          <img className={styles.mdiPencil} src="/mdi-pencil0.svg" alt="Edit" />
                        </div>
                        <div className={styles.frame31}>
                          <div className={styles.frame322}>
                            <div className={styles.frame274}></div>
                          </div>
                          <div className={styles.labelValue3}>70%</div>
                        </div>
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
                          <div className={styles.frame323}>
                            <div className={styles.frame275}></div>
                          </div>
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
                      <div className={styles.frame19}>
                        <div className={styles.frame37}>
                          <div className={styles.frame36}>
                            <div className={styles._20}>20</div>
                            <div className={styles._40}>/40 만원</div>
                            <img className={styles.mdiPencil2} src="/mdi-pencil1.svg" alt="Edit" />
                          </div>
                          <div className={styles.frame31}>
                            <div className={styles.frame322}>
                              <div className={styles.frame274}></div>
                            </div>
                            <div className={styles.labelValue3}>70%</div>
                          </div>
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
                      <div className={styles.frame324}>
                        <div className={styles.frame276}></div>
                      </div>
                      <div className={styles.labelValue2}>30/100</div>
                    </div>
                    <div className={styles.frame325}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <div className={styles.frame326}>
                        <div className={styles.frame277}></div>
                      </div>
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                    <div className={styles.frame33}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <div className={styles.frame326}>
                        <div className={styles.frame277}></div>
                      </div>
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                    <div className={styles.frame343}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <div className={styles.frame326}>
                        <div className={styles.frame277}></div>
                      </div>
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>30/40</div>
                      </div>
                    </div>
                    <div className={styles.frame352}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill7}></div>
                        <div className={styles.div4}>교통비</div>
                      </div>
                      <div className={styles.frame326}>
                        <div className={styles.frame277}></div>
                      </div>
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
                      <div className={styles.frame326}>
                        <div className={styles.frame2710}></div>
                      </div>
                      <div className={styles.frame49}>
                        <div className={styles.labelValue2}>20/40</div>
                      </div>
                    </div>
                    <div className={styles.frame215}>
                      <div className={styles.frame26}>
                        <div className={styles.ellipseFill8}></div>
                        <div className={styles.div4}>갱신 후</div>
                      </div>
                      <div className={styles.frame326}>
                        <div className={styles.frame2711}></div>
                      </div>
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
                  <img className={styles.vector2} src="/vector1.svg" alt="vector" />
                </div>
              </div>
            </div>


            <div className={styles.frame2092}>
              <div className={styles.frame232}>
                <div className={styles.frame1062}>
                  <div className={styles.a5}>북마크한 리뷰</div>             
                  <img className={styles.frame131} src="/frame-1310.svg" alt="bookmark" />
                </div>
              </div>
            </div>
      

          <div className={styles.frame2092}>
            <div className={styles.frame232}>
              <div className={styles.frame1062}>
                <div className={styles.a5}>댓글단 리뷰</div>             
                  <img className={styles.frame132} src="/frame-1320.svg" alt="comment" />
              </div>
            </div>
          </div>
          
        </div>
        

        <div className={styles.reviewsWrapper}>
            <div className={styles.reviewBlocksWrapper}>
          <div className={styles.frame83} onClick={openPopup}>
            <div className={styles.frame105}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame107}>
                    <div className={styles.frame1063}>
                      <div className={styles.profile3}></div>
                      <div className={styles.username3}>USERNAME</div>
                      <div className={styles.div13}>코지웜 듀얼히팅 전기장판</div>
                      <div className={styles.frame108}>
                      <div className={styles.date20251116}>2025.11.16</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>생활·가전</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div14}>
                      생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말
                      편해요. 온도 단계가 세밀하게 조절돼..
                    </div>
                    <div className={styles.frame111}>
                      <div className={styles.div15}>제품 링크</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame155}>
                <img className={styles.iconframe} src="like.svg" />
                <img className={styles.frame1325} src="bookmark_icon.svg" />
                <img className={styles.frame1304} src="comment_icon.svg" />
              </div>
            </div>
          </div>

          <div className={styles.frame83} onClick={openPopup}>
            <div className={styles.frame105}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame107}>
                    <div className={styles.frame1063}>
                      <div className={styles.profile3}></div>
                      <div className={styles.username3}>USERNAME</div>
                      <div className={styles.div13}>코지웜 듀얼히팅 전기장판</div>
                      <div className={styles.frame108}>
                      <div className={styles.date20251116}>2025.11.16</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>생활·가전</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div14}>
                      생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말
                      편해요. 온도 단계가 세밀하게 조절돼..
                    </div>
                    <div className={styles.frame111}>
                      <div className={styles.div15}>제품 링크</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame155}>
                <img className={styles.iconframe} src="like.svg" />
                <img className={styles.frame1325} src="bookmark_icon.svg" />
                <img className={styles.frame1304} src="comment_icon.svg" />
              </div>
            </div>
          </div>

          <div className={styles.frame83} onClick={openPopup}>
            <div className={styles.frame105}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame107}>
                    <div className={styles.frame1063}>
                      <div className={styles.profile3}></div>
                      <div className={styles.username3}>USERNAME</div>
                      <div className={styles.div13}>코지웜 듀얼히팅 전기장판</div>
                      <div className={styles.frame108}>
                      <div className={styles.date20251116}>2025.11.16</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>생활·가전</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div14}>
                      생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말
                      편해요. 온도 단계가 세밀하게 조절돼..
                    </div>
                    <div className={styles.frame111}>
                      <div className={styles.div15}>제품 링크</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame155}>
                <img className={styles.iconframe} src="like.svg" />
                <img className={styles.frame1325} src="bookmark_icon.svg" />
                <img className={styles.frame1304} src="comment_icon.svg" />
              </div>
            </div>
        </div>
        
        

        

      </div>



    <div className={styles.reviewBlocksWrapper}>
          <div className={styles.frame83} onClick={openPopup}>
            <div className={styles.frame105}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame107}>
                    <div className={styles.frame1063}>
                      <div className={styles.profile3}></div>
                      <div className={styles.username3}>USERNAME</div>
                      <div className={styles.div13}>코지웜 듀얼히팅 전기장판</div>
                      <div className={styles.frame108}>
                      <div className={styles.date20251116}>2025.11.16</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>생활·가전</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div14}>
                      생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말
                      편해요. 온도 단계가 세밀하게 조절돼..
                    </div>
                    <div className={styles.frame111}>
                      <div className={styles.div15}>제품 링크</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame155}>
                <img className={styles.iconframe} src="like.svg" />
                <img className={styles.frame1325} src="bookmark_icon.svg" />
                <img className={styles.frame1304} src="comment_icon.svg" />
              </div>
            </div>
          </div>

          <div className={styles.frame83} onClick={openPopup}>
            <div className={styles.frame105}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame107}>
                    <div className={styles.frame1063}>
                      <div className={styles.profile3}></div>
                      <div className={styles.username3}>USERNAME</div>
                      <div className={styles.div13}>코지웜 듀얼히팅 전기장판</div>
                      <div className={styles.frame108}>
                      <div className={styles.date20251116}>2025.11.16</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>생활·가전</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div14}>
                      생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말
                      편해요. 온도 단계가 세밀하게 조절돼..
                    </div>
                    <div className={styles.frame111}>
                      <div className={styles.div15}>제품 링크</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame155}>
                <img className={styles.iconframe} src="like.svg" />
                <img className={styles.frame1325} src="bookmark_icon.svg" />
                <img className={styles.frame1304} src="comment_icon.svg" />
              </div>
            </div>
          </div>

          <div className={styles.frame83} onClick={openPopup}>
            <div className={styles.frame105}>
              <div className={styles.frame109}>
                <div className={styles.frame113}>
                  <div className={styles.frame107}>
                    <div className={styles.frame1063}>
                      <div className={styles.profile3}></div>
                      <div className={styles.username3}>USERNAME</div>
                      <div className={styles.div13}>코지웜 듀얼히팅 전기장판</div>
                      <div className={styles.frame108}>
                      <div className={styles.date20251116}>2025.11.16</div>
                      <div className={styles.frame912}>
                        <div className={styles.div12}>생활·가전</div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <div className={styles.frame110}>
                    <div className={styles.div14}>
                      생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말
                      편해요. 온도 단계가 세밀하게 조절돼..
                    </div>
                    <div className={styles.frame111}>
                      <div className={styles.div15}>제품 링크</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame155}>
                <img className={styles.iconframe} src="like.svg" />
                <img className={styles.frame1325} src="bookmark_icon.svg" />
                <img className={styles.frame1304} src="comment_icon.svg" />
              </div>
            </div>
        </div>
        
        </div>

        

      </div>




        </div>
    

        </div>
      </div>
      <ReviewPopup show={isPopupOpen} onClose={closePopup} />
      {showFollowerPopup && (
        <FollowListPopup onClose={closeFollowerPopup} title="USERNAME님의 팔로워 목록" />
      )}
      {showFollowingPopup && (
        <FollowListPopup onClose={closeFollowingPopup} title="USERNAME님의 팔로우 목록" />
      )}
    </>
  );
};

export default Userprofile;