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

const attrs = ['pow', 'shieldArmor', 'maxHp', 'powPercent', 'shieldArmorPercent', 'maxHpPercent', 'crit', 'critMult'];

export const loadDollSkill = (skillId: number, character: Chr) => {
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

export function getDollStats(dollId: number): number[][] {
  const doll = Tables.GunData[dollId];

  const group = Tables.GunClassByGunClassGroupIdData[doll.gunClass];
  let classes = group.id.map((cid: number) => Tables.GunClassData[cid]);

  const baseProp = Tables.PropertyData[doll.propertyId];
  
  let breakStats = [0, 0, 0];
  let stats = null;
  const attrs = ['pow', 'shieldArmor', 'maxHp'];
  const finalStats = [];
  
  for (let level = 1; level <= 60; level++) {
    const propId = Tables.GunLevelExpData[level].propertyId;
    const levelProp = Tables.PropertyData[propId];
    stats = [...breakStats];
    
    for (let i = 0; i < attrs.length; i++) {
      stats[i] += Math.ceil(baseProp[attrs[i]] * levelProp[attrs[i]] / 1000);
    }
    
    finalStats.push([level, ...stats]);
    
    if (level === classes[0].gunLevelMax) {
      classes = classes.slice(1);
      if (classes.length) {
        const breakProp = Tables.PropertyData[classes[0].propertyId];
        for (let i = 0; i < attrs.length; i++) {
          breakStats[i] += breakProp[attrs[i]];
          stats[i] += breakProp[attrs[i]];
        }
        finalStats.push([level, ...stats]);
      }
    }
  }
  
  return finalStats;
}

function buildTalent(keyId: number | null = null, propId: number | null = null): Record<string, any> {
  const talent: Record<string, any> = {};
  
  if (keyId) {
    const key = Tables.TalentKeyData[keyId];
    talent['name'] = key['keyName'];
    talent['icon'] = Tables.ItemData[keyId]['icon'];
    const skillId = key['battleSkillId'];
    
    if (skillId) {
      talent['desc'] = Tables.BattleSkillDisplayData[skillId]['description'];
    }
    
    if (!propId && key['propertyId']) {
      propId = key['propertyId'];
    }
  }
  
  if (propId) {
    const stats = { ...Tables.PropertyData[propId] };
    delete stats.id;
    
    const orderedStats: Record<string, any> = {};
    for (const k in attrs) {
      const v = stats[k];
      delete stats[k];
      
      if (v) {
        orderedStats[k] = v;
      }
    }
    
    // Assert equivalent in TypeScript - check that no values remain in stats
    console.assert(Object.values(stats).every(v => !v), stats);
    
    talent['stats'] = orderedStats;
  }
  
  return talent;
}

export function getTalents(dollId: number): [Array<Record<string, any>>, Array<Record<string, any>>, Record<string, any>] {
  const talentsData = Tables.SquadTalentGunData[dollId];
  const treeIds = talentsData['traverseSquadTalentTreeId'].map(Number);
  const treeData = treeIds.map((tid: number) => Tables.SquadTalentTreeData[tid]);
  
  let nodeIds: number[] = [];
  for (const nodeData of treeData) {
    nodeIds = nodeIds.concat(nodeData['openPoijnt'].map(Number));
  }
  
  const nodes = nodeIds.map(nid => Tables.SquadTalentGroupData[nid.toString()]);
  const statNodes: Array<Record<string, any>> = [];
  const skillNodes: Array<Record<string, any>> = [];
  
  for (const node of nodes) {
    const geneId = parseInt(node['traverseTalentEffectGeneGroup'][0]);
    if (!(geneId in Tables.GroupTalentEffectGeneData)) {
      continue;
    }
    
    const gene = Tables.GroupTalentEffectGeneData[geneId];
    if (gene['itemId']) {
      const talent = buildTalent(gene['itemId'], null);
      skillNodes.push(talent);
    } else {
      const talent = buildTalent(null, gene['propertyId']);
      statNodes.push(talent);
    }
  }
  
  const finalNode = buildTalent(talentsData['fullyActiveItemId'], null);
  return [statNodes, skillNodes, finalNode];
}