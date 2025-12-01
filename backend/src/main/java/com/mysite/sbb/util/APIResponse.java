package com.mysite.sbb.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class APIResponse<T> {
    private boolean success;
    private String message;
    private int status;
    private T data;

    public static <T> APIResponse<T> success(String message, T data) {
        return new APIResponse<>(true, message, HttpStatus.OK.value(), data);
    }

    public static <T> APIResponse<T> success(String message) {
        return new APIResponse<>(true, message, HttpStatus.OK.value(), null);
    }

    public static <T> APIResponse<T> error(String message, int status, T data) {
        return new APIResponse<>(false, message, status, data);
    }

    public static <T> APIResponse<T> error(String message, int status) {
        return new APIResponse<>(false, message, status, null);
    }
}
