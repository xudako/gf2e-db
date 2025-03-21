import { Skill } from "../types";
import SkillGrid from "./SkillGrid";
import RichText from "./RichText";
import SkillIcon from "./SkillIcon";

const SkillCard = ({ skill }: { skill: Skill }) => {
  if (!skill) return;
  const stabExists = skill.result
    .split(";")
    .find((element) => element[0] === "2");
  const stability = stabExists ? stabExists[2] : 0;

  function processInput(input: string) {
    const parts = input.split(",").map(Number);
    return parts.map((val) => (val % 100 ? val : val / 100));
  }
  const gridRange = processInput(skill.range);
  const gridShape = processInput(skill.shapeParam);
  let dispRange;
  switch (skill.skillRange) {
    case 1:
      dispRange = "Self";
      break;
    case 2:
      dispRange = `${gridRange[0]} × ${gridRange[0]}`;
      break;
    case 3:
      dispRange = gridRange[0];
      break;
    case 7:
      dispRange = "--";
      break;
    case 8:
      dispRange = "Map";
      break;
  }
  let dispShape;
  switch (skill.shape) {
    case 1:
      dispShape = "Target";
      break;
    case 2:
      dispShape = `${gridShape[0]} × ${gridShape[0]}`;
      break;
    case 3:
      dispShape = gridShape[0];
      break;
    case 7:
      dispShape = "--";
      break;
    case 8:
      dispShape = "Map";
      break;
  }

  return (
    <div className="p-12 rounded-lg bg-background-paper flex flex-col gap-8 w-full">
      <div className="grid grid-cols-4 gap-8">
        {/* Left Section: Image, Name, and Tags */}
        <div className="text-center">
          <h5 className="text-secondary text-lg font-medium">
            {skill.name}
          </h5>
          <SkillIcon
            skill={skill.icon}
            element={skill.elementTag}
            weapon={skill.weaponTag}
          />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {skill.skillTag.split("/").map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-skill-bg text-white text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Stability/Cost/Cooldown Info */}
          <div className="flex justify-around mt-8">
            <p>{`Stability: ${stability}`}</p>
            <p>{`Cost: ${skill.potentialCost}`}</p>
            <p>{`Cooldown: ${skill.cdTime}`}</p>
          </div>
        </div>

        {/* Center Section: Description & Upgrade Buttons */}
        <div className="text-center col-span-2">
          <div className="mt-8">
            <RichText
              content={skill.description}
              descriptionTips={skill.descriptionTips}
            />
          </div>
        </div>

        {/* Right Section: Range, Target & Indicators */}
        <div className="text-center">
          {/* Visual Indicator Placeholder */}
          <SkillGrid
            range={skill.range}
            shape={skill.shape}
            shapeParam={skill.shapeParam}
            skillRange={skill.skillRange}
          />
          <div className="flex justify-between">
            <p className="mt-8">Range</p>
            <p className="mt-8 text-right">
              {dispRange}
            </p>
          </div>
          <hr className="border-b-[5px] border-grid-bg my-2" />
          <div className="flex justify-between">
            <p className="mt-8">Area of Effect</p>
            <p className="mt-8">{dispShape}</p>
          </div>
          <hr className="border-b-[5px] border-grid-bg my-2" />
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
