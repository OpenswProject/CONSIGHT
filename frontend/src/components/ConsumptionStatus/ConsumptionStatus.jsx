import React, { useState, useEffect } from "react";
import styles from "./ConsumptionStatus.module.css";
import { Line } from 'rc-progress';

export const ProgressBar = ({ value, max, label, percentageColor, isThick }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const targetPercent = max > 0 ? (value / max) * 100 : 0;

  useEffect(() => {
    const animationDuration = 200; // 0.2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      setAnimatedPercent(progress * targetPercent);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetPercent]);

  const strokeLinecap = "round"; // Default for rounded ends

  const containerClassName = isThick ? styles.thickProgressBarContainer : styles.progressBarContainer;
  const barClassName = isThick ? styles.thickProgressBar : styles.progressBar;
  const labelClassName = isThick ? styles.thickProgressLabel : styles.progressLabel;

  // Determine the final strokeColor based on percentageColor prop
  let finalStrokeColor = percentageColor;
  if (typeof percentageColor === 'string' && percentageColor.startsWith('linear-gradient')) {
    // This case should ideally not happen if we pass objects for gradients
    // but as a fallback, we can try to parse it or use a default
    // For now, let's assume percentageColor will be either a string or an object
    // that rc-progress can directly consume.
    // If it's a CSS linear-gradient string, rc-progress won't understand it directly.
    // We need to convert it to the object format { '0%': color1, '100%': color2 }
    // For simplicity, let's assume percentageColor will be passed in the correct format
    // or it's a solid color string.
  }

  return (
    <div className={containerClassName}>
      <Line
        percent={animatedPercent}
        strokeWidth={isThick ? 10 : 6} // Adjust strokeWidth based on isThick
        strokeColor={finalStrokeColor || "linear-gradient(-90deg, rgba(130, 183, 158, 0.8) 0%, rgba(221, 236, 231, 1) 100%)"}
        trailWidth={isThick ? 10 : 6} // Same as strokeWidth for the background
        trailColor="#e9e9e9" // Reverting to original trail color
        strokeLinecap={strokeLinecap}
        className={barClassName}
      />
      {label && <div className={labelClassName} style={{ color: "#676767" }}>{label}</div>}
    </div>
  );
};

export const ConsumptionStatus = ({ username, currentUser }) => {
  const [currentConsumption, setCurrentConsumption] = useState(140);
  const [targetConsumption, setTargetConsumption] = useState(200);
  const [isEditing, setIsEditing] = useState(false);

  const [weeklyCurrentConsumption, setWeeklyCurrentConsumption] = useState(140);
  const [weeklyTargetConsumption, setWeeklyTargetConsumption] = useState(200);
  const [isWeeklyEditing, setIsWeeklyEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCurrentChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCurrentConsumption(value);
    } else if (e.target.value === '') {
      setCurrentConsumption(0);
    }
  };

  const handleTargetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setTargetConsumption(value);
    } else if (e.target.value === '') {
      setTargetConsumption(0);
    }
  };

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

  const percentage = targetConsumption > 0 ? Math.round((currentConsumption / targetConsumption) * 100) : 0;
  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;

  return (
    <> {/* This component now directly renders the content of frame-6 */}
      <div className={styles.frame21}> {/* Corresponds to frame-21 */}
        <div className={styles.pieChart}> {/* Corresponds to pie-chart */}
          <div className={styles.frame25}> {/* Corresponds to frame-25 */}
            <div className={styles.frame33}> {/* Corresponds to frame-33 */}
              <div className={styles.frame24}> {/* Corresponds to frame-24 */}
                <div className={styles.frame196}> {/* Corresponds to frame-196 */}
                  <div className={styles.div3}>{currentUser ? currentUser.username : "USERNAME"} 님의 소비현황</div>
                  <div className={styles.line4}></div>
                </div>
                <div className={styles._11}>11월 소비현황</div>
              </div>
              <div className={styles.frame22}> {/* Corresponds to frame-22 */}
                <div className={styles.frame23}> {/* Corresponds to frame-23 */}
                  <div className={styles.frame44}> {/* Corresponds to frame-44 */}
                    <div className={styles.legends}> {/* Corresponds to legends */}
                      <div className={styles.frame35}> {/* Corresponds to frame-35 */}
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
                    <div className={styles.mainChart}> {/* Corresponds to main-chart */}
                      <div className={styles.pieLayer}> {/* Corresponds to pie-layer */}
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
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frame34}> {/* Corresponds to frame-34 */}
            <div className={styles.frame31}> {/* Corresponds to frame-31 */}
              <div className={styles.frame26}>
                <div className={styles.ellipseFill4}></div>
                <div className={styles.div4}>식비</div>
              </div>
              <ProgressBar value={50} max={100} label="50/100" percentageColor="#C9D3D0" />
            </div>
            <div className={styles.frame322}> {/* Corresponds to frame-322 */}
              <div className={styles.frame26}>
                <div className={styles.ellipseFill5}></div>
                <div className={styles.div4}>교통비</div>
              </div>
              <ProgressBar value={20} max={40} label="20/40" percentageColor="#C9D3D0" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.frame222}> {/* Corresponds to frame-222 */}
        <div className={styles.frame196}>
          <div className={styles.div3}>월간 목표 소비금액</div>
          <div className={styles.line4}></div>
        </div>
        <div className={styles.frame42}> {/* Corresponds to frame-42 */}
          <div className={styles.frame41}> {/* Corresponds to frame-41 */}
            <div className={styles.div5}>이번 달의 목표금액</div>
            <div className={styles.frame19}> {/* Corresponds to frame-19 */}
              <div className={styles.frame37}>
                <div className={styles.frame36}>
                    {isEditing ? (
                        <div className={styles.editAmountWrapper}>
                            <input type="number" value={currentConsumption} onChange={handleCurrentChange} className={styles.inputField} />
                            <span className={styles.amountSeparator}>/</span>
                            <input type="number" value={targetConsumption} onChange={handleTargetChange} className={`${styles.inputField} ${styles.targetInput}`} />
                            <span className={styles.amountUnit}>&nbsp;만원</span>
                        </div>
                    ) : (
                        <div className={styles.viewAmountWrapper}>
                            <div className={styles._140}>{currentConsumption}</div>
                            <div className={styles._200}>/{targetConsumption} 만원</div>
                        </div>
                    )}
                    <button onClick={handleEditToggle} className={styles.editButton}>
                        {isEditing ? '저장' : '수정'}
                    </button>
                </div>
                <ProgressBar
                  value={currentConsumption}
                  max={targetConsumption}
                  label={`${percentage}%`}
                  percentageColor="#9BC4B0"
                  isThick={true}
                />
              </div>
            </div>
          </div>
          <div className={styles.frame40}> {/* Corresponds to frame-40 */}
            <div className={styles.frame39}> {/* Corresponds to frame-39 */}
              <div className={styles.div6}>지난 달의 목표금액</div>
              <div className={styles.frame20}> {/* Corresponds to frame-20 */}
                <div className={styles.frame37}>
                  <div className={styles.frame36}>
                    <div className={styles._240}>240</div>
                    <div className={styles._2002}>/200 만원</div>
                  </div>
                  <ProgressBar
                    value={140} // Changed from 120 to 140 for 70%
                    max={200}
                    label="70%" // Changed from 60% to 70%
                    percentageColor="#9BC4B0"
                    isThick={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.frame18}> {/* Corresponds to frame-18 */}
        <div className={styles.frame196}>
          <div className={styles.div3}>오늘의 소비현황</div>
          <div className={styles.line4}></div>
        </div>
        <div className={styles.frame195}> {/* Corresponds to frame-195 */}
          <div className={styles.frame43}> {/* Corresponds to frame-43 */}
            <div className={styles.frame41}>
              <div className={styles.div5}>이번 주 목표금액</div>
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
                            <div className={styles._140}>{weeklyCurrentConsumption}</div>
                            <div className={styles._200}>/{weeklyTargetConsumption} 만원</div>
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
          </div>
          <div className={styles.frame342}> {/* Corresponds to frame-342 */}
            <div className={styles.frame31}>
              <div className={styles.frame26}>
                <div className={styles.ellipseFill4}></div>
                <div className={styles.div4}>식비</div>
              </div>
              <ProgressBar value={50} max={100} label="50/100" percentageColor="#C9D3D0" />
            </div>
            <div className={styles.frame322}>
              <div className={styles.frame26}>
                <div className={styles.ellipseFill5}></div>
                <div className={styles.div4}>교통비</div>
              </div>
              <ProgressBar value={20} max={40} label="20/40" percentageColor="#C9D3D0" />
            </div>
            <div className={styles.frame332}>
              <div className={styles.frame26}>
                <div className={styles.ellipseFill5}></div>
                <div className={styles.div4}>교통비</div>
              </div>
              <ProgressBar value={20} max={40} label="20/40" percentageColor="#C9D3D0" />
            </div>
            <div className={styles.frame343}>
              <div className={styles.frame26}>
                <div className={styles.ellipseFill5}></div>
                <div className={styles.div4}>교통비</div>
              </div>
              <ProgressBar value={20} max={40} label="20/40" percentageColor="#C9D3D0" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};