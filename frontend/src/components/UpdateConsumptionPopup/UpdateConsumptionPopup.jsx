import React, { useState, useEffect } from 'react';
import styles from './UpdateConsumptionPopup.module.css';

const UpdateConsumptionPopup = ({ onClose, title, categories, setCategories }) => {
  // Initialize state once using a function to avoid re-initialization on re-renders
  const [categoryInputs, setCategoryInputs] = useState(() => {
    const initialInputs = {};
    categories.forEach(category => {
      initialInputs[category.id] = category.currentAmount;
    });
    return initialInputs;
  });

  const handleInputChange = (categoryId, value) => {
    setCategoryInputs(prevInputs => ({
      ...prevInputs,
      [categoryId]: parseInt(value, 10) || 0,
    }));
  };

  const handleUpdateConsumption = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    console.log("Starting consumption update...");

    const updatedCategories = await Promise.all(
      categories.map(async category => {
        const newCurrent = categoryInputs[category.id] !== undefined ? categoryInputs[category.id] : category.currentAmount;
        if (category.id && newCurrent !== category.currentAmount) {
          const url = `${import.meta.env.VITE_API_URL}/api/consumption/categories/${category.id}`;
          const body = {
            id: category.id,
            name: category.name,
            type: category.type,
            targetAmount: category.targetAmount,
            currentAmount: newCurrent,
            color: category.color
          };
          
          console.log(`[DEBUG] Updating category ${category.id}`);
          console.log(`[DEBUG] URL: ${url}`);
          console.log(`[DEBUG] Body:`, JSON.stringify(body, null, 2));

          try {
            const response = await fetch(url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(body)
            });

            console.log(`[DEBUG] Response for category ${category.id}:`, response.status, response.statusText);

            if (response.ok) {
              const data = await response.json();
              console.log(`[DEBUG] Response data for category ${category.id}:`, data);
              if (data.success) {
                return data.data;
              } else {
                console.error(`[ERROR] Failed to update category ${category.name}:`, data.message);
                alert(`카테고리 '${category.name}' 업데이트 실패: ${data.message}`);
                return category;
              }
            } else {
              const errorText = await response.text();
              console.error(`[ERROR] Failed to update category ${category.name}. Status: ${response.status}. Response:`, errorText);
              alert(`카테고리 '${category.name}' 업데이트 실패: 서버 오류 (상태: ${response.status})`);
              return category;
            }
          } catch (error) {
            console.error(`[ERROR] Network or other error updating category ${category.name}:`, error);
            alert(`카테고리 '${category.name}' 업데이트 중 네트워크 오류가 발생했습니다.`);
            return category;
          }
        }
        return { ...category, currentAmount: newCurrent };
      })
    );
    setCategories(updatedCategories);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
        <div className={styles.content}>
          {categories.map(category => (
            <div key={category.id} className={styles.categoryItem}>
              <label>{category.name}:</label>
              <input
                type="number"
                value={categoryInputs[category.id] || ''}
                onChange={(e) => handleInputChange(category.id, e.target.value)}
                className={styles.inputField}
              />
            </div>
          ))}
        </div>
        <div className={styles.actions}>
          <button onClick={handleUpdateConsumption} className={styles.updateButton}>갱신</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateConsumptionPopup;
