package com.mysite.sbb.follow;

import com.mysite.sbb.user.SiteUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(
    uniqueConstraints = {
        @UniqueConstraint(
            name = "follow_uk",
            columnNames = {"follower_id", "followee_id"}
        )
    }
)
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "follower_id")
    private SiteUser follower;

    @ManyToOne
    @JoinColumn(name = "followee_id")
    private SiteUser followee;

    private LocalDateTime createDate;

    @PrePersist
    public void prePersist() {
        this.createDate = LocalDateTime.now();
    }
}
