package com.mysite.osw.demo.controller;

import com.mysite.osw.demo.service.AttendanceService;
import com.mysite.osw.demo.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceController {

    private final AttendanceService attendanceService;

    // 1. 출석 체크 요청 (POST)
    @PostMapping("/check")
    public ResponseEntity<String> doAttendance(@RequestParam Long userId) {
        try {
            String result = attendanceService.checkAttendance(userId);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    // 2. ⭐ [추가] 달력 색칠용: 나의 출석 기록 날짜들 조회 (GET)
    // 요청: GET /api/attendance/history?userId=1
    @GetMapping("/history")
    public ResponseEntity<List<LocalDate>> getHistory(@RequestParam Long userId) {
        return ResponseEntity.ok(attendanceService.getAttendanceHistory(userId));
    }

    // 3. ⭐ [추가] 메인 화면용: 내 포인트와 레벨 조회 (GET)
    // 요청: GET /api/attendance/info?userId=1
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getUserInfo(@RequestParam Long userId) {
        User user = attendanceService.getUserInfo(userId);
        
        // 프론트에서 쓰기 편하게 JSON으로 포인트와 레벨을 묶어서 보냄
        Map<String, Object> response = Map.of(
            "username", user.getUsername(),
            "points", user.getPoints(), // 나뭇잎 옆 숫자
            "level", user.getLevel()    // 에셋 단계 (1~5)
        );
        return ResponseEntity.ok(response);
    }
}