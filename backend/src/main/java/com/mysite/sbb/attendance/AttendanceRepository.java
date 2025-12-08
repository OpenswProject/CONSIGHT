package com.mysite.sbb.attendance;

import com.mysite.sbb.user.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findBySiteUserAndAttendanceDate(SiteUser siteUser, LocalDate attendanceDate);
    List<Attendance> findBySiteUserOrderByAttendanceDateDesc(SiteUser siteUser);
    List<Attendance> findBySiteUserAndAttendanceDateBetweenOrderByAttendanceDateAsc(SiteUser siteUser, LocalDate startDate, LocalDate endDate);
}
