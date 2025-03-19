export interface Chr {
    id: number;
    name: string;
    code: string;
    rank: number;
    skins: number[];
    duty: number; //'Bulwark' | 'Vanguard' | 'Support' | 'Sentinel'; //GunDutyData[doll['duty']]['name']
    weaponType: number; //'AR' | 'SMG' | 'RF' | 'HG' | 'MG' | 'SG' | 'ME'; //GunWeaponTypeData[doll['weaponType']]['name']
    skillNormalAttack: number; 
    region: number;
    element: number;
    weak: number[];
    // move: number;
    // stability: number;
    // weakness: string[];
}

export interface Skin {
    id: number;
    name: string;
    code: string;
    description: string;
}

export interface Duty {
    id: number;
    name: string;
    abbr: string;
    //description: string;
    icon: string;
}

export interface WeaponType {
    id: number;
    abbr: string;
    icon: string;
    skinIcon: string;
}

export interface ElementType {
    id: number;
    name: string;
    icon: string;
}

export interface Skill {
    id: number;

    //data
    cdTime: number;
    potentialCost: number;
    result: string;
    //skillRangeParam: string;
    //shape: number;
    //shapeParam: string;
    skillRange: number;
    weaponTag: number;
    elementTag: number;

    //display
    description: string;
    descriptionTips: string;
    //rangeDisplayParam: string;
    //shapeDisplay: number;
    //shapeDisplayParam: string;
    name: string;
    icon: string;
    skillTag: string;
    descriptionLiterary: string;
    upgradeDescription: string;

    range: string;
    shape: number;
    shapeParam: string;
  }

export interface Buff {
    id: number;
    name: string;
    description: string;
    descriptionTips: string;
    iconName?: string;
}

export interface GunGrade {
    id: number;
    skillIds: number[];
}

export interface Wpn {
    id: number;
    name: string;
    type: number;
    resCode: string;
    rank: number;
    skill: number;
    imprint?: number; //privateSkill
    trait?: number; //weaponSkill
}

export interface TableItem {
    Id: number;
    Content: string;
}

export interface Table {
    Data: TableItem[];
}