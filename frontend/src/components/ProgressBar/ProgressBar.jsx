import React, { useState, useEffect } from 'react';
import { Line } from 'rc-progress';
import styles from './ProgressBar.module.css';

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

  const strokeLinecap = "round";

  const containerClassName = isThick ? styles.thickProgressBarContainer : styles.progressBarContainer;
  const barClassName = isThick ? styles.thickProgressBar : styles.progressBar;
  const labelClassName = isThick ? styles.thickProgressLabel : styles.progressLabel;

  let finalStrokeColor = percentageColor;

  return (
    <div className={containerClassName}>
      <Line
        percent={animatedPercent}
        strokeWidth={isThick ? 10 : 6}
        strokeColor={finalStrokeColor || "linear-gradient(-90deg, rgba(130, 183, 158, 0.8) 0%, rgba(221, 236, 231, 1) 100%)"}
        trailWidth={isThick ? 10 : 6}
        trailColor="#e9e9e9"
        strokeLinecap={strokeLinecap}
        className={barClassName}
      />
      {label && <div className={labelClassName} style={{ color: "#676767" }}>{label}</div>}
    </div>
  );
};
