package com.mysite.sbb.review;

import com.mysite.sbb.comment.Comment;
import com.mysite.sbb.comment.CommentRepository;
import com.mysite.sbb.DataNotFoundException;
import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService; // 추가
import com.mysite.sbb.notification.NotificationService; // 추가
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 추가
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final ReviewBookmarkRepository reviewBookmarkRepository;
    private final CommentRepository commentRepository;
    private final UserService userService; // 추가
    private final NotificationService notificationService; // 추가

    // Placeholder for image storage directory
    // User should configure this in application.properties or similar
    private final String imageStorageDir = "uploads/receipts"; // Example path

    @Transactional
    public void create(String title, String category, String productLink, String content, MultipartFile receiptImage, SiteUser author) throws IOException {
        Review review = new Review();
        review.setTitle(title);
        review.setCategory(category); // category is String
        review.setProductLink(productLink);
        review.setContent(content);
        review.setCreateDate(LocalDateTime.now());
        review.setAuthor(author);
        review.setViewCount(0);
        review.setLikeCount(0);
        review.setBookmarkCount(0);
        review.setCommentCount(0); // 추가 // 추가

        if (receiptImage != null && !receiptImage.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + receiptImage.getOriginalFilename();
            File dest = new File(imageStorageDir, fileName);
            // Ensure the directory exists
            if (!dest.getParentFile().exists()) {
                dest.getParentFile().mkdirs();
            }
            receiptImage.transferTo(dest);
            review.setReceiptImagePath(dest.getAbsolutePath()); // Store absolute path
        }

        this.reviewRepository.save(review);
        notificationService.createNotificationForNewReview(review);
    }

    public Page<Review> getList(int page, String kw, String searchType, String username, String sort) {
        List<Sort.Order> sorts = new ArrayList<>();
        // Parse the sort parameter
        String[] sortParams = sort.split(",");
        String sortBy = sortParams[0];
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        sorts.add(Sort.Order.by(sortBy).with(direction));

        Pageable pageable = PageRequest.of(page, 10, Sort.by(sorts)); // 페이지 크기를 10으로 변경

        Page<Review> reviewPage;

        if (kw == null || kw.trim().isEmpty()) {
            reviewPage = this.reviewRepository.findAll(pageable);
        } else {
            // Implement search logic based on searchType
            reviewPage = switch (searchType) {
                case "title" -> reviewRepository.findByTitleContaining(kw, pageable);
                case "content" -> reviewRepository.findByContentContaining(kw, pageable);
                case "user" -> reviewRepository.findByAuthor_UsernameContaining(kw, pageable);
                case "category" -> reviewRepository.findByCategory(kw, pageable);
                default -> reviewRepository.findAll(pageable);
            };
        }

        // 현재 로그인한 사용자의 좋아요/북마크 상태 설정
        if (username != null && !username.isEmpty()) {
            SiteUser currentUser = userService.getUser(username);
            reviewPage.getContent().forEach(review -> {
                review.setIsLikedByCurrentUser(reviewLikeRepository.findByReviewAndUser(review, currentUser).isPresent());
                review.setIsBookmarkedByCurrentUser(reviewBookmarkRepository.findByReviewAndUser(review, currentUser).isPresent());
            });
        }

        return reviewPage;
    }

    public Review getReview(Integer id) {
        Optional<Review> review = this.reviewRepository.findById(id);
        if (review.isPresent()) {
            return review.get();
        } else {
            throw new DataNotFoundException("review not found");
        }
    }

    public void modify(Review review, String title, String category, String productLink, String content, MultipartFile receiptImage) throws IOException {
        review.setTitle(title);
        review.setCategory(category);
        review.setProductLink(productLink);
        review.setContent(content);
        review.setModifyDate(LocalDateTime.now());

        if (receiptImage != null && !receiptImage.isEmpty()) {
            // Delete old image if exists
            if (review.getReceiptImagePath() != null) {
                new File(review.getReceiptImagePath()).delete();
            }
            String fileName = UUID.randomUUID().toString() + "_" + receiptImage.getOriginalFilename();
            File dest = new File(imageStorageDir, fileName);
            if (!dest.getParentFile().exists()) {
                dest.getParentFile().mkdirs();
            }
            receiptImage.transferTo(dest);
            review.setReceiptImagePath(dest.getAbsolutePath());
        } else if (receiptImage == null && review.getReceiptImagePath() != null) {
            // If image is removed
            new File(review.getReceiptImagePath()).delete();
            review.setReceiptImagePath(null);
        }

        this.reviewRepository.save(review);
    }

    public void delete(Review review) {
        // Delete associated image file
        if (review.getReceiptImagePath() != null) {
            new File(review.getReceiptImagePath()).delete();
        }
        this.reviewRepository.delete(review);
    }

    public void updateViewCount(Review review) {
        review.setViewCount((review.getViewCount() != null ? review.getViewCount() : 0) + 1);
        this.reviewRepository.save(review);
    }

    public void save(Review review) {
        this.reviewRepository.save(review);
    }

    public void updateLikeCount(Review review, boolean increment) {
        if (increment) {
            review.setLikeCount(review.getLikeCount() + 1);
        } else {
            review.setLikeCount(review.getLikeCount() - 1);
        }
        this.reviewRepository.save(review);
    }

    @Transactional
    public void likeReview(Integer reviewId, String username) {
        Review review = getReview(reviewId);
        SiteUser user = userService.getUser(username);

        Optional<ReviewLike> existingLike = reviewLikeRepository.findByReviewAndUser(review, user);

        if (existingLike.isPresent()) {
            reviewLikeRepository.delete(existingLike.get());
            review.setLikeCount(review.getLikeCount() - 1);
        } else {
            ReviewLike reviewLike = new ReviewLike();
            reviewLike.setReview(review);
            reviewLike.setUser(user);
            reviewLike.setCreateDate(LocalDateTime.now());
            reviewLikeRepository.save(reviewLike);
            review.setLikeCount(review.getLikeCount() + 1);
        }
        reviewRepository.save(review);
    }

    @Transactional
    public void bookmarkReview(Integer reviewId, String username) {
        Review review = getReview(reviewId);
        SiteUser user = userService.getUser(username);

        Optional<ReviewBookmark> existingBookmark = reviewBookmarkRepository.findByReviewAndUser(review, user);

        if (existingBookmark.isPresent()) {
            reviewBookmarkRepository.delete(existingBookmark.get());
            review.setBookmarkCount(review.getBookmarkCount() - 1);
        } else {
            ReviewBookmark reviewBookmark = new ReviewBookmark();
            reviewBookmark.setReview(review);
            reviewBookmark.setUser(user);
            reviewBookmark.setCreateDate(LocalDateTime.now());
            reviewBookmarkRepository.save(reviewBookmark);
            review.setBookmarkCount(review.getBookmarkCount() + 1);
        }
        reviewRepository.save(review);
    }

    public Page<Review> getReviewsByAuthor(SiteUser author, int page) {
        List<Sort.Order> sorts = new ArrayList<>();
        sorts.add(Sort.Order.desc("createDate"));
        Pageable pageable = PageRequest.of(page, 2, Sort.by(sorts));
        return reviewRepository.findByAuthor(author, pageable);
    }

    public Page<Review> getCommentedReviews(SiteUser user, Pageable pageable) {
        return reviewRepository.findCommentedReviewsByAuthor(user, pageable);
    }

    public Page<Review> getLikedReviews(SiteUser user, Pageable pageable) {
        Page<ReviewLike> likedReviewLikes = reviewLikeRepository.findByUser(user, pageable);
        return likedReviewLikes.map(ReviewLike::getReview);
    }

    public Page<Review> getBookmarkedReviews(SiteUser user, Pageable pageable) {
        Page<ReviewBookmark> bookmarkedReviewBookmarks = reviewBookmarkRepository.findByUser(user, pageable);
        return bookmarkedReviewBookmarks.map(ReviewBookmark::getReview);
    }

    public MyReviewResponse getMyReviews(SiteUser siteUser) {
        log.info("DEBUG: Fetching 'My Page' data for user: {} (ID: {})", siteUser.getUsername(), siteUser.getId());

        // Written reviews
        List<Review> writtenReviews = reviewRepository.findByAuthor(siteUser);
        log.info("DEBUG: Found {} written reviews for user {}", writtenReviews.size(), siteUser.getUsername());

        // Liked reviews
        List<ReviewLike> likedReviewLikes = reviewLikeRepository.findByUser(siteUser);
        List<Review> likedReviews = likedReviewLikes.stream()
                .map(ReviewLike::getReview)
                .collect(Collectors.toList());
        log.info("DEBUG: Found {} liked reviews for user {}", likedReviews.size(), siteUser.getUsername());

        // Bookmarked reviews
        List<ReviewBookmark> bookmarkedReviewBookmarks = reviewBookmarkRepository.findByUser(siteUser);
        List<Review> bookmarkedReviews = bookmarkedReviewBookmarks.stream()
                .map(ReviewBookmark::getReview)
                .collect(Collectors.toList());
        log.info("DEBUG: Found {} bookmarked reviews for user {}", bookmarkedReviews.size(), siteUser.getUsername());

        // Comments
        List<Comment> comments = commentRepository.findByAuthor(siteUser);
        log.info("DEBUG: Found {} comments for user {}", comments.size(), siteUser.getUsername());
        
        // 추가된 로그: 발견된 댓글의 실제 작성자 이름 목록을 출력
        List<String> commentAuthors = comments.stream()
                                              .map(c -> c.getAuthor().getUsername())
                                              .collect(Collectors.toList());
        log.info("DEBUG: Authors of found comments: {}", commentAuthors);

        return new MyReviewResponse(writtenReviews, likedReviews, bookmarkedReviews, comments);
    }

    public List<Review> getRecommendedReviewsByCategory(String category) {
        return reviewRepository.findByCategoryOrderByLikeCountDesc(category);
    }

    public List<Review> getRecommendedReviews() {
        // For a general recommendation, we can fetch a few top-liked reviews across all categories
        // Or, implement more sophisticated logic here (e.g., based on user's past activity, trending reviews)
        // For now, let's just get the top 6 most liked reviews overall.
        Pageable pageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "likeCount"));
        return reviewRepository.findAll(pageable).getContent();
    }
}