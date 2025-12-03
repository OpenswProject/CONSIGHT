import React, { useState } from 'react';
import styles from './FeedbackPopup.module.css';

const FeedbackPopup = ({ onClose, onSubmit, monthEndDate }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState(3); // Default to 3/5

  const handleSubmit = () => {
    onSubmit(feedbackText, satisfactionRating); // Pass satisfactionRating
    setFeedbackText('');
    setSatisfactionRating(3); // Reset to default
  };

  return (
    <div className={styles.overlay} onClick={onClose}> {/* overlay 클릭 시 닫기 */}
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}> {/* 팝업 내부 클릭 시 이벤트 전파 중단 */}
        <div className={styles.div}>
          <div className={styles.div2}>
            <div className={styles.frame300}>
              <div className={styles._10}>{monthEndDate.substring(0, monthEndDate.lastIndexOf('.'))}월 피드백 작성하기</div>
              <div className={styles.frame294}>
                <div className={styles.frame261}>
                  <div className={styles.frame41}>
                    <div className={styles.div3}>이번 달의 목표금액 리뷰</div>
                    <div className={styles.frame20}>
                      <div className={styles.frame37}>
                        <div className={styles.frame36}>
                          <div className={styles._140}>140</div>
                          <div className={styles._200}>/200 만원</div>
                          <div className={styles.mdiPencil}></div>
                        </div>
                        <div className={styles.frame301}>
                          <div className={styles.frame31}>
                            <div className={styles.frame32}>
                              <div className={styles.frame27}></div>
                            </div>
                            <div className={styles.labelValue}>70%</div>
                          </div>
                          <div className={styles.frame268}>
                            <div className={styles.div4}>양호</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame277}>
                    <div className={styles.frame273}>
                      <img className={styles.polygon1} src="/polygon-10.svg" alt="Polygon" />
                      <div className={styles._102}>10월 소비금액</div>
                    </div>
                    <div className={styles.frame34}>
                      <div className={styles.frame252}>
                        <div className={styles.frame258}>
                          <div className={styles.frame40}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>식비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame272}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame44}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>식비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame272}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame45}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>식비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame272}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame46}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>식비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame272}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame47}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>식비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame272}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame42}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>교통비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame274}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame48}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>교통비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame274}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                          <div className={styles.frame49}>
                            <div className={styles.frame26}>
                              <div className={styles.ellipseFill}></div>
                              <div className={styles.div5}>교통비</div>
                            </div>
                            <div className={styles.frame322}>
                              <div className={styles.frame274}></div>
                            </div>
                            <div className={styles.labelValue2}>30/100</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame295}>
                  <div className={styles.frame297}>
                    <div className={styles._103}>이번 달의 피드백</div>
                    <div className={styles.frame21}>
                      <div className={styles.frame298}>
                        <div className={styles.frame271}>
                          <div className={styles.frame265}>
                            <div className={styles.frame267}>
                              <div className={styles.div6}>만족도</div>
                              <div className={styles.frame269}>
                                <div className={styles.frame266}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <div
                                      key={star}
                                      className={star <= satisfactionRating ? styles.ellipseFill2 : styles.ellipseFill3}
                                      onClick={() => setSatisfactionRating(star)}
                                      style={{ cursor: 'pointer' }}
                                    ></div>
                                  ))}
                                </div>
                                <div className={styles['3-5']}>
                                  <span>
                                    <span className={styles['3-5Span']}>{satisfactionRating}</span>
                                    <span className={styles['3-5Span']}>/5</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className={styles.frame91}>
                              <div className={styles.div7}>확인</div>
                            </div>
                          </div>
                        </div>
                        <textarea
                          className={styles.feedbackTextarea}
                          placeholder="이번 달 소비에 대한 피드백을 작성해주세요..."
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame2732}>
                    <div className={styles.frame259}>
                      <div className={styles.div9}>다음 달의 목표</div>
                    </div>
                    <div className={styles.frame212}>
                      <div className={styles.div10}>
                        <span>
                          <span className={styles.div10Span}>
                            제목
                            <br />
                          </span>
                          <span className={styles.div10Span2}>
                            <br />
                          </span>
                          <span className={styles.div10Span3}></span>
                          <span className={styles.div10Span4}>
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
                </div>
              </div>
            </div>
            <img className={styles.vector} src="/vector0.svg" alt="Vector" />
          </div>
        </div>
        <button onClick={handleSubmit} className={styles.submitButton}>작성하기</button>
        <button onClick={onClose} className={styles.closeButton}>X</button>
      </div>
    </div>
  );
};

export default FeedbackPopup;
