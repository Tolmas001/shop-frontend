import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { products, categories as apiCategories } from '../api';
import { useApp } from '../context/AppContext';
import Skeleton from '../components/Skeleton';
import { 
  ArrowRight, 
  Smartphone, 
  Shirt, 
  ShoppingBag, 
  Watch, 
  Home as HomeIcon,
  Star,
  Quote,
  Search,
  ShieldCheck,
  Truck,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('name') || '');
  const [timeLeft, setTimeLeft] = useState({ hours: 12, mins: 45, secs: 30 });
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Yangi Kolleksiya 2026",
      subtitle: "Smartfonlar va Gadjetlar",
      desc: "Eng so'nggi texnologiyalar endi hamyonbop narxlarda. 30% gacha chegirmalar!",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600",
      btnText: "Hoziroq harid qiling",
      color: "#2563EB"
    },
    {
      id: 2,
      title: "Bahoriy Chegirmalar",
      subtitle: "Kiyim-kechak va Aksessuarlar",
      desc: "Uslubingizni yangilang. Barcha kiyimlarga 50% gacha chegirma!",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600",
      btnText: "Katalogni ko'rish",
      color: "#059669"
    },
    {
      id: 3,
      title: "Aqlli Uy Tizimlari",
      subtitle: "Uy anjomlari",
      desc: "Uyingizni kelajak texnologiyalari bilan jihozlang. O'rnatish bepul!",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1600",
      btnText: "Batafsil ma'lumot",
      color: "#7C3AED"
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, mins, secs });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const categoryTiles = [
    { name: t('cat_electronics'), icon: <Smartphone size={32} />, color: '#EFF6FF' },
    { name: t('cat_creams'), icon: <Sparkles size={32} />, color: '#FDF2F8', link: '/products?category=krem' },
    { name: t('cat_clothing'), icon: <Shirt size={32} />, color: '#FEF3C7' },
    { name: t('cat_shoes'), icon: <ShoppingBag size={32} />, color: '#ECFDF5' },
    { name: t('cat_accessories'), icon: <Watch size={32} />, color: '#F5F3FF' },
    { name: t('cat_home'), icon: <HomeIcon size={32} />, color: '#FFF1F2' },
  ];

  const reviews = [
    { name: 'Azizbek K.', role: 'Dizayner', text: 'Juda mazmunli va sifatli mahsulotlar. Xizmat ko‘rsatish ham a‘lo darajada!', rating: 5, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { name: 'Malika R.', role: 'Tadbirkor', text: 'Yetkazib berish juda tez. Har safar kutganimdan ham yaxshi natija olaman.', rating: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { name: 'Farhod T.', role: 'Talaba', text: 'Narxlari juda hamyonbop. Sifati esa juda yuqori!', rating: 4, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  ];

  useEffect(() => {
    const name = searchParams.get('name');
    setSearchQuery(name || '');
    
    setLoading(true);
    products.getAll({ name })
      .then(res => {
        setProductsList(res.data);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="home-page">
      {/* Hero Ads Slider Section */}
      <section className="hero-slider-modern">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentBanner}
            className="banner-slide"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${banners[currentBanner].image})` }}
          >
            <div className="container">
              <div className="banner-content">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="banner-subtitle"
                >
                  {banners[currentBanner].subtitle}
                </motion.span>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {banners[currentBanner].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {banners[currentBanner].desc}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/products" className="btn btn-primary banner-btn">
                    {banners[currentBanner].btnText} <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={() => setCurrentBanner(prev => (prev - 1 + banners.length) % banners.length)}>
            <ChevronLeft size={24} />
          </button>
          <button className="slider-arrow next" onClick={() => setCurrentBanner(prev => (prev + 1) % banners.length)}>
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="slider-dots">
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              className={`dot ${currentBanner === idx ? 'active' : ''}`}
              onClick={() => setCurrentBanner(idx)}
            ></div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container section">
        <div className="section-header-centered">
          <p className="section-tag">{t('cat_title')}</p>
          <h2 className="section-title">{t('cat_subtitle')}</h2>
        </div>
        
        <div className="category-scroll-wrapper">
          <div className="category-grid-modern">
            {categoryTiles.map((cat, i) => (
              <motion.div
                key={i}
                className="category-card-modern"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={cat.link || `/products?category=${cat.name}`} className="category-card-inner">
                  <div className="category-icon-box" style={{ backgroundColor: cat.color }}>
                    {cat.icon}
                  </div>
                  <h4>{cat.name}</h4>
                  <span className="category-link-text">{t('view_more')} <ArrowRight size={14} /></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* Dynamic Products Sections */}
      {loading ? (
        <section className="container section">
          <div className="category-row-header">
            <Skeleton type="title" width="200px" />
            <Skeleton type="text" width="100px" />
          </div>
          <div className="products-grid-modern">
            {[1,2,3,4].map(i => (
              <div key={i} className="product-skeleton-card">
                <Skeleton type="image" height="250px" />
                <div style={{ padding: '15px' }}>
                  <Skeleton type="title" width="80%" />
                  <Skeleton type="price" width="40%" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        (() => {
          const categoriesMap = productsList.reduce((acc, product) => {
            const cat = product.category || 'Boshqa';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(product);
            return acc;
          }, {});

          return Object.entries(categoriesMap).slice(0, 3).map(([categoryName, products], index) => (
            <section key={categoryName} className="container section">
              <div className="category-row-header">
                <div className="header-text">
                  <p className="section-tag">{t('new_arrival')}</p>
                  <h2 className="section-title-small">{categoryName}</h2>
                </div>
                <Link to={`/products?category=${categoryName}`} className="view-all-link">
                  {t('view_all')} <ArrowRight size={18} />
                </Link>
              </div>
              
              <div className="products-grid-modern">
                {products.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ));
        })()
      )}

      {/* Best Sellers Slider */}
      <section className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <p className="section-tag">Eng ko'p sotilgan</p>
            <h2 className="section-title-small">Top Mahsulotlar</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="nav-btn" onClick={() => document.getElementById('best-sellers-scroll').scrollBy({ left: -300, behavior: 'smooth' })}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-btn" onClick={() => document.getElementById('best-sellers-scroll').scrollBy({ left: 300, behavior: 'smooth' })}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div 
          id="best-sellers-scroll"
          style={{ 
            display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px', 
            scrollbarWidth: 'none', msOverflowStyle: 'none'
          }}
        >
          {productsList.slice(0, 8).map(product => (
            <div key={product.id} style={{ minWidth: '280px' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="container section">
        <div className="offer-banner-modern">
          <div className="offer-text-content">
            <p className="offer-badge">{t('offer_subtitle')}</p>
            <h2 className="offer-title-text">{t('offer_title')}</h2>
            <p className="offer-description">{t('offer_desc')}</p>
            
            <div className="offer-timer-modern">
              <div className="timer-unit"><span>{String(timeLeft.hours).padStart(2, '0')}</span><p>{t('hours')}</p></div>
              <div className="timer-separator">:</div>
              <div className="timer-unit"><span>{String(timeLeft.mins).padStart(2, '0')}</span><p>{t('mins')}</p></div>
              <div className="timer-separator">:</div>
              <div className="timer-unit"><span>{String(timeLeft.secs).padStart(2, '0')}</span><p>{t('secs')}</p></div>
            </div>
            
            <Link to="/products" className="btn btn-secondary offer-btn-modern">
              {t('offer_btn')} <ArrowRight size={18} />
            </Link>
          </div>
          <div className="offer-visual-content">
            <img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800" alt="Special Offer" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container section about-section-modern">
        <div className="about-grid-modern">
          <motion.div 
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800" alt="About Shop" className="about-img-main" />
            <div className="about-experience-badge">
              <span className="years">2+</span>
              <span className="text">Yillik tajriba</span>
            </div>
          </motion.div>

          <motion.div 
            className="about-content-modern"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-tag">{t('nav_about')}</p>
            <h2 className="section-title-small">{t('about_title')}</h2>
            <p className="about-description-text">{t('about_desc')}</p>
            
            <div className="about-features-grid">
              <div className="about-feature-item">
                <div className="feature-icon-box"><ShieldCheck size={24} /></div>
                <div>
                  <h4>{t('about_quality')}</h4>
                  <p>{t('about_quality_desc')}</p>
                </div>
              </div>
              <div className="about-feature-item">
                <div className="feature-icon-box"><Truck size={24} /></div>
                <div>
                  <h4>{t('about_delivery')}</h4>
                  <p>{t('about_delivery_desc')}</p>
                </div>
              </div>
              <div className="about-feature-item">
                <div className="feature-icon-box"><Headphones size={24} /></div>
                <div>
                  <h4>{t('about_support')}</h4>
                  <p>{t('about_support_desc')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container section">
        <div className="section-header-centered">
          <p className="section-tag">{t('reviews_title')}</p>
          <h2 className="section-title">{t('reviews_subtitle')}</h2>
        </div>
        
        <div className="reviews-slider-wrapper">
          <div className="reviews-slider-container">
            {reviews.map((review, i) => (
              <motion.div 
                key={i} 
                className="review-card-modern"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="review-quote-icon"><Quote size={32} /></div>
                <p className="review-message">"{review.text}"</p>
                <div className="reviewer-profile">
                  <img src={review.img} alt={review.name} className="reviewer-avatar" />
                  <div className="reviewer-meta">
                    <h4>{review.name}</h4>
                    <p>{review.role}</p>
                    <div className="reviewer-stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={12} fill={star <= review.rating ? "#F59E0B" : "none"} color={star <= review.rating ? "#F59E0B" : "#D1D5DB"} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section id="info" className="container section info-section-modern">
        <div className="info-grid-modern">
          <div id="faq" className="info-item-modern">
            <h2 className="section-title-small" style={{ marginBottom: '24px' }}>FAQ</h2>
            <div className="faq-accordions">
              {[
                { q: "Qanday qilib buyurtma berish mumkin?", a: "Mahsulotni tanlang, savatga qo'shing va rasmiylashtirish tugmasini bosing. Siz bilan tez orada bog'lanamiz." },
                { q: "To'lov usullari qanday?", a: "Biz Click, Payme va naqd pul orqali to'lovlarni qabul qilamiz. Yaqin orada onlayn karta orqali to'lov ham yo'lga qo'yiladi." },
                { q: "Yetkazib berish qancha vaqt oladi?", a: "Toshkent shahri bo'ylab 24 soat ichida, viloyatlarga esa 2-3 kun ichida yetkazib beriladi." },
                { q: "Mahsulotni qaytarish mumkinmi?", a: "Ha, mahsulotda nuqson bo'lsa yoki tavsifga mos kelmasa, 24 soat ichida qaytarishingiz mumkin." }
              ].map((item, i) => <FAQItem key={i} question={item.q} answer={item.a} />)}
            </div>
          </div>

          <div id="shipping" className="info-item-modern">
            <h2 className="section-title-small">Yetkazib berish</h2>
            <p>O'zbekiston bo'ylab 24 soat ichida yetkazib beramiz. Toshkent shahri ichida yetkazib berish bepul.</p>
          </div>

          <div id="returns" className="info-item-modern">
            <h2 className="section-title-small">Qaytarish</h2>
            <p>Mahsulotni 24 soat ichida qaytarish yoki almashtirish imkoniyati mavjud (agar nuqson bo'lsa).</p>
          </div>

          <div id="privacy" className="info-item-modern">
            <h2 className="section-title-small">Maxfiylik</h2>
            <p>Sizning ma'lumotlaringiz biz bilan xavfsiz. Biz hech qachon shaxsiy ma'lumotlarni uchinchi shaxslarga bermaymiz.</p>
          </div>

          <div id="careers" className="info-item-modern">
            <h2 className="section-title-small">Karyera</h2>
            <p>Biz bilan birga kelajakni quring. Yangi bo'sh ish o'rinlari uchun CV-ingizni yuboring.</p>
          </div>

          <div id="news" className="info-item-modern">
            <h2 className="section-title-small">Blog</h2>
            <p>Dunyodagi eng so'nggi texnologik yangiliklar va maslahatlar bizning blogimizda.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="container section newsletter-wrapper">
        <div className="newsletter-card-modern">
          <div className="newsletter-icon-floating"><ShoppingBag size={40} /></div>
          <h2>{t('newsletter_title')}</h2>
          <p>{t('newsletter_desc')}</p>
          <form className="newsletter-form-modern" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t('newsletter_placeholder')} required />
            <button type="submit" className="btn-modern-dark">{t('newsletter_btn')}</button>
          </form>
        </div>
      </section>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ borderBottom: '1px solid #eee', marginBottom: '8px' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '20px 0', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' 
        }}
      >
        <span style={{ fontSize: '16px', fontWeight: 600 }}>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} color="var(--primary)" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ paddingBottom: '20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;