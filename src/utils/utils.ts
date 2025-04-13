import Tables from '../data/TableLoader';
import { PubTableLoader, PubTables } from '../data/PubTableLoader';

await PubTableLoader.load(['PropertyData'])

export const loadSkill = (skillId: number) => {
  const display = Tables.BattleSkillDisplayData[skillId];
  if (!display) return;
  return {
    ...display,
  };
};

export function getWeaponStats(weaponId: number): Record<string, any> {
  const weapon = Tables.GunWeaponData[weaponId];
  const baseProp = PubTables.PropertyData[weapon.propertyId];
  const attrs = ['powPercent', 'crit', 'critMult', 'potentialDam'];
  const stats: Record<string, any> = {
    pow: Math.ceil(
      (baseProp.pow * PubTables.PropertyData[Tables.GunLevelExpData[60].propertyId]['pow']) / 1000
    ),
  };
  for (const k in attrs) {
    if (baseProp[attrs[k]]) {
      stats[attrs[k]] = baseProp[attrs[k]];
    }
  }
  return stats;
}

export const formatWeaponUrl = (name: string): string => {
  let formatted = name.normalize('NFD').replace(/[^\w\s]/g, '');
  formatted = formatted.replace(/\s+/g, '-').toLowerCase();
  return formatted;
};
