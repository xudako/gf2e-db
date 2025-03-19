import React from "react";

interface ToggleButtonProps {
  value?: string | number;  // Optional since it's not used internally
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ 
  selected, 
  onClick, 
  children, 
  className = ""
}) => {
  const baseClasses = "px-2 py-1 min-w-[6rem] text-sm border border-primary-light transition-colors";
  const stateClasses = selected 
    ? "bg-primary-main text-primary-selected" 
    : "text-primary-text hover:bg-primary-light";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${stateClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default ToggleButton;
