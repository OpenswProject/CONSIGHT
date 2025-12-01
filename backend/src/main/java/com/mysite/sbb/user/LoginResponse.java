package com.mysite.sbb.user;

// 로그인 성공 시 응답으로 보낼 데이터 전송 객체 (DTO)
public record LoginResponse(String token) {
}
