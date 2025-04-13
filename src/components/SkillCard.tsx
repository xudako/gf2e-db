import { Skill } from '../types';
import SkillGrid from './SkillGrid';
import RichText from './RichText';
import SkillIcon from './SkillIcon';
import Tables from '../data/TableLoader';
import { asset } from '../utils/utils';

const SkillCard = ({ skill }: { skill: Skill }) => {
  if (!skill) return;
  const stabExists = skill.result.split(';').find((element) => element[0] === '2');
  const stability = stabExists ? stabExists[2] : 0;

  function processInput(input: string) {
    const parts = input.split(',').map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  }
  const gridRange = processInput(skill.range);
  const gridShape = processInput(skill.shapeParam);
  let dispRange;
  switch (skill.skillRange) {
    case 1:
      dispRange = 'Self';
      break;
    case 2:
      dispRange = `${gridRange[0]} × ${gridRange[0]}`;
      break;
    case 3:
      dispRange = gridRange[0];
      break;
    case 7:
      dispRange = '--';
      break;
    case 8:
      dispRange = 'Map';
      break;
  }
  let dispShape;
  switch (skill.shape) {
    case 1:
      dispShape = 'Target';
      break;
    case 2:
      dispShape = `${gridShape[0]} × ${gridShape[0]}`;
      break;
    case 3:
      dispShape = gridShape[0];
      break;
    case 7:
      dispShape = '--';
      break;
    case 8:
      dispShape = 'Map';
      break;
  }

  return (
    <div className="p-6 rounded-lg bg-background-paper w-full">
      <div className="grid sm:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
        {/* Top row: Icon, Name/Tags, Element/Weapon */}
        <div className="sm:col-span-2 lg:col-span-1 self-start">
          {/* Icon aligned with name */}
          <SkillIcon skill={skill.icon} className="h-16 w-16" />
        </div>

        <div className="sm:col-span-3 lg:col-span-8 mx-4">
          {/* Name and Tags */}
          <h5 className="text-secondary text-xl font-bold">{skill.name}</h5>
          <div className="flex flex-wrap gap-2 mt-2 text-gray-500">{skill.skillTag}</div>
        </div>

        {/* Element/Weapon icons */}
        <div className="sm:col-span-1 lg:col-span-3 flex items-end sm:justify-end">
          <div className="flex items-center">
            {skill.weaponTag > 0 && (
              <div className="flex items-center ml-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-element-bg">
                  <img
                    src={asset(`icons/${Tables.WeaponTagData[skill.weaponTag].icon}_Weakpoint.png`)}
                    alt="Weapon Icon"
                    className="w-6 h-6"
                  />
                </div>
                <p className="-ml-2 whitespace-nowrap">
                  {Tables.WeaponTagData[skill.weaponTag].name}
                </p>
              </div>
            )}
            {skill.elementTag > 0 && (
              <div className="flex items-center ml-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-element-bg">
                  <img
                    src={asset(`icons/${Tables.LanguageElementData[skill.elementTag].icon}_Weakpoint.png`)}
                    alt="Element Icon"
                    className="w-6 h-6"
                  />
                </div>
                <p className="-ml-2 whitespace-nowrap">
                  {Tables.LanguageElementData[skill.elementTag].name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Middle row: Description */}
        <div className="sm:col-span-5 lg:col-span-9">
          {(stability as number) > 0 && (
            <p className="mb-2 text-secondary-main font-bold">{`Stability Damage: ${stability}`}</p>
          )}
          <RichText content={skill.description} descriptionTips={skill.descriptionTips} />
        </div>

        {/* Grid area */}
        <div className="sm:col-span-1 lg:col-span-3">
          <SkillGrid
            id={skill.id}
            range={skill.range}
            shape={skill.shape}
            shapeParam={skill.shapeParam}
            skillRange={skill.skillRange}
          />
        </div>
        {/* Cooldown/Cost */}
        <div className="sm:col-span-5 lg:col-span-9">
          <div className="flex gap-2 mt-4 items-end">
            {skill.cdTime > 0 && (
              <div className="bg-gray-500 text-primary-text px-2 py-1 rounded inline-flex items-center justify-between w-40">
                <div className="flex items-center gap-1">
                  <img
                    className="h-[1em] w-auto"
                    src={asset('icons/Icon_CD.png')}
                    alt="Cooldown"
                  />
                  <span>Cooldown</span>
                </div>
                <span>{skill.cdTime}</span>
              </div>
            )}
            {skill.potentialCost > 0 && (
              <div className="bg-gray-500 text-primary-text px-2 py-1 rounded inline-flex items-center justify-between w-40">
                <div className="flex items-center gap-1">
                  <img
                    className="h-[1em] w-auto"
                    src={asset('icons/Icon_Combat_Consume.png')}
                    alt="Cost"
                  />
                  <span>Confectance</span>
                </div>
                <span>{skill.potentialCost}</span>
              </div>
            )}
          </div>
        </div>
        <div className="sm:col-span-1 lg:col-span-3">
          <div className="flex justify-between mt-2">
            <p>Range</p>
            <p>{dispRange}</p>
          </div>
          <hr className="border-b-2 border-grid-bg my-1" />
          <div className="flex justify-between">
            <p>Area of Effect</p>
            <p>{dispShape}</p>
          </div>
          <hr className="border-b-2 border-grid-bg my-1" />
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
