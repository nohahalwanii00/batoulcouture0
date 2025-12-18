import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartIcon: React.FC = () => {
  const { state } = useCart();
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => navigate('/cart')}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 2L6 6H3L5 20H19L21 6H18L15 2H9Z" />
        <path d="M9 2V6" />
        <path d="M15 2V6" />
        <path d="M3 6H21" />
      </svg>
      {itemCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ff4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {itemCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;