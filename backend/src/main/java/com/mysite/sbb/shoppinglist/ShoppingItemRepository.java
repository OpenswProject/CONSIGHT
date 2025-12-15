package com.mysite.sbb.shoppinglist;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.mysite.sbb.user.SiteUser;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Long> {
    List<ShoppingItem> findByUser(SiteUser user);
}
