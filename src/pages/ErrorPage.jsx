import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  RefreshCw, 
  ShieldAlert, 
  ArrowLeft,
  CloudOff
} from 'lucide-react';

const ErrorPage = ({ status: propStatus }) => {
  const { status: paramStatus } = useParams();
  const navigate = useNavigate();
  const status = (propStatus || paramStatus || '404').toString();

  const getErrorContent = (code) => {
    switch(code) {
      case '404':
        return {
          title: 'Sahifa topilmadi 😿',
          message: 'Kechirasiz, siz qidirayotgan sahifa uyquga ketgan ko\'rinadi... 🤫 Uni bezovta qilmasdan bosh sahifaga qaytamizmi?',
          icon: <img src="/assets/images/404-illustration.png" alt="404" style={{ width: '250px', height: '250px', borderRadius: '30px', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }} />,
          gradient: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
          action: 'Bosh sahifaga qaytish'
        };
      case '401':
        return {
          title: 'Ruxsat berilmagan 🔐',
          message: 'Ushbu sahifani ko\'rish uchun siz tizimga kirishingiz kerak. Iltimos, kalitni kiriting! 🗝️',
          icon: <ShieldAlert size={100} strokeWidth={1.5} />,
          gradient: 'linear-gradient(135deg, #F9D423 0%, #FF4E50 100%)',
          action: 'Tizimga kirish'
        };
      case '403':
        return {
          title: 'Kirish taqiqlangan 🚫',
          message: 'Sizda ushbu joyga kirish uchun ruxsatnoma yo\'q. Adashib qolgan bo\'lsangiz, orqaga qayting! 🏃‍♂️',
          icon: <AlertCircle size={100} strokeWidth={1.5} />,
          gradient: 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
          action: 'Bosh sahifaga qaytish'
        };
      case '500':
        return {
          title: 'Serverda xatolik 🛠️',
          message: 'Kechirasiz, tizim biroz charchadi. Muhandislarimiz uni davolashmoqda! 👨‍🔧',
          icon: <RefreshCw size={100} strokeWidth={1.5} />,
          gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
          action: 'Qayta urinish'
        };
      case 'offline':
        return {
          title: 'Bog\'lanish yo\'q 📶',
          message: 'Internet qochib ketdi! 🏃 Uni topib, qaytadan urinib ko\'ring. 📡',
          icon: <CloudOff size={100} strokeWidth={1.5} />,
          gradient: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)',
          action: 'Qayta tekshirish'
        };
      default:
        return {
          title: 'Xatolik yuz berdi 🧐',
          message: 'Kutilmagan xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring. ✨',
          icon: <AlertCircle size={100} strokeWidth={1.5} />,
          gradient: 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)',
          action: 'Bosh sahifaga qaytish'
        };
    }
  };

  const content = getErrorContent(status);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleAction = () => {
    if (status === '401') {
      navigate('/login');
    } else if (status === '500' || status === 'offline') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              background: content.gradient,
              opacity: 0.03,
              filter: 'blur(80px)',
              borderRadius: '50%'
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: 'var(--surface)',
          padding: '60px 40px',
          borderRadius: '40px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          backdropFilter: 'blur(10px)'
        }}
      >
        <motion.div variants={itemVariants}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '150px',
            fontWeight: 900,
            color: 'var(--text-main)',
            opacity: 0.05,
            userSelect: 'none',
            zIndex: -1
          }}>
            {status}
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          animate={{
            y: status === '404' ? [0, 0, 0] : [-10, 10, -10], // Don't float the image too much
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ 
            marginBottom: '32px',
            display: 'inline-flex',
            padding: status === '404' ? '0' : '30px',
            borderRadius: '30px',
            background: status === '404' ? 'transparent' : 'rgba(37, 99, 235, 0.03)',
            color: 'var(--primary)'
          }}
        >
          {content.icon}
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          style={{ 
            fontSize: '36px', 
            fontWeight: 800, 
            marginBottom: '16px',
            background: content.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {content.title}
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          style={{ 
            fontSize: '17px', 
            lineHeight: '1.7', 
            color: 'var(--text-muted)',
            marginBottom: '40px' 
          }}
        >
          {content.message}
        </motion.p>

        <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={handleAction}
            className="btn btn-primary"
            style={{ 
              padding: '16px 40px',
              borderRadius: '20px',
              fontSize: '16px',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            {content.action}
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--text-muted)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'none',
              border: 'none'
            }}
          >
            <ArrowLeft size={18} /> Orqaga qaytish
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
