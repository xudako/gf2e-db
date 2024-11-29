export interface Chr {
    name: string;
    internalName?: string;
    rarity: 'SR' | 'SSR';
    skinID?: string[];
    class: 'Bulwark' | 'Vanguard' | 'Support' | 'Sentinel';
    weapon: 'AR' | 'SMG' | 'RF' | 'HG' | 'MG' | 'SG' | 'ME';
    basicAttack?: string;
    element: 'Burn' | 'Corrosion' | 'Turbid' | 'Electric' | 'Ice' | '';
    hp: number;
    atk: number;
    def: number;
    move: number;
    stability: number;
    weakness: string[];
}

export interface Wpn {
    name: string;
    rarity: 3 | 4 | 5;
    type: 'AR' | 'SMG' | 'RF' | 'HG' | 'MG' | 'SG' | 'ME';
    internalName?: string;
}