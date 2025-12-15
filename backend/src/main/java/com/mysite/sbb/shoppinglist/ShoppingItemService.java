package com.mysite.sbb.shoppinglist;

import com.mysite.sbb.user.SiteUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ShoppingItemService {

    private final ShoppingItemRepository shoppingItemRepository;

    public List<ShoppingItem> getItemsForUser(SiteUser user) {
        return shoppingItemRepository.findByUser(user);
    }

    public ShoppingItem addItem(SiteUser user, String text, String category) {
        ShoppingItem newItem = new ShoppingItem();
        newItem.setUser(user);
        newItem.setText(text);
        newItem.setCategory(category);
        return shoppingItemRepository.save(newItem);
    }

    public void deleteItem(Long id, SiteUser user) {
        ShoppingItem item = shoppingItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to delete this item");
        }
        shoppingItemRepository.delete(item);
    }
}
