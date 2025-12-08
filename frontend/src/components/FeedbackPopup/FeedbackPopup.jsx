import React, { useState } from 'react';
import styles from './FeedbackPopup.module.css';
import { ProgressBar } from '../ProgressBar/ProgressBar'; // ProgressBar 임포트

const FeedbackPopup = ({ onClose, onSubmit, monthEndDate, monthlyCategories, monthlyCurrentConsumption, monthlyTargetConsumption, monthlyPercentage }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState(3); // Default to 3/5
  const [nextMonthGoal, setNextMonthGoal] = useState(''); // 다음 달 목표 상태 추가

  const handleSubmit = () => {
    const feedbackData = {
      date: new Date().toLocaleDateString('ko-KR'), // Add current date
      currentConsumption: monthlyCurrentConsumption,
      targetConsumption: monthlyTargetConsumption,
      percentage: monthlyPercentage,
      text: feedbackText,
      rating: satisfactionRating,
      nextMonthGoal: nextMonthGoal,
    };
    onSubmit(feedbackData);
    setFeedbackText('');
    setSatisfactionRating(3); // Reset to default
    setNextMonthGoal(''); // 다음 달 목표 초기화
  };

  const getMonthlyStatusText = (percentage) => {
    if (percentage <= 70) return "양호";
    if (percentage <= 100) return "보통";
    return "초과";
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
                          <div className={styles._140}>{monthlyCurrentConsumption}</div>
                          <div className={styles._200}>/{monthlyTargetConsumption} 만원</div>
                          <div className={styles.mdiPencil}></div>
                        </div>
                        <div className={styles.frame301}>
                          <div className={styles.frame31}>
                            <ProgressBar
                              value={monthlyCurrentConsumption}
                              max={monthlyTargetConsumption}
                              label={`${monthlyPercentage}%`}
                              percentageColor="#9BC4B0"
                              isThick={true}
                            />
                          </div>
                          <div className={styles.frame268}>
                            <div className={styles.div4}>{getMonthlyStatusText(monthlyPercentage)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame277}>
                    <div className={styles.frame273}>
                      <img className={styles.polygon1} src="/polygon-10.svg" alt="Polygon" />
                      <div className={styles._102}>{monthEndDate.substring(0, monthEndDate.lastIndexOf('.'))}월 소비금액</div>
                    </div>
                    <div className={styles.frame34}>
                      <div className={styles.frame252}>
                        <div className={styles.frame258}>
                          {monthlyCategories.map(category => (
                            <div className={styles.categoryItem} key={category.id}>
                              <div className={styles.frame26}>
                                <div className={styles.ellipseFill} style={{ backgroundColor: category.color }}></div>
                                <div className={styles.div5}>{category.name}</div>
                              </div>
                              <ProgressBar value={category.currentAmount} max={category.targetAmount} isThick={false} percentageColor={category.color} />
                              <div className={styles.labelValue2}>{category.currentAmount}/{category.targetAmount}</div>
                            </div>
                          ))}
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
                      <textarea
                        className={styles.feedbackTextarea} // 기존 피드백 textarea 스타일 재활용
                        placeholder="다음 달의 목표를 작성해주세요..."
                        value={nextMonthGoal}
                        onChange={(e) => setNextMonthGoal(e.target.value)}
                      ></textarea>
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
