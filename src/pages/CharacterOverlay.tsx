import React, { useState, useEffect } from 'react';
import { Chr, Skill, Skin } from '../types';
import { loadChrSkill } from '../utils/skill-utils';
import { getDollStats } from '../utils/stat-utils';
import SkillCard from '../components/SkillCard';
import Tables from '../data/TableLoader';
import ToggleButton from '../components/ToggleButton';
import Tooltip from '../components/Tooltip';
import Slide from '../components/Slide';
import LevelSlider from '../components/ChrLevelSlider';

type SkillTypeId = '01' | '05' | '07' | '04' | '08';

interface SkillType {
  id: SkillTypeId;
  name: string;
}

const skillTypes: SkillType[] = [
  { id: '01', name: 'Basic' },
  { id: '05', name: 'Skill 1' },
  { id: '07', name: 'Skill 2' },
  { id: '04', name: 'Ultimate' },
  { id: '08', name: 'Passive' },
];

interface SkillsByLevel {
  [level: string]: Skill;
}

interface SkillTree {
  [sType: string]: SkillsByLevel;
}

interface CharacterOverlayProps {
  open: boolean;
  onClose: () => void;
  character?: Chr;
}

const CharacterOverlay: React.FC<CharacterOverlayProps> = ({ open, onClose, character }) => {
  if (!character) {
    return <div className="text-2xl text-center">404</div>;
  }

  // Skins
  const skinData = character.skins.map((skinId) => {
    const skin = Tables.ClothesData[skinId];
    if (!skin) throw new Error(`Skin with ID ${skinId} not found`);
    return {
      ...skin,
    };
  });

  const [currentSkin, setCurrentSkin] = useState<Skin>(skinData[0]);
  const displayedImage = `${import.meta.env.BASE_URL}dolls/Avatar_Whole_${currentSkin.code}.png`;

  const handleSkinChange = (newSkinId: number) => {
    const newSkin = skinData.find((skin) => skin.id === newSkinId);
    if (newSkin) {
      setCurrentSkin(newSkin);
    }
  };

  // Skills
  const vertebraeIds = [...Array.from({ length: 7 }, (_, i) => i + 1)].map(
    (x) => character.id * 100 + x
  );

  const skillIds = vertebraeIds.map((vertId) => Tables.GunGradeData[vertId].abbr);

  const allSkills: SkillTree = {};

  [character.skillNormalAttack].concat(skillIds.flat()).forEach((id) => {
    const idString = id.toString();
    const type = idString.substring(4, 6);
    const level = idString.substring(6, 8);

    if (!allSkills[type]) {
      allSkills[type] = {};
    }

    allSkills[type][level] = loadChrSkill(id, character);
  });

  const [currentSkillType, setCurrentSkillType] = useState<SkillTypeId>(skillTypes[0].id);
  const [currentSkillLevels, setCurrentSkillLevels] = useState<Map<SkillTypeId, string>>(
    new Map(skillTypes.map((type) => [type.id, '01']))
  );
  const [currentSkillLevel, setCurrentSkillLevel] = useState<string>('01');
  const [currentSkill, setCurrentSkill] = useState<Skill>(allSkills['01']['01']);
  const [currentLevel, setCurrentLevel] = useState(60);
  const [currentRange, setCurrentRange] = useState(60);

  useEffect(() => {
    setCurrentSkillLevels((prevLevels) =>
      new Map(prevLevels).set(currentSkillType, currentSkillLevel)
    );
  }, [currentSkillLevel]);

  useEffect(() => {
    setCurrentSkillLevel(currentSkillLevels.get(currentSkillType) ?? '01');
  }, [currentSkillType]);

  useEffect(() => {
    const level = currentSkillLevels.get(currentSkillType);
    if (
      currentSkillType &&
      currentSkillLevels &&
      allSkills[currentSkillType] &&
      level &&
      allSkills[currentSkillType][level]
    )
      setCurrentSkill(allSkills[currentSkillType][level]);
  }, [currentSkillType, currentSkillLevels]);

  const handleSkillTypeChange = (newSkillTypeId: SkillTypeId) => {
    setCurrentSkillType(newSkillTypeId);
  };

  const getLevels = (skillType: string): string[] => {
    const levels = allSkills[skillType] ? Object.keys(allSkills[skillType]).sort() : [];
    return levels;
  };

  const handleSkillLevelChange = (newLevel: string) => {
    setCurrentSkillLevel(newLevel);
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
        {/* Character Info */}
        <div className="col-span-6">
          <div className="p-4">
            <h1
              className="text-4xl"
              style={{
                color: `#${Tables.LanguageElementData[character.element]['color'].slice(0, -2)}`,
              }}
            >
              {character.name}
            </h1>

            {/* Stats Info */}
            <div className="mt-4 p-6 grid grid-cols-6 lg:grid-cols-12 gap-4 text-primary-text">
              <div className="col-span-2">
                <span>Class:</span>
              </div>
              <div className="col-span-4">
                <Tooltip title={Tables.GunDutyData[character.duty].name}>
                  <img
                    src={`${import.meta.env.BASE_URL}icons/${Tables.GunDutyData[character.duty].icon}_W.png`}
                    alt={`${Tables.GunDutyData[character.duty].name} icon`}
                    className="h-16 align-middle"
                  />
                </Tooltip>
              </div>

              <div className="col-span-2">
                <span>Weapon:</span>
              </div>
              <div className="col-span-4">
                <Tooltip title={Tables.GunWeaponTypeData[character.weaponType]['name']}>
                  <img
                    src={`${import.meta.env.BASE_URL}icons/${Tables.GunWeaponTypeData[character.weaponType]['skinIcon']}.png`}
                    alt={`${Tables.GunWeaponTypeData[character.weaponType]['name']} icon`}
                    className="h-16 align-middle"
                  />
                </Tooltip>
              </div>

              <div className="col-span-2">
                <span>Element:</span>
              </div>
              <div className="col-span-4">
                <Tooltip title={Tables.LanguageElementData[character.element]['name']}>
                  <img
                    src={`${import.meta.env.BASE_URL}icons/${Tables.LanguageElementData[character.element]['icon']}_S.png`}
                    alt={`${Tables.LanguageElementData[character.element]['name']} icon`}
                    className="h-16 align-middle"
                  />
                </Tooltip>
              </div>

              <div className="col-span-2">
                <span>Weakness:</span>
              </div>
              <div className="col-span-4 flex space-x-2">
                <Tooltip title={Tables.WeaponTagData[character.weak[0]]['name']}>
                  <img
                    src={`${import.meta.env.BASE_URL}icons/${Tables.WeaponTagData[character.weak[0]]['icon']}_S.png`}
                    alt={`${Tables.WeaponTagData[character.weak[0]]['name']} icon`}
                    className="h-16 align-middle"
                  />
                </Tooltip>
                <Tooltip title={Tables.LanguageElementData[character.weak[1]]['name']}>
                  <img
                    src={`${import.meta.env.BASE_URL}icons/${Tables.LanguageElementData[character.weak[1]]['icon']}_S.png`}
                    alt={`${Tables.LanguageElementData[character.weak[1]]['name']} icon`}
                    className="h-16 align-middle"
                  />
                </Tooltip>
              </div>

              <div className="col-span-2">
                <img src={`${import.meta.env.BASE_URL}icons/Icon_Pow_64.png`} />
                <span>{getDollStats(character.id)[currentLevel + currentRange / 10 - 3][1]}</span>
              </div>
              <div className="col-span-2">
                <img src={`${import.meta.env.BASE_URL}icons/Icon_Armor_64.png`} />
                <span>{getDollStats(character.id)[currentLevel + currentRange / 10 - 3][2]}</span>
              </div>
              <div className="col-span-2">
                <img src={`${import.meta.env.BASE_URL}icons/Icon_Hp_64.png`} />
                <span>{getDollStats(character.id)[currentLevel + currentRange / 10 - 3][3]}</span>
              </div>
              <LevelSlider 
                currentLevel={currentLevel}
                currentRange={currentRange}
                onLevelChange={setCurrentLevel}
                onRangeChange={setCurrentRange}
              />
            </div>

            {/* Skills Info */}
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                {skillTypes.map((skillType) => (
                  <ToggleButton
                    key={skillType.id}
                    selected={currentSkillType === skillType.id}
                    onClick={() => handleSkillTypeChange(skillType.id)}
                  >
                    {skillType.name}
                  </ToggleButton>
                ))}
              </div>

              {currentSkillType && getLevels(currentSkillType).length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {getLevels(currentSkillType).map((level) => (
                    <ToggleButton
                      key={level}
                      selected={currentSkillLevel === level}
                      onClick={() => handleSkillLevelChange(level)}
                    >
                      {level}
                    </ToggleButton>
                  ))}
                </div>
              )}

              <SkillCard skill={currentSkill} />
            </div>
          </div>
        </div>

        {/* Character Image */}
        <div className="col-span-6">
          <div className="p-4">
            {character.skins.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {skinData.map((skin) => (
                  <ToggleButton
                    key={skin.id}
                    selected={currentSkin.id === skin.id}
                    onClick={() => handleSkinChange(skin.id)}
                    className="normal-case"
                  >
                    {skin.name}
                  </ToggleButton>
                ))}
              </div>
            )}
            <img
              src={displayedImage}
              alt={character.name}
              className="w-full object-contain max-h-[80vh]"
            />
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default CharacterOverlay;
