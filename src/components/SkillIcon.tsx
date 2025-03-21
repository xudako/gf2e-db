import Tables from "../data/TableLoader";

interface SkillIconProps {
  skill: string;
  element: number;
  weapon: number;
}

const SkillIcon: React.FC<SkillIconProps> = ({ skill, element, weapon }) => {
  return (
    <div className="relative inline-block mt-8">
      <img
        src={`${import.meta.env.BASE_URL}skills/${skill}.png`}
        alt="Skill Icon"
        className="block w-32 max-w-full bg-skill-bg rounded-lg"
      />
      {element > 0 && (
        <img
          src={`${import.meta.env.BASE_URL}icons/${
            Tables.LanguageElementData[element].icon
          }_Weakpoint.png`}
          alt="Element Icon"
          className="w-[52px] absolute -bottom-1.5 -left-1.5"
        />
      )}
      {weapon > 0 && (
        <img
          src={`${import.meta.env.BASE_URL}icons/${
            Tables.WeaponTagData[weapon].icon
          }_Weakpoint.png`}
          alt="Weapon Icon"
          className="w-[52px] absolute -top-1.5 -left-1.5"
        />
      )}
    </div>
  );
};

export default SkillIcon;