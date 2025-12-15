import React, { useState, useEffect } from "react";
import styles from "./ShoppingList.module.css";

export const CATEGORIES = ["뷰티", "식품", "의류", "주방", "생활·가전", "청소·욕실", "가구", "문구", "인테리어", "취미·레저"];

export const ShoppingList = ({ shoppingItems = [], handleSaveShoppingItem = () => {}, handleRemoveShoppingItem = () => {}, onItemClick = () => {} }) => {
  const [showAllItems, setShowAllItems] = useState(false);
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

  const handleSaveNewItem = async () => { // Made async
    console.log('handleSaveNewItem called');
    if (newItemText.trim() === "") {
      return;
    }
    console.log('Calling handleSaveShoppingItem with:', newItemText, newItemCategory);
    const savedItem = await handleSaveShoppingItem(newItemText, newItemCategory); // Call prop
    console.log('Saved item:', savedItem);
    if (savedItem) {
      // onItemAdd(savedItem.category, savedItem.text, shoppingItems.length); // Removed
      // Instead, HomePage's handleShoppingItemAdd will be called directly from HomePage
      // after handleSaveShoppingItem returns the saved item.
    }
    handleCancel();
  };

  const handleRemoveItem = async (idToRemove) => { // Made async
    await handleRemoveShoppingItem(idToRemove); // Call prop
  };

  // 렌더링할 아이템 목록 결정
  const itemsToDisplay = showAllItems ? shoppingItems : shoppingItems.slice(0, 6);

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>사야 할 물건</h2>
      <div className={styles.list}>
        <div className={styles.listItemsWrapper}>
          {itemsToDisplay.map((item, index) => (
            <div key={item.id} className={styles.listItem} onClick={() => onItemClick(index, item.text, item.category)}> {/* Pass category */}
              <div className={styles.itemDetails}>
                <span className={styles.itemText}>{index + 1}. {item.text}</span>
                <div className={styles.itemActions}>
                  <div className={styles.categoryTagWrapper}>
                    <span className={styles.categoryTag}>{item.category}</span>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from bubbling to the parent div
                      handleRemoveItem(item.id);
                    }} 
                    className={styles.removeItemButton}
                  >
                    -
                  </div>
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
          {shoppingItems.length > 6 && ( // 아이템이 6개 초과일 때만 버튼 표시
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