import styles from "./ReviewFilters.module.css";

export const ReviewFilters = () => {
  return (
    <>
      <div className={styles["frame-58"]}>
        <div className={styles["div2"]}>필터링 </div>
        <div className={styles["frame-96"]}>
          <div className={styles["frame-95"]}>
            <div className={styles["div3"]}>추천 </div>
          </div>
        </div>
        <div className={styles["frame-97"]}>
          <div className={styles["frame-95"]}>
            <div className={styles["div3"]}>비추천 </div>
          </div>
        </div>
      </div>
      <div className={styles["frame-59"]}>
        <div className={styles["frame-112"]}>
          <div className={styles["div4"]}>정렬 </div>
          <img className={styles["polygon-1"]} src="polygon-10.svg" alt="Dropdown arrow" />
        </div>
        <div className={styles["frame-113"]}>
          <div className={styles["frame-95"]}>
            <div className={styles["div3"]}>최신순 </div>
          </div>
        </div>
        <div className={styles["frame-96"]}>
          <div className={styles["frame-95"]}>
            <div className={styles["div3"]}>조회수순 </div>
          </div>
        </div>
        <div className={styles["frame-97"]}>
          <div className={styles["frame-95"]}>
            <div className={styles["div3"]}>좋아요순 </div>
          </div>
        </div>
      </div>
      <div className={styles["frame-51"]}>
        <div className={styles["div2"]}>카테고리 </div>
        <div className={styles["frame-96"]}>
          <div className={styles["frame-95"]}>
            <div className={styles["div3"]}>뷰티 </div>
          </div>
          <div className={styles["frame-91"]}>
            <div className={styles["div3"]}>식품 </div>
          </div>
          <div className={styles["frame-93"]}>
            <div className={styles["div3"]}>의류 </div>
          </div>
          <div className={styles["frame-88"]}>
            <div className={styles["div3"]}>주방 </div>
          </div>
          <div className={styles["frame-94"]}>
            <div className={styles["div3"]}>생활·가전 </div>
          </div>
          <div className={styles["frame-89"]}>
            <div className={styles["div3"]}>청소·욕실 </div>
          </div>
          <div className={styles["frame-962"]}>
            <div className={styles["div3"]}>가구 </div>
          </div>
          <div className={styles["frame-90"]}>
            <div className={styles["div3"]}>문구 </div>
          </div>
          <div className={styles["frame-92"]}>
            <div className={styles["div3"]}>인테리어 </div>
          </div>
          <div className={styles["frame-972"]}>
            <div className={styles["div3"]}>취미·레저 </div>
          </div>
        </div>
      </div>
    </>
  );
};
