package com.mysite.sbb.review;

import java.security.Principal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://devtest-theta-six.vercel.app"})
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    // 1. 리뷰 피드 (정렬 + 검색)
    @GetMapping
    public ResponseEntity<Page<Review>> list(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "sort", defaultValue = "latest") String sort,
            @RequestParam(name = "type", defaultValue = "all") String type,
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        Page<Review> result = reviewService.getFeed(page, sort, type, keyword);
        return ResponseEntity.ok(result);
    }

    // 2. 리뷰 상세보기 + 조회수 증가
    @GetMapping("/{id}")
    public ResponseEntity<Review> detail(@PathVariable("id") Long id) {
        Review review = reviewService.getReview(id);
        reviewService.increaseViewCount(review);
        return ResponseEntity.ok(review);
    }

    // 3. 리뷰 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<Review> create(
            @RequestBody ReviewCreateRequest req,
            Principal principal
    ) {
        SiteUser user = userService.getUser(principal.getName());
        Review review = reviewService.create(req.getTitle(), req.getContent(), req.getCategory(), user);
        return ResponseEntity.ok(review);
    }

    // 4. 리뷰 수정
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<Review> modify(
            @PathVariable("id") Long id,
            @RequestBody ReviewCreateRequest req,
            Principal principal
    ) {
        Review review = reviewService.getReview(id);
        if (!review.getAuthor().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(403).build();
        }
        reviewService.modify(review, req.getTitle(), req.getContent(), req.getCategory());
        return ResponseEntity.ok(review);
    }

    // 5. 리뷰 삭제
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable("id") Long id,
            Principal principal
    ) {
        Review review = reviewService.getReview(id);
        if (!review.getAuthor().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(403).build();
        }
        reviewService.delete(review);
        return ResponseEntity.ok().build();
    }

    // 6. 좋아요 토글
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/like")
    public ResponseEntity<LikeResponse> toggleLike(
            @PathVariable("id") Long id,
            Principal principal
    ) {
        Review review = reviewService.getReview(id);
        SiteUser user = userService.getUser(principal.getName());
        boolean liked = reviewService.toggleLike(review, user);
        return ResponseEntity.ok(new LikeResponse(liked, review.getLikeCount()));
    }

    // 7. 북마크 토글
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<BookmarkResponse> toggleBookmark(
            @PathVariable("id") Long id,
            Principal principal
    ) {
        Review review = reviewService.getReview(id);
        SiteUser user = userService.getUser(principal.getName());
        boolean bookmarked = reviewService.toggleBookmark(review, user);
        return ResponseEntity.ok(new BookmarkResponse(bookmarked));
    }

    // 8. 댓글 작성
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/comments")
    public ResponseEntity<ReviewComment> addComment(
            @PathVariable("id") Long id,
            @RequestBody CommentCreateRequest req,
            Principal principal
    ) {
        Review review = reviewService.getReview(id);
        SiteUser user = userService.getUser(principal.getName());
        ReviewComment c = reviewService.addComment(review, user, req.getContent());
        return ResponseEntity.ok(c);
    }

    // 9. 마이페이지용: 내가 작성한 / 댓글 단 / 좋아요 / 북마크한 리뷰
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<MyReviewResponse> myReviews(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        List<Review> written = reviewService.getReviewsByAuthor(user, 0);
        List<Review> liked = reviewService.getReviewsLikedByUser(user);
        List<Review> bookmarked = reviewService.getReviewsBookmarkedByUser(user);
        List<ReviewComment> comments = reviewService.getCommentsByUser(user);

        MyReviewResponse res = new MyReviewResponse(written, liked, bookmarked, comments);
        return ResponseEntity.ok(res);
    }
}
