import styles from "./ReviewFeedPage.module.css";
import { Header } from "../components/Header/Header";
import { ReviewFilters } from "../components/ReviewFilters/ReviewFilters";
import { ReviewList } from "../components/ReviewList/ReviewList";
import { ReviewSidebar } from "../components/ReviewSidebar/ReviewSidebar";

export const ReviewFeedPage = ({ className, ...props }) => {
  return (
    <div className={styles.div + " " + className}>
      <Header />
      <div className={styles["rectangle-10"]}></div>
      <div className={styles["rectangle-11"]}></div>
      <ReviewFilters />
      <ReviewList />
      <ReviewSidebar />
    </div>
  );
};
