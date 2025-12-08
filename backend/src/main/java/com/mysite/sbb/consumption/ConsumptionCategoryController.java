package com.mysite.sbb.consumption;

import com.mysite.sbb.user.SiteUser;
import com.mysite.sbb.user.UserService;
import com.mysite.sbb.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consumption")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ConsumptionCategoryController {

    private final ConsumptionCategoryService consumptionCategoryService;
    private final UserService userService;

    @GetMapping("/categories")
    public ResponseEntity<APIResponse<List<ConsumptionCategory>>> getUserCategories(Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        List<ConsumptionCategory> categories = consumptionCategoryService.getCategoriesByUser(user);
        return ResponseEntity.ok(APIResponse.success("Categories fetched successfully", categories));
    }

    @PostMapping("/categories")
    public ResponseEntity<APIResponse<ConsumptionCategory>> createCategory(@RequestBody ConsumptionCategory category, Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        ConsumptionCategory newCategory = consumptionCategoryService.createCategory(
                user,
                category.getName(),
                category.getType(),
                category.getTargetAmount(),
                category.getColor()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(APIResponse.success("Category created successfully", newCategory));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<APIResponse<ConsumptionCategory>> updateCategory(@PathVariable Long id, @RequestBody ConsumptionCategory updatedData, Principal principal) {
        SiteUser user = userService.getUser(principal.getName());
        Optional<ConsumptionCategory> category = consumptionCategoryService.updateCategory(id, user, updatedData);

        return category.map(value -> ResponseEntity.ok(APIResponse.success("Category updated successfully", value)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error("Category not found or permission denied", HttpStatus.NOT_FOUND.value(), null)));
    }
}
