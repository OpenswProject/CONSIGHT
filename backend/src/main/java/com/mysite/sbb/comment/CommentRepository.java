package com.mysite.sbb.comment;

import com.mysite.sbb.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByReview(Review review);
}
