import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  delay?: number;
  hideDelay?: number;
  zIndex?: number;
  maxWidth?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  className = '',
  placement = 'auto',
  delay = 250,
  hideDelay = 150,
  zIndex = 50,
  maxWidth = '24rem',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = containerRect.left + containerRect.width / 2 - tooltipRect.width / 2;
    let top = 0;
    let actualPlacement = placement;

    if (placement === 'auto') {
      const spaceTop = containerRect.top;
      const spaceBottom = windowHeight - containerRect.bottom;

      if (spaceTop >= tooltipRect.height || spaceBottom >= tooltipRect.height) {
        actualPlacement = spaceTop > spaceBottom ? 'top' : 'bottom';
      } else {
        const spaceLeft = containerRect.left;
        const spaceRight = windowWidth - containerRect.right;
        actualPlacement = spaceLeft > spaceRight ? 'left' : 'right';
      }
    }

    switch (actualPlacement) {
      case 'top':
        top = containerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        top = containerRect.bottom + 8;
        break;
      case 'left':
        left = containerRect.left - tooltipRect.width - 8;
        top = containerRect.top + containerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        left = containerRect.right + 8;
        top = containerRect.top + containerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > windowWidth - 10) left = windowWidth - tooltipRect.width - 10;
    if (top < 10) top = 10;
    if (top + tooltipRect.height > windowHeight - 10) top = windowHeight - tooltipRect.height - 10;

    setPosition({ left, top });
    setIsPositioned(true);
  };

  useEffect(() => {
    if (isVisible) {
      setIsPositioned(false);
      setTimeout(calculatePosition, 0);
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);

      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed p-2 bg-background-tooltip text-primary-text rounded shadow-lg"
          style={{
            visibility: isPositioned ? 'visible' : 'hidden',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: zIndex,
            maxWidth: maxWidth,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {title}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
