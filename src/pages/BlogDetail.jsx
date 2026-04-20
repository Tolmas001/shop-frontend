import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogs } from '../api';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Calendar, Eye, ChevronLeft, Share2 } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { backendUrl, handleImageError } = useApp();

  useEffect(() => {
    blogs.getOne(id)
      .then(res => setPost(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container section"><Skeleton type="image" height="400px" /><Skeleton type="title" /></div>;
  if (!post) return <div className="container section"><h1>Blog topilmadi</h1><Link to="/blog">Blogga qaytish</Link></div>;

  return (
    <div className="container section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >
        <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          <ChevronLeft size={18} /> Orqaga qaytish
        </Link>
        
        <img 
          src={post.image?.startsWith('/') ? `${backendUrl}${post.image}` : post.image} 
          alt={post.title} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '32px', marginBottom: '40px' }}
          onError={handleImageError}
        />

        <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={18} /> {new Date(post.created_at).toLocaleDateString()}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={18} /> {post.views} ko'rildi</span>
        </div>

        <h1 style={{ fontSize: '42px', lineHeight: '1.2', marginBottom: '32px' }}>{post.title}</h1>

        <div 
          className="blog-content-rich"
          style={{ fontSize: '18px', lineHeight: '1.8', color: '#374151' }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />

        <div style={{ marginTop: '60px', padding: '40px', background: '#F9FAFB', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0 }}>Maqolani ulashing</h4>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Boshqalarga ham foydali bo'lsin</p>
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} /> Ulashish
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
