package com.mysite.sbb.follow;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FollowCountsDto {
    private long followerCount;
    private long followingCount;
}
