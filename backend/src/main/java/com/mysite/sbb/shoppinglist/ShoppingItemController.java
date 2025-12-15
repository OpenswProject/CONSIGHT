package com.mysite.sbb.shoppinglist;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import com.mysite.sbb.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/shopping-items")
@RequiredArgsConstructor
public class ShoppingItemController {

    private final ShoppingItemService shoppingItemService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<APIResponse<List<ShoppingItem>>> getShoppingItems(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        List<ShoppingItem> items = shoppingItemService.getItemsForUser(user);
        return ResponseEntity.ok(APIResponse.success("Shopping items fetched successfully", items));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<APIResponse<ShoppingItem>> addShoppingItem(@RequestBody ShoppingItemDto shoppingItemDto, Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        ShoppingItem newItem = shoppingItemService.addItem(user, shoppingItemDto.getText(), shoppingItemDto.getCategory());
        return ResponseEntity.ok(APIResponse.success("Shopping item added successfully", newItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<APIResponse<Void>> deleteShoppingItem(@PathVariable Long id, Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        try {
            shoppingItemService.deleteItem(id, user);
            return ResponseEntity.ok(APIResponse.success("Shopping item deleted successfully", null));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(APIResponse.error(e.getMessage(), 403, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(APIResponse.error(e.getMessage(), 404, null));
        }
    }
}
