import React, { useState } from "react";
import styles from "./ShoppingList.module.css";

const CATEGORIES = ["뷰티", "식품", "의류", "주방", "생활·가전", "청소·욕실", "가구", "문구", "인테리어", "취미·레저"];

export const ShoppingList = () => {
  const [items, setItems] = useState([
    { id: 1, text: "겨울 옷 구매", category: "의류" },
    { id: 2, text: "12월 식재료 구매", category: "식품" },
    { id: 3, text: "전기장판 구매", category: "생활·가전" },
    { id: 4, text: "핸드워시 구매", category: "청소·욕실" },
    { id: 5, text: "난방텐트 구매", category: "생활·가전" },
    { id: 6, text: "수면양말 구매", category: "의류" },
    { id: 7, text: "크리스마스 트리 구매", category: "기타" },
    { id: 8, text: "새해 다이어리 구매", category: "문구" },
    { id: 9, text: "귤 한박스 구매", category: "식품" },
  ]);
  const [showAllItems, setShowAllItems] = useState(false); // 모든 아이템 표시 여부 상태 추가
  const [isAdding, setIsAdding] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[0]);

  const handleToggleShowAll = () => {
    setShowAllItems(prev => !prev);
  };

  const handleAddItemClick = () => {
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewItemText("");
    setNewItemCategory(CATEGORIES[0]);
  };

  const handleSaveNewItem = () => {
    if (newItemText.trim() === "") {
      // Optionally, show an alert or handle empty input
      return;
    }
    const newItem = {
      id: Date.now(), // Simple unique ID
      text: newItemText,
      category: newItemCategory,
    };
    setItems(prevItems => [...prevItems, newItem]);
    handleCancel(); // Reset form
  };

  const handleRemoveItem = (idToRemove) => {
    setItems(prevItems => prevItems.filter(item => item.id !== idToRemove));
  };

  // 렌더링할 아이템 목록 결정
  const itemsToDisplay = showAllItems ? items : items.slice(0, 6);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>사야 할 물건</h2>
      <div className={styles.list}>
        <div className={styles.listItemsWrapper}>
          {itemsToDisplay.map((item) => (
            <div key={item.id} className={styles.listItem}>
              <span className={styles.itemText}>{item.text}</span>
              <div className={styles.itemActions}>
                <div className={styles.categoryTagWrapper}>
                  <span className={styles.categoryTag}>{item.category}</span>
                </div>
                <div 
                  onClick={() => handleRemoveItem(item.id)} 
                  className={styles.removeItemButton}
                >
                  -
                </div>
              </div>
            </div>
          ))}
          {isAdding && (
            <div className={`${styles.listItem} ${styles.addItemForm}`}>
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="내가 살 물건..."
                className={styles.addItemInput}
              />
              <div className={styles.itemActions}>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className={styles.categorySelect}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button onClick={handleSaveNewItem} className={styles.saveButton}>저장</button>
                <button onClick={handleCancel} className={styles.cancelButton}>취소</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsInnerWrapper}>
          {/* '더보기'/'줄이기' 버튼 */}
          {items.length > 6 && ( // 아이템이 6개 초과일 때만 버튼 표시
            <button onClick={handleToggleShowAll} className={`${styles.button} ${styles.moreButton}`}>
              {showAllItems ? '줄이기' : '더보기'}
            </button>
          )}
          {!isAdding && (
            <button onClick={handleAddItemClick} className={`${styles.button} ${styles.addButton}`}>
              추가하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};