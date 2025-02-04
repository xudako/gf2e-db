// import React, { useState } from "react";
// import { Wpn } from '../types';

// const weapons: Wpn[] = [
// ]

// const WeaponGrid: React.FC = () => {
//     const [selectedWeapon, setSelectedWeapon] = useState<Wpn | null>(null);
  
//     const openWeaponInfo = (weapon: Wpn) => {
//       setSelectedWeapon(weapon);
//     };
  
//     return (
//       <div className="weapon-grid">
//         {weapons.map((weapon) => (
//           <div
//             key={weapon.name}
//             className="weapon-card"
//             onClick={() => openWeaponInfo(weapon)}
//           >
//             <img
//               className="weapon-image"
//             // fix   src={`/images/Avatar_Bust_${weapon.internalName ?? weapon.name}${weapon.rarity}.png`}
//               alt={weapon.name}
//               onError={(e) => (e.currentTarget.src = "/images/default.png")}
//             />
//             <div className="weapon-name">{weapon.name}</div>
//           </div>
//         ))}
//       </div>
//     );
//   };
const WeaponGrid: React.FC = () => (
  <h1>weapons</h1>
)

export default WeaponGrid;