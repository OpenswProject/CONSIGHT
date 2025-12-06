import React, { useState, useEffect } from "react";
import styles from "./VisitHistory.module.css";
import { format, subDays, isSameDay } from 'date-fns'; // Import date-fns for date manipulation

export const VisitHistory = ({ onAttend, currentUser }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const fetchAttendanceHistory = async () => {
    if (!currentUser || !currentUser.id) {
      // Silently return if no user, as this can be a normal state
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn("No JWT token found, cannot fetch attendance history.");
      return;
    }

    try {
      const response = await fetch(`/api/attendance/history?userId=${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array before setting
        setAttendanceHistory(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch attendance history:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceHistory();
  }, [currentUser]); // Refetch when user changes

  const handleAttendClick = async () => {
    // onAttend should be an async function that returns a boolean for success
    const success = await onAttend(); 
    if (success) {
      // If attendance was successful, refetch the history to update the UI
      fetchAttendanceHistory();
    }
  };

  const totalDays = 265;
  const today = new Date();
  const daysToDisplay = Array.from({ length: totalDays }, (_, i) => {
    const date = subDays(today, totalDays - 1 - i);
    // Check if the current date is in the fetched history
    const isAttended = attendanceHistory.some(attendedDate => isSameDay(date, new Date(attendedDate)));
    return {
      date: date,
      isAttended: isAttended,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>방문 기록</div>
        <div className={styles.attendText} onClick={handleAttendClick}>출석하기</div>
      </div>
      <div className={styles.graph}>
        {daysToDisplay.map((day, index) => (
          <div
            key={index}
            className={styles.day}
            style={{ backgroundColor: day.isAttended ? `var(--green-8b)` : `rgba(100, 120, 130, 0.5)` }}
            title={format(day.date, 'yyyy-MM-dd') + (day.isAttended ? ' (출석)' : '')}
          ></div>
        ))}
      </div>
    </div>
  );
};