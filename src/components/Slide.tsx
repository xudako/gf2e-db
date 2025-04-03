import React, { useState, useEffect, ReactNode } from 'react';

interface SlideProps {
  in?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

const Slide: React.FC<SlideProps> = ({ 
  in: isVisible = false, 
  direction = "up", 
  mountOnEnter = true,
  unmountOnExit = true,
  className = "",
  containerClassName = "",
  children 
}) => {
  const [isMounted, setIsMounted] = useState(!mountOnEnter || isVisible);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isVisible && !isMounted) {
      setIsMounted(true);
    }

    if (isMounted) {
      setTimeout(() => {
        setIsTransitioning(isVisible);
      }, 10);
    }

    if (!isVisible && unmountOnExit && isMounted) {
      const timeout = setTimeout(() => {
        setIsMounted(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isMounted, unmountOnExit]);

  const getTransformClass = (isVisible: boolean): string => {
    switch (direction) {
      case "up":
        return isVisible ? 'translate-y-0' : 'translate-y-full';
      case "down":
        return isVisible ? 'translate-y-0' : '-translate-y-full';
      case "left":
        return isVisible ? 'translate-x-0' : 'translate-x-full';
      case "right":
        return isVisible ? 'translate-x-0' : '-translate-x-full';
      default:
        return isVisible ? 'translate-y-0' : 'translate-y-full';
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${containerClassName}`}>
      <div 
        className={`transform transition-transform duration-300 ease-in-out ${getTransformClass(isTransitioning)} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Slide;