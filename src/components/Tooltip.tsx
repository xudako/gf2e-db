import React, { useState } from 'react';

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-xs bg-background-overlay text-primary-text rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
          {title}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
