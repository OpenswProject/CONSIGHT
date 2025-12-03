package com.mysite.sbb.review;

import com.mysite.sbb.user.SiteUser;
import jakarta.persistence.*;
import jakarta.persistence.Transient; // 추가
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 200)
    private String title;

    @Column(length = 50)
    private String category;

    @Column(length = 500)
    private String productLink;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 500)
    private String receiptImagePath; // Path to the stored image

    private LocalDateTime createDate;
    private LocalDateTime modifyDate; // Add modifyDate field

    @Column(nullable = false) // 추가
    private Integer viewCount; // Add viewCount field
    private Integer likeCount; // Add likeCount field
    private Integer bookmarkCount; // Add bookmarkCount field
    @Column(nullable = false) // 추가
    private Integer commentCount; // Add commentCount field

    @ManyToOne
    private SiteUser author;

    @Transient // 데이터베이스에 저장되지 않음
    private Boolean isLikedByCurrentUser;

    @Transient // 데이터베이스에 저장되지 않음
    private Boolean isBookmarkedByCurrentUser;
}