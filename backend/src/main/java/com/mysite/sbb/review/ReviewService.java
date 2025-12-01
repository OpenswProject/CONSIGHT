package com.mysite.sbb.review;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mysite.sbb.DataNotFoundException;
import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewCommentRepository commentRepository;
    private final ReviewLikeRepository likeRepository;
    private final ReviewBookmarkRepository bookmarkRepository;
    private final UserService userService;

    // ==========================
    // 1. 리뷰 피드 조회
    // ==========================
    public Page<Review> getFeed(int page, String sort, String searchType, String keyword) {
        Sort sortObj;

        if ("likes".equals(sort)) {
            sortObj = Sort.by(Sort.Order.desc("likeCount"), Sort.Order.desc("id"));
        } else if ("views".equals(sort)) {
            sortObj = Sort.by(Sort.Order.desc("viewCount"), Sort.Order.desc("id"));
        } else {
            sortObj = Sort.by(Sort.Order.desc("createDate")); // 최신순
        }

        Pageable pageable = PageRequest.of(page, 10, sortObj);

        if (keyword == null || keyword.isBlank()) {
            return reviewRepository.findAll(pageable);
        }

        return switch (searchType) {
            case "title" -> reviewRepository.findByTitleContaining(keyword, pageable);
            case "content" -> reviewRepository.findByContentContaining(keyword, pageable);
            case "user" -> reviewRepository.findByAuthor_Username(keyword, pageable);
            case "category" -> {
                Category cat = Category.valueOf(keyword.toUpperCase());
                yield reviewRepository.findByCategory(cat, pageable);
            }

            default -> reviewRepository.findAll(pageable);
        };
    }

    // ==========================
    // 2. 리뷰 상세 조회
    // ==========================
    public Review getReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("review not found"));
    }

    // ==========================
    // 3. 리뷰 작성
    // ==========================
    @Transactional
    public Review create(String title, String content, Category category, SiteUser author) {
        Review r = new Review();
        r.setTitle(title);
        r.setContent(content);
        r.setCategory(category);
        r.setAuthor(author);
        r.setViewCount(0);
        r.setLikeCount(0);
        r.setCreateDate(LocalDateTime.now());
        return reviewRepository.save(r);
    }

    // ==========================
    // 4. 리뷰 수정
    // ==========================
    @Transactional
    public void modify(Review review, String title, String content, Category category) {
        review.setTitle(title);
        review.setContent(content);
        review.setCategory(category);
        review.setModifyDate(LocalDateTime.now());
        reviewRepository.save(review);
    }

    // ==========================
    // 5. 리뷰 삭제
    // ==========================
    @Transactional
    public void delete(Review review) {
        reviewRepository.delete(review);
    }

    // ==========================
    // 6. 조회수 증가
    // ==========================
    @Transactional
    public void increaseViewCount(Review review) {
        review.setViewCount(review.getViewCount() + 1);
        reviewRepository.save(review);
    }

    // ==========================
    // 7. 좋아요 토글
    // ==========================
    @Transactional
    public boolean toggleLike(Review review, SiteUser user) {
        var opt = likeRepository.findByReviewAndUser(review, user);
        if (opt.isPresent()) {
            likeRepository.delete(opt.get());
            review.setLikeCount(review.getLikeCount() - 1);
            reviewRepository.save(review);
            return false;
        } else {
            ReviewLike like = new ReviewLike(null, review, user);
            likeRepository.save(like);
            review.setLikeCount(review.getLikeCount() + 1);
            reviewRepository.save(review);
            return true;
        }
    }

    // ==========================
    // 8. 북마크 토글
    // ==========================
    @Transactional
    public boolean toggleBookmark(Review review, SiteUser user) {
        var opt = bookmarkRepository.findByReviewAndUser(review, user);
        if (opt.isPresent()) {
            bookmarkRepository.delete(opt.get());
            return false;
        } else {
            ReviewBookmark bm = new ReviewBookmark(null, review, user);
            bookmarkRepository.save(bm);
            return true;
        }
    }

    // ==========================
    // 9. 댓글 작성
    // ==========================
    @Transactional
    public ReviewComment addComment(Review review, SiteUser user, String content) {
        ReviewComment c = new ReviewComment();
        c.setReview(review);
        c.setAuthor(user);
        c.setContent(content);
        c.setCreateDate(LocalDateTime.now());
        return commentRepository.save(c);
    }

    // ==========================
    // 10. 마이페이지
    // ==========================
    public List<ReviewComment> getCommentsByUser(SiteUser user) {
        return commentRepository.findByAuthor(user);
    }

    public List<Review> getReviewsByAuthor(SiteUser user, int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Order.desc("createDate")));
        return reviewRepository.findByAuthor(user, pageable).getContent();
    }

    public List<Review> getReviewsLikedByUser(SiteUser user) {
        return likeRepository.findByUser(user).stream()
                .map(ReviewLike::getReview)
                .toList();
    }

    public List<Review> getReviewsBookmarkedByUser(SiteUser user) {
        return bookmarkRepository.findByUser(user).stream()
                .map(ReviewBookmark::getReview)
                .toList();
    }
}
