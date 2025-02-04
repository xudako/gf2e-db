import gunData from "./Tables/GunData.json";
import gunDutyData from "./Tables/GunDutyData.json";
import gunWeaponTypeData from "./Tables/GunWeaponTypeData.json";
import gunGradeData from "./Tables/GunGradeData.json";
import { Chr, Duty, WeaponType, Skill, GunGrade } from "../types";

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
