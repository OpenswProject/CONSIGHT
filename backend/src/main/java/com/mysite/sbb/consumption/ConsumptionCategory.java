package com.mysite.sbb.consumption;

import com.mysite.sbb.user.SiteUser;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ConsumptionCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private SiteUser user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type; // WEEKLY or MONTHLY

    @Column(nullable = false)
    private Integer targetAmount;

    @Column(nullable = false)
    private Integer currentAmount;

    @Column(nullable = true)
    private String color; // To store color hex code like '#A7C7E7'
}
