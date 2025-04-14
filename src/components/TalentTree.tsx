import { useState } from 'react';
import RichText from './RichText';
import { asset } from '../utils/utils';

const gridAreas = [
  'A2',
  'C2',
  'E2',
  'G2',
  'I2',
  'K2',
  'D1',
  'D3',
  'H1',
  'H3',
  'L1',
  'L3',
  'N2',
  'P2',
];
const statIcons = ['Pow', 'Hp', 'Pow', 'Hp', 'Pow', 'Pow'];
const statNames: Record<string, string> = {
  pow: 'Attack',
  shieldArmor: 'Defense',
  maxHp: 'Health',
  crit: 'Crit Rate',
  critMult: 'Crit DMG',
  powPercent: 'Attack Boost',
  shieldArmorPercent: 'Defense Boost',
  maxHpPercent: 'Health Boost',
};

interface TalentTreeProps {
  talents: Record<string, any>[];
}

const TalentTree = ({ talents }: TalentTreeProps) => {
  const [currentTalent, setcurrentTalent] = useState(talents[talents.length - 1]);

  const handleTalentClick = (talent: Record<string, any>) => {
    setcurrentTalent(talent);
  };

  const convertToGridArea = (area: string) => {
    const column = area.charAt(0).charCodeAt(0) - 65;
    const row = parseInt(area.substring(1)) - 1;
    return { row, column };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div
        className="mb-10 hidden md:grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(3, minmax(0, auto))',
          gap: '1rem',
        }}
      >
        {talents.map((talent, index) => {
          const { row, column } = convertToGridArea(gridAreas[index]);
          return (
            <div
              key={index}
              className="flex justify-center items-center"
              style={{
                gridColumn: `${column + 1} / span 1`,
                gridRow: `${row + 1} / span 1`,
              }}
            >
              <button
                onClick={() => handleTalentClick(talent)}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xs md:text-sm
                           border-2 transition-all duration-300
                           md:aspect-square
                           ${
                             currentTalent === talent
                               ? 'border-primary-selected bg-primary-light scale-110'
                               : 'border-gray-300 bg-primary-main hover:bg-primary-light'
                           }`}
              >
                {talent.icon ? (
                  <img src={asset(`keys/${talent.icon}.png`)} alt={'talent'} />
                ) : (
                  <img src={asset(`icons/Icon_${statIcons[index]}_64.png`)} alt={'talent'} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-2 border-gray-300 rounded-lg min-h-32 bg-background-paper flex flex-col gap-8">
        <div className="grid grid-cols-4 gap-8">
          {currentTalent.icon && (
            <div className="text-center col-span-1 m-4">
              <img
                src={asset(`keys/${currentTalent.icon}.png`)}
                alt="Key Icon"
                className="block w-32 max-w-full bg-skill-bg rounded-lg"
              />
            </div>
          )}
          <div className="mt-8 col-span-3">
            {currentTalent.name && (
              <h3 className="text-lg font-semibold mb-2">{currentTalent.name}</h3>
            )}
            {currentTalent.stats && (
              <>
                {Object.entries(currentTalent.stats).map(([name, value]) => {
                  const isPercent = name.includes('crit') || name.includes('Percent');
                  const displayValue = isPercent
                    ? `${(value as number) / 10}.0%`
                    : `${value as number}.0`;
                  return (
                    <p key={name}>
                      {statNames[name]}: {displayValue}
                    </p>
                  );
                })}
              </>
            )}
            {currentTalent.desc && (
              <RichText content={currentTalent.desc} descriptionTips={currentTalent.descTips} />
            )}
          </div>
        </div>
      </div>

      {/* <div className="md:hidden mt-4">
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg mb-6">
          <p className="text-yellow-800">
            The selection grid is hidden on mobile devices. Please use the list below to select a
            talent.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {talents.map((talent) => (
            <button
              key={talent.id}
              onClick={() => handleTalentClick(talent)}
              className={`p-3 border rounded-lg text-left transition-all
                        ${
                          currentTalent?.id === talent.id
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-300 bg-white'
                        }`}
            >
              {talent.image}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default TalentTree;
