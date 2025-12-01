import React from 'react';

const RecommendedReview = ({ title, user, content }) => (
  <div className="frame-1053">
    <div className="frame-1093">
      <div className="frame-1133">
        <div className="frame-1076">
          <div className="frame-1065">
            <div className="profile3"></div>
            <div className="username6">{user}</div>
            <img className="ri-more-line11" src="ri-more-line10.svg" />
            <div className="div23">{title}</div>
          </div>
          <div className="frame-108">
            <div className="_2025-11-16">2025.11.16</div>
            <div className="frame-91">
              <div className="div10">의류</div>
            </div>
          </div>
        </div>
        <div className="frame-1103">
          <div className="div24">{content}</div>
          <div className="frame-111">
            <div className="frame-912">
              <div className="div12">제품 링크</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="frame-155">
      <img className="frame-1318" src="frame-1317.svg" />
      <img className="frame-1328" src="frame-1327.svg" />
      <img className="frame-1308" src="frame-1307.svg" />
    </div>
  </div>
);

const RecommendedReviews = () => {
  return (
    <div className="frame-60">
      <div className="frame-123">
        <div className="frame-1222">
          <div className="frame-124">
            <div className="div22">추천 리뷰</div>
          </div>
        </div>
      </div>
      <div className="frame-116">
        <div className="frame-114">
          <div className="frame-832">
            <RecommendedReview user="USERNAME" title="소프트 터치 라운드 니트" content="니트가 생각보다 훨씬 촉감이 부드럽고 까슬거림이 전혀 없어요." />
          </div>
        </div>
        <div className="frame-115">
          <div className="frame-832">
            <RecommendedReview user="USERNAME" title="코지웜 듀얼히팅 전기장판" content="생각보다 훨씬 빠르게 따뜻해져서 밤에 잠들 때 정말 편해요." />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedReviews;