import React, { useState, useEffect } from "react";
import styles from "./ConsumptionStatus.module.css";
import { Line } from 'rc-progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'; // recharts import

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

export const ConsumptionStatus = ({ 
  username, 
  currentUser, 
  points,
  monthlyCategories,
  weeklyCategories,
  weeklyCurrentConsumption,
  weeklyTargetConsumption,
  monthlyCurrentConsumption,
  monthlyTargetConsumption,
  lastFeedback,
  navigate
}) => {
  // Monthly Consumption
  const monthlyPercentage = monthlyTargetConsumption > 0 ? Math.round((monthlyCurrentConsumption / monthlyTargetConsumption) * 100) : 0;

  // Weekly Consumption
  const weeklyPercentage = weeklyTargetConsumption > 0 ? Math.round((weeklyCurrentConsumption / weeklyTargetConsumption) * 100) : 0;

  // Pie Chart Data - Use props directly, ensure it's an array.
  const pieData = Array.isArray(monthlyCategories) 
    ? monthlyCategories.map(cat => ({ name: cat.name, value: cat.currentAmount }))
    : [];

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

  return (
    <div className={styles.consumptionBoxesContainer}> {/* New container for the three main sections */}
      <div className={styles.frame21}> {/* Corresponds to frame-21 */}
        <div className={styles.pieChart}> {/* Corresponds to pie-chart */}
          <div className={styles.frame25}> {/* Corresponds to frame-25 */}
            <div className={styles.frame33}> {/* Corresponds to frame-33 */}
              <div className={styles.frame24}> {/* Corresponds to frame-24 */}
                <div className={styles.frame196}> {/* Corresponds to frame-196 */}
                  <div className={styles.consumptionTitleContainer}>
                    <div className={styles.div3}>
                      {currentUser ? `${currentUser.username}님의 소비현황` : "Guest님의 소비현황"}
                    </div>
                    {currentUser && (
                      <div className={styles.pointsInfo}>
                        <img className={styles.vector} src="/leaf_point_icon.svg" alt="Leaf Point Icon" />
                        <div className={styles.frame914}>
                          <div className={styles._4000}>{points}</div>
                        </div>
                        <div className={styles._6000pt}>승급까지 -6000PT</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.frame196}>
                  <div className={styles.div3}>월 소비현황</div>
                  <div className={styles.line4_short}></div>
                </div>
              </div>
              <div className={styles.frame22}> {/* Corresponds to frame-22 */}
                <div className={styles.frame23}> {/* Corresponds to frame-23 */}
                  <div className={styles.frame44}> {/* Corresponds to frame-44 */}
                    {pieData.length > 0 ? (
                      <>
                        <div className={styles.legends}> {/* Corresponds to legends */}
                          <div className={styles.frame35}> {/* Corresponds to frame-35 */}
                            {pieData.map((entry, index) => (
                              <div className={styles.legend} key={`legend-${index}`}>
                                <div className={styles.frame27}>
                                  <div className={styles.ellipseFill} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                  <div className={styles.div4}>{entry.name}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={styles.mainChart}> {/* Corresponds to main-chart */}
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                labelLine={false}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    ) : (
                      <div className={styles.noDataMessage}>월간 소비 데이터가 없습니다.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Dynamic Progress Bars based on monthlyCategories */}
          <div className={styles.frame34}>
            {monthlyCategories.slice(0, 4).map((category, index) => (
              <div className={styles.frame31} key={category.id || index}>
                <div className={styles.frame26}>
                  <div className={styles.ellipseFill} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className={styles.div4}>{category.name}</div>
                </div>
                <ProgressBar value={category.currentAmount} max={category.targetAmount} label={`${category.currentAmount}/${category.targetAmount}`} percentageColor={COLORS[index % COLORS.length]} />
              </div>
            ))}
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
                    <div className={styles.viewAmountWrapper}>
                        <div className={styles._140}>{monthlyCurrentConsumption}</div>
                        <div className={styles._200}>{`/`}{monthlyTargetConsumption} 만원</div>
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
          <div className={styles.frame40}> {/* Corresponds to frame-40 */}
            <div className={styles.frame39}> {/* Corresponds to frame-39 */}
              <div className={styles.div6}>지난 달의 목표금액</div>
              <div className={styles.frame20}> {/* Corresponds to frame-20 */}
                <div className={styles.frame37}>
                  <div className={styles.frame36}>
                    <div className={styles._240}>{lastFeedback ? lastFeedback.currentConsumption : 0}</div>
                    <div className={styles._2002}>{`/`}{lastFeedback ? lastFeedback.targetConsumption : 0} 만원</div>
                  </div>
                  <ProgressBar
                    value={lastFeedback ? lastFeedback.currentConsumption : 0}
                    max={lastFeedback ? lastFeedback.targetConsumption : 0}
                    label={`${lastFeedback && lastFeedback.targetConsumption > 0 ? Math.round((lastFeedback.currentConsumption / lastFeedback.targetConsumption) * 100) : 0}%`}
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
          <div className={styles.div3}>주간 소비현황</div>
          <div className={styles.line4}></div>
        </div>
        <div className={styles.frame195}> {/* Corresponds to frame-195 */}
          <div className={styles.frame43}> {/* Corresponds to frame-43 */}
            <div className={styles.frame41}>
              <div className={styles.div5}>이번 주 목표금액</div>
              <div className={styles.frame19}>
                <div className={styles.frame37}>
                  <div className={styles.frame36}>
                    <div className={styles.viewAmountWrapper}>
                        <div className={styles._140}>{weeklyCurrentConsumption}</div>
                        <div className={styles._200}>{`/`}{weeklyTargetConsumption} 만원</div>
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
          {/* Dynamic weekly progress bars */}
          <div className={styles.frame342}>
            {(weeklyCategories || []).slice(0, 3).map((category, index) => (
              <div className={styles.frame31} key={category.id || index}>
                <div className={styles.frame26}>
                  <div className={styles.ellipseFill} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className={styles.div4}>{category.name}</div>
                </div>
                <ProgressBar value={category.currentAmount} max={category.targetAmount} label={`${category.currentAmount}/${category.targetAmount}`} percentageColor={COLORS[index % COLORS.length]} />
              </div>
            ))}
          </div>
          <div className={styles.seeMoreButton} onClick={() => navigate('/consume-plan')}>
            더보기
          </div>
        </div>
      </div>
    </div>
  );
};