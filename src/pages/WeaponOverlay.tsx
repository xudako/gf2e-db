import React from 'react';
import { Wpn } from '../types';
import Slide from '../components/Slide';

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
    <Slide
      in={open}
      direction="up"
      mountOnEnter
      unmountOnExit
      className="p-8 overflow-auto"
      containerClassName="fixed inset-0 bg-background-overlay z-50"
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
    </Slide>
  );
};

export default WeaponOverlay;
