import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, t, backendUrl, appliedPromo, applyPromoCode, formatPrice } = useApp();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="container cart-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center' }}
        >
          <img 
            src="https://img.icons8.com/ios/200/2c3e50/shopping-bag.png" 
            alt="Empty cart" 
            style={{ opacity: 0.3, marginBottom: '20px' }}
          />
          <h1 style={{ marginBottom: '16px' }}>Savat bo'sh</h1>
          <p style={{ color: '#86868b', marginBottom: '24px' }}>Savatingizda hali mahsulotlar yo'q</p>
          <Link to="/products" className="btn">Mahsulotlarni ko'rish</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <motion.h1 
          className="section-title"
          style={{ margin: 0 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Savat
        </motion.h1>
        <button 
          onClick={() => { if(window.confirm("Savatni bo'shatmoqchimisiz?")) clearCart(); }}
          style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
        >
          Savatni tozalash
        </button>
      </div>

      <div className="cart-items-container" style={{ display: 'grid', gap: '20px' }}>
        {cart.map((item, index) => (
          <motion.div 
            key={`${item.id}-${item.variant}`}
            className="cart-item-enhanced"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px', 
              padding: '24px', 
              background: 'white', 
              borderRadius: '24px',
              border: '1px solid #f1f1f1',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
              flexWrap: 'wrap'
            }}
          >
            <img 
              src={item.image?.startsWith('/') ? `${backendUrl}${item.image}` : (item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200')} 
              onError={handleImageError}
              alt={item.name} 
              style={{ width: '100px', height: '100px', borderRadius: '16px', objectFit: 'cover' }}
            />
            <div style={{ flex: '1 1 200px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>{item.name}</h3>
              <p style={{ color: '#86868b', fontSize: '14px', margin: 0 }}>{item.brand}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                {item.selectedColor && <span style={{ fontSize: '12px', background: '#F3F4F6', padding: '4px 10px', borderRadius: '20px' }}>Rang: {item.selectedColor}</span>}
                {item.selectedSize && <span style={{ fontSize: '12px', background: '#F3F4F6', padding: '4px 10px', borderRadius: '20px' }}>O'lcham: {item.selectedSize}</span>}
              </div>
            </div>
            <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 auto', justifyContent: 'flex-end', minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '12px', padding: '4px' }}>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)} style={{ width: '32px', height: '32px' }}>-</button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)} style={{ width: '32px', height: '32px' }}>+</button>
              </div>
              <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: 800 }}>
                {formatPrice(item.price * item.quantity)}
              </div>
              <button 
                className="delete-btn" 
                onClick={() => removeFromCart(item.id, item.variant)}
                style={{ color: '#DC2626', background: '#FEE2E2', border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '60px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: '#f9f9fb', padding: '32px', borderRadius: '24px' }}
        >
          <h3 style={{ marginBottom: '16px' }}>{t('promo_code')}</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Masalan: SHOPSRY10"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}
            />
            <button 
              className="btn btn-primary" 
              onClick={async () => {
                const result = await applyPromoCode(promoInput);
                if (!result.success) setPromoError(result.error);
                else { setPromoError(''); setPromoInput(''); }
              }}
              style={{ padding: '0 24px' }}
            >
              {t('apply')}
            </button>
          </div>
          {promoError && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px' }}>{promoError}</p>}
          {appliedPromo && (
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 600 }}>
              <span style={{ fontSize: '12px', background: '#D1FAE5', padding: '4px 12px', borderRadius: '20px' }}>
                {appliedPromo.code} (-{appliedPromo.discount_percent}%)
              </span>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="cart-total"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ margin: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', color: '#86868b' }}>
            <span>Oraliq qiymat:</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          {appliedPromo && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', color: '#059669' }}>
              <span>Chegirma:</span>
              <span>-{formatPrice(Math.floor(cartTotal * appliedPromo.discount_percent / 100))}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', fontSize: '24px', fontWeight: 800, marginTop: '8px' }}>
            <span>Jami:</span>
            <span style={{ color: 'var(--primary)' }}>
              {formatPrice(Math.floor(cartTotal * (1 - (appliedPromo?.discount_percent || 0) / 100)))}
            </span>
          </div>
          
          <button className="btn" onClick={() => navigate('/checkout')} style={{ width: '100%', marginTop: '20px', height: '56px', fontSize: '18px' }}>
            {t('checkout')}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;