import styles from "./Header.module.css";

export const Header = () => {
  return (
    <div className={styles["frame-18"]}>
      <div className={styles["bar"]}>
        <div className={styles["frame-38"]}>
          <div className={styles["frame-17"]}>
            <img className={styles["logo"]} src="/public2/CONSIGHT_Logo.svg" alt="CONSIGHT Logo" />
          </div>
          <div className={styles["div17"]}>
            <div className={styles["frame-2"]}>
              <div className={styles["div18"]}>소비계획 </div>
            </div>
            <div className={styles["frame-5"]}>
              <div className={styles["div19"]}>리뷰 </div>
            </div>
            <div className={styles["frame-4"]}>
              <div className={styles["div18"]}>마이페이지 </div>
            </div>
            <div className={styles["frame-1"]}>
              <div className={styles["div18"]}>문의 </div>
            </div>
          </div>
        </div>
        <div className={styles["frame-19"]}>
          <img className={styles["mdi-account-cog"]} src="/public2/account_setting_icon.svg" alt="Account Settings" />
          <img
            className={styles["majesticons-logout-line"]}
            src="majesticons-logout-line0.svg"
            alt="Logout"
          />
        </div>
      </div>
    </div>
  );
};
