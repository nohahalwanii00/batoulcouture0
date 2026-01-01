import React from 'react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const shareOnWhatsApp = () => {
    if (state.items.length === 0) return;
    const lines = state.items.map(item => {
      const details = [
        item.size ? `Size: ${item.size}` : null,
        item.color ? `Color: ${item.color}` : null,
        `Qty: ${item.quantity}`
      ].filter(Boolean).join(' • ');
      return `${item.name}${details ? ` (${details})` : ''} — ${(item.price * item.quantity).toFixed(2)} TND`;
    });
    const message = `Hello, I'm interested in these items from Batoul's Couture:\n\n${lines.join('\n')}\n\nTotal: ${state.total.toFixed(2)} TND`;
    const phoneRaw = '+963 986 583 086';
    const phone = phoneRaw.replace(/[^\d]/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h2 style={{ marginBottom: '16px' }}>Your Cart</h2>
      {state.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {state.items.map(item => (
              <li
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderBottom: '1px solid #eee',
                  padding: '12px 0'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: 14 }}>
                    {item.size ? `Size: ${item.size}` : ''}
                    {item.color ? (item.size ? ' • ' : '') + `Color: ${item.color}` : ''}
                  </div>
                  <div style={{ marginTop: 4 }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ minWidth: 90, textAlign: 'right' }}>{(item.price * item.quantity).toFixed(2)} TND</div>
                <button
                  onClick={() => handleRemove(item._id)}
                  style={{
                    marginLeft: 12,
                    background: '#ff4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleClear}
                style={{
                  background: '#eee',
                  color: '#333',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 14px',
                  cursor: 'pointer'
                }}
              >
                Clear Cart
              </button>
              <button
                onClick={shareOnWhatsApp}
                disabled={state.items.length === 0}
                style={{
                  background: '#25D366',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 14px',
                  cursor: state.items.length === 0 ? 'not-allowed' : 'pointer'
                }}
                aria-label="Share cart on WhatsApp"
              >
                Share on WhatsApp
              </button>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Total: {state.total.toFixed(2)} TND</div>
          </div
          >
        </div>
      )}
    </div>
  );
};

export default Cart;