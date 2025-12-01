import React from "react";
import styles from "./VisitHistory.module.css";

export const VisitHistory = () => {
  const totalDays = 265; // Adjusted to fit 5 rows and 53 columns without scrollbar
  const days = Array.from({ length: totalDays }, (_, i) => {
    const intensity = Math.random();
    return {
      level: Math.floor(intensity * 5), // 0-4
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.title}>방문 기록</div>
      <div className={styles.graph}>
        {days.map((day, index) => (
          <div
            key={index}
            className={styles.day}
            style={{ backgroundColor: day.level === 0 ? `rgba(100, 120, 130, 0.5)` : `rgba(130, 183, 158, 0.5)` }} /* Fixed default/active color with 50% transparency */
            title={`Day ${index + 1}, Level ${day.level}`}
          ></div>
        ))}
      </div>
    </div>
  );
};
