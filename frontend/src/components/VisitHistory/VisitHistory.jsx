import React, { useState } from 'react';
import styles from './VisitHistory.module.css';

const VisitHistory = ({ onAttend, currentUser, attendanceHistory, isAttendedToday }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 툴팁을 표시할 블록의 인덱스

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day

  // Generate last 144 days
  const last144Days = Array.from({ length: 144 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (143 - i)); // 143 - i ensures rightmost is today
    return date;
  });

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleAttendClick = async () => {
    await onAttend();
  };

  return (
    <div className={styles.frame45}>
      <div className={styles.frame6}>
        <div className={styles.frame282}>
          <div className={styles.div}>방문 기록</div>
          <div className={styles.frame914}>
            <div className={styles.div2}>
              <button 
                className={styles.attendButton} 
                onClick={handleAttendClick}
                disabled={isAttendedToday || !currentUser}
              >
                {isAttendedToday ? '오늘 출석 완료' : '출석하기'}
              </button>
            </div>
          </div>
        </div>
        <div className={styles.frame283}>
          {last144Days.map((date, index) => {
            const isAttended = attendanceHistory.some(attendedDate => 
              attendedDate.getFullYear() === date.getFullYear() &&
              attendedDate.getMonth() === date.getMonth() &&
              attendedDate.getDate() === date.getDate()
            );
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div
                key={index}
                className={`${styles.rectangle10} ${isAttended ? styles.attended : styles.notAttended} ${isToday ? styles.today : ''}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredIndex === index && (
                  <div className={styles.tooltip}>
                    {date.toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { VisitHistory };
