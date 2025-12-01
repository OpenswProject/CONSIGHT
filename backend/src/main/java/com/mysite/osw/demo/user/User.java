package com.mysite.osw.demo.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "users") // 테이블 이름을 'users'로 강제 지정 (에러 방지)
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;

    // 포인트
    private int points; 

    // 레벨 (1~5단계)
    // DB에 저장될 때 기본값 1로 저장
    @Column(columnDefinition = "integer default 1")
    private int level = 1; 

    // 포인트 적립 메서드 (이걸 호출하면 레벨도 같이 계산됨)
    public void addPoints(int amount) {
        this.points += amount;
        calculateLevel(); // 포인트가 변했으니 레벨 재계산
    }

    // ⭐ [수정된 레벨 계산 로직]
    // 1레벨: 0 ~ 49
    // 2레벨: 50 ~ 149
    // 3레벨: 150 ~ 299
    // 4레벨: 300 ~ 499
    // 5레벨: 500 이상
    private void calculateLevel() {
        if (this.points < 50) {
            this.level = 1;
        } else if (this.points < 150) {
            this.level = 2;
        } else if (this.points < 300) {
            this.level = 3;
        } else if (this.points < 500) {
            this.level = 4;
        } else {
            this.level = 5;
        }
    }

    // 생성자 (테스트용)
    public User(String username, String password, int points) {
        this.username = username;
        this.password = password;
        this.points = points;
        calculateLevel(); // 처음 생성할 때도 포인트에 맞춰 레벨 설정
    }
}