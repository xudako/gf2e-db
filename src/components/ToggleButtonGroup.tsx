import React from 'react';

interface ToggleButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ children, className = '' }) => {
  return <div className={`flex border border-filter-button-border ${className}`}>{children}</div>;
};

export default ToggleButtonGroup;
