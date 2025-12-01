package com.mysite.osw.demo.repository;

import com.mysite.osw.demo.domain.Attendance;
import com.mysite.osw.demo.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // 1. 중복 출석 방지: 특정 유저가 오늘 날짜에 출석 기록이 있는지 확인
    // SQL: SELECT count(*) > 0 FROM attendance WHERE user_id = ? AND date = ?
    boolean existsByUserAndDate(User user, LocalDate date);

    // 2. 연속 출석 계산용: 특정 유저의 모든 기록을 날짜 최신순으로 조회
    // SQL: SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC
    List<Attendance> findByUserOrderByDateDesc(User user);
}