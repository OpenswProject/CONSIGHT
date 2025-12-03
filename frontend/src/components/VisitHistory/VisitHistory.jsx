import React, { useState, useEffect } from "react";
import styles from "./VisitHistory.module.css";
import { format, subDays, isSameDay } from 'date-fns'; // Import date-fns for date manipulation

export const VisitHistory = ({ onAttend }) => { // onAttend prop 추가
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn("No JWT token found, cannot fetch user data.");
      return;
    }
    try {
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setUserData(data.data);
      } else {
        console.error("Failed to fetch user data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const totalDays = 265;
  const today = new Date();
  const daysToDisplay = Array.from({ length: totalDays }, (_, i) => {
    const date = subDays(today, totalDays - 1 - i); // Calculate date for each block
    return {
      date: date,
      isAttended: userData && userData.lastAttendanceDate && isSameDay(date, new Date(userData.lastAttendanceDate)),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}> {/* 새로운 div로 title과 attendText를 묶음 */}
        <div className={styles.title}>방문 기록</div>
        <div className={styles.attendText} onClick={onAttend}>출석하기</div> {/* onAttend prop 사용 */}
      </div>
      <div className={styles.graph}>
        {daysToDisplay.map((day, index) => (
          <div
            key={index}
            className={styles.day}
            style={{ backgroundColor: day.isAttended ? `var(--green-8b)` : `rgba(100, 120, 130, 0.5)` }} // Use green-8b for attended days
            title={format(day.date, 'yyyy-MM-dd') + (day.isAttended ? ' (출석)' : '')}
          ></div>
        ))}
      </div>
    </div>
  );
};
