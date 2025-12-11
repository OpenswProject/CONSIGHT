package com.mysite.sbb.review;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.mysite.sbb.user.SiteUser;

public interface ReviewBookmarkRepository extends JpaRepository<ReviewBookmark, Long> {
    Optional<ReviewBookmark> findByReviewAndUser(Review review, SiteUser user);
    List<ReviewBookmark> findByUser(SiteUser user);
    Page<ReviewBookmark> findByUser(SiteUser user, Pageable pageable);
}
