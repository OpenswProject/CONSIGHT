import React from 'react';
import styles from './ReviewPopup.module.css';

const ReviewPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.div} onClick={(e) => e.stopPropagation()}>
        <img className={styles.vector} src="/public/vector0.svg" alt="Close" onClick={onClose} /> {/* Added onClick for close */}
        <div className={styles.frame154}>
          <div className={styles.frame151}>
            <div className={styles.frame107}>
              <div className={styles.frame106}>
                <div className={styles.frame150}>
                  <div className={styles.frame243}>
                    <div className={styles.frame109}>
                      <div className={styles.profile}></div>
                      <div className={styles.username}>USERNAME</div>
                    </div>
                    <img className={styles.riMoreLine} src="/public/ri-more-line0.svg" alt="More options" />
                  </div>
                </div>
                <div className={styles.frame149}>
                  <div className={styles.div2}>스노우쉴드 롱패딩</div>
                </div>
                <div className={styles._20251116}>2025.11.16</div>
              </div>
              <div className={styles.frame148}>
                <div className={styles.frame91}>
                  <div className={styles.div3}>의류</div>
                </div>
                <div className={styles.frame111}>
                  <div className={styles.frame912}>
                    <div className={styles.div3}>제품 링크</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frame153}>
              <div className={styles.div4}>
                패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만 입어도
                충분히 한겨울 기온을 버틸 정도라서 요즘 거의 매일 입고 다닙니다.
                지퍼도 부드럽게 잘 올라가고 주머니 털 안감도 포근해서 만족스러워요.
                전체적으로 착용감이 편안해서 오래 입고 있어도 부담이 없고, 바람 부는
                날에도 체온을 잘 유지해줘서 외출할 때마다 든든합니다. 디자인도
                깔끔해서 어떤 옷과 매치해도 잘 어울려 데일리 아우터로 손색이 없어요.
                개인적으로 이번 시즌에 산 옷 중 가장 만족스러워서 주변에도 적극
                추천하고 싶을 정도입니다
              </div>
              <div className={styles.frame129}>
                <div className={styles.frame131}></div>
                <div className={styles.frame132}></div>
                <div className={styles.frame130}></div>
                <div className={styles.frame246}>
                  <div className={styles.frame248}>
                    <img className={styles.frame1312} src="/public/frame-1311.svg" alt="Like" />
                    <div className={styles.frame247}>
                      <div className={styles._10}>10</div>
                    </div>
                  </div>
                  <div className={styles.frame249}>
                    <img className={styles.frame1322} src="/public/frame-1321.svg" alt="Bookmark" />
                    <div className={styles.frame247}>
                      <div className={styles._10}>10</div>
                    </div>
                  </div>
                  <div className={styles.frame250}>
                    <img className={styles.frame1302} src="/public/frame-1301.svg" alt="Comment" />
                    <div className={styles.frame247}>
                      <div className={styles._10}>10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frame152}>
            <div className={styles.frame1072}>
              <div className={styles.frame1062}>
                <div className={styles.frame141}>
                  <div className={styles.frame140}>
                    <div className={styles.profile2}></div>
                    <div className={styles.username2}>USERNAME</div>
                  </div>
                  <div className={styles.frame139}>
                    <div className={styles.div5}>댓글 작성하기..</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frame1072}>
              <div className={styles.frame1062}>
                <div className={styles.frame141}>
                  <div className={styles.frame140}>
                    <div className={styles.profile2}></div>
                    <div className={styles.username2}>USERNAME</div>
                  </div>
                  <div className={styles.frame139}>
                    <div className={styles.div6}>
                      바람 많이 부는 지역 살아서 걱정했는데 이 정도면 충분히
                      따뜻하겠다 싶네요
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.frame138}>
              <div className={styles.frame1062}>
                <div className={styles.frame141}>
                  <div className={styles.frame140}>
                    <div className={styles.profile2}></div>
                    <div className={styles.username2}>USERNAME</div>
                  </div>
                  <div className={styles.frame139}>
                    <div className={styles.div6}>
                      착용감 편하다는 말에 바로 장바구니 넣었습니다. 실제로도
                      가볍나요?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frame197}>
            <div className={styles.line5}></div>
            <div className={styles.div7}>더보기</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;