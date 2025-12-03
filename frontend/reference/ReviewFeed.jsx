import React, { useState, useMemo } from "react";
import styles from "./ReviewFeed.module.css";
import { ShoppingList } from "../ShoppingList/ShoppingList"; // ShoppingList 컴포넌트 import

export const ReviewFeed = () => {
  const initialReviews = [
    {
      id: 1,
      username: "USERNAME",
      title: "스노우쉴드 롱패딩",
      productImage: "/mask-group0.svg",
      date: "2025.11.16",
      category: "의류",
      content:
        "패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만 입어도 충분히 한겨울 기온을 버틸 정도라서 요즘 거의 매일 입고 다닙니다. 지퍼도 부드럽게 잘 올라가고 주머니 털 안감도 포근해서 만족스러워요. 전체적으로 착용감이 편안해서 오래 입고 있어도 부담이 없고, 바람 부는 날에도 체온을 잘 유지해줘서 외출할 때마다 든든합니다. 디자인도 깔끔해서 어떤 옷과 매치해도 잘 어울려 데일리 아우터로 손색이 없어요. 개인적으로 이번 시즌에 산 옷 중 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다",
      productLink: "제품 링크",
      likes: 2,
      comments: 5,
      bookmarks: 10,
      views: 150,
      moreIcon: "/ri-more-line0.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [
        { id: 1, username: "USERNAME", text: "요즘 패딩 찾고 있었는데 상세 후기 덕분에 선택에 도움이 됐어요, 감사합니다", moreIcon: "/ri-more-line1.svg" },
        { id: 2, username: "USERNAME", text: "바람 많이 부는 지역 살아서 걱정했는데 이 정도면 충분히 따뜻하겠다 싶네요", moreIcon: "/ri-more-line2.svg" },
        { id: 3, username: "USERNAME", text: "착용감 편하다는 말에 바로 장바구니 넣었습니다. 실제로도 가볍나요?", moreIcon: "/ri-more-line3.svg" },
      ],
    },
    {
      id: 2,
      username: "USERNAME",
      title: "테라플렉스 워킹화",
      productImage: null, // No image for this one in reference
      date: "2025.11.16",
      category: "의류",
      content:
        "착용하자마자 발을 부드럽게 감싸는 느낌이 정말 좋았습니다. 장시간 걸어도 발바닥이 쉽게 피로해지지 않고, 충격 흡수력이 좋아 하루 종일 신어도 편안하더라고요. 발등을 압박하지 않으면서도 안정감 있게 잡아주는 착화감 덕분에 운동할 때도 잘 벗겨지지 않아 믿음이 갑니다. 신발 바닥 패턴이 미끄럼을 잘 잡아줘 비 오는 날에도 걱정 없이 걸을 수 있었어요. 디자인도 과하지 않고 깔끔해서 데일리로 신기 좋아, 최근 산 신발 중 가장 만족도가 높은 제품입니다.",
      productLink: "제품 링크",
      likes: 10,
      comments: 10,
      bookmarks: 10,
      views: 200,
      moreIcon: "/ri-more-line4.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 3,
      username: "USERNAME",
      title: "플러피라운지 후드집업",
      productImage: null,
      date: "2025.11.16",
      category: "의류",
      content:
        "입는 순간 편안함이 느껴질 정도로 소재가 굉장히 부드럽습니다. 안감이 따뜻해 가벼운 티셔츠 위에 걸쳐도 보온성이 좋고, 지퍼가 부드럽게 올라가서 사용감이 만족스러워요. 품이 여유로워 활동할 때 불편함이 없고, 소매와 밑단 시보리가 탄탄해서 오래 입어도 형태가 잘 유지됩니다. 캐주얼한 디자인이라 청바지나 조거팬츠와 매치해도 자연스럽고, 집에서 입기에도 딱이라 요즘 손이 자주 가는 옷이에요. 전체적으로 활용도 높은 아이템이라 추천하고 싶은 후드입니다.",
      productLink: "제품 링크",
      likes: 10,
      comments: 10,
      bookmarks: 10,
      views: 180,
      moreIcon: "/ri-more-line5.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 4,
      username: "USERNAME",
      title: "윈터가드 웜테크 롱패딩",
      productImage: null,
      date: "2025.11.16",
      category: "의류",
      content:
        "패딩을 처음 입어보자마자 가벼움에 한 번, 보온성에 두 번 놀랐습니다. 두께감이 크게 느껴지지 않는데도 확실하게 체온을 잡아줘서, 요즘처럼 아침저녁 기온 차가 큰 날에도 안에 얇은 맨투맨 하나만 입어도 전혀 춥지 않아요. 지퍼와 스냅 단추가 견고해 쉽게 풀리지 않고, 주머니 안감이 부드러워 손을 넣을 때마다 따뜻한 느낌이 들어 작은 부분까지 신경 쓴 게 느껴집니다. 활동할 때도 크게 불편함이 없을 정도로 핏이 여유롭고, 바람이 강한 날에도 외풍을 잘 막아줘서 외출할 때마다 든든한 아우터가 되어주고 있어요. 디자인 역시 군더더기 없이 깔끔해서 캐주얼·포멀 어떤 코디에도 조화가 좋습니다.",
      productLink: "제품 링크",
      likes: 10,
      comments: 10,
      bookmarks: 10,
      views: 220,
      moreIcon: "/ri-more-line6.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 5,
      username: "USERNAME",
      title: "아이스버스터 프라임 롱패딩",
      productImage: null,
      date: "2025.11.16",
      category: "의류",
      content:
        "입는 순간 가볍고 포근해서 만족스러웠어요. 두껍지 않은 옷을 받쳐 입어도 한겨울 바람을 잘 막아줘서 요즘 외출할 때 무조건 이 패딩만 찾게 됩니다. 지퍼가 잘 걸리지 않고 부드럽게 올라가며, 주머니 안쪽 소재도 따뜻해서 작은 부분까지 신경 쓴 느낌이에요. 착용감이 편안하고 어깨가 눌리는 느낌이 없어 오래 입어도 피로가 덜합니다. 무엇보다 디자인이 깔끔해 어떤 코디에도 자연스럽게 어울려 데일리 아우터로 딱이에요. 전체적으로 가격 대비 만족도가 높아서 지인들에게도 추천하고 싶은 패딩입니다.",
      productLink: "제품 링크",
      likes: 10,
      comments: 10,
      bookmarks: 10,
      views: 190,
      moreIcon: "/ri-more-line7.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 6,
      username: "USERNAME",
      title: "코어히트 울트라롱 패딩",
      productImage: null,
      date: "2025.11.16",
      category: "의류",
      content:
        "착용했을 때 생각보다 훨씬 따뜻해서 놀랐습니다. 가벼운데도 보온력이 좋아서 안에 얇게 입고도 충분히 한겨울을 버틸 수 있더라고요. 바람막이 기능이 확실해 강풍이 부는 날에도 체온을 잘 잡아줍니다. 지퍼와 버튼 마감도 튼튼하고, 주머니 안감이 부드러워 손을 넣을 때마다 포근함이 느껴져요. 활동할 때 불편함이 없도록 핏이 적당히 여유로워서 일상용뿐 아니라 장시간 외출 때도 편합니다. 디자인도 심플하고 깔끔해 매일 손이 가는 옷이에요. 이번 시즌 구매 제품 중 가장 만족스러운 아이템입니다.",
      productLink: "제품 링크",
      likes: 10,
      comments: 10,
      bookmarks: 10,
      views: 210,
      moreIcon: "/ri-more-line8.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 7,
      username: "USERNAME",
      title: "뉴발란스 530",
      productImage: null,
      date: "2025.11.15",
      category: "신발",
      content: "편안하고 디자인도 예뻐서 만족합니다.",
      productLink: "제품 링크",
      likes: 5,
      comments: 2,
      bookmarks: 3,
      views: 100,
      moreIcon: "/ri-more-line9.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 8,
      username: "USERNAME",
      title: "나이키 에어포스 1",
      productImage: null,
      date: "2025.11.14",
      category: "신발",
      content: "클래식은 영원하다. 어떤 옷에도 잘 어울려요.",
      productLink: "제품 링크",
      likes: 8,
      comments: 3,
      bookmarks: 5,
      views: 120,
      moreIcon: "/ri-more-line10.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
    {
      id: 9,
      username: "USERNAME",
      title: "아디다스 가젤",
      productImage: null,
      date: "2025.11.13",
      category: "신발",
      content: "가볍고 착화감이 좋습니다. 데일리 슈즈로 최고!",
      productLink: "제품 링크",
      likes: 12,
      comments: 6,
      bookmarks: 7,
      views: 130,
      moreIcon: "/ri-more-line11.svg",
      likeIcon: "/public2/like.svg",
      commentIcon: "/public2/comment_icon.svg",
      bookmarkIcon: "/public2/bookmark_icon.svg",
      commentsList: [],
    },
  ];

  const [reviews, setReviews] = useState(initialReviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(4); // 페이지당 4개의 리뷰
  const [sortOrder, setSortOrder] = useState("latest"); // 기본 정렬: 최신순

  // 정렬된 리뷰 목록 계산
  const sortedReviews = useMemo(() => {
    let sortableReviews = [...reviews];
    if (sortOrder === "latest") {
      sortableReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "views") {
      sortableReviews.sort((a, b) => b.views - a.views);
    } else if (sortOrder === "likes") {
      sortableReviews.sort((a, b) => b.likes - a.likes);
    }
    return sortableReviews;
  }, [reviews, sortOrder]);

  // 현재 페이지의 리뷰 가져오기
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);

  // 페이지 변경
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const recommendedReviews = [
    { id: 1, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 2, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 3, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 4, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
    { id: 5, username: "USERNAME", title: "소프트 터치 라운드 니트", date: "2025.11.16", category: "의류" },
  ];

  return (
    <div className={styles.reviewFeedMainContainer}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.contentWrapper}>

      <div className={styles.filterSortCategoryWrapper}>

        {/* Category Section */}
        <div className={styles.frame51}>
          <div className={styles.div2}>카테고리</div>
          <div className={styles.frame96}>
            <div className={styles.frame95}>
              <div className={styles.div3}>뷰티</div>
            </div>
            <div className={styles.frame91}>
              <div className={styles.div3}>식품</div>
            </div>
            <div className={styles.frame93}>
              <div className={styles.div3}>의류</div>
            </div>
            <div className={styles.frame88}>
              <div className={styles.div3}>주방</div>
            </div>
            <div className={styles.frame94}>
              <div className={styles.div3}>생활·가전</div>
            </div>
            <div className={styles.frame89}>
              <div className={styles.div3}>청소·욕실</div>
            </div>
            <div className={styles.frame962}>
              <div className={styles.div3}>가구</div>
            </div>
            <div className={styles.frame90}>
              <div className={styles.div3}>문구</div>
            </div>
            <div className={styles.frame92}>
              <div className={styles.div3}>인테리어</div>
            </div>
            <div className={styles.frame972}>
              <div className={styles.div3}>취미·레저</div>
            </div>
            <div className={styles.frame972}>
              <div className={styles.div3}>기타</div>
            </div>
          </div>
        </div>

                {/* Filtering Section */}
        <div className={styles.frame58}>
          <div className={styles.div2}>필터링</div>
          <div className={styles.frame96}>
            <div className={styles.frame95}>
              <div className={styles.div3}>추천</div>
            </div>
          </div>
          <div className={styles.frame97}>
            <div className={styles.frame95}>
              <div className={styles.div3}>비추천</div>
            </div>
          </div>

                 {/* Sorting Section */}
        <div className={styles.frame59}>
          <div className={styles.frame112}>
            <div className={styles.div4}>정렬</div>
            <img className={styles.polygon1} src="/public2/listup_icon.svg" alt="sort icon" />
          </div>
          <div className={styles.frame113}>
            <div className={`${styles.frame95} ${sortOrder === "latest" ? styles.activeSort : ""}`} onClick={() => setSortOrder("latest")}>
              <div className={styles.div3}>최신순</div>
            </div>
          </div>
          <div className={styles.frame96}>
            <div className={`${styles.frame95} ${sortOrder === "views" ? styles.activeSort : ""}`} onClick={() => setSortOrder("views")}>
              <div className={styles.div3}>조회수순</div>
            </div>
          </div>
          <div className={styles.frame97}>
            <div className={`${styles.frame95} ${sortOrder === "likes" ? styles.activeSort : ""}`} onClick={() => setSortOrder("likes")}>
              <div className={styles.div3}>좋아요순</div>
            </div>
          </div>
        </div>

        </div>

      </div>

      {/* Main Content Area */}
      <div className={styles.frame182}>
        <div className={styles.frame181}>
          <div className={styles.frame180}>
            <div className={styles.frame245}>
              <div className={styles.frame236}>
                <div className={styles.frame106}>
                  <div className={styles.a}>검색된 리뷰</div>
                </div>
                <div className={styles._30}>총 {reviews.length}건</div>
              </div>
              {/* Pagination (Top) */}
              <div className={styles.frame2222}> {/* Corresponds to frame-183 */}
                         
                          
                    <div className={styles.frame1901}>
                      <img className={styles.group20953} src="/public2/leftleft_icon.svg" alt="<<" onClick={() => paginate(1)} />
                      <img className={styles.group20953} src="/public2/left_icon.svg" alt="<" onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} />
                    </div>
          
                
                    
                      {pageNumbers.map(number => (
                        <div key={number} className={`${styles.frame1804} ${currentPage === number ? styles.activePage : ''}`} onClick={() => paginate(number)}> 
                          <div className={styles._10}>{number}</div>
                        </div>
                      ))}
                  
      
                      <div className={styles.frame1901}> {/* Corresponds to frame-191 */}
                        <img className={styles.group20953} src="/public2/right_icon.svg" alt=">" onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)} />
                        <img className={styles.group20953} src="/public2/rightright_icon.svg" alt=">>" onClick={() => paginate(totalPages)} />
                      </div>
                    
                    </div>
            </div>
            <div className={styles.frame244}>
               <div className={styles.frame1407}>
                <img className={styles.group1} src="/public2/search_icon.svg" alt="Search icon" />
                <div className={styles.line54}></div>
                <input type="text" placeholder="검색..." className={styles.searchInput} />
              </div>
            </div>
          </div>

          {/* Review Cards Container */}
          <div className={styles.frame119}>
            {currentReviews.map((review) => (
              <div key={review.id} className={styles.frame50}>
                <div className={styles.frame1222}>
                  <div className={styles.reviewContentWrapper}>
                    <div className={styles.section01}>
                  <div className={styles.frame1072}>
                    <div className={styles.frame1062}>
                      <div className={styles.frame150}>
                        <div className={styles.frame243}>
                          <div className={styles.frame109}>
                            <div className={styles.profile}></div>
                            <div className={styles.username}>{review.username}</div>
                          </div>
                          <img className={styles.riMoreLine} src="/public2/More_info.svg" alt="moreoptions" />
                        </div>
                        <div className={styles.frame149}>
                          <div className={styles.div5}>{review.title}</div>
                        </div>
                        <div className={styles._20251116}>{review.date}</div>
                      </div>
                    </div>
                    <div className={styles.frame148}>
                      <div className={styles.frame912}>
                        <div className={styles.div6}>{review.category}</div>
                      </div>
                      <div className={styles.frame111}>
                        <div className={styles.frame913}>
                          <div className={styles.div6}>{review.productLink}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.frame153}>
                    <div className={styles.div7}>{review.content}</div>
                    <div className={styles.frame129}>
                      <div className={styles.frame246}>
                        <div className={styles.frame248}>
                          <img className={styles.frame131} src={review.likeIcon} alt="like" />
                          <div className={styles.frame247}>
                            <div className={styles._10}>{review.likes}</div>
                          </div>
                        </div>
                        <div className={styles.frame249}>
                          <img className={styles.frame132} src={review.commentIcon} alt="comment" />
                          <div className={styles.frame247}>
                            <div className={styles._10}>{review.comments}</div>
                          </div>
                        </div>
                        <div className={styles.frame250}>
                          <img className={styles.frame130} src={review.bookmarkIcon} alt="bookmark" />
                          <div className={styles.frame247}>
                            <div className={styles._10}>{review.bookmarks}</div>
                          </div>
                        </div>
                        <div className={styles.frame250}> {/* View count display */}
                          <img className={styles.frame130} src="/public2/search_icon.svg" alt="views" /> {/* Using search icon as placeholder for views */}
                          <div className={styles.frame247}>
                            <div className={styles._10}>{review.views}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> {/* section01 닫는 태그 */}
                  <div className={styles.frame179}>
             
                  {/* <div className={styles.line52}></div> */}
                  {/*e */}
                  <div className={styles.frame176}>
                         
                    {review.commentsList.map((comment) => (
                      <div key={comment.id} className={styles.frame174}>
                        <div className={styles.line7}></div>
                        <div className={styles.frame1063}>
                          <div className={styles.frame141}>
                            <div className={styles.frame140}>
                              <div className={styles.profile2}></div>
                              <div className={styles.username2}>{comment.username}</div>
                            </div>
                            <div className={styles.frame139}>
                              <div className={styles.div8}>{comment.text}</div>
                            </div>
                          </div>
                          <img className={styles.group1} src="/public2/More_info.svg" alt="more options" />
                        </div>
                        <div className={styles.line6}></div>
                      </div>
                    ))}
                    <div className={styles.frame197}>
                      <div className={styles.line53}></div>
                      <div className={styles.div9}>더보기</div>
                    </div>
                  </div>
                </div>
                </div> {/* section01 닫는 태그 */}
                </div> {/* reviewContentWrapper 닫는 태그 */}
                
              </div>
            
            ))}
          </div>
        </div>

        {/* Sidebars */}
        <div className={styles.frame172}>
          {/* Shopping List Section */}
          <ShoppingList />

          {/* Recommended Reviews Section */}
          <div className={styles.frame168}>
            <div className={styles.div14}>추천 리뷰</div>
            {recommendedReviews.map((review) => (
              <div key={review.id} className={styles.frame167}>
                <div className={styles.frame162}>
                  <div className={styles.frame161}>
                    <div className={styles.frame160}>
                      <div className={styles.profile}></div>
                      <div className={styles.username3}>{review.username}</div>
                    </div>
                    <div className={styles.div15}>{review.title}</div>
                  </div>
                  <div className={styles.frame108}>
                    <div className={styles._202511162}>{review.date}</div>
                    <div className={styles.frame91}>
                      <div className={styles.div3}>{review.category}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};