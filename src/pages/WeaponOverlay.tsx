import React from 'react';
import { Wpn } from '../types';

interface WeaponOverlayProps {
  open: boolean;
  onClose: () => void;
  weapon?: Wpn;
}

const WeaponOverlay: React.FC<WeaponOverlayProps> = ({ open, onClose, weapon }) => {
  if (!weapon) {
    return <div className="text-2xl text-center">404</div>;
  }

  return (
    <div
      className={`fixed inset-0 bg-background-overlay z-50 p-8 overflow-auto transition-transform transform duration-300 ease-in-out ${
        open ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-primary-text hover:text-secondary-main transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="text-2xl text-center">WIP</div>
    </div>
  );
};

export default WeaponOverlay;
