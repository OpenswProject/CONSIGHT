import React from "react";
import styles from "./ReviewFilters.module.css";

export const ReviewFilters = () => {
  const categories = [
    "뷰티", "식품", "의류", "주방", "생활·가전", "청소·욕실", "가구", "문구", "인테리어", "취미·레저"
  ];
  const filters = ["필터링", "추천", "비추천"];
  const sortOptions = ["최신순", "조회수순", "좋아요순"];

  return (
    <div className={styles.filtersCard}>
      <div className={styles.categoryRow}>
        {categories.map((category, index) => (
          <button key={index} className={styles.categoryButton}>
            {category}
          </button>
        ))}
      </div>
      <div className={styles.filterRow}>
        {filters.map((filter, index) => (
          <button key={index} className={styles.filterButton}>
            {filter}
          </button>
        ))}
      </div>
      <div className={styles.sortAndSearchRow}>
        <select className={styles.sortDropdown}>
          {sortOptions.map((option, index) => (
            <option key={index} value={option}>
              정렬▼ {option}
            </option>
          ))}
        </select>
        <div className={styles.searchContainer}>
          <input type="text" placeholder="검색" className={styles.searchInput} />
          <img src="/search_icon.svg" alt="Search" className={styles.searchIcon} />
        </div>
      </div>
    </div>
  );
};
