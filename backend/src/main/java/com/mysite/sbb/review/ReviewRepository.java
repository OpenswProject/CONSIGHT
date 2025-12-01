package com.mysite.sbb.review;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.mysite.sbb.user.SiteUser;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 정렬은 Pageable 의 Sort 기능으로 처리
    Page<Review> findAll(Pageable pageable);

    // 검색용
    Page<Review> findByTitleContaining(String keyword, Pageable pageable);
    Page<Review> findByContentContaining(String keyword, Pageable pageable);
    Page<Review> findByAuthor_Username(String username, Pageable pageable);
    Page<Review> findByCategory(Category category, Pageable pageable);

    Page<Review> findByAuthor(SiteUser author, Pageable pageable);
}
