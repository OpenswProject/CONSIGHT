package com.mysite.sbb.consumption;

import com.mysite.sbb.user.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ConsumptionCategoryRepository extends JpaRepository<ConsumptionCategory, Long> {
    List<ConsumptionCategory> findByUser(SiteUser user);
    List<ConsumptionCategory> findByUserAndType(SiteUser user, CategoryType type);

    @Transactional
    @Modifying
    @Query("DELETE FROM ConsumptionCategory c WHERE c.user = :user")
    void deleteAllByUser(@Param("user") SiteUser user);
}
