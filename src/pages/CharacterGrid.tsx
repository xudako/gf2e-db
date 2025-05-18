import React, { useState, useEffect } from 'react';
import { Chr } from '../types';
import { characters, gunDuties, weaponTypes, elementTypes } from '../data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ToggleButtonGroup from '../components/ToggleButtonGroup';
import ToggleButton from '../components/ToggleButton';
import { asset } from '../utils/utils';

function stripCode(input: string): string {
  return input.replace(/SSR$/, '').replace(/SR$/, '');
}

const defaultFilters = {
  region: -1,
  rarity: -1,
  role: -1,
  weapon: -1,
  element: -1,
  search: '',
};

const CharacterGrid: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredCharacter, setHoveredCharacter] = useState<Chr | null>(null);
  const [filterRegion, setFilterRegion] = useState<number>(
    location.state?.filters?.region ?? defaultFilters.region
  );
  const [filterRarity, setFilterRarity] = useState<number>(
    location.state?.filters?.rarity ?? defaultFilters.rarity
  );
  const [filterRole, setFilterRole] = useState<number>(
    location.state?.filters?.role ?? defaultFilters.role
  );
  const [filterWeapon, setFilterWeapon] = useState<number>(
    location.state?.filters?.weapon ?? defaultFilters.weapon
  );
  const [filterElement, setFilterElement] = useState<number>(
    location.state?.filters?.element ?? defaultFilters.element
  );
  const [searchQuery, setSearchQuery] = useState(
    location.state?.filters?.search ?? defaultFilters.search
  );

  useEffect(() => {
    const filters = {
      region: filterRegion,
      rarity: filterRarity,
      role: filterRole,
      weapon: filterWeapon,
      element: filterElement,
      search: searchQuery,
    };
    navigate(location.pathname, { state: { ...location.state, filters }, replace: true });
  }, [filterRegion, filterRarity, filterRole, filterWeapon, filterElement, searchQuery]);

  const handleRegionFilter = (newRegion: number) => {
    setFilterRegion(filterRegion === newRegion ? -1 : newRegion);
  };

  const handleRarityFilter = (newRarity: number) => {
    setFilterRarity(filterRarity === newRarity ? -1 : newRarity);
  };

  const handleRoleFilter = (newRole: number) => {
    setFilterRole(filterRole === newRole ? -1 : newRole);
  };

  const handleWeaponFilter = (newWeapon: number) => {
    setFilterWeapon(filterWeapon === newWeapon ? -1 : newWeapon);
  };

  const handleElementFilter = (newElement: number) => {
    setFilterElement(filterElement === newElement ? -1 : newElement);
  };

  const sortedCharacters = characters.sort((a, b) => {
    if (a.rank !== b.rank) {
      return b.rank - a.rank;
    }
    return a.name.localeCompare(b.name);
  });

  const filteredCharacters = sortedCharacters.filter((character) => {
    const regionMatch = filterRegion === -1 || filterRegion === character.region;
    const rarityMatch = filterRarity === -1 || filterRarity === character.rank;
    const roleMatch = filterRole === -1 || filterRole === character.duty;
    const weaponMatch = filterWeapon === -1 || filterWeapon === character.weaponType;
    const elementMatch = filterElement === -1 || filterElement === character.element;
    const searchMatch =
      searchQuery === '' || character.name.toLowerCase().includes(searchQuery.toLowerCase());

    return regionMatch && rarityMatch && roleMatch && weaponMatch && elementMatch && searchMatch;
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

        {/* Region Filter */}
        <div className="grid grid-cols-4 lg:grid-cols-11 w-full gap-2">
          <ToggleButtonGroup className="col-span-2 lg:col-span-2 bg-primary-main">
            <ToggleButton selected={filterRegion === 0} onClick={() => handleRegionFilter(0)}>
              CN
            </ToggleButton>
            <ToggleButton selected={filterRegion === 1} onClick={() => handleRegionFilter(1)}>
              EN
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Rarity Filter */}
          <ToggleButtonGroup className="col-span-2 lg:col-span-2 bg-primary-main">
            <ToggleButton selected={filterRarity === 4} onClick={() => handleRarityFilter(4)}>
              SR
            </ToggleButton>
            <ToggleButton selected={filterRarity === 5} onClick={() => handleRarityFilter(5)}>
              SSR
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Weapon Filter */}
          <ToggleButtonGroup className="col-span-4 lg:col-span-7 bg-primary-main">
            {weaponTypes.map((weapon) => (
              <ToggleButton
                key={weapon.id}
                selected={filterWeapon === weapon.id}
                onClick={() => handleWeaponFilter(weapon.id)}
              >
                {weapon.abbr}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Element Filter */}
          <ToggleButtonGroup className="col-span-4 lg:col-span-6 bg-primary-main">
            {elementTypes.slice(0, -2).map((element) => (
              <ToggleButton
                key={element.id}
                selected={filterElement === element.id}
                onClick={() => handleElementFilter(element.id)}
              >
                {element.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Role Filter */}
          <ToggleButtonGroup className="col-span-3 lg:col-span-4 bg-primary-main">
            {gunDuties.map((role) => (
              <ToggleButton
                key={role.id}
                selected={filterRole === role.id}
                onClick={() => handleRoleFilter(role.id)}
              >
                {role.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {/* Reset Button */}
          <button
            onClick={() => {
              setFilterRegion(-1);
              setFilterRarity(-1);
              setFilterRole(-1);
              setFilterWeapon(-1);
              setFilterElement(-1);
              setSearchQuery('');
            }}
            className="px-2 py-1 text-sm border border-filter-button-border transition-colors bg-primary-main text-primary-text hover:bg-primary-light"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredCharacters.map((character) => (
          <Link
            key={character.name}
            to={`/dolls/${character.name.toLowerCase()}`}
            state={location.state}
            onMouseEnter={() => setHoveredCharacter(character)}
            onMouseLeave={() => setHoveredCharacter(null)}
            className={`transition-colors cursor-pointer
              hover:bg-secondary-main hover:text-white`}
          >
            <div className="relative overflow-hidden aspect-square">
              <div className="absolute p-4 inset-0">
                <img src={asset(`decor/Icon_Gashapon_${character.rank === 5 ? 'Golden' : 'Purple'}.png`)} 
                className="w-full h-full object-cover object-center"/>
              </div>
              <div className='absolute inset-0 p-4 flex items-center justify-center'>
                <img
                  src={
                    character === hoveredCharacter
                      ? asset(`dolls/Avatar_Head_${character.code}_Spine.png`)
                      : asset(`dolls/Avatar_Head_${character.code}UP.png`)
                  }
                  alt={character.name}
                  onError={(e) => (e.currentTarget.src = asset('images/default.png'))}
                  className={`w-full h-full object-contain`}
                />
              </div>
            </div>
            <div className='relative -mt-4'>
              <img
                src={asset(`decor/Img_Title_GunGet_${stripCode(character.code)}.png`)}
                alt={character.name}
                onError={(e) => (e.currentTarget.src = asset('images/default.png'))}
                className="w-full"
              />
              <div className='absolute inset-0 flex items-center justify-center text-center font-medium text-white text-shadow-outline'>
                {character.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CharacterGrid;
