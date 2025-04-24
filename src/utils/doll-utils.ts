import { Chr } from '../types';
import { TableLoader, Tables } from '../data/TableLoader';

await TableLoader.load([
  'PropData',
  'BattleSkillData',
  'BattleSkillDisplayData',
  'GunData',
  'GunClassByGunClassGroupIdData',
  'GunClassData',
  'GunLevelExpData',
  'TalentKeyData',
  'ItemData',
  'SquadTalentGunData',
  'SquadTalentTreeData',
  'SquadTalentGroupData',
  'GroupTalentEffectGeneData',
]);

const ammoType = new Map([
  [1, 2],
  [2, 2],
  [3, 8],
  [4, 4],
  [5, 8],
  [6, 32],
  [7, 16],
]);

const attrs = [
  'pow',
  'shieldArmor',
  'maxHp',
  'powPercent',
  'shieldArmorPercent',
  'maxHpPercent',
  'crit',
  'critMult',
];

export const loadDollSkill = (skillId: number, character: Chr) => {
  const [data, display] = [Tables.BattleSkillData[skillId], Tables.BattleSkillDisplayData[skillId]];
  if (!data || !display) return;
  return {
    ...data,
    ...display,
    range: display.rangeDisplayParam || data.skillRangeParam,
    shape: display.shapeDisplay || data.shape,
    shapeParam: display.shapeDisplayParam || data.shapeParam,
    weaponTag: data.weaponTag === 1 ? ammoType.get(character.weaponType) : data.weaponTag,
  };
};

export function getDollStats(dollId: number): number[][] {
  const doll = Tables.GunData[dollId];

  const group = Tables.GunClassByGunClassGroupIdData[doll.gunClass];
  if (!group) return [[0, 0, 0, 0]];
  let classes = group.id.map((cid: number) => Tables.GunClassData[cid]);

  const baseProp = Tables.PropData[doll.propertyId];

  let breakStats = [0, 0, 0];
  let stats = null;
  const attrs = ['pow', 'shieldArmor', 'maxHp'];
  const finalStats = [];

  for (let level = 1; level <= 60; level++) {
    const propId = Tables.GunLevelExpData[level].propertyId;
    const levelProp = Tables.PropData[propId];
    stats = [...breakStats];

    for (let i = 0; i < attrs.length; i++) {
      stats[i] += Math.ceil((baseProp[attrs[i]] * levelProp[attrs[i]]) / 1000);
    }

    finalStats.push([level, ...stats]);

    if (level === classes[0].gunLevelMax) {
      classes = classes.slice(1);
      if (classes.length) {
        const breakProp = Tables.PropData[classes[0].propertyId];
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

export function getAffectStats(dollId: number): number[][] {
  const affectProps = Array.from({ length: 4 }, (_, i) => 655 * 100000 + dollId * 10 + i + 1);
  let stats = [0, 0, 0];
  const attrs = ['pow', 'shieldArmor', 'maxHp'];
  const finalStats = [[1, ...stats]];
  if (Tables.PropData[affectProps[0]]) {
    for (let affect = 1; affect < 5; affect++) {
      const affectProp = Tables.PropData[affectProps[affect - 1]];
      for (let i = 0; i < attrs.length; i++) {
        stats[i] += affectProp[attrs[i]];
      }
      finalStats.push([affect + 1, ...stats]);
    }
    finalStats.push([6, ...stats]);
  }
  return finalStats;
}

export function getNeuralStats(neurals: Array<Record<string, any>>): number[][] {
  let stats = [0, 0, 0, 0, 0, 0, 0, 0];
  const finalStats = [[...stats]];
  if (neurals) {
    for (const neural of neurals) {
      for (let i = 0; i < attrs.length; i++) {
        if (neural['stats'][attrs[i]]) {
          stats[i] += neural['stats'][attrs[i]];
        }
      }
      finalStats.push([...stats]);
    }
  }
  return finalStats;
}

function loadTalent(
  keyId: number | null = null,
  propId: number | null = null
): Record<string, any> {
  const talent: Record<string, any> = {};

  if (keyId) {
    const key = Tables.TalentKeyData[keyId];
    talent['name'] = key['keyName'];
    talent['icon'] = Tables.ItemData[keyId]['icon'];
    const skillId = key['battleSkillId'];

    if (skillId) {
      talent['desc'] = Tables.BattleSkillDisplayData[skillId]['description'];
      talent['descTips'] = Tables.BattleSkillDisplayData[skillId]['descriptionTips'];
    }

    if (!propId && key['propertyId']) {
      propId = key['propertyId'];
    }
  }

  if (propId) {
    const stats = { ...Tables.PropData[propId] };

    const orderedStats: Record<string, any> = {};
    for (const k in attrs) {
      if (stats[attrs[k]]) {
        orderedStats[attrs[k]] = stats[attrs[k]];
      }
    }

    talent['stats'] = orderedStats;
  }

  return talent;
}

export function getTalents(
  dollId: number
): [Array<Record<string, any>>, Array<Record<string, any>>] {
  const talentsData = Tables.SquadTalentGunData[dollId];
  if (!talentsData) {
    return [[], []];
  }

  const treeIds = talentsData['traverseSquadTalentTreeId'].map(Number);
  const treeData = treeIds.map((tid: number) => Tables.SquadTalentTreeData[tid]);

  let nodeIds: number[] = [];
  for (const nodeData of treeData) {
    nodeIds = nodeIds.concat(nodeData['openPoijnt'].map(Number));
  }

  const nodes = nodeIds.map((nid) => Tables.SquadTalentGroupData[nid.toString()]);
  const statNodes: Array<Record<string, any>> = [];
  const skillNodes: Array<Record<string, any>> = [];

  for (const node of nodes) {
    const geneId = parseInt(node['traverseTalentEffectGeneGroup'][0]);
    if (!(geneId in Tables.GroupTalentEffectGeneData)) {
      continue;
    }

    const gene = Tables.GroupTalentEffectGeneData[geneId];
    if (gene['itemId']) {
      const talent = loadTalent(gene['itemId'], null);
      skillNodes.push(talent);
    } else {
      const talent = loadTalent(null, gene['propertyId']);
      statNodes.push(talent);
    }
  }

  //const finalNode = loadTalent(talentsData['fullyActiveItemId'], null);
  return [statNodes, skillNodes];
}
