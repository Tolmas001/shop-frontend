import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { promo } from '../../api';
import { Ticket, Plus, Trash2, Edit2, X, Check, Calendar, Users, Percent } from 'lucide-react';

const AdminPromoCodes = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: 10,
    expiry_date: '',
    usage_limit: 100,
    is_active: true
  });

  useEffect(() => {
    loadPromos();
  }, []);

  const loadPromos = () => {
    setLoading(true);
    promo.getAllAdmin()
      .then(res => {
        setPromos(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await promo.updateAdmin(editingPromo.id, formData);
      } else {
        await promo.createAdmin(formData);
      }
      setIsModalOpen(false);
      setEditingPromo(null);
      setFormData({ code: '', discount_percent: 10, expiry_date: '', usage_limit: 100, is_active: true });
      loadPromos();
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham ushbu promo-kodni o\'chirmoqchimisiz?')) {
      try {
        await promo.deleteAdmin(id);
        loadPromos();
      } catch (err) {
        alert('O\'chirishda xatolik');
      }
    }
  };

  const openEditModal = (p) => {
    setEditingPromo(p);
    setFormData({
      code: p.code,
      discount_percent: p.discount_percent,
      expiry_date: p.expiry_date ? new Date(p.expiry_date).toISOString().split('T')[0] : '',
      usage_limit: p.usage_limit,
      is_active: p.is_active
    });
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-promo-page"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Promo-kodlar Boshqaruvi</h2>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Chegirma kodlarini yaratish va tahrirlash.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingPromo(null);
            setFormData({ code: '', discount_percent: 10, expiry_date: '', usage_limit: 100, is_active: true });
            setIsModalOpen(true);
          }}
          style={{ padding: '12px 24px', borderRadius: '16px' }}
        >
          <Plus size={20} /> Yangi Kod
        </button>
      </div>

      <div className="table-responsive" style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Kod</th>
              <th>Chegirma</th>
              <th>Foydalanildi</th>
              <th>Limit</th>
              <th>Muddati</th>
              <th>Holat</th>
              <th style={{ textAlign: 'right' }}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p, i) => (
              <motion.tr 
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', background: '#EEF2FF', borderRadius: '8px', color: '#4F46E5' }}>
                      <Ticket size={16} />
                    </div>
                    <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>{p.code}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 600 }}>
                    <Percent size={14} />
                    {p.discount_percent}%
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4B5563' }}>
                    <Users size={14} />
                    {p.used_count}
                  </div>
                </td>
                <td>{p.usage_limit}</td>
                <td>
                  <div style={{ fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {p.expiry_date ? new Date(p.expiry_date).toLocaleDateString() : 'Cheksiz'}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                    background: p.is_active ? '#D1FAE5' : '#F3F4F6',
                    color: p.is_active ? '#059669' : '#6B7280'
                  }}>
                    {p.is_active ? 'AKTIV' : 'YOPILGAN'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button className="btn-icon" onClick={() => openEditModal(p)} style={{ color: '#4F46E5' }}><Edit2 size={18} /></button>
                    <button className="btn-icon" onClick={() => handleDelete(p.id)} style={{ color: '#EF4444' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 2000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content"
              style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3>{editingPromo ? 'Tahrirlash' : 'Yangi Promo-kod'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Promo-kod Matni</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    required
                    placeholder="MASALAN: SHOPSRY20"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label>Chegirma (%)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.discount_percent}
                      onChange={(e) => setFormData({...formData, discount_percent: parseInt(e.target.value)})}
                      min="1" max="100" required
                    />
                  </div>
                  <div className="form-group">
                    <label>Foydalanish Limiti</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({...formData, usage_limit: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Amal Qilish Muddati</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  />
                </div>
                <div className="form-check" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <label htmlFor="is_active" style={{ margin: 0 }}>Hozirda aktiv bo'lsin</label>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px', borderRadius: '16px' }}>
                  {editingPromo ? 'Yangilash' : 'Yaratish'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPromoCodes;
