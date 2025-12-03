import React, { useState } from 'react';
import styles from './ReviewWritePage.module.css';
import { Link } from 'react-router-dom'; // Link 컴포넌트 추가
import { ShoppingList } from '../components/ShoppingList/ShoppingList'; // ShoppingList 컴포넌트 import

const ReviewWritePage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('의류');
  const [receiptImage, setReceiptImage] = useState(null);
  const [productLink, setProductLink] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setReceiptImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      // Optionally redirect to login page
      // navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('productLink', productLink);
    formData.append('reviewContent', reviewContent);
    if (receiptImage) {
      // Convert base64 image to Blob if receiptImage is a data URL
      // Or if it's a File object, append directly
      // For simplicity, assuming receiptImage is a File object from input
      // If receiptImage is a data URL, you'd need to convert it to a Blob
      const response = await fetch(receiptImage);
      const blob = await response.blob();
      formData.append('receiptImage', blob, 'receipt.png');
    }

    try {
      const response = await fetch('/api/reviews', { // Assuming /api/reviews is the endpoint
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by fetch when using FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '리뷰 업로드 실패');
      }

      alert('리뷰가 성공적으로 업로드되었습니다!');
      // Optionally navigate to the review feed page
      // navigate('/review-feed');
      setTitle('');
      setCategory('의류');
      setReceiptImage(null);
      setProductLink('');
      setReviewContent('');
    } catch (error) {
      console.error('리뷰 업로드 중 오류 발생:', error);
      alert(`리뷰 업로드 실패: ${error.message}`);
    }
  };

  return (
    <div className={styles.div}>
      <div className={styles.rectangle10}></div>
      <div className={styles.rectangle9}></div>
      
      <div className={styles.mainContentWrapper}> {/* 새로운 래퍼 추가 */}
        <div className={styles.reviewEditorSection}> {/* 메인 콘텐츠 섹션 */}
          <div className={styles.frame308}>
            <div className={styles.frame309}>
              <div className={styles.frame310}></div>
            </div>
            <div className={styles.frame311}>
              <div className={styles.frame306}>
                <div className={styles.frame154}>
                  <div className={styles.frame151}>
                    <div className={styles.frame107}>
                      <div className={styles.frame1062}>
                        <div className={styles.frame150}>
                          <div className={styles.frame149}>
                            <input
                              type="text"
                              className={styles.div7}
                              placeholder="제목을 입력하세요..."
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={styles.frame148}>
                        <div className={styles.frame912}>
                          <div className={styles.frame305}>
                            <select
                              className={styles.div8}
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            >
                              <option value="의류">의류</option>
                              <option value="식품">식품</option>
                              <option value="생활·가전">생활·가전</option>
                              <option value="청소·욕실">청소·욕실</option>
                              {/* 다른 카테고리 옵션 추가 */}
                            </select>
                            <img className={styles.polygon1} src="/public/polygon-10.svg" alt="Category dropdown" />
                          </div>
                        </div>
                        <div className={styles.frame112}>
                          <label htmlFor="receipt-upload" className={styles.frame305}>
                            <div className={styles.div8}>영수증 인증</div>
                            <input
                              id="receipt-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                        <div className={styles.frame111}>
                          <div className={styles.frame913}>
                            <div className={styles.div8}>제품 링크</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.frame153}>
                      <div className={styles.frame129}>
                        {/* 이미지 미리보기 또는 업로드 영역 */}
                        {receiptImage && <img src={receiptImage} alt="Receipt Preview" className={styles.receiptPreview} />}
                        <div className={styles.frame131}></div>
                        <div className={styles.frame132}></div>
                        <div className={styles.frame130}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.frame307}>
                  <div className={styles.frame914}>
                    <div className={styles.div9}>인증하기</div>
                    <img className={styles.maskGroup} src="/public/mask-group0.svg" alt="Certification icon" />
                  </div>
                  <div className={styles.frame92}>
                    <input
                      type="text"
                      className={styles.div10}
                      placeholder="링크를 입력하세요"
                      value={productLink}
                      onChange={(e) => setProductLink(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <textarea
                className={styles.div11}
                placeholder="패딩이 정말 가볍고 따뜻해서 깜짝 놀랐어요. 안에 얇은 기모티만 입어도 충분히 한겨울 기온을 버틸 정도라서 요즘 거의 매일 입고 다닙니다. 지퍼도 부드럽게 잘 올라가고 주머니 털 안감도 포근해서 만족스러워요. 전체적으로 착용감이 편안해서 오래 입고 있어도 부담이 없고, 바람 부는 날에도 체온을 잘 유지해줘서 외출할 때마다 든든합니다. 디자인도 깔끔해서 어떤 옷과 매치해도 잘 어울려 데일리 아우터로 손색이 없어요. 개인적으로 이번 시즌에 산 옷 중 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다 가장 만족스러워서 주변에도 적극 추천하고 싶을 정도입니다"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        <div className={styles.shoppingListSection}> {/* 사이드바 섹션 */}
          <ShoppingList /> {/* ShoppingList 컴포넌트로 교체 */}
          <div className={styles.frame5} onClick={handleSubmit}> {/* 업로드하기 버튼 이동 */}
            <div className={styles.div12}>업로드하기</div>
          </div>
        </div>
      </div>

      <div className={styles.line5}></div>
    </div>
  );
};

export default ReviewWritePage;