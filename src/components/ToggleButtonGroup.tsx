import React from "react";

interface ToggleButtonGroupProps {
  children: React.ReactNode;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({ 
  children, 
}) => {
  return (
    <div
      className="flex bg-primary-main border border-filter-button-border"
    >
      {children}
    </div>
  );
};

export default ToggleButtonGroup;