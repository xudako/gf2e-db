import { Wpn } from '../types';

interface ModalProps {
  weapon: Wpn | null;
  onClose: () => void;
}

const WeaponModal: React.FC<ModalProps> = ({ weapon, onClose }) => {
  if (!weapon) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div>
          <img
            src={`/weapons/Weapon_${weapon.internalName ?? weapon.name}_${weapon.rarity}_1024.png`}
            alt={weapon.name}
            className="modal-image"
          />

          <h2>{weapon.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default WeaponModal;
