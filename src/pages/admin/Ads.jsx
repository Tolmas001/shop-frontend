import React, { useState, useEffect } from 'react';
import { ads } from '../../api';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Check, Search, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Ads = () => {
  const { t, backendUrl } = useApp();
  const [adsList, setAdsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    button_text: 'Harid qilish',
    link: '/products',
    color: '#2563EB',
    is_active: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await ads.getAdmin();
      setAdsList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle || '',
      description: ad.description || '',
      image: ad.image,
      button_text: ad.button_text || 'Harid qilish',
      link: ad.link || '/products',
      color: ad.color || '#2563EB',
      is_active: ad.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham ushbu reklamani o\'chirmoqchimisiz?')) {
      try {
        await ads.delete(id);
        fetchAds();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAd) {
        await ads.update(editingAd.id, formData);
      } else {
        await ads.create(formData);
      }
      setIsModalOpen(false);
      fetchAds();
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        button_text: 'Harid qilish',
        link: '/products',
        color: '#2563EB',
        is_active: true
      });
      setEditingAd(null);
    } catch (err) {
      console.error(err);
      alert('Xatolik yuz berdi');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Reklamalar (Ads)</h1>
          <p className="admin-subtitle">Bosh sahifadagi bannerlarni boshqarish</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingAd(null); setIsModalOpen(true); }}>
          <Plus size={20} /> Yangi qo'shish
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="loading-spinner">Yuklanmoqda...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rasm</th>
                  <th>Sarlavha</th>
                  <th>Sub-sarlavha</th>
                  <th>Tugma matni</th>
                  <th>Rang</th>
                  <th>Holati</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {adsList.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                      <div className="admin-table-img">
                        <img 
                          src={ad.image.startsWith('/') ? `${backendUrl}${ad.image}` : ad.image} 
                          alt={ad.title} 
                        />
                      </div>
                    </td>
                    <td><div className="font-600">{ad.title}</div></td>
                    <td><div className="text-muted">{ad.subtitle}</div></td>
                    <td>{ad.button_text}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: ad.color, border: '1px solid #ddd' }}></div>
                        <span style={{ fontSize: '12px', color: '#666' }}>{ad.color}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${ad.is_active ? 'paid' : 'cancelled'}`}>
                        {ad.is_active ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="action-btn edit" title="Tahrirlash" onClick={() => handleEdit(ad)}>
                          <Edit size={18} />
                        </button>
                        <button className="action-btn delete" title="O'chirish" onClick={() => handleDelete(ad.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {adsList.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                      <div className="text-muted">Hozircha reklamalar yo'q</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div 
              className="modal-content-modern"
              style={{ maxWidth: '1000px', width: '95%', padding: 0, overflow: 'hidden' }}
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="modal-header" style={{ padding: '24px 32px', borderBottom: '1px solid #f1f1f1' }}>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{editingAd ? 'Reklamani tahrirlash' : 'Yangi reklama qo\'shish'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 0 }}>
                  {/* Left Column: Form */}
                  <div style={{ padding: '32px', borderRight: '1px solid #f1f1f1', maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <div className="form-group">
                        <label>Sarlavha</label>
                        <input 
                          type="text" 
                          value={formData.title} 
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                          required 
                          placeholder="Masalan: Yozgi Chegirma"
                        />
                      </div>
                      <div className="form-group">
                        <label>Sub-sarlavha</label>
                        <input 
                          type="text" 
                          value={formData.subtitle} 
                          onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                          placeholder="Masalan: Yangi kolleksiya"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Tavsif</label>
                        <textarea 
                          value={formData.description} 
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          rows="3"
                          placeholder="Reklama haqida qisqacha ma'lumot..."
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label>Tugma matni</label>
                        <input 
                          type="text" 
                          value={formData.button_text} 
                          onChange={e => setFormData({ ...formData, button_text: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Link (Havola)</label>
                        <input 
                          type="text" 
                          value={formData.link} 
                          onChange={e => setFormData({ ...formData, link: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Asosiy rang</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="color" 
                            value={formData.color} 
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                            style={{ width: '44px', height: '44px', padding: '4px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }}
                          />
                          <input 
                            type="text" 
                            value={formData.color} 
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                            style={{ flex: 1 }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Holati</label>
                        <div 
                          onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                          style={{ 
                            height: '44px', display: 'flex', alignItems: 'center', gap: '12px', 
                            padding: '0 16px', background: '#f8f9fa', borderRadius: '12px', cursor: 'pointer'
                          }}
                        >
                          <div style={{ 
                            width: '40px', height: '20px', background: formData.is_active ? 'var(--primary)' : '#ccc', 
                            borderRadius: '10px', position: 'relative', transition: '0.3s'
                          }}>
                            <div style={{ 
                              width: '14px', height: '14px', background: 'white', borderRadius: '50%',
                              position: 'absolute', top: '3px', left: formData.is_active ? '23px' : '3px', transition: '0.3s'
                            }}></div>
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{formData.is_active ? 'Faol' : 'Nofaol'}</span>
                        </div>
                      </div>
                      <div className="form-group full-width">
                        <label>Rasm</label>
                        <div className="image-upload-modern" style={{ height: '140px' }}>
                          {formData.image ? (
                            <div className="image-preview">
                              <img 
                                src={formData.image.startsWith('data:') ? formData.image : (formData.image?.startsWith('/') ? backendUrl + formData.image : formData.image)} 
                                alt="Preview" 
                              />
                              <button type="button" className="remove-img" onClick={() => setFormData({ ...formData, image: '' })}>
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <label className="upload-placeholder">
                              <input type="file" onChange={handleImageChange} accept="image/*" hidden />
                              <ImageIcon size={32} />
                              <span>Rasm yuklash yoki tashlang</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Preview */}
                  <div style={{ padding: '32px', background: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#374151' }}>Jonli ko'rinish (Live Preview)</span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div 
                        className="banner-slide" 
                        style={{ 
                          position: 'relative', height: '320px', width: '100%', borderRadius: '24px', overflow: 'hidden',
                          backgroundColor: formData.color || '#111',
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${formData.image?.startsWith('data:') ? formData.image : (formData.image?.startsWith('/') ? backendUrl + formData.image : formData.image)})`,
                          backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', color: 'white', padding: '32px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ maxWidth: '100%' }}>
                          <motion.span 
                            key={formData.subtitle}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ 
                              display: 'inline-block', padding: '6px 12px', background: formData.color || 'var(--primary)', 
                              borderRadius: '6px', fontSize: '11px', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}
                          >
                            {formData.subtitle || 'Sub-sarlavha'}
                          </motion.span>
                          <motion.h4 
                            key={formData.title}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: '24px', margin: '0 0 12px 0', lineHeight: 1.2, fontWeight: 800 }}
                          >
                            {formData.title || 'Asosiy Sarlavha'}
                          </motion.h4>
                          <motion.p 
                            key={formData.description}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: '14px', margin: '0 0 20px 0', opacity: 0.9, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {formData.description || 'Reklama tavsifi bu yerda ko\'rinadi. Mijozlarni qiziqtiradigan matn yozing.'}
                          </motion.p>
                          <motion.button 
                            type="button" 
                            className="btn" 
                            style={{ 
                              background: formData.color || 'var(--primary)', border: 'none', color: 'white', 
                              padding: '10px 24px', fontSize: '14px', borderRadius: '10px', fontWeight: 700,
                              display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                          >
                            {formData.button_text} <ExternalLink size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '24px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #f1f1f1' }}>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                        <strong>Eslatma:</strong> Rang va rasm tanlashda matn o'qilishi oson bo'lishiga e'tibor bering. To'qroq fonlar uchun oq matn tavsiya etiladi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer" style={{ padding: '24px 32px', background: 'white', borderTop: '1px solid #f1f1f1' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)} style={{ padding: '12px 24px' }}>Bekor qilish</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', minWidth: '160px' }}>{editingAd ? 'Saqlash' : 'Qo\'shish'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ads;
