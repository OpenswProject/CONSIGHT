import React from "react";
import styles from "./ReviewFeedPage.module.css";
import { ReviewFeed } from "../components/ReviewFeed/ReviewFeed";

export const ReviewFeedPage = () => {
  return (
    <div className={styles.reviewFeedPageContainer}>
      <ReviewFeed />
    </div>
  );
};
