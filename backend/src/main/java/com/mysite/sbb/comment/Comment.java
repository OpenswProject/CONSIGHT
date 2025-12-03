package com.mysite.sbb.comment;

import com.mysite.sbb.review.Review;
import com.mysite.sbb.user.SiteUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createDate;
    private LocalDateTime modifyDate;

    @ManyToOne
    @JoinColumn(name = "author_id") // 외래키 컬럼명 지정
    private SiteUser author;

    @ManyToOne
    @JoinColumn(name = "review_id") // 외래키 컬럼명 지정
    private Review review;
}
