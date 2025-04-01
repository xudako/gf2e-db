import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wpn } from '../types';
import { weapons, weaponTypes } from '../data/data';
import ToggleButton from '../components/ToggleButton';

const WeaponGrid: React.FC = () => {
  const [filterRarity, setFilterRarity] = useState<number>(-1);
  const [filterWeapon, setFilterWeapon] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleWeaponSelect = (weapon: Wpn) => {
    navigate(`/weapons/${weapon.name}`);
  };

  const handleRarityFilter = (newRarity: number) => {
    setFilterRarity(filterRarity === newRarity ? -1 : newRarity);
  };

  const handleWeaponFilter = (newWeapon: number) => {
    setFilterWeapon(filterWeapon === newWeapon ? -1 : newWeapon);
  };

  const sortedWeapons = weapons.sort((a, b) => {
    if (a.rank != b.rank) {
      return b.rank - a.rank;
    }
    return a.name.localeCompare(b.name);
  });

  const filteredWeapons = sortedWeapons.filter((weapon) => {
    const rarityMatch = filterRarity === -1 || filterRarity === weapon.rank;
    const weaponMatch = filterWeapon === -1 || filterWeapon === weapon.type;
    const searchMatch =
      searchQuery === '' || weapon.name.toLowerCase().includes(searchQuery.toLowerCase());

    return rarityMatch && weaponMatch && searchMatch;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-main bg-white/90"
        />
        {/* Rarity Filter */}
        <div className="flex bg-primary-main border border-filter-button-border">
          <ToggleButton selected={filterRarity === 3} onClick={() => handleRarityFilter(3)}>
            R
          </ToggleButton>
          <ToggleButton selected={filterRarity === 4} onClick={() => handleRarityFilter(4)}>
            SR
          </ToggleButton>
          <ToggleButton selected={filterRarity === 5} onClick={() => handleRarityFilter(5)}>
            SSR
          </ToggleButton>
        </div>

        {/* Weapon Filter */}
        <div className="flex bg-primary-main border border-filter-button-border">
          {weaponTypes.map((weapon) => (
            <ToggleButton
              key={weapon.id}
              selected={filterWeapon === weapon.id}
              onClick={() => handleWeaponFilter(weapon.id)}
            >
              {weapon.abbr}
            </ToggleButton>
          ))}
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setFilterRarity(-1);
            setFilterWeapon(-1);
          }}
          className="px-2 py-1 min-w-[6rem] text-sm border border-filter-button-border transition-colors bg-primary-main text-primary-text hover:bg-primary-light"
        >
          Reset
        </button>
      </div>

      {/* Weapon Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {filteredWeapons.map((weapon) => (
          <div
            key={weapon.name}
            onClick={() => handleWeaponSelect(weapon)}
            className={`relative p-4 transition-colors cursor-pointer hover:bg-secondary-main hover:text-white group`}
          >
            <img
              src={`${import.meta.env.BASE_URL}weapons/${weapon.resCode}_256.png`}
              alt={weapon.name}
              onError={(e) =>
                (e.currentTarget.src = `${import.meta.env.BASE_URL}images/default.png`)
              }
              className={`w-full aspect-square object-cover rounded-lg 
                ${weapon.rank === 5 ? 'bg-rarity-ssr' : weapon.rank === 4 ? 'bg-rarity-sr' : 'bg-rarity-r'}`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-center">
              <p className="text-white text-sm truncate">{weapon.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponGrid;
