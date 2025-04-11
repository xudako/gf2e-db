import React, { useState, useEffect } from 'react';
import { Chr, Skill, Skin } from '../types';
import { loadDollSkill, getDollStats, getTalents } from '../utils/utils';
import SkillCard from '../components/SkillCard';
import Tables from '../data/TableLoader';
import ToggleButton from '../components/ToggleButton';
import Tooltip from '../components/Tooltip';
import Slide from '../components/Slide';
import LevelSlider from '../components/ChrLevelSlider';
import TalentTree from '../components/TalentTree';
import StatDisplay from '../components/StatDisplay';
import { useNavigate } from 'react-router-dom';

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
  [level: string]: Skill | null;
}

interface SkillTree {
  [sType: string]: SkillsByLevel;
}

interface CharacterOverlayProps {
  open: boolean;
  onClose: () => void;
  character?: Chr;
}

const CharacterOverlay: React.FC<CharacterOverlayProps> = ({
  open,
  onClose,
  character,
}): JSX.Element => {
  if (!character) {
    return <div className="text-2xl text-center">404</div>;
  }
  const navigate = useNavigate();

  // Skins
  const skinData = character.skins
    .map(skinId => Tables.ClothesData[skinId])
    .filter(skin => skin !== undefined);

  if (skinData.length === 0) {
    skinData.push({ id: 0, name: 'Base', code: character.code });
  }

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

  const skillIds = vertebraeIds.map((vertId) => {
    const gunGradeData = Tables.GunGradeData[vertId];
    return gunGradeData ? gunGradeData.abbr : null;
  }).filter(Boolean);

  const allSkills: SkillTree = {};

  const skillsToProcess = [character.skillNormalAttack].concat(skillIds.flat()).filter(Boolean);

  skillsToProcess.forEach((id) => {
    if (!id) return;
    
    const idString = id.toString();
    if (idString.length < 8) return;
    
    const type = idString.substring(4, 6);
    const level = idString.substring(6, 8);

    if (!allSkills[type]) {
      allSkills[type] = {};
    }

    const skill = loadDollSkill(id, character);
    if (skill) {
      allSkills[type][level] = skill;
    }
  });

  if (Object.keys(allSkills).length === 0) {
    const defaultType = '01' as SkillTypeId;
    allSkills[defaultType] = { '01': null };
  }

  const [currentSkillType, setCurrentSkillType] = useState<SkillTypeId>(
    (Object.keys(allSkills)[0] as SkillTypeId) || ('01' as SkillTypeId)
  );

  const [currentSkillLevels, setCurrentSkillLevels] = useState<Map<SkillTypeId, string>>(
    new Map(skillTypes.map((type) => [type.id, '01']))
  );
  const [currentSkillLevel, setCurrentSkillLevel] = useState<string>('01');
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(
    (allSkills[currentSkillType] && allSkills[currentSkillType]['01']) || null
  );

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
    ) {
      setCurrentSkill(allSkills[currentSkillType][level]);
    } else {
      setCurrentSkill(null);
    }
  }, [currentSkillType, currentSkillLevels]);

  const handleSkillTypeChange = (newSkillTypeId: SkillTypeId) => {
    if (allSkills[newSkillTypeId]) {
      setCurrentSkillType(newSkillTypeId);
    }
  };

  const getSkillLevels = (skillType: string): string[] => {
    return allSkills[skillType] ? Object.keys(allSkills[skillType]).sort() : [];
  };

  const handleSkillLevelChange = (newLevel: string) => {
    if (allSkills[currentSkillType] && allSkills[currentSkillType][newLevel] !== undefined) {
      setCurrentSkillLevel(newLevel);
    }
  };

  // Stats
  const [currentLevel, setCurrentLevel] = useState(60);
  const [currentRange, setCurrentRange] = useState(60);

  const levelStats = getDollStats(character.id);

  const talents = getTalents(character.id);

  const sig = Tables.GunWeaponData[Tables.GunData[character?.id]?.weaponPrivate] || '';

  return (
    <Slide
      in={open}
      direction="up"
      mountOnEnter
      unmountOnExit
      className="p-8"
      containerClassName="fixed inset-0 bg-background-overlay z-50"
    >
      <div className="max-h-[calc(100vh-2rem)] overflow-auto">
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

                {levelStats[0][0] > 0 && (
                  <div className="grid grid-cols-6 gap-2 col-span-6">
                    <StatDisplay
                      img="Icon_Pow_64"
                      stat={levelStats[currentLevel + currentRange / 10 - 3][1]}
                    />
                    <StatDisplay
                      img="Icon_Armor_64"
                      stat={levelStats[currentLevel + currentRange / 10 - 3][2]}
                    />
                    <StatDisplay
                      img="Icon_Hp_64"
                      stat={levelStats[currentLevel + currentRange / 10 - 3][3]}
                    />
                    <StatDisplay
                      img="Icon_Will_64"
                      stat={
                        Tables.PropertyData[Tables.GunData[character.id].propertyId]['maxWillValue']
                      }
                    />
                    <StatDisplay
                      img="Icon_Max_Ap_64"
                      stat={Tables.PropertyData[Tables.GunData[character.id].propertyId]['maxAp'] / 100}
                    />
                    <div className="col-span-1"></div></div>)}
                    {levelStats[0][0] > 0 && (<div className="col-span-6">
                    <LevelSlider
                      currentLevel={currentLevel}
                      currentRange={currentRange}
                      onLevelChange={setCurrentLevel}
                      onRangeChange={setCurrentRange}
                    />
                  </div>)}
              </div>

              {/* Skills Info */}
              {currentSkill && <div className="mt-4 space-y-4">
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

                {currentSkillType && getSkillLevels(currentSkillType).length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {getSkillLevels(currentSkillType).map((level) => (
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
              </div>}

              {/* Talents Info */}
              <div className="mt-4 space-y-4">
                {talents[0].length > 0 && <TalentTree talents={talents.flat()} />}
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

            {/* Weapon Info */}
            {sig && (
              <div className="mt-4 space-y-4">
                <img
                  src={`${import.meta.env.BASE_URL}weapons/${sig.resCode}_1024.png`}
                  alt="Signature weapon"
                  onClick={() =>
                    navigate(`/weapons/${sig.name.toLowerCase().replace(/\s+/g, '-')}`)
                  }
                  className="cursor-pointer hover:opacity-80"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default CharacterOverlay;
