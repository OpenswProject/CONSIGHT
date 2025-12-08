import React from 'react';

const ShoppingList = () => {
  const shoppingItems = [
    "겨울 옷 구매",
    "12월 식재료 구매",
    "전기장판 구매",
    "핸드워시 구매"
  ];

  return (
    <div className="frame-59">
      <div className="div18">사야 할 물건</div>
      <div className="frame-85">
        <div className="frame-86">
          {shoppingItems.map((item, index) => (
            <div key={index} className="shopping-list-item">
              <span className="item-number">{index + 1}.</span> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
