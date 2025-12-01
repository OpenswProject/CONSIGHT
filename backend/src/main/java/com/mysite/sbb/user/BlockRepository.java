package com.mysite.sbb.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockRepository extends JpaRepository<Block, Long> {

    // 내가 차단한 사람들
    List<Block> findByBlocker(SiteUser blocker);

    // 차단 여부 확인
    Optional<Block> findByBlockerAndBlocked(SiteUser blocker, SiteUser blocked);
}
