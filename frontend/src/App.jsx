import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Userprofile from "./pages/Userprofile"; // Import Userprofile

const HomePage = ({ user, notifications }) => (
  <>
    <div className={styles.backgroundRectangle}></div> {/* 새로 추가 */}
    {/* Corresponds to rectangle-11 */}
    <div className={styles.mainContentArea}>
      {/* Corresponds to frame-193 */}
      <div className={styles.frame193}>
        <div className={styles.frame192}> {/* Corresponds to frame-192 */}
          <div className={styles.headerRow}> {/* 새로운 div */}
            <div className={styles.usernameTitle}>
              {user.username} 님의 소비현황
            </div>
            <div className={styles.frame282}>
              <img className={styles.vector} src="/public2/leaf_point_icon.svg" alt="Leaf Point Icon" />
              <div className={styles.frame914}>
                <div className={styles._4000}>4000</div>
              </div>
              <div className={styles._6000pt}>승급까지 -6000PT</div>
            </div>
          </div>
          <div className={styles.div2Wrapper}> {/* Corresponds to div2 */}
            <div className={styles.frame45}> {/* Corresponds to frame-45 */}
              <div className={styles.frame6}> {/* Corresponds to frame-6 */}
                <ConsumptionStatus username={user.username} />
              </div>
              <VisitHistory /> {/* Render VisitHistory here */}
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
                                      <div className={styles.username}>USERNAME</div>
                                    </div>
                                  </div>
                                  <div className={styles.userinfo1}>USERINFO_1</div>
                                </div>
                                <img className={styles.riMoreLine} src="/More_info.svg" alt="More options" />
                              </div>
                            </div>
                            
                          </div>
                        </div>
            <div className={`${styles.actionButton} ${styles.primary}`}>
              리뷰 작성
            </div>
            <div className={`${styles.actionButton} ${styles.secondary}`}>
              내 리뷰
            </div>
            <div className={styles.notificationsCard}>
              <div className={styles.notificationsHeader}>알림</div>
              <div className={styles.line5}></div> {/* Corresponds to line-5 */}
              <div className={styles.frame205}> {/* Corresponds to frame-205 */}
                {notifications.map((item, index) => (
                  <div key={index} className={styles.notificationItem}>
                    <div className={styles.notificationAvatar}></div>
                    <div className={styles.notificationText}>
                      <span>팔로우중인</span>
                      <span>USERNAME</span>
                      <span>님의<br />새로운 글 업로드</span>
                    </div>
                    <div className={styles.notificationLine}></div>
                  </div>
                ))}
              </div>
              <div className={styles.notificationControls}>
                <img src="/public2/left_icon.svg" alt="Previous" className={styles.notificationControlIcon} />
                <img src="/public2/right_icon.svg" alt="Next" className={styles.notificationControlIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corresponds to frame-142 */}
      <div className={styles.frame142}>
        <div className={styles.line42}></div> {/* Corresponds to line-42 */}
        <div className={styles.frame117}> {/* Corresponds to frame-117 */}
          <ShoppingList />
          <RecommendedReviews />
        </div>
      </div>

      <div className={styles.frame145}>
        <div className={styles.line42}></div>
        <div className={styles.frame143}> {/* Corresponds to frame-143 */}
          <div className={styles.reviewFeedTitle}>리뷰 피드</div>
          <div className={styles.frame2222}> {/* Corresponds to frame-183 */}
          
              <div className={styles.frame191}> {/* Corresponds to frame-191 */}
                <img className={styles.group20953} src="/public2/leftleft_icon.svg" alt="<<" />
                <img className={styles.group2096} src="/public2/left_icon.svg" alt="<" />
              </div>
    
                <div className={styles.frame184}> 
                  <div className={styles._1}>1</div>
                </div>
              
                <div className={styles.frame184}> {/* Corresponds to frame-185 */}
    
                    <div className={styles._2}>2</div>
                
                </div>
                <div className={styles.frame184}> {/* Corresponds to frame-186 */}
              
                    <div className={styles._3}>3</div>
                
                </div>
                <div className={styles.frame184}> {/* Corresponds to frame-1872 */}
      
                    <div className={styles._4}>4</div>
        
                </div>
                <div className={styles.frame184}> {/* Corresponds to frame-1882 */}
                
                    <div className={styles._5}>5</div>
              
                </div>
            

                <div className={styles.frame191}> {/* Corresponds to frame-191 */}
                  <img className={styles.group20953} src="/public2/right_icon.svg" alt=">" />
                  <img className={styles.group2096} src="/public2/rightright_icon.svg" alt=">>" />
                </div>
          </div>
        </div>
        <div className={styles.frame144}> {/* Corresponds to frame-144 */}

                 <div className={styles.frame120}>
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
                                <div className={styles.username}>USERNAME</div>
                              </div>
                              <img className={styles.riMoreLine} src="/public2/More_info.svg" alt="More Options" />
                            </div>
                            <div className={styles.frame251}>
                              <div className={styles.div}>스노우쉴드 롱패딩</div>
                              <img className={styles.maskGroup} src="/public2/check.svg" alt="Product Image" />
                            </div>
                            <div className={styles.iconParkSolidCheckOne}></div>
                          </div>
                          <div className={styles.frame108}>
                            <div className={styles._20251116}>2025.11.16</div>
                            <div className={styles.frame91}>
                              <div className={styles.div2}>의류</div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame110}>
                          <div className={styles.div3}>
                            패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만
                            입어도 충분히 한겨울 기온을 버틸 정도라서 요즘 거의 매일 입고
                            다닙니다. 지퍼도 부드럽게 잘 올라가고 주머니 털 안감도
                            포근해서 만족스러워요. 전체적으로 착용감이 편안해서 오래 입고
                            있어도 부담이 없고, 바람 부는 날에도 체온을 잘 유지해줘서
                            외출할 때마다 든든합니다. 디자인도 깔끔해서 어떤 옷과 매치해도
                            잘 어울려 데일리 아우터로 손색이 없어요. 개인적으로 이번
                            시즌에 산 옷 중 가장 만족스러워서 주변에도 적극 추천하고 싶을
                            정도입니다
                          </div>
                          <div className={styles.frame111}>
                            <div className={styles.frame912}>
                              <div className={styles.div4}>제품 링크</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.frame129}></div>
                  </div>
                  <div className={styles.frame156}>
                    <div className={styles.line5}></div>
                    <div className={styles.frame246}>
                      <div className={styles.frame248}>
                        <img className={styles.frame131} src="/public2/bookmark_icon.svg" alt="Like" />
                        <div className={styles.frame247}>
                          <div className={styles._10}>10</div>
                        </div>
                      </div>
                      <div className={styles.frame249}>
                        <img className={styles.frame132} src="/public2/comment_icon.svg" alt="Comment" />
                        <div className={styles.frame247}>
                          <div className={styles._10}>10</div>
                        </div>
                      </div>
                      <div className={styles.frame250}>
                        <img className={styles.frame130} src="/public2/like.svg" alt="Share" />
                        <div className={styles.frame247}>
                          <div className={styles._10}>10</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame157}>
                  <div className={styles.frame137}>
                    <div className={styles.frame1073}>
                      <div className={styles.frame1062}>
                        <div className={styles.frame141}>
                          <div className={styles.frame140}>
                            <div className={styles.profile2}></div>
                            <div className={styles.username2}>USERNAME</div>
                            <img className={styles.riMoreLine2} src="/public2/More_info.svg"alt="More Options" />
                          </div>
                          <div className={styles.frame139}>
                            <div className={styles.div5}>
                              요즘 패딩 찾고 있었는데 상세 후기 덕분에 선택에 도움이
                              됐어요, 감사합니다
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame1073}>
                    <div className={styles.frame1062}>
                      <div className={styles.frame141}>
                        <div className={styles.frame140}>
                          <div className={styles.profile2}></div>
                          <div className={styles.username2}>USERNAME</div>
                          <img className={styles.riMoreLine3} src="/public2/More_info.svg" alt="More Options" />
                        </div>
                        <div className={styles.frame1392}>
                          <div className={styles.div6}>
                            바람 많이 부는 지역 살아서 걱정했는데 이 정도면 충분히
                            따뜻하겠다 싶네요
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame1382}>
                    <div className={styles.frame1062}>
                      <div className={styles.frame141}>
                        <div className={styles.frame140}>
                          <div className={styles.profile2}></div>
                          <div className={styles.username2}>USERNAME</div>
                          <img className={styles.riMoreLine4} src="/public2/More_info.svg" alt="More Options" />
                        </div>
                        <div className={styles.frame1393}>
                          <div className={styles.div6}>
                            착용감 편하다는 말에 바로 장바구니 넣었습니다. 실제로도
                            가볍나요?
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.frame197}>
                <div className={styles.line52}></div>
                <div className={styles.div7}>더보기</div>
              </div>
              <div className={styles.materialSymbolsBookmarkOutlineRounded}></div>
            </div>
          </div>
          
         <div className={styles.frameshort}>
            <div className={styles.frame107short}>
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
                                <div className={styles.username}>USERNAME</div>
                              </div>
                              <img className={styles.riMoreLine} src="/public2/More_info.svg" alt="More Options" />
                            </div>
                            <div className={styles.frame251}>
                              <div className={styles.div}>스노우쉴드 롱패딩</div>
                              <img className={styles.maskGroup} src="/public2/check.svg" alt="Product Image" />
                            </div>
                            <div className={styles.iconParkSolidCheckOne}></div>
                          </div>
                          <div className={styles.frame108}>
                            <div className={styles._20251116}>2025.11.16</div>
                            <div className={styles.frame91}>
                              <div className={styles.div2}>의류</div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.frame110}>
                          <div className={styles.div3}>
                            패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만
                            입어도 충분히 한겨울 기온을 버틸 정도라서 요즘 거의 매일 입고
                            다닙니다. 지퍼도 부드럽게 잘 올라가고 주머니 털 안감도
                            포근해서 만족스러워요. 전체적으로 착용감이 편안해서 오래 입고
                            있어도 부담이 없고, 바람 부는 날에도 체온을 잘 유지해줘서
                            외출할 때마다 든든합니다. 디자인도 깔끔해서 어떤 옷과 매치해도
                            잘 어울려 데일리 아우터로 손색이 없어요. 개인적으로 이번
                            시즌에 산 옷 중 가장 만족스러워서 주변에도 적극 추천하고 싶을
                            정도입니다
                          </div>
                          <div className={styles.frame111}>
                            <div className={styles.frame912}>
                              <div className={styles.div4}>제품 링크</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.frame129}></div>
                  </div>
                  <div className={styles.frame156}>
                    <div className={styles.line5}></div>
                    <div className={styles.frame246}>
                      <div className={styles.frame248}>
                        <img className={styles.frame131} src="/public2/bookmark_icon.svg" alt="Like" />
                        <div className={styles.frame247}>
                          <div className={styles._10}>10</div>
                        </div>
                      </div>
                      <div className={styles.frame249}>
                        <img className={styles.frame132} src="/public2/comment_icon.svg" alt="Comment" />
                        <div className={styles.frame247}>
                          <div className={styles._10}>10</div>
                        </div>
                      </div>
                      <div className={styles.frame250}>
                        <img className={styles.frame130} src="/public2/like.svg" alt="Share" />
                        <div className={styles.frame247}>
                          <div className={styles._10}>10</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className={styles.materialSymbolsBookmarkOutlineRounded}></div>
            </div>
          </div>
        </div>


        
      </div>

      
      <div className={styles.frame208}>
        <div className={styles.line55}></div>
        <div className={styles.frame913}>
          <div className={styles.div25}>더보기</div>
        </div>
      </div>
      
      

    </div>
  </>
);

export default function App() {
  const user = {
    username: "USERNAME",
    userInfo: "USERINFO_1",
  };

  const notifications = [
    "팔로우중인 USERNAME 님의 새로운 글 업로드",
    "팔로우중인 USERNAME 님의 새로운 글 업로드",
    "팔로우중인 USERNAME 님의 새로운 글 업로드",
    "팔로우중인 USERNAME 님의 새로운 글 업로드",
  ];

  return (
    <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage user={user} notifications={notifications} />} />
          <Route path="/review-feed" element={<ReviewFeedPage />} />
          <Route path="/consume-plan" element={<ConsumePlanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/review-write" element={<ReviewWritePage />} /> {/* ReviewWritePage 라우팅 추가 */}
          <Route path="/Userprofile" element={<Userprofile />} /> {/* Userprofile 라우팅 추가 */}
        </Routes>
    </BrowserRouter>
  );
}