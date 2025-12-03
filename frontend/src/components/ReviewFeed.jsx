import React from 'react';

const ReviewCard = ({ review }) => {
  // review 객체가 없으면 렌더링하지 않음
  if (!review) {
    return null;
  }

  // 날짜 포맷팅 (예: 2025-11-16T12:00:00 -> 2025.11.16)
  const formattedDate = review.createDate ? new Date(review.createDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '.').slice(0, -1) : '';

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
                          <div className="username4">{review.author ? review.author.username : 'UNKNOWN'}</div>
                        </div>
                        <img
                          className="ri-more-line2"
                          src="ri-more-line1.svg"
                          alt="More options"
                        />
                      </div>
                      <div className="frame-251">
                        <div className="div9">{review.title}</div>
                        {/* Assuming receiptImage is a URL */}
                        <img className="mask-group" src={review.receiptImagePath || "mask-group0.svg"} alt="Receipt" />
                      </div>
                      <div className="icon-park-solid-check-one"></div>
                    </div>
                    <div className="frame-108">
                      {/* 조회수와 날짜를 함께 표시하는 div */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img className="view-icon" src="/public2/More_info.svg" alt="View" style={{ width: '16px', height: '16px' }} /> {/* 임시 아이콘 */}
                        <div className="view-count" style={{ color: 'red', fontWeight: 'bold', fontSize: '16px', border: '1px solid red', padding: '2px' }}>{review.viewCount || 0}</div>
                        <div className="_2025-11-16">{formattedDate}</div>
                      </div>
                      <div className="frame-91">
                        <div className="div10">{review.category}</div>
                      </div>
                    </div>
                  </div>
                  <div className="frame-110">
                    <div className="div11">
                      {review.content}
                    </div>
                    <div className="frame-111">
                      <div className="frame-912">
                        <a href={review.productLink} target="_blank" rel="noopener noreferrer" className="div12">제품 링크</a>
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
                  <img className="frame-131" src="frame-1310.svg" alt="Like" />
                  <div className="frame-247">
                    <div className="_10">{review.likeCount || 0}</div>
                  </div>
                </div>
                <div className="frame-249">
                  <img className="frame-132" src="frame-1320.svg" alt="Bookmark" />
                  <div className="frame-247">
                    <div className="_10">{review.bookmarkCount || 0}</div>
                  </div>
                </div>
                <div className="frame-250">
                  <img className="frame-130" src="frame-1300.svg" alt="Comment" />
                  <div className="frame-247">
                    <div className="_10">{review.commentCount || 0}</div>
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

const ReviewFeed = ({ reviews }) => {
  // reviews prop이 없거나 비어있으면 빈 배열로 초기화
  const reviewList = reviews || [];

  // 리뷰를 두 개의 열로 나누기
  const column1 = reviewList.filter((_, index) => index % 2 === 0);
  const column2 = reviewList.filter((_, index) => index % 2 !== 0);

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
          {column1.map((review, index) => (
            <ReviewCard key={review.id || index} review={review} />
          ))}
        </div>
        <div className="frame-127">
          {column2.map((review, index) => (
            <ReviewCard key={review.id || index} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewFeed;