package com.mysite.sbb.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    // 내가 팔로우하는 사람 리스트
    List<Follow> findByFollower(SiteUser follower);

    // 나를 팔로우하는 사람 리스트
    List<Follow> findByFollowing(SiteUser following);

    // 팔로우 여부 확인
    Optional<Follow> findByFollowerAndFollowing(SiteUser follower, SiteUser following);
}
