import { useState } from 'react';

const gridAreas = ['A2', 'C2', 'E2', 'G2', 'I2', 'K2', 'D1', 'D3', 'H1', 'H3', 'L1', 'L3', 'N2', 'P2'];

interface TalentTreeProps {
  talents: Record<string, any>[];
}

const TalentTree = ({
  talents,
}: TalentTreeProps) => {
  const [selectedTalent, setSelectedTalent] = useState(talents[talents.length - 1]);

  const handleTalentClick = (talent: Record<string, any>) => {
    setSelectedTalent(talent);
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
                           ${
                             selectedTalent === talent
                               ? 'border-blue-500 bg-blue-100 scale-110'
                               : 'border-gray-300 bg-white hover:bg-gray-100'
                           }`}
              >
                <img src={`${import.meta.env.BASE_URL}keys/${talent.image}.png` || `${import.meta.env.BASE_URL}icons/${talent[0]}.png`} alt={talent.image} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-2 border-gray-300 rounded-lg min-h-32 bg-white">
        <div>
          <h3 className="text-lg font-semibold mb-2">{selectedTalent.image}</h3>
          <p>{selectedTalent.content.map((content: Record<string, any>) => content.name)}</p>
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
                          selectedTalent?.id === talent.id
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
