import React, { useState, useEffect } from 'react';
import { Chr, Skill, Skin } from '../types';
import { asset } from '../utils/utils';
import {
  loadDollSkill,
  getDollStats,
  getAffectStats,
  getTalents,
  getNeuralStats,
} from '../utils/doll-utils';
import { formatWeaponUrl } from '../utils/wpn-utils';
import SkillCard from '../components/SkillCard';
import { TableLoader, Tables } from '../data/TableLoader';
import ToggleButtonGroup from '../components/ToggleButtonGroup';
import ToggleButton from '../components/ToggleButton';
import Tooltip from '../components/Tooltip';
import Slide from '../components/Slide';
import LevelSlider from '../components/ChrLevelSlider';
import TalentTree from '../components/TalentTree';
import StatDisplay from '../components/StatDisplay';
import RichText from '../components/RichText';
import { oath } from '../data/data';
import { Link, useLocation } from 'react-router-dom';

await TableLoader.load([
  'ClothesData',
  'GunGradeData',
  'GunWeaponData',
  'GunData',
  'GunCharacterData',
  'LanguageElementData',
  'GunDutyData',
  'GunWeaponTypeData',
  'WeaponTagData',
  'PropData',
]);

interface CharacterOverlayProps {
  open: boolean;
  character?: Chr;
}

type SkillTypeId = 1 | 5 | 7 | 4 | 8;

interface SkillType {
  id: SkillTypeId;
  name: string;
}

const CharacterOverlay: React.FC<CharacterOverlayProps> = ({ open, character }): JSX.Element => {
  if (!character) {
    return <div className="text-2xl text-center">404</div>;
  }

  const location = useLocation();

  // Accent Color
  const accent =
    Tables.GunCharacterData[character.characterId] &&
    Tables.GunCharacterData[character.characterId]['color']
      ? `#${Tables.GunCharacterData[character.characterId]['color'].slice(0, -2)}`
      : `#${Tables.LanguageElementData[character.element]['color'].slice(0, -2)}`;

  // Skins
  const skinData = character.skins
    .map((skinId) => Tables.ClothesData[skinId])
    .filter((skin) => skin !== undefined);

  if (skinData.length === 0) {
    skinData.push({ id: 0, name: 'Base', code: character.code });
  }

  const [currentSkin, setCurrentSkin] = useState<Skin>(skinData[0]);
  const displayedImage = asset(`dolls/Avatar_Whole_${currentSkin.code}.png`);

  const handleSkinChange = (newSkinId: number) => {
    const newSkin = skinData.find((skin) => skin.id === newSkinId);
    if (newSkin) {
      setCurrentSkin(newSkin);
    }
  };

  // Skills

  const skillTypes: SkillType[] = [
    { id: 1, name: 'Basic' },
    { id: 5, name: 'Skill 1' },
    { id: 7, name: 'Skill 2' },
    { id: 4, name: 'Ultimate' },
    { id: 8, name: 'Passive' },
  ];
  if (character.id === 1027) {
    const ult = skillTypes.find((skill) => skill.name === 'Ultimate');
    if (ult) {
      ult.name = 'Imada';
    }
  }

  const vertebraeIds = [...Array.from({ length: 7 }, (_, i) => i + 1)].map(
    (x) => character.id * 100 + x
  );

  const skillIds = vertebraeIds
    .map((vertId) => {
      const gunGradeData = Tables.GunGradeData[vertId];
      return gunGradeData ? gunGradeData.abbr : null;
    })
    .filter(Boolean);

  const allSkillIds = [character.skillNormalAttack].concat(skillIds.flat()).filter(Boolean);
  const initialSkillLevels = new Map<SkillTypeId, number>();
  skillTypes.forEach((type) => {
    if (
      allSkillIds.filter((id) =>
        id.toString().startsWith((character.id * 100 + type.id).toString())
      ).length > 0
    ) {
      initialSkillLevels.set(type.id, 1);
    }
  });

  const [currentSkillType, setCurrentSkillType] = useState<SkillTypeId>(1);
  const [skillLevelMemory, setSkillLevelMemory] =
    useState<Map<SkillTypeId, number>>(initialSkillLevels);
  const [currentSkillLevel, setCurrentSkillLevel] = useState<number>(
    skillLevelMemory.get(currentSkillType) || 1
  );
  const [currentSkill, setCurrentSkill] = useState<Skill>(
    loadDollSkill(character.id * 10000 + currentSkillType * 100 + currentSkillLevel, character)
  );

  useEffect(() => {
    setCurrentSkill(
      loadDollSkill(character.id * 10000 + currentSkillType * 100 + currentSkillLevel, character)
    );
  }, [currentSkillType, currentSkillLevel]);

  const getSkillLevels = (skillType: SkillTypeId): number[] => {
    return allSkillIds
      .filter((id) => id.toString().startsWith((character.id * 100 + skillType).toString()))
      .map((id) => id % 10);
  };

  const handleSkillTypeChange = (newSkillTypeId: SkillTypeId) => {
    if (getSkillLevels(newSkillTypeId).length > 0) {
      setCurrentSkillType(newSkillTypeId);
      const rememberedLevel = skillLevelMemory.get(newSkillTypeId);
      if (rememberedLevel && getSkillLevels(newSkillTypeId).includes(rememberedLevel)) {
        setCurrentSkillLevel(rememberedLevel);
      } else {
        const firstLevel = getSkillLevels(newSkillTypeId)[0];
        if (firstLevel) {
          setCurrentSkillLevel(firstLevel);
          setSkillLevelMemory((prev) => new Map(prev).set(newSkillTypeId, firstLevel));
        }
      }
    }
  };

  const handleSkillLevelChange = (newLevel: number) => {
    if (getSkillLevels(currentSkillType).includes(newLevel)) {
      setCurrentSkillLevel(newLevel);
      setSkillLevelMemory((prev) => new Map(prev).set(currentSkillType, newLevel));
    }
  };

  // Stats
  const [currentLevel, setCurrentLevel] = useState(60);
  const [currentRange, setCurrentRange] = useState(60);
  const [currentAffect, setCurrentAffect] = useState(1);
  const [currentNeural, setCurrentNeural] = useState(0);

  const handleAffectChange = (newAffect: number) => {
    setCurrentAffect(newAffect);
  };

  const handleNeuralChange = (newNeural: number) => {
    setCurrentNeural(newNeural);
  };

  const levelStats = getDollStats(character.id);
  const affectStats = getAffectStats(character.id);

  // Talents (Neural Helix)
  const talents = getTalents(character.id);
  const neuralStats = getNeuralStats(talents[0]);

  useEffect(() => {
    if (affectStats.length > 1) {
      setCurrentAffect(5);
    }
    if (neuralStats.length > 1) {
      setCurrentNeural(6);
    }
  }, []);

  // Sig
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
        <Link
          to="/dolls"
          state={location.state}
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
        </Link>

        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4">
          {/* Character Info */}
          <div className="col-span-8">
            <div className="p-4">
              <h1
                className="text-4xl flex justify-center"
                style={{
                  color: `#${Tables.LanguageElementData[character.element]['color'].slice(0, -2)}`,
                }}
              >
                {character.name}
              </h1>

              {/* Stats Info */}
              <div className="mt-4 p-6 grid grid-cols-3 lg:grid-cols-6 xl:grid-cols-12 gap-4 text-primary-text">
                <div className="col-span-1">
                  <span>Class:</span>
                </div>
                <div className="col-span-2">
                  <Tooltip title={Tables.GunDutyData[character.duty].name}>
                    <img
                      src={asset(`icons/${Tables.GunDutyData[character.duty].icon}_W.png`)}
                      alt={`${Tables.GunDutyData[character.duty].name} icon`}
                      className="h-16 align-middle"
                    />
                  </Tooltip>
                </div>

                <div className="col-span-1">
                  <span>Weapon:</span>
                </div>
                <div className="col-span-2">
                  <Tooltip title={Tables.GunWeaponTypeData[character.weaponType]['name']}>
                    <img
                      src={asset(
                        `icons/${Tables.GunWeaponTypeData[character.weaponType]['skinIcon']}.png`
                      )}
                      alt={`${Tables.GunWeaponTypeData[character.weaponType]['name']} icon`}
                      className="h-16 align-middle"
                    />
                  </Tooltip>
                </div>

                <div className="col-span-1">
                  <span>Element:</span>
                </div>
                <div className="col-span-2">
                  <Tooltip title={Tables.LanguageElementData[character.element]['name']}>
                    <img
                      src={asset(
                        `icons/${Tables.LanguageElementData[character.element]['icon']}_S.png`
                      )}
                      alt={`${Tables.LanguageElementData[character.element]['name']} icon`}
                      className="h-16 align-middle"
                    />
                  </Tooltip>
                </div>

                <div className="col-span-1">
                  <span>Weakness:</span>
                </div>
                {character.weak[0] > 0 && (
                  <div className="col-span-2 flex space-x-2">
                    <Tooltip title={Tables.WeaponTagData[character.weak[0]]['name']}>
                      <img
                        src={asset(
                          `icons/${Tables.WeaponTagData[character.weak[0]]['icon']}_S.png`
                        )}
                        alt={`${Tables.WeaponTagData[character.weak[0]]['name']} icon`}
                        className="h-16 align-middle"
                      />
                    </Tooltip>
                    <Tooltip title={Tables.LanguageElementData[character.weak[1]]['name']}>
                      <img
                        src={asset(
                          `icons/${Tables.LanguageElementData[character.weak[1]]['icon']}_S.png`
                        )}
                        alt={`${Tables.LanguageElementData[character.weak[1]]['name']} icon`}
                        className="h-16 align-middle"
                      />
                    </Tooltip>
                  </div>
                )}

                {levelStats[0][0] > 0 && (
                  <div
                    className="grid grid-cols-5 lg:grid-cols-6 gap-2 col-span-6 border-l border-l-4"
                    style={{ borderColor: accent }}
                  >
                    <StatDisplay
                      img="Icon_Pow_64"
                      stat={
                        levelStats[currentLevel + currentRange / 10 - 3][1] +
                        affectStats[currentAffect - 1][1] +
                        neuralStats[currentNeural][0]
                      }
                    />
                    <StatDisplay
                      img="Icon_Armor_64"
                      stat={
                        levelStats[currentLevel + currentRange / 10 - 3][2] +
                        affectStats[currentAffect - 1][2] +
                        neuralStats[currentNeural][1]
                      }
                    />
                    <StatDisplay
                      img="Icon_Hp_64"
                      stat={
                        levelStats[currentLevel + currentRange / 10 - 3][3] +
                        affectStats[currentAffect - 1][3] +
                        neuralStats[currentNeural][2]
                      }
                    />
                    <StatDisplay
                      img="Icon_Will_64"
                      stat={
                        Tables.PropData[Tables.GunData[character.id].propertyId]['maxWillValue']
                      }
                    />
                    <StatDisplay
                      img="Icon_Max_Ap_64"
                      stat={Tables.PropData[Tables.GunData[character.id].propertyId]['maxAp'] / 100}
                    />
                    <div className="hidden lg:block"></div>
                    <StatDisplay
                      img="Icon_Pow_64"
                      stat={`${neuralStats[currentNeural][3] / 10 + (currentAffect === 6 ? 5 : 0)}.0%`}
                    />
                    <StatDisplay
                      img="Icon_Armor_64"
                      stat={`${neuralStats[currentNeural][4] / 10 + (currentAffect === 6 ? 5 : 0)}.0%`}
                    />
                    <StatDisplay
                      img="Icon_Hp_64"
                      stat={`${neuralStats[currentNeural][5] / 10 + (currentAffect === 6 ? 5 : 0)}.0%`}
                    />
                    <StatDisplay
                      img="Icon_Crit_64"
                      stat={`${neuralStats[currentNeural][6] / 10 + Tables.PropData[Tables.GunData[character.id].propertyId]['crit'] / 10}.0%`}
                    />
                    <StatDisplay
                      img="Icon_Mult_64"
                      stat={`${neuralStats[currentNeural][7] / 10 + Tables.PropData[Tables.GunData[character.id].propertyId]['critMult'] / 10}.0%`}
                    />
                    <div className="hidden lg:block"></div>
                  </div>
                )}
                {levelStats[0][0] > 0 && (
                  <div className="col-span-6 grid grid-cols-6">
                    <div className="col-span-3 lg:col-span-4">
                      <LevelSlider
                        currentLevel={currentLevel}
                        currentRange={currentRange}
                        onLevelChange={setCurrentLevel}
                        onRangeChange={setCurrentRange}
                      />
                    </div>
                    <div className="hidden lg:block"></div>
                    <div className="col-span-3">
                      <span className="ml-6 lg:ml-0">Affection:</span>
                      <ToggleButtonGroup className="mt-2 ml-6 lg:ml-0 mr-6">
                        {affectStats.map((affect) => (
                          <ToggleButton
                            key={affect[0]}
                            selected={currentAffect === affect[0]}
                            onClick={() => handleAffectChange(affect[0])}
                            className={
                              affect[0] === 6 && !oath.includes(character.name)
                                ? 'pointer-events-none select-none opacity-50 cursor-not-allowed'
                                : ''
                            }
                          >
                            {affect[0] === 6 ? 'C' : affect[0]}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </div>
                    <div className="col-span-3 block lg:hidden"></div>
                    <div className="col-span-3">
                      {neuralStats.length > 1 && (
                        <div>
                          <span className="ml-6 lg:ml-0">Neurals:</span>
                          <ToggleButtonGroup className="mt-2 ml-6 lg:ml-0 ">
                            {neuralStats.map((_neural, index) => (
                              <ToggleButton
                                key={index}
                                selected={currentNeural === index}
                                onClick={() => handleNeuralChange(index)}
                              >
                                {index}
                              </ToggleButton>
                            ))}
                          </ToggleButtonGroup>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Info */}
              {currentSkill && (
                <div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
                    <div className="col-span-2">
                      <ToggleButtonGroup>
                        {skillTypes.map((skillType) => (
                          <ToggleButton
                            key={skillType.id}
                            selected={currentSkillType === skillType.id}
                            onClick={() => handleSkillTypeChange(skillType.id)}
                          >
                            {skillType.name}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </div>

                    <div className="col-span-1">
                      {getSkillLevels(currentSkillType).length > 1 && (
                        <ToggleButtonGroup>
                          {getSkillLevels(currentSkillType).map((level) => (
                            <ToggleButton
                              key={level}
                              selected={currentSkillLevel === level}
                              onClick={() => handleSkillLevelChange(level)}
                            >
                              {`Level ${level} ${allSkillIds.slice(-6).indexOf(character.id * 10000 + currentSkillType * 100 + level) + 1 > 0 ? `(V${allSkillIds.slice(-6).indexOf(character.id * 10000 + currentSkillType * 100 + level) + 1})` : ''}`}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      )}
                    </div>
                  </div>
                  <SkillCard skill={currentSkill} />
                  <div className="grid grid-cols-12 grid-rows-12 border border-t-slate-700 overflow-hidden">
                    {allSkillIds.slice(-6).map((id, index) => (
                      <React.Fragment key={index}>
                        <div className="flex items-center justify-center text-center col-span-3 row-span-1 p-4 font-medium bg-background-paper border-r border-b border-r-slate-700">
                          {`Segment ${index + 1}`}
                        </div>
                        <div className="flex items-center justify-center col-span-9 row-span-2 p-4 bg-background-paper border-r border-b border-b-slate-700">
                          <RichText
                            content={Tables.BattleSkillDisplayData[id].upgradeDescription}
                            descriptionTips={Tables.BattleSkillDisplayData[id].descriptionTips}
                          />
                        </div>
                        <div className="flex items-center justify-center text-center col-span-3 row-span-1 p-4 font-medium bg-background-paper border-r border-b border-r-slate-700 border-b-slate-700">
                          {`${Tables.BattleSkillDisplayData[id].name} Lv. ${Tables.BattleSkillDisplayData[id].level}`}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Talents Info */}
              <div className="mt-4 space-y-4">
                {talents[0].length > 0 && <TalentTree talents={talents.flat()} />}
              </div>
            </div>
          </div>

          {/* Character Image */}
          <div className="col-span-8 lg:col-span-4">
            <div className="p-4">
              {skinData.length > 1 && (
                <ToggleButtonGroup className="mt-2 mb-8">
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
                </ToggleButtonGroup>
              )}
              <img
                src={displayedImage}
                alt={character.name}
                className="w-full object-contain max-h-[80vh]"
              />
            </div>

            {/* Weapon Info */}
            {sig && (
              <Link to={`/weapons/${formatWeaponUrl(sig.name)}`} className="mt-4 space-y-4">
                <img
                  src={asset(`weapons/${sig.resCode}_1024.png`)}
                  alt="Signature weapon"
                  className="cursor-pointer hover:opacity-80"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default CharacterOverlay;
