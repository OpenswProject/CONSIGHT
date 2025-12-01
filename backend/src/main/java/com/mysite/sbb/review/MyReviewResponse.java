package com.mysite.sbb.review;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MyReviewResponse {
    private List<Review> written;
    private List<Review> liked;
    private List<Review> bookmarked;
    private List<ReviewComment> comments;
}
