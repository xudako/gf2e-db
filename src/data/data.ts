import { Chr, Wpn, Duty, WeaponType, ElementType } from '../types';
import { asset } from '../utils/utils';
import { TableLoader, Tables } from '../data/TableLoader';

await TableLoader.load(['GunGradeData', 'BattleSkillData']);

const loadJson = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
};

const paths = [
  asset('tables/GunData.json'),
  asset('tables/GunDutyData.json'),
  asset('tables/GunWeaponTypeData.json'),
  asset('tables/LanguageElementData.json'),
  asset('tables/GunWeaponData.json'),
];

const [gunData, gunDutyData, gunWeaponTypeData, elementTypeData, gunWeaponData] =
  await Promise.all(paths.map(loadJson));

const enDolls: string[] = [
  'Groza',
  'Nemesis',
  'Krolik',
  'Colphne',
  'Qiongjiu',
  'Tololo',
  'Peritya',
  'Vepley',
  'Mosin-Nagant',
  'Sabrina',
  'Sharkry',
  'Cheeta',
  'Ksenia',
  'Nagant',
  'Littara',
  'Daiyan',
  'Centaureissi',
  'Makiatto',
  'Ullrid',
  'Lotta',
  'Suomi',
  'Dushevnaya',
  'Papasha',
  'Klukai',
  'Mechty',
];

const dollElements: Record<string, number> = {
  'Mosin-Nagant': 2,
  Qiuhua: 1,
  Peri: 1,
  Nikketa: 5,
  Leva: 2,
  Robella: 3,
};

export const gunDuties: Duty[] = gunDutyData['data'].map((duty: any) => ({
  ...duty,
}));

export const weaponTypes: WeaponType[] = gunWeaponTypeData['data'].map((wtype: any) => ({
  ...wtype,
  id: wtype.typeId,
}));

export const elementTypes: ElementType[] = elementTypeData['data'].map((etype: any) => ({
  ...etype,
}));

export const characters: Chr[] = gunData['data'].map((gun: any) => ({
  ...gun,
  skins: gun.costumeReplace,
  region: enDolls.includes(gun.name) ? 1 : 0,
  element:
    dollElements[gun.name] !== undefined
      ? dollElements[gun.name]
      : Math.max(
          ...Tables.GunGradeData[gun.id * 100 + 1].abbr.map(
            (skill: any) => Tables.BattleSkillData[skill].elementTag
          )
        ),
  weak: [gun.weakWeaponTag, parseInt(gun.weakTag)],
}));

export const weapons: Wpn[] = gunWeaponData['data'].map((weapon: any) => ({
  ...weapon,
  imprint: weapon.privateSkill,
  trait: weapon.weaponSkill[0],
}));
