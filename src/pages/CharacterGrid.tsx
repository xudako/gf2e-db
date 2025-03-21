import React, { useState } from 'react';
import { Chr } from '../types';
import { characters, gunDuties, weaponTypes, elementTypes } from '../data/data';
import { useNavigate } from 'react-router-dom';
import ToggleButtonGroup from '../components/ToggleButtonGroup';
import ToggleButton from '../components/ToggleButton';

function stripCode(input: string): string {
  return input.replace(/ssr$/i, '').replace(/sr$/i, '');
}

const CharacterGrid: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Chr | null>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<Chr | null>(null);
  const [filterRegion, setFilterRegion] = useState<number>(-1);
  const [filterRarity, setFilterRarity] = useState<number>(-1);
  const [filterRole, setFilterRole] = useState<number>(-1);
  const [filterWeapon, setFilterWeapon] = useState<number>(-1);
  const [filterElement, setFilterElement] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCharacterSelect = (character: Chr) => {
    setSelectedCharacter(character);
    navigate(`/dolls/${character.name}`);
  };

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
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-main bg-white/90"
        />

        {/* Region Filter */}
        <ToggleButtonGroup>
          <ToggleButton selected={filterRegion === 0} onClick={() => handleRegionFilter(0)}>
            CN
          </ToggleButton>
          <ToggleButton selected={filterRegion === 1} onClick={() => handleRegionFilter(1)}>
            EN
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Rarity Filter */}
        <ToggleButtonGroup>
          <ToggleButton selected={filterRarity === 4} onClick={() => handleRarityFilter(4)}>
            SR
          </ToggleButton>
          <ToggleButton selected={filterRarity === 5} onClick={() => handleRarityFilter(5)}>
            SSR
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Weapon Filter */}
        <ToggleButtonGroup>
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
        <ToggleButtonGroup>
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
        <ToggleButtonGroup>
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
          className="px-2 py-1 min-w-[6rem] text-sm border border-filter-button-border transition-colors bg-primary-main text-primary-text hover:bg-primary-light"
        >
          Reset
        </button>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {filteredCharacters.map((character) => (
          <div
            key={character.name}
            onClick={() => handleCharacterSelect(character)}
            onMouseEnter={() => setHoveredCharacter(character)}
            onMouseLeave={() => setHoveredCharacter(null)}
            className={`p-4 transition-colors cursor-pointer
              ${selectedCharacter?.name === character.name ? 'bg-primary-light' : ''}
              hover:bg-secondary-main hover:text-white`}
          >
            <img
              src={
                character === hoveredCharacter
                  ? `${import.meta.env.BASE_URL}dolls/Img_KittyCafe_Cat_${stripCode(character.code)}.png`
                  : `${import.meta.env.BASE_URL}dolls/Avatar_Head_${character.code}_Spine.png`
              }
              alt={character.name}
              onError={(e) =>
                (e.currentTarget.src = `${import.meta.env.BASE_URL}images/default.png`)
              }
              className={`w-full aspect-square object-cover rounded-lg 
                ${character.rank === 5 ? 'bg-rarity-ssr' : 'bg-rarity-sr'}`}
            />
            <div className="mt-2 text-center font-medium bg-black/50 text-white rounded">
              {character.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterGrid;
