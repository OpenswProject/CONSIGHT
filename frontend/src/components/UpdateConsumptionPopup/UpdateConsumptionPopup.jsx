import React, { useState, useEffect } from 'react';
import styles from './UpdateConsumptionPopup.module.css';

const UpdateConsumptionPopup = ({ onClose, title, categories, setCategories }) => {
  const [categoryInputs, setCategoryInputs] = useState({});

  useEffect(() => {
    const initialInputs = {};
    categories.forEach(category => {
      initialInputs[category.id] = category.current;
    });
    setCategoryInputs(initialInputs);
  }, [categories]);

  const handleInputChange = (categoryId, value) => {
    setCategoryInputs(prevInputs => ({
      ...prevInputs,
      [categoryId]: parseInt(value, 10) || 0,
    }));
  };

  const handleUpdateConsumption = () => {
    const updatedCategories = categories.map(category => ({
      ...category,
      current: categoryInputs[category.id] !== undefined ? categoryInputs[category.id] : category.current,
    }));
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
