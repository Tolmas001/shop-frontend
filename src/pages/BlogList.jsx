import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { blogs } from '../api';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, backendUrl, handleImageError } = useApp();

  useEffect(() => {
    blogs.getAll()
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container section">
      <Skeleton type="title" width="300px" />
      <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px', marginTop: '40px' }}>
        {[1, 2, 3].map(i => <Skeleton key={i} type="image" height="300px" />)}
      </div>
    </div>
  );

  return (
    <div className="container section">
      <div className="section-header">
        <h1>Dukon Blogi & Yangiliklar</h1>
        <p style={{ color: 'var(--text-muted)' }}>Eng so'nggi yangiliklar va foydali maslahatlar bilan tanishing.</p>
      </div>

      <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px', marginTop: '40px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px 0' }}>
             <h3>Hozircha bloglar mavjud emas</h3>
          </div>
        ) : posts.map((post, index) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="blog-card-modern"
            style={{ 
              background: 'white', borderRadius: '24px', overflow: 'hidden', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f1f1' 
            }}
          >
            <Link to={`/blog/${post.id}`}>
              <div style={{ height: '240px', overflow: 'hidden' }}>
                <img 
                  src={post.image?.startsWith('/') ? `${backendUrl}${post.image}` : (post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800')} 
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={handleImageError}
                />
              </div>
            </Link>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {post.views}</span>
              </div>
              <Link to={`/blog/${post.id}`}>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', lineHeight: '1.4' }}>{post.title}</h3>
              </Link>
              <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                {post.content.slice(0, 100)}...
              </p>
              <Link to={`/blog/${post.id}`} style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Batafsil <ArrowRight size={18} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
