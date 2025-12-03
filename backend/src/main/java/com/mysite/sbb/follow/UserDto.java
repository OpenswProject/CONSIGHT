package com.mysite.sbb.follow;

import com.mysite.sbb.user.SiteUser;
import lombok.Getter;

@Getter
public class UserDto {
    private String username;
    private String email; // email 필드 추가
    private int points; // points 필드 추가
    private int level; // level 필드 추가

    public UserDto(SiteUser user) {
        this.username = user.getUsername();
        this.email = user.getEmail(); // email 값 설정
        this.points = user.getPoints(); // points 값 설정
        this.level = user.getLevel(); // level 값 설정
    }
}
