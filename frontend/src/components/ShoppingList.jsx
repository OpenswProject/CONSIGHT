import React from 'react';

const ShoppingList = ({ shoppingItems, onItemClick }) => { // prop으로 받도록 수정
  return (
    <div className="frame-59">
      <div className="div18">사야 할 물건</div>
      <div className="frame-85">
        <div className="frame-86">
          {shoppingItems.map((item, index) => (
            <div 
              key={index} 
              className="shopping-list-item"
              onClick={() => onItemClick(index, item)} // 클릭 이벤트 추가
              style={{ cursor: 'pointer' }} // 클릭 가능함을 시각적으로 표시
            >
              <span className="item-number">{index + 1}.</span> {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
