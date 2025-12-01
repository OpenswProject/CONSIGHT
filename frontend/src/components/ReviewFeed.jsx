import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="frame-120">
      <div className="frame-107">
        <div className="frame-138">
          <div className="frame-194">
            <div className="frame-134">
              <div className="frame-109">
                <div className="frame-113">
                  <div className="frame-1072">
                    <div className="frame-1062">
                      <div className="frame-243">
                        <div className="frame-1092">
                          <div className="profile3"></div>
                          <div className="username4">USERNAME</div>
                        </div>
                        <img
                          className="ri-more-line2"
                          src="ri-more-line1.svg"
                        />
                      </div>
                      <div className="frame-251">
                        <div className="div9">스노우쉴드 롱패딩</div>
                        <img className="mask-group" src="mask-group0.svg" />
                      </div>
                      <div className="icon-park-solid-check-one"></div>
                    </div>
                    <div className="frame-108">
                      <div className="_2025-11-16">2025.11.16</div>
                      <div className="frame-91">
                        <div className="div10">의류</div>
                      </div>
                    </div>
                  </div>
                  <div className="frame-110">
                    <div className="div11">
                      패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은
                      기모티만 입어도 충분히 한겨울 기온을 버틸 정도라서
                      요즘 거의 매일 입고 다닙니다. 지퍼도 부드럽게 잘
                      올라가고 주머니 털 안감도 포근해서 만족스러워요.
                      전체적으로 착용감이 편안해서 오래 입고 있어도 부담이
                      없고, 바람 부는 날에도 체온을 잘 유지해줘서 외출할
                      때마다 든든합니다. 디자인도 깔끔해서 어떤 옷과
                      매치해도 잘 어울려 데일리 아우터로 손색이 없어요.
                      개인적으로 이번 시즌에 산 옷 중 가장 만족스러워서
                      주변에도 적극 추천하고 싶을 정도입니다
                    </div>
                    <div className="frame-111">
                      <div className="frame-912">
                        <div className="div12">제품 링크</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="frame-129"></div>
            </div>
            <div className="frame-156">
              <div className="line-52"></div>
              <div className="frame-246">
                <div className="frame-248">
                  <img className="frame-131" src="frame-1310.svg" />
                  <div className="frame-247">
                    <div className="_10">10</div>
                  </div>
                </div>
                <div className="frame-249">
                  <img className="frame-132" src="frame-1320.svg" />
                  <div className="frame-247">
                    <div className="_10">10</div>
                  </div>
                </div>
                <div className="frame-250">
                  <img className="frame-130" src="frame-1300.svg" />
                  <div className="frame-247">
                    <div className="_10">10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewFeed = () => {
  return (
    <div className="frame-145">
      <div className="line-42"></div>
      <div className="frame-143">
        <div className="div8">리뷰 피드</div>
        <div className="frame-183">
          {/* Pagination controls */}
        </div>
      </div>
      <div className="frame-144">
        <div className="frame-128">
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
        <div className="frame-127">
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
      </div>
    </div>
  );
};

export default ReviewFeed;