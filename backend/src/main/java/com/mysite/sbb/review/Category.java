package com.mysite.sbb.review;

public enum Category {
    CLOTHING("의류"),
    FOOD("식품"),
    LIVING_APPLIANCES("생활·가전"),
    CLEANING_BATH("청소·욕실"),
    // Add other categories as needed
    ETC("기타");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}