import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { admin, superAdmin } from '../../api';
import { Users as UsersIcon, User, Mail, Calendar, Shield, ShieldAlert, CheckCircle } from 'lucide-react';

const AdminManagement = () => {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    admin.getUsers()
      .then(res => {
        setUsersList(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
      ? "Haqiqatan ham ushbu foydalanuvchini ADMIN qilib tayinlamoqchimisiz?" 
      : "Foydalanuvchidan ADMINlik huquqini olib tashlamoqchimisiz?";

    if (!window.confirm(confirmMsg)) return;

    setUpdatingId(userId);
    try {
      await superAdmin.updateUserRole(userId, newRole);
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-management-page"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Super Admin: Adminlarni boshqarish</h2>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Tizim adminlarini tayinlash va boshqarish.</p>
        </div>
      </div>

      <div className="table-responsive" style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Foydalanuvchi</th>
              <th>Email</th>
              <th>Hozirgi Rol</th>
              <th>Sana</th>
              <th style={{ textAlign: 'right' }}>Admin Tayinlash</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {usersList.map((u, i) => (
                <motion.tr 
                  key={u.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ opacity: u.role === 'superadmin' ? 0.6 : 1 }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50px', background: '#F3F4F6', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                      }}>
                        {u.image ? (
                          <img src={u.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <User size={20} color="#9CA3AF" />
                        )}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.username}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280' }}>
                      <Mail size={14} />
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: u.role === 'superadmin' ? '#FEF3C7' : (u.role === 'admin' ? '#EEF2FF' : '#F3F4F6'),
                      color: u.role === 'superadmin' ? '#D97706' : (u.role === 'admin' ? '#4F46E5' : '#4B5563'),
                      display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      {u.role === 'superadmin' ? <ShieldAlert size={12} /> : (u.role === 'admin' ? <Shield size={12} /> : <User size={12} />)}
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {u.role !== 'superadmin' ? (
                      <button 
                        className={`btn ${u.role === 'admin' ? 'btn-danger-lite' : 'btn-primary'}`}
                        disabled={updatingId === u.id}
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        style={{ 
                          padding: '8px 16px', borderRadius: '12px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: u.role === 'admin' ? '#FEE2E2' : '#2563EB',
                          color: u.role === 'admin' ? '#DC2626' : 'white',
                          border: 'none', cursor: 'pointer'
                        }}
                      >
                        {updatingId === u.id ? '...' : (u.role === 'admin' ? 'Adminlikni olish' : 'Admin qilish')}
                      </button>
                    ) : (
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Super Admin o'zgarmas</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminManagement;
