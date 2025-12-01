package com.mysite.osw.demo.domain;

import com.mysite.osw.demo.user.User; // 기존 User 클래스 import 필요
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity // 이 클래스가 DB 테이블이 됩니다.
@Getter @Setter
@NoArgsConstructor // 기본 생성자 자동 생성
@Table(name = "attendance") // 테이블 이름 지정
public class Attendance {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Increment (1, 2, 3... 자동 증가)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 다대일 관계 (한 유저가 여러 번 출석 가능)
    @JoinColumn(name = "user_id") // 외래키 컬럼명
    private User user;

    private LocalDate date; // 출석 날짜 (YYYY-MM-DD)

    // 생성자: 유저와 날짜를 받아 객체 생성
    public Attendance(User user, LocalDate date) {
        this.user = user;
        this.date = date;
    }
}