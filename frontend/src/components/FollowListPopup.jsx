import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import styles from './FollowListPopup.module.css';

const FollowListPopup = ({ onClose, title }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleUserClick = () => {
    onClose(); // 팝업 닫기
    navigate('/Userprofile'); // Userprofile 페이지로 이동
  };

  return (
    <div className={styles.overlay} onClick={onClose}> {/* overlay 클릭 시 닫기 */}
      <div className={styles.div} onClick={(e) => e.stopPropagation()}> {/* 팝업 내부 클릭 시 이벤트 전파 중단 */}
        <img className={styles.vector} src="/public/vector0.svg" alt="Close" onClick={onClose} />
        <div className={styles.frame154}>
          <div className={styles.frame151}>
            <div className={styles.frame107}>
              <div className={styles.frame106}>
                <div className={styles.frame150}>
                  <div className={styles.frame149}>
                    <div className={styles.username}>{title}</div>
                  </div>
                </div>
              </div>
              <div className={styles.frame148}>
                <div className={styles.frame111}></div>
              </div>
            </div>
          </div>
          {/* 각 팔로우/팔로워 항목에 onClick 이벤트 추가 */}
          <div className={styles.frame1072} onClick={handleUserClick}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine} src="/public/ri-more-line0.svg" alt="More" />
          </div>
          <div className={styles.frame198} onClick={handleUserClick}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine2} src="/public/ri-more-line1.svg" alt="More" />
          </div>
          <div className={styles.frame199} onClick={handleUserClick}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine3} src="/public/ri-more-line2.svg" alt="More" />
          </div>
          <div className={styles.frame203} onClick={handleUserClick}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine4} src="/public/ri-more-line3.svg" alt="More" />
          </div>
          <div className={styles.frame204} onClick={handleUserClick}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine5} src="/public/ri-more-line4.svg" alt="More" />
          </div>
          <div className={styles.frame205} onClick={handleUserClick}>
            <div className={styles.frame1062}>
              <div className={styles.frame141}>
                <div className={styles.frame140}>
                  <div className={styles.profile}></div>
                  <div className={styles.username2}>USERNAME</div>
                </div>
                <div className={styles.userinfo1}>USERINFO_1</div>
              </div>
            </div>
            <img className={styles.riMoreLine6} src="/public/ri-more-line5.svg" alt="More" />
          </div>
          <div className={styles.frame197}></div>
        </div>
      </div>
    </div>
  );
};

export default FollowListPopup;
