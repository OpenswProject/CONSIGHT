import React, { useState, useEffect } from "react";
import styles from "./ReviewFeedPage.module.css";
import { ReviewFeed } from "../components/ReviewFeed/ReviewFeed";

export const ReviewFeedPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Assuming your backend is running on localhost:8080
        const response = await fetch("http://localhost:8080/api/reviews");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        // Assuming the reviews are in result.data.content based on Spring Page object structure
        setReviews(result.data.content);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div className={styles.reviewFeedPageContainer}>Loading reviews...</div>;
  }

  if (error) {
    return <div className={styles.reviewFeedPageContainer}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.reviewFeedPageContainer}>
      <ReviewFeed reviews={reviews} />
    </div>
  );
};
