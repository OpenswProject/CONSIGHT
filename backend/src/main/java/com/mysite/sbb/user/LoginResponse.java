package com.mysite.sbb.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String email;
    private boolean success;
    private String message;
}