package com.mysite.sbb.follow;

import com.mysite.sbb.user.SiteUser;
import lombok.Getter;

@Getter
public class UserDto {
    private String username;
    // Add other fields you want to expose, e.g., profile picture URL

    public UserDto(SiteUser user) {
        this.username = user.getUsername();
    }
}
