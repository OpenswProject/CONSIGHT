package com.mysite.osw.demo.service;

import com.mysite.osw.demo.domain.Attendance;
import com.mysite.osw.demo.repository.AttendanceRepository;
import com.mysite.osw.demo.user.User;
import com.mysite.osw.demo.user.DemoUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final DemoUserRepository userRepository;

    private static final int DAILY_POINT = 10;
    private static final int WEEKLY_BONUS = 100;
    private static final int MONTHLY_BONUS = 500;

    // 출석 체크 (기존 코드 유지)
    @Transactional
    public String checkAttendance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsByUserAndDate(user, today)) {
            return "오늘은 이미 출석체크를 완료했습니다! 내일 또 오세요.";
        }

        Attendance attendance = new Attendance(user, today);
        attendanceRepository.save(attendance);

        int pointToAdd = DAILY_POINT;
        int streakDays = calculateStreak(user, today);

        if (streakDays % 7 == 0) pointToAdd += WEEKLY_BONUS;
        if (streakDays % 30 == 0) pointToAdd += MONTHLY_BONUS;

        user.addPoints(pointToAdd); 

        return String.format("출석 완료! %d 포인트 지급 (현재 %d일 연속, 레벨 %d)", pointToAdd, streakDays, user.getLevel());
    }

    // ⭐ [추가] 특정 유저의 출석 날짜 리스트 가져오기 (달력 색칠용)
    @Transactional(readOnly = true)
    public List<LocalDate> getAttendanceHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다."));
        
        // 유저의 모든 출석 기록을 가져와서 날짜(LocalDate)만 뽑아서 리스트로 반환
        return attendanceRepository.findByUserOrderByDateDesc(user).stream()
                .map(Attendance::getDate)
                .collect(Collectors.toList());
    }

    // ⭐ [추가] 유저 정보(포인트, 레벨) 가져오기
    @Transactional(readOnly = true)
    public User getUserInfo(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 없습니다."));
    }

    // 연속 출석 계산 (기존 코드 유지)
    private int calculateStreak(User user, LocalDate today) {
        List<Attendance> history = attendanceRepository.findByUserOrderByDateDesc(user);
        int streak = 1;
        LocalDate targetDate = today.minusDays(1);

        for (Attendance att : history) {
            if (att.getDate().isEqual(today)) continue;
            if (att.getDate().isEqual(targetDate)) {
                streak++;
                targetDate = targetDate.minusDays(1);
            } else {
                break;
            }
        }
        return streak;
    }
}