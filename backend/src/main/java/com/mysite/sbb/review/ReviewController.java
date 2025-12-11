package com.mysite.sbb.review;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import com.mysite.sbb.util.APIResponse;
import com.mysite.sbb.comment.CommentService; // 추가
import com.mysite.sbb.comment.CommentRequest; // 추가
import com.mysite.sbb.comment.Comment; // 추가
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // 추가
import org.springframework.data.domain.PageRequest; // 추가
import org.springframework.data.domain.Sort; // 추가
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import com.mysite.sbb.DataNotFoundException; // 추가
import java.util.List; // 추가

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reviews")
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService; // To get SiteUser from username
    private final CommentService commentService; // 추가

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<APIResponse<?>> createReview(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("productLink") String productLink,
            @RequestParam("reviewContent") String reviewContent,
            @RequestParam(value = "receiptImage", required = false) MultipartFile receiptImage,
            Principal principal // Spring Security Principal to get authenticated user's username
    ) {
        try {
            // Get the authenticated user
            SiteUser siteUser = userService.getUser(principal.getName());

            // Create the review
            reviewService.create(title, category, productLink, reviewContent, receiptImage, siteUser);

            return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success("리뷰가 성공적으로 작성되었습니다."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("리뷰 작성 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @GetMapping
    public ResponseEntity<APIResponse<Page<Review>>> getReviewList(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "kw", defaultValue = "") String kw,
            @RequestParam(value = "searchType", defaultValue = "") String searchType,
            @RequestParam(value = "sort", defaultValue = "createDate,desc") String sort, // sort 파라미터 추가
            Principal principal // Principal 추가
    ) {
        try {
            String username = (principal != null) ? principal.getName() : null; // 사용자명 추출
            Page<Review> reviewList = reviewService.getList(page, kw, searchType, username, sort); // sort 파라미터 전달
            return ResponseEntity.ok(APIResponse.success("리뷰 목록을 성공적으로 불러왔습니다.", reviewList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("리뷰 목록을 불러오는 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @GetMapping("/by-author/{username}")
    public ResponseEntity<APIResponse<Page<Review>>> getReviewsByAuthor(
            @PathVariable("username") String username,
            @RequestParam(value = "page", defaultValue = "0") int page
    ) {
        try {
            SiteUser author = userService.getUser(username);
            Page<Review> reviewList = reviewService.getReviewsByAuthor(author, page);
            return ResponseEntity.ok(APIResponse.success("Author's reviews fetched successfully.", reviewList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("Failed to fetch author's reviews: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<APIResponse<MyReviewResponse>> getMyReviews(Principal principal) {
        try {
            SiteUser siteUser = userService.getUser(principal.getName());
            MyReviewResponse myReviews = reviewService.getMyReviews(siteUser);
            return ResponseEntity.ok(APIResponse.success("내 리뷰 정보를 성공적으로 불러왔습니다.", myReviews));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("내 리뷰 정보를 불러오는 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/commented-by-me")
    public ResponseEntity<APIResponse<Page<Review>>> getCommentedReviews(
            Principal principal,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            SiteUser user = userService.getUser(principal.getName());
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createDate"));
            Page<Review> reviewPage = reviewService.getCommentedReviews(user, pageable);
            return ResponseEntity.ok(APIResponse.success("사용자가 댓글을 단 리뷰 목록을 성공적으로 불러왔습니다.", reviewPage));
        } catch (Exception e) {
            log.error("댓글 단 리뷰 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error("댓글 단 리뷰 목록 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/liked-by-me")
    public ResponseEntity<APIResponse<Page<Review>>> getLikedReviews(
            Principal principal,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            SiteUser user = userService.getUser(principal.getName());
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createDate"));
            Page<Review> reviewPage = reviewService.getLikedReviews(user, pageable);
            return ResponseEntity.ok(APIResponse.success("사용자가 좋아요한 리뷰 목록을 성공적으로 불러왔습니다.", reviewPage));
        } catch (Exception e) {
            log.error("좋아요한 리뷰 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error("좋아요한 리뷰 목록 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/bookmarked-by-me")
    public ResponseEntity<APIResponse<Page<Review>>> getBookmarkedReviews(
            Principal principal,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        try {
            SiteUser user = userService.getUser(principal.getName());
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createDate"));
            Page<Review> reviewPage = reviewService.getBookmarkedReviews(user, pageable);
            return ResponseEntity.ok(APIResponse.success("사용자가 북마크한 리뷰 목록을 성공적으로 불러왔습니다.", reviewPage));
        } catch (Exception e) {
            log.error("북마크한 리뷰 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(APIResponse.error("북마크한 리뷰 목록 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/like")
    public ResponseEntity<APIResponse<?>> likeReview(@PathVariable("id") Integer id, Principal principal) {
        try {
            reviewService.likeReview(id, principal.getName());
            return ResponseEntity.ok(APIResponse.success("좋아요 상태가 변경되었습니다."));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(e.getMessage(), HttpStatus.NOT_FOUND.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("좋아요 처리 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/bookmark")
    public ResponseEntity<APIResponse<?>> bookmarkReview(@PathVariable("id") Integer id, Principal principal) {
        try {
            reviewService.bookmarkReview(id, principal.getName());
            return ResponseEntity.ok(APIResponse.success("북마크 상태가 변경되었습니다."));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(e.getMessage(), HttpStatus.NOT_FOUND.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("북마크 처리 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/comments")
    public ResponseEntity<APIResponse<?>> addComment(@PathVariable("id") Integer id, @RequestBody CommentRequest commentRequest, Principal principal) {
        try {
            commentService.addComment(id, principal.getName(), commentRequest.getContent());
            return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success("댓글이 성공적으로 추가되었습니다."));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(e.getMessage(), HttpStatus.NOT_FOUND.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("댓글 추가 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<APIResponse<List<Comment>>> getComments(@PathVariable("id") Integer id) {
        log.info("댓글 목록 조회 요청: reviewId={}", id);
        try {
            Review review = reviewService.getReview(id);
            List<Comment> comments = commentService.getCommentsByReview(review);
            log.info("댓글 목록 조회 성공: reviewId={}, commentsCount={}", id, comments.size());
            return ResponseEntity.ok(APIResponse.success("댓글 목록을 성공적으로 불러왔습니다.", comments));
        } catch (DataNotFoundException e) {
            log.warn("댓글 목록 조회 실패: Review not found for reviewId={}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(e.getMessage(), HttpStatus.NOT_FOUND.value()));
        } catch (Exception e) {
            log.error("댓글 목록 조회 중 오류 발생: reviewId={}, error={}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("댓글 목록 조회 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<APIResponse<?>> updateReviewViewCount(@PathVariable("id") Integer id) {
        try {
            Review review = reviewService.getReview(id);
            reviewService.updateViewCount(review);
            return ResponseEntity.ok(APIResponse.success("조회수가 성공적으로 업데이트되었습니다."));
        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(e.getMessage(), HttpStatus.NOT_FOUND.value()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("조회수 업데이트 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @GetMapping("/recommended")
    public ResponseEntity<APIResponse<List<Review>>> getRecommendedReviews() {
        try {
            List<Review> recommendedReviews = reviewService.getRecommendedReviews();
            return ResponseEntity.ok(APIResponse.success("추천 리뷰 목록을 성공적으로 불러왔습니다.", recommendedReviews));
        } catch (Exception e) {
            log.error("추천 리뷰 목록을 불러오는 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("추천 리뷰 목록을 불러오는 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }

    @GetMapping("/most-liked-by-category")
    public ResponseEntity<APIResponse<Review>> getMostLikedReviewByCategory(@RequestParam("category") String category) {
        try {
            List<Review> reviews = reviewService.getRecommendedReviewsByCategory(category);
            if (reviews.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error("해당 카테고리의 추천 리뷰를 찾을 수 없습니다.", HttpStatus.NOT_FOUND.value()));
            }
            // Return the first one, which is the most liked due to sorting in service
            return ResponseEntity.ok(APIResponse.success("카테고리별 가장 많은 좋아요를 받은 리뷰를 성공적으로 불러왔습니다.", reviews.get(0)));
        } catch (Exception e) {
            log.error("카테고리별 가장 많은 좋아요를 받은 리뷰를 불러오는 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(APIResponse.error("카테고리별 가장 많은 좋아요를 받은 리뷰를 불러오는 중 오류 발생: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()));
        }
    }
}