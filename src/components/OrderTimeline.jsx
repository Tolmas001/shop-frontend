import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Truck, Home, Clock } from 'lucide-react';

const OrderTimeline = ({ status }) => {
  const statuses = [
    { id: 'pending', label: 'Buyurtma berildi', icon: <Clock size={20} /> },
    { id: 'processing', label: 'Tayyorlanmoqda', icon: <Package size={20} /> },
    { id: 'shipped', label: 'Yo\'lda', icon: <Truck size={20} /> },
    { id: 'delivered', label: 'Yetkazildi', icon: <Home size={20} /> },
  ];

  const currentIndex = statuses.findIndex(s => s.id === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="order-timeline-wrap" style={{ padding: '40px 0', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', minWidth: '600px' }}>
        {/* Progress Line Background */}
        <div style={{ 
          position: 'absolute', top: '24px', left: '0', right: '0', height: '4px', 
          background: '#E5E7EB', zIndex: 1 
        }} />
        
        {/* Active Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(activeIndex / (statuses.length - 1)) * 100}%` }}
          style={{ 
            position: 'absolute', top: '24px', left: '0', height: '4px', 
            background: 'var(--primary)', zIndex: 2 
          }} 
        />

        {statuses.map((s, index) => {
          const isActive = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={s.id} style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '120px' }}>
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.2 : 1 }}
                style={{ 
                  width: '48px', height: '48px', borderRadius: '50%', 
                  background: isActive ? 'var(--primary)' : 'white',
                  border: `2px solid ${isActive ? 'var(--primary)' : '#D1D5DB'}`,
                  color: isActive ? 'white' : '#9CA3AF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: isCurrent ? '0 0 20px rgba(37, 99, 235, 0.4)' : 'none'
                }}
              >
                {isActive && index < activeIndex ? <Check size={24} /> : s.icon}
              </motion.div>
              <span style={{ 
                fontSize: '14px', fontWeight: isCurrent ? 700 : 500, 
                color: isActive ? 'var(--text-main)' : '#9CA3AF' 
              }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
