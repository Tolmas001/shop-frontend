import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { superAdmin } from '../../api';
import { Activity, User, Clock, Terminal, Search } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLoading(true);
    superAdmin.getLogs()
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const filteredLogs = logs.filter(log => 
    log.username.toLowerCase().includes(filter.toLowerCase()) || 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    (log.details && log.details.toLowerCase().includes(filter.toLowerCase()))
  );

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return '#EF4444';
    if (action.includes('CREATE')) return '#10B981';
    if (action.includes('UPDATE')) return '#2563EB';
    if (action.includes('STATUS')) return '#F59E0B';
    return '#6B7280';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="activity-logs-page"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '24px', margin: 0 }}>Audit Tarixi (Loglar)</h2>
          <p style={{ color: '#6B7280', marginTop: '4px' }}>Adminlar tomonidan amalga oshirilgan barcha harakatlar.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input 
            type="text" 
            placeholder="Qidiruv (admin yoki amal)..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid #E5E7EB', 
              width: '300px', fontSize: '14px', outline: 'none', transition: 'all 0.2s'
            }}
          />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence>
            {filteredLogs.map((log, i) => (
              <motion.div 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '20px', padding: '16px', 
                  background: '#F9FAFB', borderRadius: '16px', border: '1px solid #F3F4F6'
                }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <Terminal size={18} color={getActionColor(log.action)} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{log.username}</span>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800,
                      background: getActionColor(log.action) + '15', color: getActionColor(log.action)
                    }}>{log.action}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#4B5563' }}>{log.details}</div>
                </div>

                <div style={{ textAlign: 'right', color: '#9CA3AF', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} />
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredLogs.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
              <Activity size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p>Loglar topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityLogs;
