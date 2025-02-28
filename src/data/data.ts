import gunData from "./tables/GunData.json";
import gunDutyData from "./tables/GunDutyData.json";
import gunWeaponTypeData from "./tables/GunWeaponTypeData.json";
import gunGradeData from "./tables/GunGradeData.json";
import { Chr, Duty, WeaponType, GunGrade } from "../types";

const enDolls: string[] = [
  "Groza",
  "Nemesis",
  "Krolik",
  "Colphne",
  "Qiongjiu",
  "Tololo",
  "Peritya",
  "Vepley",
  "Mosin-Nagant",
  "Sabrina",
  "Sharkry",
  "Cheeta",
  "Ksenia",
  "Nagant",
  "Littara",
  "Daiyan",
  "Centaureissi",
  "Makiatto",
  "Ullrid",
  "Lotta",
  "Suomi",
  "Dushevnaya",
  "Papasha",
];

export const gunDuties: Duty[] = gunDutyData["data"].map((duty: any) => ({
  ...duty,
}));

export const weaponTypes: WeaponType[] = gunWeaponTypeData["data"].map(
  (wtype: any) => ({
    ...wtype,
    id: wtype.typeId,
  })
);

export const gunGrades: GunGrade[] = gunGradeData["data"].map((grade: any) => ({
  ...grade,
  skillIds: grade.abbr,
}));

export const characters: Chr[] = gunData["data"].map((gun: any) => ({
  ...gun,
  skins: gun.costumeReplace,
  region: enDolls.includes(gun.name) ? 1 : 0,
}));
