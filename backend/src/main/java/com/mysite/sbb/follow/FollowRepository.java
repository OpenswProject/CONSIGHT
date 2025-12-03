package com.mysite.sbb.follow;

import com.mysite.sbb.user.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAndFollowee(SiteUser follower, SiteUser followee);
    List<Follow> findByFollower(SiteUser follower);
    List<Follow> findByFollowee(SiteUser followee);
    long countByFollower(SiteUser follower);
    long countByFollowee(SiteUser followee);
}
