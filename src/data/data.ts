import gunData from './tables/GunData.json';
import gunDutyData from './tables/GunDutyData.json';
import gunWeaponTypeData from './tables/GunWeaponTypeData.json';
import gunGradeData from './tables/GunGradeData.json';
import elementTypeData from './tables/LanguageElementData.json';
import gunWeaponData from './tables/GunWeaponData.json';
import { Chr, Wpn, Duty, WeaponType, ElementType, GunGrade } from '../types';
import Tables from './TableLoader';

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
];

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

export const gunGrades: GunGrade[] = gunGradeData['data'].map((grade: any) => ({
  ...grade,
  skillIds: grade.abbr,
}));

export const characters: Chr[] = gunData['data'].map((gun: any) => ({
  ...gun,
  skins: gun.costumeReplace,
  region: enDolls.includes(gun.name) ? 1 : 0,
  element:
    gun.name == 'Mosin-Nagant'
      ? 2
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
