import React from 'react';

const RecommendedReviews = ({ shoppingItem }) => {
  return (
    <div className="frame-60">
      <div className="frame-123">
        <div className="frame-1222">
          <div className="frame-124">
            <div className="div22">{shoppingItem}에 대한 추천 리뷰</div>
          </div>
        </div>
      </div>
      <div className="frame-116">
        <div className="frame-114">
          <div className="frame-832">
            {/* 여기에 shoppingItem에 따른 동적인 추천 리뷰 내용을 표시할 수 있습니다. */}
            {/* 현재는 예시 텍스트로 대체합니다. */}
            <div className="recommended-review-content">
              "{shoppingItem}" 관련 추천 리뷰 내용이 여기에 표시됩니다.
              <br />
              예시: "소프트 터치 라운드 니트"는 촉감이 부드럽고 까슬거림이 전혀 없어요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedReviews;