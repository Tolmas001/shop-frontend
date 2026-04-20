import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, height, width, borderRadius, style }) => {
  const classes = `skeleton ${type}`;
  
  return (
    <div 
      className={classes} 
      style={{ 
        height: height || 'auto', 
        width: width || '100%', 
        borderRadius: borderRadius || '8px',
        ...style 
      }}
    >
      <div className="skeleton-shimmer"></div>
    </div>
  );
};

export default Skeleton;
