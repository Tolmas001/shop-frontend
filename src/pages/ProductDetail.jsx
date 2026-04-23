import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products as api, orders as ordersApi } from '../api';
import { useApp } from '../context/AppContext';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import { 
  ShoppingCart, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Star, 
  MessageSquare, 
  Image as ImageIcon,
  Send,
  Heart,
  Share2,
  CheckCircle2
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { user, addToCart, t, backendUrl, handleImageError, formatPrice } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews');
  const [isOneClickModalOpen, setIsOneClickModalOpen] = useState(false);
  const [oneClickForm, setOneClickForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    setLoading(true);
    api.getOne(id)
      .then(res => {
        setProduct(res.data);
        setActiveImage(res.data.image);
        setSelectedColor(res.data.colors?.[0] || null);
        setSelectedSize(res.data.sizes?.[0] || null);
        
        // Fetch related products
        api.getAll({ category: res.data.category })
          .then(related => {
            setRelatedProducts(related.data.filter(p => !id || p.id !== parseInt(id)).slice(0, 4));
          });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock_count < 1) return;
    setIsAdding(true);
    addToCart(product, selectedColor, selectedSize, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    try {
      const res = await api.addComment(id, commentText, commentImage);
      setProduct({ ...product, comments: res.data.comments });
      setCommentText('');
      setCommentImage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(err => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('link_copied'));
    }
  };

  if (loading) return (
    <div className="container section">
      <div className="product-detail-grid-modern">
        <div className="product-visuals">
          <Skeleton type="image" height="500px" />
          <div className="thumb-gallery" style={{ marginTop: '20px' }}>
            {[1,2,3,4].map(i => <Skeleton key={i} type="image" height="80px" width="80px" />)}
          </div>
        </div>
        <div className="product-info-col">
          <Skeleton type="title" width="60%" />
          <Skeleton type="title" width="90%" height="40px" />
          <Skeleton type="text" width="100%" height="100px" style={{ margin: '40px 0' }} />
          <Skeleton type="title" width="40%" height="56px" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <h2>{t('product_not_found')}</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
        {t('back_to_shop')}
      </Link>
    </div>
  );

  const defaultSpecs = {
    [t('brand')]: product.brand,
    [t('nav_categories')]: product.category,
    [t('select_color')]: product.colors?.join(', ') || t('nothing_found'),
    [t('select_size')]: product.sizes?.join(', ') || t('nothing_found'),
    [t('order_status')]: product.stock_count > 0 ? t('in_stock') : t('out_of_stock')
  };

  const specs = (product.specifications && Object.keys(product.specifications).length > 0) 
    ? product.specifications 
    : defaultSpecs;

  return (
    <div className="container section">
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--text-muted)', fontWeight: 500 }}>
        <ChevronLeft size={20} /> {t('back_to_catalog')}
      </Link>

      <div className="product-detail-grid-modern">
        {/* Images Column */}
        <div className="product-visuals">
          <motion.div 
            className="main-image-wrap-modern"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img 
              src={activeImage?.startsWith('/') ? `${backendUrl}${activeImage}` : (activeImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800')} 
              alt={product.name} 
              className="main-img-detail"
              onError={handleImageError}
            />
          </motion.div>
          
          <div className="thumb-gallery">
             <div 
               onClick={() => setActiveImage(product.image)}
               className={`thumb-item ${activeImage === product.image ? 'active' : ''}`}
             >
               <img 
                 src={product.image?.startsWith('/') ? `${backendUrl}${product.image}` : (product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400')} 
                 alt="thumb" 
                 onError={handleImageError}
               />
             </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="product-info-col">
          <div className="product-info-header">
            <div>
              <span className="brand-tag">{product.brand}</span>
              <h1 className="product-name-title">{product.name}</h1>
            </div>
            <div className="product-meta-btns">
              <button className="nav-btn"><Heart size={20} /></button>
              <button className="nav-btn"><Share2 size={20} /></button>
            </div>
          </div>

          <div className="product-rating-row">
            <div className="stars-box">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= 4 ? "#F59E0B" : "none"} color={i <= 4 ? "#F59E0B" : "#D1D5DB"} />)}
            </div>
            <span className="rating-text">4.8 (120+ {t('reviews_count')})</span>
          </div>

          <div className="product-price-detail">
            {formatPrice(product.price)}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '40px', fontSize: '16px' }}>
            {product.description || t('footer_desc')}
          </p>

          <div style={{ borderTop: '1px solid var(--border)', padding: '40px 0' }}>
            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px' }}>{t('select_color')}:</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', background: color.toLowerCase(),
                        border: '3px solid ' + (selectedColor === color ? 'var(--primary)' : 'white'),
                        boxShadow: '0 0 0 1px ' + (selectedColor === color ? 'var(--primary)' : '#e5e7eb'),
                        cursor: 'pointer'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ marginBottom: '16px' }}>{t('select_size')}:</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{ 
                        padding: '10px 20px', borderRadius: '12px', border: '1.5px solid',
                        borderColor: selectedSize === size ? 'var(--primary)' : '#D1D5DB',
                        background: selectedSize === size ? 'var(--primary)' : 'white',
                        color: selectedSize === size ? 'white' : 'var(--text-main)',
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions-mobile" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: '16px', padding: '4px'
              }}>
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 700, fontSize: '18px' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                className="btn btn-outline" 
                style={{ width: '56px', height: '56px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleShare}
              >
                <Share2 size={24} />
              </button>

              <motion.button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.stock_count < 1 || isAdding}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1, height: '56px', fontSize: '18px', gap: '12px', minWidth: '200px' }}
              >
                {isAdding ? (
                   <><CheckCircle2 size={24} /> {t('add_to_cart_success')}</>
                ) : (
                   <><ShoppingCart size={24} /> {t('add_to_cart')}</>
                )}
              </motion.button>

              <button 
                className="btn btn-outline"
                style={{ height: '56px', flex: 1, minWidth: '200px' }}
                onClick={() => setIsOneClickModalOpen(true)}
              >
                {t('buy_one_click')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '100px', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
        <div style={{ display: 'flex', gap: '40px', marginBottom: '60px', borderBottom: '1px solid var(--border)' }}>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{ 
              paddingBottom: '20px', 
              borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : 'none', 
              fontWeight: activeTab === 'reviews' ? 700 : 600, 
              color: activeTab === 'reviews' ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '20px' 
            }}
          >
            {t('reviews')} ({product.comments?.length || 0})
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            style={{ 
              paddingBottom: '20px', 
              borderBottom: activeTab === 'specs' ? '3px solid var(--primary)' : 'none', 
              fontWeight: activeTab === 'specs' ? 700 : 600, 
              color: activeTab === 'specs' ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '20px' 
            }}
          >
            {t('specifications')}
          </button>
        </div>

        {activeTab === 'reviews' ? (
          <div className="comments-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px' }}>
            {/* Write a review */}
            <div>
              <div style={{ background: '#F9FAFB', padding: '32px', borderRadius: '24px', position: 'sticky', top: '120px' }}>
                <h3 style={{ marginBottom: '24px' }}>{t('leave_review')}</h3>
                {user ? (
                  <form onSubmit={handleSubmitComment}>
                    <div className="form-group">
                      <label>{t('your_opinion')}</label>
                      <textarea 
                        style={{ height: '120px', resize: 'none' }}
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder={t('opinion_placeholder')}
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ImageIcon size={16} /> {t('upload_image')}
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {commentImage && (
                          <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <img src={commentImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setCommentImage(reader.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '10px' }}>
                      <Send size={18} /> {t('send')}
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{t('login_to_comment')}</p>
                    <Link to="/login" className="btn btn-secondary">{t('login')}</Link>
                  </div>
                )}
              </div>
            </div>

            {/* List reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {product.comments && product.comments.length > 0 ? (
                product.comments.map((comment, index) => (
                  <div key={index} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                          {comment.username[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '16px' }}>{comment.username}</h4>
                          <div style={{ display: 'flex', color: '#F59E0B' }}>
                            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#F59E0B" />)}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ lineHeight: '1.6', color: '#4B5563', marginBottom: '16px' }}>{comment.text}</p>
                    {comment.image && (
                      <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img 
                          src={comment.image.startsWith('/') ? `${backendUrl}${comment.image}` : comment.image} 
                          alt="User upload" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <MessageSquare size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                  <h3>{t('no_reviews')}</h3>
                  <p style={{ color: 'var(--text-muted)' }}>{t('be_first_review')}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="specifications-list" style={{ maxWidth: '800px' }}>
            {Object.entries(specs).map(([key, value], i) => (
              <div 
                key={i} 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', padding: '20px 0', 
                  borderBottom: '1px solid var(--border)', fontSize: '16px' 
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{key}</span>
                <span style={{ fontWeight: 700 }}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '100px' }}>
          <h2 style={{ marginBottom: '40px' }}>{t('related_products')}</h2>
          <div className="products-grid-modern">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* One-Click Buy Modal */}
      <AnimatePresence>
        {isOneClickModalOpen && (
          <div className="modal-overlay" onClick={() => setIsOneClickModalOpen(false)}>
            <motion.div 
              className="modal-content-modern" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <h3>{t('buy_one_click')}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{t('one_click_desc')}</p>
              <div className="form-group">
                <label>{t('full_name')}</label>
                <input 
                  type="text" 
                  value={oneClickForm.name}
                  onChange={e => setOneClickForm({ ...oneClickForm, name: e.target.value })}
                  placeholder="Ismingizni kiriting"
                />
              </div>
              <div className="form-group">
                <label>{t('phone')}</label>
                <input 
                  type="text" 
                  value={oneClickForm.phone}
                  onChange={e => setOneClickForm({ ...oneClickForm, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="btn btn-outline" onClick={() => setIsOneClickModalOpen(false)}>{t('cancel')}</button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={async () => {
                    if (!oneClickForm.name || !oneClickForm.phone) {
                      alert('Iltimos, ismingiz va telefon raqamingizni kiriting');
                      return;
                    }
                    try {
                      await ordersApi.oneClickBuy({
                        ...oneClickForm,
                        product_id: product.id,
                        product_name: product.name
                      });
                      alert('Siz bilan tez orada bog\'lanamiz!');
                      setIsOneClickModalOpen(false);
                    } catch (err) {
                      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
                    }
                  }}
                >
                  {t('send')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
