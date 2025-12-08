import React, { useState, useEffect } from 'react';
import styles from './UpdateConsumptionPopup.module.css';

const UpdateConsumptionPopup = ({ onClose, title, categories, setCategories }) => {
  // Initialize state once using a function to avoid re-initialization on re-renders
  const [categoryInputs, setCategoryInputs] = useState(() => {
    const initialInputs = {};
    categories.forEach(category => {
      initialInputs[category.id] = category.current;
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

    const updatedCategories = await Promise.all(
      categories.map(async category => {
        const newCurrent = categoryInputs[category.id] !== undefined ? categoryInputs[category.id] : category.current;
        if (category.id && newCurrent !== category.current) { // Only update if ID exists and value changed
          try {
            const response = await fetch(`/api/consumption/categories/${category.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                id: category.id,
                name: category.name,
                type: category.type,
                targetAmount: category.target,
                currentAmount: newCurrent,
                color: category.color
              })
            });
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                return data.data; // Return the updated category from backend
              } else {
                console.error(`Failed to update category ${category.name}:`, data.message);
                return category; // Return original if update failed
              }
            } else {
              console.error(`Failed to update category ${category.name}:`, response.statusText);
              return category; // Return original if update failed
            }
          } catch (error) {
            console.error(`Error updating category ${category.name}:`, error);
            return category; // Return original on error
          }
        }
        return { ...category, current: newCurrent }; // Return with new current if not updated via API (e.g. no ID)
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
