import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { stats, notifications as notifyApi } from '../../api';
import AdminProducts from './Products';
import AdminCategories from './Categories';
import AdminOrders from './Orders';
import AdminUsers from './Users';
import AdminReviews from './Reviews';
import AdminManagement from './AdminManagement';
import ActivityLogs from './ActivityLogs';
import AdminPromoCodes from './PromoCodes';

import { 
  MessageSquare,
  DollarSign,
  TrendingDown,
  LayoutDashboard,
  Box,
  Layers,
  ClipboardList,
  Users,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Heart,
  ShoppingBag,
  AlertCircle,
  Bell,
  ShieldCheck,
  History,
  Ticket
} from 'lucide-react';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  const { user, loading, t } = useApp();
  const location = useLocation();
  const [statsData, setStatsData] = useState(null);
  const [broadcastForm, setBroadcastForm] = useState({ message: '', type: 'info' });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      stats.get()
        .then(res => setStatsData(res.data))
        .catch(() => {});
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <div className="sidebar" style={{ background: '#111827' }}>
        <h2 style={{ color: 'white', padding: '0 20px', marginBottom: '40px', fontSize: '24px' }}>Admin Panel</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/admin" className={isActive('/admin') ? 'sidebar-item active' : 'sidebar-item'}>
            <LayoutDashboard size={20} /> Bosh sahifa
          </Link>
          <Link to="/admin/products" className={isActive('/admin/products') ? 'sidebar-item active' : 'sidebar-item'}>
            <Box size={20} /> Mahsulotlar
          </Link>
          <Link to="/admin/categories" className={isActive('/admin/categories') ? 'sidebar-item active' : 'sidebar-item'}>
            <Layers size={20} /> Kategoriyalar
          </Link>
          <Link to="/admin/orders" className={isActive('/admin/orders') ? 'sidebar-item active' : 'sidebar-item'}>
            <ClipboardList size={20} /> Buyurtmalar
          </Link>
          <Link to="/admin/users" className={isActive('/admin/users') ? 'sidebar-item active' : 'sidebar-item'}>
            <Users size={20} /> Foydalanuvchilar
          </Link>
          <Link to="/admin/reviews" className={isActive('/admin/reviews') ? 'sidebar-item active' : 'sidebar-item'}>
            <MessageSquare size={20} /> Sharhlar
          </Link>
          <Link to="/admin/promo" className={isActive('/admin/promo') ? 'sidebar-item active' : 'sidebar-item'}>
            <Ticket size={20} /> Promo-kodlar
          </Link>
          
          {user?.role === 'superadmin' && (
            <>
              <div style={{ padding: '20px 20px 10px', color: '#4B5563', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Super Admin</div>
              <Link to="/admin/management" className={isActive('/admin/management') ? 'sidebar-item active' : 'sidebar-item'}>
                <ShieldCheck size={20} /> Adminlar
              </Link>
              <Link to="/admin/logs" className={isActive('/admin/logs') ? 'sidebar-item active' : 'sidebar-item'}>
                <History size={20} /> Audit Loglari
              </Link>
            </>
          )}

          <Link to="/" className="sidebar-item" style={{ marginTop: '40px', color: '#9CA3AF' }}>
            <ArrowLeft size={20} /> Saytga qaytish
          </Link>
        </div>
      </div>
      
      <div className="admin-content" style={{ background: '#F9FAFB', overflowY: 'auto' }}>
        <div className="container" style={{ padding: '40px 0' }}>
          <div className="admin-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', margin: 0 }}>Xush kelibsiz, {user?.username}</h1>
              <p style={{ color: '#6B7280', marginTop: '4px' }}>Bugungi holat va statistikani kuzatib boring.</p>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={async () => {
                try {
                  const { demo } = await import('../../api');
                  await demo.seed();
                  alert('Demo ma`lumotlar muvaffaqiyatli yaratildi!');
                  window.location.reload();
                } catch (e) {
                  alert('Xatolik: ' + e.message);
                }
              }}
            >
              Demo Ma'lumot Qushish
            </button>
          </div>
          
          <Routes>
            <Route path="/" element={
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {statsData && (
                  <>
                    <div className="stats-grid" style={{ 
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' 
                    }}>
                      <div className="stat-card-premium" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
                        <div style={{ color: '#2563EB', marginBottom: '16px', opacity: 0.8 }}><TrendingUp size={24} /></div>
                        <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Umumiy Daromad</p>
                        <h3 style={{ fontSize: '28px', margin: '8px 0 0 0' }}>{statsData.totalRevenue?.toLocaleString()} <span style={{fontSize: '14px'}}>so'm</span></h3>
                      </div>
                      <div className="stat-card-premium" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
                        <div style={{ color: '#D97706', marginBottom: '16px', opacity: 0.8 }}><ShoppingBag size={24} /></div>
                        <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Buyurtmalar</p>
                        <h3 style={{ fontSize: '28px', margin: '8px 0 0 0' }}>{statsData.totalOrders}</h3>
                      </div>
                      <div className="stat-card-premium" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
                        <div style={{ color: '#DC2626', marginBottom: '16px', opacity: 0.8 }}><AlertCircle size={24} /></div>
                        <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Kutilayotgan</p>
                        <h3 style={{ fontSize: '28px', margin: '8px 0 0 0' }}>{statsData.pendingOrders}</h3>
                      </div>
                      <div className="stat-card-premium" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
                        <div style={{ color: '#059669', marginBottom: '16px', opacity: 0.8 }}><Box size={24} /></div>
                        <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Mahsulotlar</p>
                        <h3 style={{ fontSize: '28px', margin: '8px 0 0 0' }}>{statsData.totalProducts}</h3>
                      </div>
                    </div>

                    <div className="broadcast-section" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1', marginBottom: '40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <Bell size={24} color="var(--primary)" />
                        <h3 style={{ margin: 0 }}>Xabarnoma yuborish (Broadcast)</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 150px', gap: '16px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '12px', color: '#6B7280' }}>Xabar matni</label>
                          <input 
                            type="text" 
                            value={broadcastForm.message}
                            onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                            placeholder="Mijozlar uchun yangilik yoki xabar..."
                            className="form-control"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '12px', color: '#6B7280' }}>Turi</label>
                          <select 
                            className="form-control"
                            value={broadcastForm.type}
                            onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                            style={{ width: '100%' }}
                          >
                            <option value="info">Ma'lumot (Info)</option>
                            <option value="success">Muvaffaqiyat (Success)</option>
                            <option value="warning">Ogohlantirish (Warning)</option>
                            <option value="urgent">Muhim (Urgent)</option>
                          </select>
                        </div>
                        <button 
                          className="btn btn-primary" 
                          style={{ height: '48px' }}
                          disabled={isSending || !broadcastForm.message}
                          onClick={async () => {
                            setIsSending(true);
                            try {
                              await notifyApi.broadcast(broadcastForm);
                              alert('Xabar barcha foydalanuvchlarga yuborildi!');
                              setBroadcastForm({ message: '', type: 'info' });
                            } catch (e) {
                              alert('Xatolik: ' + e.message);
                            } finally {
                              setIsSending(false);
                            }
                          }}
                        >
                          {isSending ? 'Yuborilmoqda...' : 'Yuborish'}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
                      <div className="charts-area" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                          <h3 style={{ margin: 0 }}>Sotuvlar Trendi</h3>
                          <TrendingUp size={20} color="var(--primary)" />
                        </div>
                        <div style={{ height: '300px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={statsData.revenueTrend}>
                              <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} dy={10} />
                              <YAxis hide />
                              <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                formatter={(value) => [`${value.toLocaleString()} so'm`, 'Daromad']}
                              />
                              <Area type="monotone" dataKey="val" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="status-donut" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
                        <h3 style={{ margin: '0 0 32px 0' }}>Holatlar</h3>
                        <div style={{ height: '220px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={statsData.statusDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="label"
                              >
                                {statsData.statusDistribution.map((entry, index) => (
                                  <Cell key={"cell-" + index} fill={
                                    entry.label === 'delivered' ? '#10B981' : 
                                    (entry.label === 'pending' ? '#F59E0B' : 
                                    (entry.label === 'cancelled' ? '#EF4444' : '#6366F1'))
                                  } />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '20px' }}>
                          {statsData.statusDistribution.map((stat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                              <div style={{ 
                                width: '8px', height: '8px', borderRadius: '50%',
                                background: stat.label === 'delivered' ? '#10B981' : (stat.label === 'pending' ? '#F59E0B' : '#6366F1')
                              }}></div>
                              <span style={{ textTransform: 'capitalize' }}>{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="charts-area" style={{ background: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1', marginBottom: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h3 style={{ margin: 0 }}>Eng ko'p saqlangan mahsulotlar (Wishlist)</h3>
                        <Heart size={20} color="#EF4444" />
                      </div>
                      <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={statsData.popularWishlist}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="wishlist_count" fill="#EC4899" radius={[10, 10, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                      <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f1f1', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                          <h3 style={{ margin: 0 }}>Oxirgi Buyurtmalar</h3>
                          <Link to="/admin/orders" style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}>Barchasini ko'rish</Link>
                        </div>
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Mijoz</th>
                                <th>Sana</th>
                                <th>Summa</th>
                                <th>Holat</th>
                              </tr>
                            </thead>
                            <tbody>
                              {statsData.recentOrders?.map(order => (
                                <tr key={order.id}>
                                  <td>#{order.id}</td>
                                  <td style={{ fontWeight: 600 }}>{order.customer_name}</td>
                                  <td style={{ color: '#6B7280' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                  <td style={{ fontWeight: 700 }}>{order.total_amount?.toLocaleString()} so'm</td>
                                  <td>
                                    <span style={{ 
                                      padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                                      background: order.status === 'delivered' ? '#D1FAE5' : (order.status === 'pending' ? '#FEF3C7' : '#DBEAFE'),
                                      color: order.status === 'delivered' ? '#059669' : (order.status === 'pending' ? '#D97706' : '#2563EB')
                                    }}>
                                      {order.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="low-stock-widget" style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f1f1', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <h3 style={{ margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <TrendingDown size={20} color="#EF4444" /> Kam Qolgan
                        </h3>
                        {statsData.lowStockProducts?.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {statsData.lowStockProducts.map(p => (
                              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FEF2F2', borderRadius: '16px' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#991B1B' }}>{p.name}</div>
                                  <div style={{ fontSize: '12px', color: '#B91C1C' }}>Zaxira: {p.stock_count} dona</div>
                                </div>
                                <Link to="/admin/products" style={{ color: '#DC2626' }}><AlertCircle size={18} /></Link>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                            <CheckCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ fontSize: '14px' }}>Hamma mahsulot yetarli</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            } />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategories />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/reviews" element={<AdminReviews />} />
            <Route path="/management" element={<AdminManagement />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/promo" element={<AdminPromoCodes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;