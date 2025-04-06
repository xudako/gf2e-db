import Tables from '../data/TableLoader';

export function getDollStats(dollId: number): number[][] {
    const doll = Tables.GunData[dollId];

    const group = Tables.GunClassByGunClassGroupIdData[doll.gunClass];
    let classes = group.id.map((cid: number) => Tables.GunClassData[cid]);

    const baseProp = Tables.PropertyData[doll.propertyId];
    
    let breakStats = [0, 0, 0];
    let stats = null;
    const attrs = ['pow', 'shieldArmor', 'maxHp'];
    const finalStats = [];
    
    for (let level = 1; level <= 60; level++) {
      const propId = Tables.GunLevelExpData[level].propertyId;
      const levelProp = Tables.PropertyData[propId];
      stats = [...breakStats];
      
      for (let i = 0; i < attrs.length; i++) {
        stats[i] += Math.ceil(baseProp[attrs[i]] * levelProp[attrs[i]] / 1000);
      }
      
      finalStats.push([level, ...stats]);
      
      if (level === classes[0].gunLevelMax) {
        classes = classes.slice(1);
        if (classes.length) {
          const breakProp = Tables.PropertyData[classes[0].propertyId];
          for (let i = 0; i < attrs.length; i++) {
            breakStats[i] += breakProp[attrs[i]];
            stats[i] += breakProp[attrs[i]];
          }
          finalStats.push([level, ...stats]);
        }
      }
    }
    
    // const dollProp = { ...baseProp };
    // for (let i = 0; i < attrs.length; i++) {
    //   dollProp[attrs[i]] = stats[i];
    // }
    
    // const [statTalents, skillTalents, finalTalent] = getTalents(dollId);
    // const talents = [...statTalents, finalTalent];
    
    // for (const talent of talents) {
    //   for (const [k, v] of Object.entries(talent.stats)) {
    //     dollProp[k] += v;
    //   }
    // }
    
    // dollProp.powPercent += 120;
    // dollProp.shieldArmorPercent += 120;
    // dollProp.maxHpPercent += 120;
    
    return finalStats;
  }