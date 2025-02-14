export interface Chr {
    id: number;
    name: string;
    code: string;
    rank: number;
    skins: number[];
    duty: number; //'Bulwark' | 'Vanguard' | 'Support' | 'Sentinel'; //GunDutyData[doll['duty']]['name']
    weaponType: number; //'AR' | 'SMG' | 'RF' | 'HG' | 'MG' | 'SG' | 'ME'; //GunWeaponTypeData[doll['weaponType']]['name']
    skillNormalAttack: number; 
    // element: 'Burn' | 'Corrosion' | 'Turbid' | 'Electric' | 'Ice' | ''; //
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
    description: string;
    icon: string;
}

export interface WeaponType {
    id: number;
    name: string;
    icon: string;
    skinIcon: string;
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
  

export interface GunGrade {
    id: number;
    skillIds: number[];
}

export interface Effect {
    name: string;
    descriptionID: number;
}

export interface Wpn {
    name: string;
    rarity: 3 | 4 | 5;
    type: 'AR' | 'SMG' | 'RF' | 'HG' | 'MG' | 'SG' | 'ME';
    internalName?: string;
}

export interface TableItem {
    Id: number;
    Content: string;
}

export interface Table {
    Data: TableItem[];
}