package com.mysite.sbb.review;

import java.util.List;
import com.mysite.sbb.user.SiteUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    Page<Review> findByTitleContaining(String keyword, Pageable pageable);
    Page<Review> findByContentContaining(String keyword, Pageable pageable);
    Page<Review> findByAuthor_UsernameContaining(String keyword, Pageable pageable);
    Page<Review> findByCategory(String category, Pageable pageable);
    Page<Review> findByAuthor(SiteUser author, Pageable pageable);
    @Query("SELECT DISTINCT c.review FROM Comment c WHERE c.author = :author")
    Page<Review> findCommentedReviewsByAuthor(@Param("author") SiteUser author, Pageable pageable);
    List<Review> findByAuthor(SiteUser author); // Add this for getMyReviews
    List<Review> findTop6ByOrderByLikeCountDesc();

    List<Review> findTop6ByCategoryOrderByLikeCountDesc(String category);

    List<Review> findTop6ByCategoryInOrderByLikeCountDesc(List<String> categories);
}
