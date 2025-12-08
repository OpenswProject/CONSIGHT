package com.mysite.sbb.attendance;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository; // SiteUser의 points를 업데이트하기 위해 필요

    private static final int ATTENDANCE_POINTS = 10; // 출석 시 지급할 포인트

    @Transactional
    public Attendance create(SiteUser user) {
        LocalDate today = LocalDate.now();

        // 오늘 이미 출석했는지 확인
        Optional<Attendance> existingAttendance = attendanceRepository.findBySiteUserAndAttendanceDate(user, today);
        if (existingAttendance.isPresent()) {
            throw new IllegalStateException("You have already attended today.");
        }

        // 출석 기록 생성
        Attendance attendance = new Attendance();
        attendance.setSiteUser(user);
        attendance.setAttendanceDate(today);
        this.attendanceRepository.save(attendance);

        // 사용자 포인트 업데이트
        user.setPoints(user.getPoints() + ATTENDANCE_POINTS);
        user.setLastAttendanceDate(today); // 마지막 출석일 업데이트
        this.userRepository.save(user); // 사용자 정보 업데이트

        return attendance;
    }

    public List<Attendance> getAttendanceHistory(SiteUser user) {
        // 최근 30일간의 출석 기록을 가져옵니다.
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(29); // 오늘 포함 30일
        return attendanceRepository.findBySiteUserAndAttendanceDateBetweenOrderByAttendanceDateAsc(user, startDate, endDate);
    }

    public boolean isAttendedToday(SiteUser user) {
        return attendanceRepository.findBySiteUserAndAttendanceDate(user, LocalDate.now()).isPresent();
    }
}
