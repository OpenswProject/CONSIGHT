package com.mysite.sbb.consumption;

import com.mysite.sbb.user.SiteUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ConsumptionCategoryService {

    private final ConsumptionCategoryRepository consumptionCategoryRepository;

    public List<ConsumptionCategory> getCategoriesByUser(SiteUser user) {
        return consumptionCategoryRepository.findByUser(user);
    }

    public ConsumptionCategory createCategory(SiteUser user, String name, CategoryType type, Integer targetAmount, String color) {
        ConsumptionCategory newCategory = new ConsumptionCategory();
        newCategory.setUser(user);
        newCategory.setName(name);
        newCategory.setType(type);
        newCategory.setTargetAmount(targetAmount);
        newCategory.setCurrentAmount(0); // Initial current amount is 0
        newCategory.setColor(color);
        return consumptionCategoryRepository.save(newCategory);
    }

    public Optional<ConsumptionCategory> updateCategory(Long categoryId, SiteUser user, ConsumptionCategory updatedData) {
        Optional<ConsumptionCategory> optionalCategory = consumptionCategoryRepository.findById(categoryId);
        if (optionalCategory.isPresent()) {
            ConsumptionCategory category = optionalCategory.get();
            // Ensure the user owns this category
            if (!category.getUser().getId().equals(user.getId())) {
                // Or throw an exception
                return Optional.empty();
            }
            category.setName(updatedData.getName());
            category.setTargetAmount(updatedData.getTargetAmount());
            category.setCurrentAmount(updatedData.getCurrentAmount());
            category.setColor(updatedData.getColor());
            return Optional.of(consumptionCategoryRepository.save(category));
        }
        return Optional.empty();
    }

    public void deleteCategory(Long categoryId, SiteUser user) {
        consumptionCategoryRepository.findById(categoryId).ifPresent(category -> {
            if (category.getUser().getId().equals(user.getId())) {
                consumptionCategoryRepository.delete(category);
            }
            // Optionally throw an exception if user is not authorized
        });
    }
}
