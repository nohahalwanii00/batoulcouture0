import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Dress } from '../types/Dress';

interface AddToCartButtonProps {
  dress: Dress;
  className?: string;
  size?: string;
  color?: string;
  quantity?: number;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  dress, 
  className = '',
  size,
  color,
  quantity = 1,
  disabled = false
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    if (disabled) return;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        _id: dress._id ?? dress.id ?? `${dress.name}-${dress.category}`,
        name: dress.name,
        price: dress.price,
        image: dress.images[0]?.url || '',
        size,
        color,
        quantity: quantity
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`btn btn-primary ${className}`}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#777' : '#000',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = '#333';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = disabled ? '#777' : '#000';
      }}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;