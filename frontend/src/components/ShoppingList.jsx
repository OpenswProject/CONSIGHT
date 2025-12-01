import React from 'react';

const ShoppingListItem = ({ title, category }) => (
  <div className="frame-98">
    <div className="div19">{title}</div>
    <div className="frame-91">
      <div className="div10">{category}</div>
    </div>
  </div>
);

const ShoppingList = () => {
  return (
    <div className="frame-59">
      <div className="div18">사야 할 물건</div>
      <div className="frame-85">
        <div className="frame-86">
          <ShoppingListItem title="겨울 옷 구매" category="의류" />
          <ShoppingListItem title="12월 식재료 구매" category="식품" />
          <ShoppingListItem title="전기장판 구매" category="생활·가전" />
          <ShoppingListItem title="핸드워시 구매" category="청소·욕실" />
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
