import RichText from '../components/RichText';
import { TableLoader, Tables } from '../data/TableLoader';
import SkillIcon from '../components/SkillIcon';

await TableLoader.load(['BattleSkillDisplayData']);

const skills = [6892101, 6892201, 6892301, 6892401, 6892001, 6246901];
const vine = [6892303, 6892304];

const EnemyGrid: React.FC = () => {
  return (
    <div className="bg-background-paper shadow-md p-6 mb-8">
      <span className="text-lg font-bold">Nemertea</span>
      {skills.map((skillId) => (
        <div className="grid grid-cols-12 mb-4 p-4 border border-slate-700">
          <div key={skillId} className="col-span-1">
            <SkillIcon skill={Tables.BattleSkillDisplayData[skillId].icon} className="h-16 w-16" />
          </div>
          <div>{skillId > 6892001 ? 'Active' : 'Passive'}</div>
          <div className="col-span-2">
            <RichText content={Tables.BattleSkillDisplayData[skillId].name} />
          </div>
          <div className="col-span-8">
            <RichText
              content={Tables.BattleSkillDisplayData[skillId].description}
              descriptionTips={Tables.BattleSkillDisplayData[skillId].descriptionTips}
            />
          </div>
        </div>
      ))}
      <span className="text-lg font-bold">Flesh Vine</span>
      {vine.map((skillId) => (
        <div className="grid grid-cols-12 mb-4 p-4 border border-slate-700">
          <div key={skillId} className="col-span-1">
            <SkillIcon skill={Tables.BattleSkillDisplayData[skillId].icon} className="h-16 w-16" />
          </div>
          <div>{skillId > 6892001 ? 'Active' : 'Passive'}</div>
          <div className="col-span-2">
            <RichText content={Tables.BattleSkillDisplayData[skillId].name} />
          </div>
          <div className="col-span-8">
            <RichText
              content={Tables.BattleSkillDisplayData[skillId].description}
              descriptionTips={Tables.BattleSkillDisplayData[skillId].descriptionTips}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnemyGrid;
