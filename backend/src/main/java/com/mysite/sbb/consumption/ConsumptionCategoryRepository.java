package com.mysite.sbb.consumption;

import com.mysite.sbb.user.SiteUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConsumptionCategoryRepository extends JpaRepository<ConsumptionCategory, Long> {
    List<ConsumptionCategory> findByUser(SiteUser user);
    List<ConsumptionCategory> findByUserAndType(SiteUser user, CategoryType type);
}
