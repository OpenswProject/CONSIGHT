package com.mysite.sbb.user;

// 로그인 요청 시 사용할 데이터 전송 객체 (DTO)
// Java 17의 record 기능을 사용하여 불변 객체로 간단히 정의
public record LoginRequest(String username, String password) {
}
