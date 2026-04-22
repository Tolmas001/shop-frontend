import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orders } from '../api';
import { useApp } from '../context/AppContext';

import { Banknote, CreditCard, Lock, MapPin } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart, user, t, appliedPromo, usePoints, setUsePoints, formatPrice } = useApp();
  const [form, setForm] = useState({ 
    customer_name: user?.full_name || user?.username || '', 
    customer_phone: user?.phone || '', 
    customer_address: '' 
  });
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSelectCard = (card) => {
    setSelectedCardId(card.id);
    setCardInfo({ number: card.number, expiry: card.expiry, cvv: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await orders.create({
        ...form,
        payment_method: paymentMethod,
        promo_code: appliedPromo?.code,
        use_points: usePoints,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.price }))
      });
      clearCart();
      setMessage('✅ Buyurtma muvaffaqiyatli qabul qilindi!');
      setTimeout(() => navigate(`/order-success/${res.data.order_id}`), 1500);
    } catch (err) {
      setMessage('❌ Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container checkout-page">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="empty"
        >
          Savat bo'sh
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container checkout-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <motion.h1 
        className="section-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        Buyurtmani Rasmiylashtirish
      </motion.h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {message && (
          <motion.div 
            className={`message ${message.includes('muvaffaqiyatli') ? 'success' : 'error'}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'grid', gap: '32px' }}
        >
          {/* Order Summary */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' }}>
            <h3 style={{ marginBottom: '24px' }}>Buyurtma Tafsilotlari</h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img src={item.image?.startsWith('/') ? `${backendUrl}${item.image}` : (item.image || 'https://via.placeholder.com/64')} 
                       alt={item.name} 
                       onError={handleImageError}
                       style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f1f1f1' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {item.quantity} x {formatPrice(item.price)} 
                      {(item.selectedColor || item.selectedSize) && ` (${item.selectedColor || ''}${item.selectedColor && item.selectedSize ? ', ' : ''}${item.selectedSize || ''})`}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Customer Info */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Ma'lumotlar
            </h3>
            {/* Saved Addresses */}
            {user?.address_list?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '12px', color: 'var(--text-muted)' }}>Mening manzillarim</label>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {user.address_list.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => setForm(f => ({ ...f, customer_address: addr.details }))}
                      style={{ 
                        flexShrink: 0, width: '180px', padding: '16px', borderRadius: '16px', 
                        border: `2px solid ${form.customer_address === addr.details ? 'var(--primary)' : '#f1f1f1'}`,
                        background: form.customer_address === addr.details ? 'rgba(37, 99, 235, 0.05)' : 'white',
                        cursor: 'pointer', transition: '0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--primary)" /> {addr.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {addr.details}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Ism</label>
              <input 
                type="text" 
                value={form.customer_name} 
                onChange={e => setForm({...form, customer_name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input 
                type="tel" 
                placeholder="+998"
                value={form.customer_phone} 
                onChange={e => setForm({...form, customer_phone: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Manzil</label>
              <input 
                type="text" 
                value={form.customer_address} 
                onChange={e => setForm({...form, customer_address: e.target.value})} 
                required
              />
            </div>
          </div>

          {/* Loyalty Points Section */}
          {user && user.points > 0 && (
            <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{t('points_balance')}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '4px 0 0 0' }}>{user.points} ball (+{Math.floor(user.points * 1000).toLocaleString()} so'm)</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    onClick={() => setUsePoints(!usePoints)}
                    style={{ 
                      width: '50px', height: '26px', background: usePoints ? 'var(--primary)' : '#ccc', 
                      borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                      position: 'absolute', top: '3px', left: usePoints ? '27px' : '3px', transition: '0.3s'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{t('use_points')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' }}>
            <h3 style={{ marginBottom: '24px' }}>To'lov Usuli</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: paymentMethod === 'card' ? '32px' : '0' }}>
              <div 
                onClick={() => setPaymentMethod('cash')}
                style={{ 
                  padding: '20px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center',
                  border: `2px solid ${paymentMethod === 'cash' ? 'var(--primary)' : '#f1f1f1'}`,
                  background: paymentMethod === 'cash' ? 'rgba(37, 99, 235, 0.05)' : 'white',
                  transition: '0.3s'
                }}
              >
                <Banknote size={24} color={paymentMethod === 'cash' ? 'var(--primary)' : '#6B7280'} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 600 }}>Naqd pul</div>
              </div>

              <div 
                onClick={() => setPaymentMethod('card')}
                style={{ 
                  padding: '20px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center',
                  border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : '#f1f1f1'}`,
                  background: paymentMethod === 'card' ? 'rgba(37, 99, 235, 0.05)' : 'white',
                  transition: '0.3s'
                }}
              >
                <CreditCard size={24} color={paymentMethod === 'card' ? 'var(--primary)' : '#6B7280'} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 600 }}>Karta orqali</div>
              </div>
            </div>

            <AnimatePresence>
              {paymentMethod === 'card' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ background: '#f9f9fb', padding: '24px', borderRadius: '16px', border: '1px solid #eee' }}>
                    
                    {/* Saved Cards Selection */}
                    {user?.saved_cards?.length > 0 && (
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '12px', color: 'var(--text-muted)' }}>Saqlangan kartalar</label>
                        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                          {user.saved_cards.map(card => (
                            <div 
                              key={card.id}
                              onClick={() => handleSelectCard(card)}
                              style={{ 
                                flexShrink: 0, width: '140px', padding: '12px', borderRadius: '12px', 
                                border: `2px solid ${selectedCardId === card.id ? 'var(--primary)' : '#f1f1f1'}`,
                                background: selectedCardId === card.id ? 'rgba(37, 99, 235, 0.05)' : 'white',
                                cursor: 'pointer', transition: '0.2s', textAlign: 'center'
                              }}
                            >
                              <CreditCard size={20} color={selectedCardId === card.id ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: '8px' }} />
                              <div style={{ fontSize: '12px', fontWeight: 700 }}>•••• {card.number.slice(-4)}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{card.expiry}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ height: '1px', background: '#eee', margin: '16px 0' }} />
                      </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Karta raqami</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        value={cardInfo.number} 
                        onChange={e => setCardInfo({...cardInfo, number: e.target.value})}
                        required
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Muddati</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          value={cardInfo.expiry} 
                          onChange={e => setCardInfo({...cardInfo, expiry: e.target.value})}
                          required
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>CVV</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          value={cardInfo.cvv} 
                          onChange={e => setCardInfo({...cardInfo, cvv: e.target.value})}
                          required
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '11px', color: '#86868b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Lock size={12} /> Ma'lumotlaringiz xavfsiz holatda saqlanadi
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#86868b' }}>
                <span>Oraliq qiymat:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {appliedPromo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Promo-kod ({appliedPromo.code}):</span>
                  <span>-{formatPrice(Math.floor(cartTotal * appliedPromo.discount_percent / 100))}</span>
                </div>
              )}
              {usePoints && user && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Bonus ballar:</span>
                  <span>-{formatPrice(Math.min(user.points * 1000, Math.floor(cartTotal * (1 - (appliedPromo?.discount_percent || 0) / 100) / 1000) * 1000))}</span>
                </div>
              )}
              <div style={{ height: '1px', background: '#f1f1f1', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 800 }}>
                <span>Jami:</span>
                <span style={{ color: 'var(--primary)', fontSize: '24px' }}>
                  {formatPrice(Math.floor(
                    (cartTotal * (1 - (appliedPromo?.discount_percent || 0) / 100)) - 
                    (usePoints ? Math.min(user.points * 1000, Math.floor(cartTotal * (1 - (appliedPromo?.discount_percent || 0) / 100) / 1000) * 1000) : 0)
                  ))}
                </span>
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              className="btn"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '18px', fontSize: '18px' }}
            >
              {loading ? 'Yuborilmoqda...' : (paymentMethod === 'card' ? 'To\'lash va Buyurtma berish' : 'Buyurtmani Tasdiqlash')}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Checkout;