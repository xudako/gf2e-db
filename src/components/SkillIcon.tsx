import { TableLoader, Tables } from '../data/TableLoader';
import { asset } from '../utils/utils';

await TableLoader.load(['LanguageElementData', 'WeaponTagData']);

interface SkillIconProps {
  skill: string;
  element?: number;
  weapon?: number;
  className?: string;
}

const SkillIcon: React.FC<SkillIconProps> = ({
  skill,
  element = 0,
  weapon = 0,
  className = '',
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={asset(`skills/${skill}.png`)}
        alt="Skill Icon"
        className="block w-32 max-w-full bg-skill-bg rounded-lg"
      />
      {element > 0 && (
        <img
          src={asset(`icons/${Tables.LanguageElementData[element].icon}_Weakpoint.png`)}
          alt="Element Icon"
          className="w-[52px] absolute -bottom-1.5 -left-1.5"
        />
      )}
      {weapon > 0 && (
        <img
          src={asset(`icons/${Tables.WeaponTagData[weapon].icon}_Weakpoint.png`)}
          alt="Weapon Icon"
          className="w-[52px] absolute -top-1.5 -left-1.5"
        />
      )}
    </div>
  );
};

export default SkillIcon;
