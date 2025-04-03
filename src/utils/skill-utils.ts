import { Chr } from '../types';
import Tables from '../data/TableLoader';

const ammoType = new Map([
  [1, 2],
  [2, 2],
  [3, 8],
  [4, 4],
  [5, 8],
  [6, 32],
  [7, 16],
]);

export const loadChrSkill = (skillId: number, character: Chr) => {
  const [data, display] = [Tables.BattleSkillData[skillId], Tables.BattleSkillDisplayData[skillId]];
  if (!data || !display) throw new Error(`Skill with ID ${skillId} not found`);
  return {
    ...data,
    ...display,
    range: display.rangeDisplayParam || data.skillRangeParam,
    shape: display.shapeDisplay || data.shape,
    shapeParam: display.shapeDisplayParam || data.shapeParam,
    weaponTag: data.weaponTag === 1 ? ammoType.get(character.weaponType) : data.weaponTag,
  };
};

export const loadSkill = (skillId: number) => {
  const display = Tables.BattleSkillDisplayData[skillId];
  if (!display) throw new Error(`Skill with ID ${skillId} not found`);
  return {
    ...display,
  };
};
