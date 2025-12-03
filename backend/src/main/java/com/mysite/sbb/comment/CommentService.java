package com.mysite.sbb.comment;

import com.mysite.sbb.DataNotFoundException;
import com.mysite.sbb.review.Review;
import com.mysite.sbb.review.ReviewService;
import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewService reviewService; // ReviewService 주입
    private final UserService userService; // UserService 주입

    @Transactional
    public Comment create(Review review, String content, SiteUser author) {
        log.info("댓글 생성 요청: reviewId={}, content='{}', authorUsername='{}'", review.getId(), content, author.getUsername());
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCreateDate(LocalDateTime.now());
        comment.setModifyDate(null); // 추가: 초기에는 수정되지 않았으므로 null
        comment.setAuthor(author);
        comment.setReview(review);
        this.commentRepository.save(comment);
        log.info("댓글 저장 완료. commentId={}", comment.getId());

        // 리뷰의 댓글 수 증가
        log.info("댓글 수 업데이트 전: reviewId={}, commentCount={}", review.getId(), review.getCommentCount());
        review.setCommentCount((review.getCommentCount() != null ? review.getCommentCount() : 0) + 1);
        log.info("댓글 수 업데이트 후: reviewId={}, commentCount={}", review.getId(), review.getCommentCount());
        reviewService.save(review);
        log.info("리뷰 저장 완료 (댓글 수 업데이트).");

        return comment;
    }

    public List<Comment> getCommentsByReview(Review review) {
        return this.commentRepository.findByReview(review);
    }

    // reviewId와 username을 받아 댓글을 생성하는 메서드 (Controller에서 사용)
    @Transactional
    public Comment addComment(Integer reviewId, String authorUsername, String content) {
        Review review = reviewService.getReview(reviewId); // reviewService에서 review를 가져오는 메서드 필요
        SiteUser author = userService.getUser(authorUsername); // userService에서 user를 가져오는 메서드 필요

        if (review == null) {
            throw new DataNotFoundException("Review not found");
        }
        if (author == null) {
            throw new DataNotFoundException("User not found");
        }

        return create(review, content, author);
    }
}
