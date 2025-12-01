import React from 'react';
import styles from './FollowerFollowListPopup.module.css';

const FollowerFollowListPopup = ({ isOpen, onClose, type = '팔로우' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <img className={styles.vector} src="/vector0.svg" alt="Close" onClick={onClose} />
        <div className={styles.frame154}>
          <div className={styles.frame151}>
            <div className={styles.frame107}>
              <div className={styles.frame106}>
                <div className={styles.frame150}>
                  <div className={styles.frame149}>
                    <div className={styles.username}>USERNAME님의 {type} 목록</div>
                  </div>
                </div>
              </div>
              <div className={styles.frame148}>
                <div className={styles.frame111}></div>
              </div>
            </div>
          </div>
          <div className={styles.frame1072}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine} src="/ri-more-line0.svg" alt="More" />
          </div>
          <div className={styles.frame198}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine2} src="/ri-more-line1.svg" alt="More" />
          </div>
          <div className={styles.frame199}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine3} src="/ri-more-line2.svg" alt="More" />
          </div>
          <div className={styles.frame203}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine4} src="/ri-more-line3.svg" alt="More" />
          </div>
          <div className={styles.frame204}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine5} src="/ri-more-line4.svg" alt="More" />
          </div>
          <div className={styles.frame205}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine6} src="/ri-more-line5.svg" alt="More" />
          </div>
          <div className={styles.frame197}></div>
        </div>
      </div>
    </div>
  );
};

export default FollowerFollowListPopup;
