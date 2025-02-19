import gunData from "./tables/GunData.json";
import gunDutyData from "./tables/GunDutyData.json";
import gunWeaponTypeData from "./tables/GunWeaponTypeData.json";
import gunGradeData from "./tables/GunGradeData.json";
import { Chr, Duty, WeaponType, GunGrade } from "../types";

export const gunDuties: Duty[] = gunDutyData["data"].map((duty: any) => ({
  ...duty,
}));

export const weaponTypes: WeaponType[] = gunWeaponTypeData["data"].map(
  (wtype: any) => ({
    ...wtype,
    id: wtype.typeId,
  })
);

export const gunGrades: GunGrade[] = gunGradeData["data"].map(
  (grade: any) => ({
    ...grade,
    skillIds: grade.abbr,
  })
)

export const characters: Chr[] = gunData["data"].map((gun: any) => ({
  ...gun,
  skins: gun.costumeReplace
}));
