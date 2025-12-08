package com.mysite.sbb.attendance;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserService userService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping("")
    public ResponseEntity<?> attend(Principal principal) {
        SiteUser siteUser = userService.getUser(principal.getName());
        try {
            attendanceService.create(siteUser);
            return ResponseEntity.ok(Map.of("message", "Attendance recorded successfully!", "points", siteUser.getPoints()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error recording attendance: " + e.getMessage()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/history")
    public ResponseEntity<List<LocalDate>> getAttendanceHistory(Principal principal) {
        SiteUser siteUser = userService.getUser(principal.getName());
        List<Attendance> history = attendanceService.getAttendanceHistory(siteUser);
        List<LocalDate> attendanceDates = history.stream()
                .map(Attendance::getAttendanceDate)
                .collect(Collectors.toList());
        return ResponseEntity.ok(attendanceDates);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/today")
    public ResponseEntity<Map<String, Boolean>> isAttendedToday(Principal principal) {
        SiteUser siteUser = userService.getUser(principal.getName());
        boolean attended = attendanceService.isAttendedToday(siteUser);
        return ResponseEntity.ok(Map.of("attended", attended));
    }
}
