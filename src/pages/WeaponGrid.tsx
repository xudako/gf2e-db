import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { weapons, weaponTypes } from '../data/data';
import ToggleButton from '../components/ToggleButton';
import ToggleButtonGroup from '../components/ToggleButtonGroup';
import { asset } from '../utils/utils';
import { formatWeaponUrl } from '../utils/wpn-utils';

const defaultFilters = {
  rarity: -1,
  weapon: -1,
  search: '',
};

const WeaponGrid: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filterRarity, setFilterRarity] = useState<number>(
    location.state?.filters?.rarity ?? defaultFilters.rarity
  );
  const [filterWeapon, setFilterWeapon] = useState<number>(
    location.state?.filters?.weapon ?? defaultFilters.weapon
  );
  const [searchQuery, setSearchQuery] = useState(
    location.state?.filters?.search ?? defaultFilters.search
  );

  useEffect(() => {
    const filters = {
      rarity: filterRarity,
      weapon: filterWeapon,
      search: searchQuery,
    };
    navigate(location.pathname, { state: { ...location.state, filters }, replace: true });
  }, [filterRarity, filterWeapon, searchQuery]);

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
          id="search"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-main bg-white/90"
        />
        {/* Rarity Filter */}
        <ToggleButtonGroup className="bg-primary-main">
          <ToggleButton
            selected={filterRarity === 3}
            onClick={() => handleRarityFilter(3)}
            className="min-w-[6rem]"
          >
            R
          </ToggleButton>
          <ToggleButton
            selected={filterRarity === 4}
            onClick={() => handleRarityFilter(4)}
            className="min-w-[6rem]"
          >
            SR
          </ToggleButton>
          <ToggleButton
            selected={filterRarity === 5}
            onClick={() => handleRarityFilter(5)}
            className="min-w-[6rem]"
          >
            SSR
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Weapon Filter */}
        <ToggleButtonGroup className="bg-primary-main">
          {weaponTypes.map((weapon) => (
            <ToggleButton
              key={weapon.id}
              selected={filterWeapon === weapon.id}
              onClick={() => handleWeaponFilter(weapon.id)}
              className="min-w-[3rem] sm:min-w-[6rem]"
            >
              {weapon.abbr}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

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
          <Link
            key={weapon.name}
            to={`/weapons/${formatWeaponUrl(weapon.name)}`}
            state={location.state}
            className={`relative p-4 transition-colors cursor-pointer hover:bg-secondary-main hover:text-white group`}
          >
            <img
              src={asset(`weapons/${weapon.resCode}_256.png`)}
              alt={weapon.name}
              onError={(e) => (e.currentTarget.src = asset('images/default.png'))}
              className={`w-full aspect-square object-cover rounded-lg 
                ${weapon.rank === 5 ? 'bg-rarity-ssr' : weapon.rank === 4 ? 'bg-rarity-sr' : 'bg-rarity-r'}`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 text-center">
              <p className="text-white text-sm truncate">{weapon.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WeaponGrid;
