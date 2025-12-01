package com.mysite.sbb.review;

import java.time.LocalDateTime;

import com.mysite.sbb.user.SiteUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 작성자
    @ManyToOne
    private SiteUser author;

    // 제목
    private String title;

    // 본문
    @Column(columnDefinition = "TEXT")
    private String content;

    // 카테고리 (옵션형으로)
    private Category category;

    // 조회수, 좋아요 수
    private int viewCount;
    private int likeCount;

    private LocalDateTime createDate;
    private LocalDateTime modifyDate;
}
