import React, { useState, useEffect } from 'react';
import { Skill, Wpn, Chr } from '../types';
import { asset } from '../utils/utils';
import { getWeaponStats, loadSkill } from '../utils/wpn-utils';
import Slide from '../components/Slide';
import ToggleButton from '../components/ToggleButton';
import RichText from '../components/RichText';
import Tables from '../data/TableLoader';
import StatDisplay from '../components/StatDisplay';
import Tooltip from '../components/Tooltip';
import { useNavigate } from 'react-router-dom';
import { characters } from '../data/data';

const statIcon: Record<string, string> = {
  powPercent: 'Pow_64',
  crit: 'Crit_64',
  critMult: 'Mult_64',
  potentialDam: 'potential_dam',
};

interface WeaponOverlayProps {
  open: boolean;
  onClose: () => void;
  weapon?: Wpn;
}

const WeaponOverlay: React.FC<WeaponOverlayProps> = ({ open, onClose, weapon }) => {
  if (!weapon) {
    return <div className="text-2xl text-center">404</div>;
  }
  const navigate = useNavigate();

  const trait = weapon.trait ? loadSkill(weapon.trait) : undefined;
  const imprint = weapon.imprint ? loadSkill(weapon.imprint) : undefined;
  const [currentSkillLevel, setCurrentSkillLevel] = useState<number>(1);
  const [currentSkill, setCurrentSkill] = useState<Skill>(loadSkill(weapon.skill));

  useEffect(() => {
    setCurrentSkill(loadSkill(weapon.skill + currentSkillLevel - 1));
  }, [currentSkillLevel]);

  const handleSkillLevelChange = (newLevel: number) => {
    setCurrentSkillLevel(newLevel);
  };

  const stats = getWeaponStats(weapon.id);
  const code =
    Tables.GunWeaponData[weapon.id].resPath.match(/(?<=Player\/)(.*?)(?=SSR|SR|R)/)?.[0] || 'null';
  const imprintDoll: Chr | undefined = characters.find((chr: Chr) => chr.code.startsWith(code));

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
        <div className="col-span-6">
          <div className="p-4">
            <h1
              className={`text-4xl
                ${weapon.rank === 5 ? 'text-rarity-ssr' : weapon.rank === 4 ? 'text-rarity-sr' : 'text-rarity-r'}`}
            >
              {weapon.name}
            </h1>
          </div>

          <div className="mt-4 p-6 grid grid-cols-6 gap-4 text-primary-text">
            <StatDisplay img="Icon_Pow_64" stat={stats.pow} />
            {weapon.rank === 5 && (
              <StatDisplay
                img={`Icon_${statIcon[Object.keys(stats)[1]]}`}
                stat={`${Object.values(stats)[1] / 10}.0%`}
              />
            )}
            <div></div>
            <div className="col-span-2">
                  <Tooltip title={Tables.GunWeaponTypeData[weapon.type]['name']}>
                    <img
                      src={asset(
                        `icons/${Tables.GunWeaponTypeData[weapon.type]['skinIcon']}.png`
                      )}
                      alt={`${Tables.GunWeaponTypeData[weapon.type]['name']} icon`}
                      className="h-16 align-middle"
                    />
                  </Tooltip>
                </div>
            <div className="mt-4 space-y-4 col-span-1 col-start-6 justify-self-end">
              {imprintDoll && (
                <div>
                  <img
                    src={asset(`dolls/Avatar_Bust_${imprintDoll?.code}.png`)}
                    alt="Imprinted doll"
                    onClick={() =>
                      navigate(`/dolls/${imprintDoll?.name.toLowerCase().replace(/\s+/g, '-')}`)
                    }
                    className="cursor-pointer hover:opacity-80"
                  />
                </div>
              )}
            </div>
          </div>

          {(trait || imprint) && (
            <div className="mt-8 p-12 rounded-lg bg-background-paper flex flex-col gap-8 w-full">
              {trait && (
                <RichText
                  content={`Trait: ${trait.description}`}
                  descriptionTips={trait.descriptionTips}
                />
              )}
              {imprint && (
                <RichText
                  content={`${imprint.name}: ${imprint.description}`}
                  descriptionTips={imprint.descriptionTips}
                />
              )}
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((skillLevel) => (
                <ToggleButton
                  key={skillLevel}
                  selected={currentSkillLevel === skillLevel}
                  onClick={() => handleSkillLevelChange(skillLevel)}
                >
                  {skillLevel}
                </ToggleButton>
              ))}
            </div>
          </div>
          <div className="mt-4 p-12 rounded-lg bg-background-paper flex flex-col gap-8 w-full">
            <RichText
              content={`${currentSkill.name}: ${currentSkill.description}`}
              descriptionTips={currentSkill.descriptionTips}
            />
          </div>
        </div>

        <div className="col-span-6">
          <div className="p-4">
            <img
              src={asset(`weapons/${weapon.resCode}_1024.png`)}
              alt={weapon.name}
              className="w-full object-contain max-h-[80vh]"
            />
          </div>
        </div>
      </div>
    </Slide>
  );
};

export default WeaponOverlay;
